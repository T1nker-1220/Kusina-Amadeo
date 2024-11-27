import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' blob: data: https:;
          object-src 'self' data:;
          font-src 'self' https://fonts.gstatic.com;
          frame-src 'self';
          connect-src 'self' https://api.cloudinary.com https://fonts.googleapis.com https://fonts.gstatic.com
        `.replace(/\s{2,}/g, ' ').trim()} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
