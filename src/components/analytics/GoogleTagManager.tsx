import Script from 'next/script'

const GT_ID = 'GT-55N858PH'

export function GoogleTagManager() {
  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GT_ID}`}
      />
      <Script
        id="gtm-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GT_ID}');
          `,
        }}
      />
    </>
  )
}
