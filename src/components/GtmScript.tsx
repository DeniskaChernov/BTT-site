import Script from "next/script";

type Props = {
  /** Идентификатор контейнера GTM, например GTM-XXXXXXX */
  gtmId: string;
};

const GTM_ID_RE = /^GTM-[A-Z0-9]+$/;

/**
 * Подключает Google Tag Manager при заданном `NEXT_PUBLIC_GTM_ID`.
 * События из `trackEvent` попадают в тот же `dataLayer`.
 */
export function GtmScript({ gtmId }: Props) {
  const id = gtmId.trim();
  if (!GTM_ID_RE.test(id)) return null;

  const idJson = JSON.stringify(id);

  return (
    <>
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(id)}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${idJson});`}
      </Script>
    </>
  );
}
