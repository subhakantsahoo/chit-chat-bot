import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  url?: string;
}

export default function SEO({
  title = "AI Chat Bot",
  description = "AI Chat Bot to assist you with various tasks.",
  keywords = "AI, Chatbot, Generative AI, Next.js",
  author = "Subhakanta sahoo",
  url = "https://main.d3g1sjoperhwf0.amplifyapp.com/",
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
