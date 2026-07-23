const LOGO_URL = "https://newconceptbyrims.com/images/logo-mark.png";
const SITE_URL = "https://newconceptbyrims.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2brHtml(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

export type ConfirmationEmailData = {
  name: string;
  service?: string;
  message: string;
  address: string;
  phone: string;
  mapsUrl: string;
};

export function confirmationEmailHtml(data: ConfirmationEmailData): string {
  const { name, service, message, address, phone, mapsUrl } = data;

  const serviceRow = service
    ? `
      <tr>
        <td style="padding:14px 24px 12px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; padding-bottom:3px;">Prestation souhait&eacute;e</td></tr>
            <tr><td style="font-size:16px; font-weight:600; color:#15151a; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(service)}</td></tr>
          </table>
        </td>
      </tr>
      <tr><td style="padding:0 24px;"><div style="border-top:1px solid rgba(120,130,150,0.18); font-size:0; line-height:0;">&nbsp;</div></td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<title>Demande bien re&ccedil;ue - New Concept by Rims</title>
</head>
<body style="margin:0; padding:0; background-color:#e8ecf1; font-family:-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif;">
<span style="display:none; font-size:1px; color:#e8ecf1; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
Votre demande de rendez-vous chez New Concept by Rims a bien &eacute;t&eacute; re&ccedil;ue &mdash; nous vous recontactons rapidement.
</span>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8ecf1; background-image:linear-gradient(180deg,#eef2f7 0%,#dde3ea 100%);">
<tr>
<td align="center" style="padding:40px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">

<!-- Header / Logo card -->
<tr>
<td style="padding:0 0 16px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(20,20,22,0.92); border-radius:28px;">
<tr>
<td align="center" style="padding:32px 24px 32px 24px; border-radius:28px;">
<img src="${LOGO_URL}" alt="New Concept by Rims" width="88" height="88" style="display:block; width:88px; height:88px; border-radius:20px; border:0;">
</td>
</tr>
</table>
</td>
</tr>

<!-- Status pill -->
<tr>
<td align="center" style="padding:0 0 20px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color:rgba(52,199,89,0.15); border:1px solid rgba(52,199,89,0.35); border-radius:20px; padding:8px 18px;">
<span style="font-size:13px; font-weight:600; color:#1f7a37; font-family:-apple-system, Helvetica, Arial, sans-serif;">&#10003; Demande bien re&ccedil;ue</span>
</td>
</tr>
</table>
</td>
</tr>

<!-- Main glass card -->
<tr>
<td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(255,255,255,0.9); border-radius:28px; border:1px solid rgba(255,255,255,0.6); box-shadow:0 20px 40px rgba(31,41,55,0.08);">

<tr>
<td style="padding:36px 32px 8px 32px;">
<h1 style="margin:0; font-size:22px; font-weight:600; color:#111114; font-family:-apple-system, 'SF Pro Display', Helvetica, Arial, sans-serif;">Bonjour ${escapeHtml(name)},</h1>
</td>
</tr>

<tr>
<td style="padding:8px 32px 28px 32px;">
<p style="margin:0; font-size:15px; line-height:23px; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">
Merci pour votre message ! Nous avons bien re&ccedil;u votre demande de rendez-vous chez New Concept by Rims et nous vous recontactons tr&egrave;s rapidement pour convenir ensemble d'un cr&eacute;neau.
</p>
</td>
</tr>

<!-- Detail rows as soft inset cards -->
<tr>
<td style="padding:0 24px 24px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(120,130,150,0.08); border-radius:20px;">

<tr>
<td style="padding:20px 24px 12px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; padding-bottom:3px;">Client</td></tr>
<tr><td style="font-size:16px; font-weight:600; color:#15151a; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(name)}</td></tr>
</table>
</td>
</tr>

<tr><td style="padding:0 24px;"><div style="border-top:1px solid rgba(120,130,150,0.18); font-size:0; line-height:0;">&nbsp;</div></td></tr>
${serviceRow}
<tr>
<td style="padding:14px 24px 12px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; padding-bottom:3px;">Votre message</td></tr>
<tr><td style="font-size:15px; line-height:22px; color:#15151a; font-family:-apple-system, Helvetica, Arial, sans-serif;">${nl2brHtml(message)}</td></tr>
</table>
</td>
</tr>

<tr><td style="padding:0 24px;"><div style="border-top:1px solid rgba(120,130,150,0.18); font-size:0; line-height:0;">&nbsp;</div></td></tr>

<tr>
<td style="padding:14px 24px 20px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; padding-bottom:3px;">Adresse du salon</td></tr>
<tr><td style="font-size:16px; font-weight:600; color:#15151a; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(address)}</td></tr>
</table>
</td>
</tr>

</table>
</td>
</tr>

<!-- CTA buttons -->
<tr>
<td style="padding:0 32px 12px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td width="100%" style="background-color:rgba(120,130,150,0.12); border-radius:16px; border:1px solid rgba(120,130,150,0.2);">
<a href="${mapsUrl}" style="display:block; padding:14px 16px; font-size:14px; font-weight:600; color:#15151a; text-decoration:none; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center; border-radius:16px;">Voir sur la carte</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:8px 32px 32px 32px;">
<p style="margin:0; font-size:13px; line-height:20px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center;">
Une question en attendant ? Appelez-nous au ${escapeHtml(phone)}.
</p>
</td>
</tr>

</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td align="center" style="padding:28px 24px 0 24px;">
<p style="margin:0 0 6px 0; font-size:13px; font-weight:600; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">New Concept by Rims</p>
<p style="margin:0 0 6px 0; font-size:12px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(address)} &mdash; ${escapeHtml(phone)}</p>
<p style="margin:0; font-size:11px; color:#a7a7ae; font-family:-apple-system, Helvetica, Arial, sans-serif;">Vous recevez cet e-mail car vous avez rempli le formulaire de contact du site <a href="${SITE_URL}" style="color:#a7a7ae;">New Concept by Rims</a>.</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

export function confirmationEmailText(data: ConfirmationEmailData): string {
  const { name, service, message, address, phone } = data;
  return [
    `Bonjour ${name},`,
    "",
    "Merci pour votre message ! Nous avons bien reçu votre demande de rendez-vous chez New Concept by Rims et nous vous recontactons rapidement pour convenir d'un créneau.",
    "",
    "Récapitulatif de votre demande :",
    service ? `Prestation souhaitée : ${service}` : null,
    `Message : ${message}`,
    "",
    "Adresse du salon :",
    address,
    phone,
    "",
    "À très vite,",
    "L'équipe New Concept by Rims",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
