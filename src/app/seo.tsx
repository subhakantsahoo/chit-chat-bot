import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string; // Add this back
  author?: string;
}

export default function SEO({
  title = "Open Ai 2.0",
  description = "AI-powered chatbot for real-time communication and automation.",
  url = "https://main.d3g1sjoperhwf0.amplifyapp.com/",
  image = "https://metatags.io/images/meta-tags.png",
  keywords = "chatbot, generative AI, Gemini, Next.js,AI chatbot, Next.js, Gemini API, image recognition, NLP, chatbot automation,Open Ai 2.0",
  author = "Subhakanta Sahoo",
}: SEOProps) {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />

      {/* Optional: for responsive behavior */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
