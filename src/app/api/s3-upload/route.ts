import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand,ListObjectsV2Command } from "@aws-sdk/client-s3";
import mime from "mime-types";
// Create S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});


async function uploadFileToS3({
    file,
    fileName,
  }: {
    file: Buffer;
    fileName: string;
  }) {

    const contentType = mime.lookup(fileName) || "application/octet-stream";

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: file,
      ContentType: contentType // adjust based on your file type
    };
    console.log('params', params);
    
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return fileName;
}

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file =formData.get("file") as File;
    if(!file){
        return NextResponse.json({
            error: "File not found",
        },{status: 400}); 
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `Ai-chat-bot/${file.name}`;

    const uploadedFileName = await uploadFileToS3({ 
      file: buffer,
      fileName:fileName,
    });
    
    return NextResponse.json({
      success: true,
      uploadedFileName
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error uploading file ${error}`,
    },{status: 500
    });
  }
};


export const GET = async () => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Prefix: "Ai-chat-bot/",
  });
  
  const response = await s3Client.send(command);

  const files = response.Contents?.map((item) => {
    const fileName = item.Key;
    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`;
    return {
      fileName,
      fileUrl,
    };
  });

  return NextResponse.json({ files,msg:`Response from the S3 ${command}` });
  // return NextResponse.json({
  //   msg: "Hello from S3 upload"
  // });
}
