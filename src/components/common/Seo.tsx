import Head from 'next/head';
import { SeoProps } from '@/types';

export default function Seo({ 
  title, 
  description, 
  keywords = [], 
  ogImage,
  canonical 
}: SeoProps) {
  const siteTitle = `${title} | Kusina Amadeo`;
  const defaultOgImage = '/images/og-image.jpg'; // Default OG image

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
      
      {/* Schema.org markup for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Kusina Amadeo",
          "image": defaultOgImage,
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Your Street Address",
            "addressLocality": "Your City",
            "addressRegion": "Your Region",
            "postalCode": "Your Postal Code",
            "addressCountry": "PH"
          },
          "servesCuisine": "Filipino",
          "priceRange": "₱₱",
          "openingHours": [
            "Mo-Su 11:00-22:00"
          ]
        })}
      </script>
    </Head>
  );
}
