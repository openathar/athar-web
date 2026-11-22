import QRCode from "qrcode";

/**
 * A store link as a QR code, drawn at build time as inline SVG (no script, no image request).
 * Dark modules on the page's paper colour with a quiet zone, so every phone camera reads it —
 * a gold-on-night code looks nicer but scans badly.
 */
export async function StoreQr({ url, label, aria }: { url: string; label: string; aria: string }) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: { dark: "#0b0f17", light: "#f4efe4" },
  });
  return (
    <figure className="lp-qr">
      <div
        className="lp-qr-code"
        role="img"
        aria-label={aria}
        // Generated locally from our own constant URL — not user input.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="mono">{label}</figcaption>
    </figure>
  );
}
