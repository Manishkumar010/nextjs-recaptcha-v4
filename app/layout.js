export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script 
  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
  async
  defer
></script>

      </head>
      <body>{children}</body>
    </html>
  );
}
