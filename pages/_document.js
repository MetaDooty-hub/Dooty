import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
        <meta name="theme-color" content="#080b10" />
        <meta property="og:title" content="Meta Dooty — COD Loadouts" />
        <meta property="og:description" content="The best Call of Duty loadouts, ranked by the community. Submit, vote, and find the meta." />
        <meta property="og:image" content="https://dooty.vercel.app/logo.svg" />
        <meta property="og:url" content="https://dooty.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meta Dooty — COD Loadouts" />
        <meta name="twitter:description" content="The best Call of Duty loadouts, ranked by the community." />
        <meta name="twitter:image" content="https://dooty.vercel.app/logo.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}