import { site } from "@/data/site";
import { formatParisFrench } from "@/lib/paris-time";

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

function detailRow(label: string, value: string, isLast = false): string {
  return `
    <tr>
      <td style="padding:14px 24px 12px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; padding-bottom:3px;">${escapeHtml(label)}</td></tr>
          <tr><td style="font-size:16px; font-weight:600; color:#15151a; font-family:-apple-system, Helvetica, Arial, sans-serif;">${value}</td></tr>
        </table>
      </td>
    </tr>
    ${
      isLast
        ? ""
        : `<tr><td style="padding:0 24px;"><div style="border-top:1px solid rgba(120,130,150,0.18); font-size:0; line-height:0;">&nbsp;</div></td></tr>`
    }`;
}

function emailShell(opts: {
  title: string;
  preheader: string;
  pillBg: string;
  pillBorder: string;
  pillColor: string;
  pillLabel: string;
  headingHtml: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#e8ecf1; font-family:-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif;">
<span style="display:none; font-size:1px; color:#e8ecf1; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
${escapeHtml(opts.preheader)}
</span>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8ecf1; background-image:linear-gradient(180deg,#eef2f7 0%,#dde3ea 100%);">
<tr>
<td align="center" style="padding:40px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">

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

<tr>
<td align="center" style="padding:0 0 20px 0;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="background-color:${opts.pillBg}; border:1px solid ${opts.pillBorder}; border-radius:20px; padding:8px 18px;">
<span style="font-size:13px; font-weight:600; color:${opts.pillColor}; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(opts.pillLabel)}</span>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(255,255,255,0.94); border-radius:28px; border:1px solid rgba(255,255,255,0.6); box-shadow:0 20px 40px rgba(31,41,55,0.08);">

<tr>
<td style="padding:36px 32px 8px 32px;">
${opts.headingHtml}
</td>
</tr>

${opts.bodyHtml}

</table>
</td>
</tr>

<tr>
<td align="center" style="padding:28px 24px 0 24px;">
<p style="margin:0 0 6px 0; font-size:13px; font-weight:600; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">New Concept by Rims</p>
<p style="margin:0 0 6px 0; font-size:12px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(site.address.full)} &mdash; ${escapeHtml(site.phone)}</p>
<p style="margin:0; font-size:11px; color:#a7a7ae; font-family:-apple-system, Helvetica, Arial, sans-serif;">${escapeHtml(opts.footerNote)} <a href="${SITE_URL}" style="color:#a7a7ae;">New Concept by Rims</a>.</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

export type BookingEmailData = {
  name: string;
  service?: string;
  message: string;
  appointmentAt: Date;
};

// ─── 1. Réservation confirmée ───────────────────────────────────────────────

export function reservationConfirmedHtml(data: BookingEmailData): string {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(data.appointmentAt);
  const dateTimeLabel = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateLabel} &agrave; ${timeLabel}`;

  const bodyHtml = `
<tr>
<td style="padding:8px 32px 28px 32px;">
<p style="margin:0; font-size:15px; line-height:23px; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">
Merci pour votre confiance ! Votre rendez-vous chez New Concept by Rims est bien confirm&eacute;. Nous avons h&acirc;te de vous accueillir.
</p>
</td>
</tr>

<tr>
<td style="padding:0 24px 24px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(120,130,150,0.08); border-radius:20px;">
${detailRow("Client", escapeHtml(data.name))}
${data.service ? detailRow("Prestation", escapeHtml(data.service)) : ""}
${detailRow("Date &amp; heure", dateTimeLabel)}
${detailRow("Adresse", escapeHtml(site.address.full), true)}
</table>
</td>
</tr>

<tr>
<td style="padding:0 32px 12px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td width="100%" style="background-color:rgba(120,130,150,0.12); border-radius:16px; border:1px solid rgba(120,130,150,0.2);">
<a href="${site.mapsDirectionsUrl}" style="display:block; padding:14px 16px; font-size:14px; font-weight:600; color:#15151a; text-decoration:none; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center; border-radius:16px;">Voir sur la carte</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:8px 32px 32px 32px;">
<p style="margin:0; font-size:13px; line-height:20px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center;">
Un emp&ecirc;chement ? Merci de nous pr&eacute;venir au moins 24h &agrave; l'avance au ${escapeHtml(site.phone)}.
</p>
</td>
</tr>`;

  return emailShell({
    title: "Confirmation de réservation - New Concept by Rims",
    preheader: "Votre rendez-vous est confirmé chez New Concept by Rims — retrouvez tous les détails ci-dessous.",
    pillBg: "rgba(52,199,89,0.15)",
    pillBorder: "rgba(52,199,89,0.35)",
    pillColor: "#1f7a37",
    pillLabel: "✓ Réservation confirmée",
    headingHtml: `<h1 style="margin:0; font-size:22px; font-weight:600; color:#111114; font-family:-apple-system, 'SF Pro Display', Helvetica, Arial, sans-serif;">Bonjour ${escapeHtml(data.name)},</h1>`,
    bodyHtml,
    footerNote: "Vous recevez cet e-mail car vous avez pris rendez-vous chez",
  });
}

export function reservationConfirmedText(data: BookingEmailData): string {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(data.appointmentAt);
  return [
    `Bonjour ${data.name},`,
    "",
    "Votre rendez-vous chez New Concept by Rims est bien confirmé.",
    "",
    data.service ? `Prestation : ${data.service}` : null,
    `Date & heure : ${dayName} ${dateLabel} à ${timeLabel}`,
    `Adresse : ${site.address.full}`,
    "",
    `Un empêchement ? Merci de nous prévenir au moins 24h à l'avance au ${site.phone}.`,
    "",
    "À très vite,",
    "L'équipe New Concept by Rims",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

// ─── 2. Rappel 24h avant ────────────────────────────────────────────────────

export function reminderEmailHtml(data: BookingEmailData): string {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(data.appointmentAt);
  const dateTimeLabel = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dateLabel} &agrave; ${timeLabel}`;

  const bodyHtml = `
<tr>
<td style="padding:8px 32px 28px 32px;">
<p style="margin:0; font-size:15px; line-height:23px; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">
Petit rappel : votre rendez-vous chez New Concept by Rims a lieu demain. Nous avons h&acirc;te de vous accueillir.
</p>
</td>
</tr>

<tr>
<td style="padding:0 24px 24px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:rgba(120,130,150,0.08); border-radius:20px;">
${detailRow("Client", escapeHtml(data.name))}
${data.service ? detailRow("Prestation", escapeHtml(data.service)) : ""}
${detailRow("Date &amp; heure", dateTimeLabel)}
${detailRow("Adresse", escapeHtml(site.address.full), true)}
</table>
</td>
</tr>

<tr>
<td style="padding:0 32px 12px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td width="100%" style="background-color:rgba(120,130,150,0.12); border-radius:16px; border:1px solid rgba(120,130,150,0.2);">
<a href="${site.mapsDirectionsUrl}" style="display:block; padding:14px 16px; font-size:14px; font-weight:600; color:#15151a; text-decoration:none; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center; border-radius:16px;">Voir sur la carte</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:8px 32px 32px 32px;">
<p style="margin:0; font-size:13px; line-height:20px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center;">
Un emp&ecirc;chement ? Merci de nous pr&eacute;venir d&egrave;s que possible au ${escapeHtml(site.phone)}.
</p>
</td>
</tr>`;

  return emailShell({
    title: "Rappel de rendez-vous - New Concept by Rims",
    preheader: "Rappel : votre rendez-vous chez New Concept by Rims a lieu demain.",
    pillBg: "rgba(10,132,255,0.14)",
    pillBorder: "rgba(10,132,255,0.35)",
    pillColor: "#0a5cb8",
    pillLabel: "🔔 Rappel — c'est demain",
    headingHtml: `<h1 style="margin:0; font-size:22px; font-weight:600; color:#111114; font-family:-apple-system, 'SF Pro Display', Helvetica, Arial, sans-serif;">Bonjour ${escapeHtml(data.name)},</h1>`,
    bodyHtml,
    footerNote: "Vous recevez cet e-mail car un rendez-vous est prévu chez",
  });
}

export function reminderEmailText(data: BookingEmailData): string {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(data.appointmentAt);
  return [
    `Bonjour ${data.name},`,
    "",
    "Petit rappel : votre rendez-vous chez New Concept by Rims a lieu demain.",
    "",
    `Date & heure : ${dayName} ${dateLabel} à ${timeLabel}`,
    `Adresse : ${site.address.full}`,
    "",
    `Un empêchement ? Merci de nous prévenir dès que possible au ${site.phone}.`,
  ].join("\n");
}

// ─── 3. Avis post-visite ────────────────────────────────────────────────────

export function reviewRequestEmailHtml(data: BookingEmailData): string {
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<td style="padding:0 4px;"><a href="${site.googleReviewLeaveUrl}?rating=${n}" style="text-decoration:none; font-size:30px; color:#ffb000;">★</a></td>`
    )
    .join("");

  const bodyHtml = `
<tr>
<td style="padding:8px 32px 24px 32px;">
<p style="margin:0; font-size:15px; line-height:23px; color:#4b4b52; font-family:-apple-system, Helvetica, Arial, sans-serif;">
${data.service ? `Nous esp&eacute;rons que votre ${escapeHtml(data.service)} vous a plu.` : "Nous esp&eacute;rons que votre visite vous a plu."} Votre avis nous aide &agrave; nous am&eacute;liorer et aide d'autres client(e)s &agrave; nous faire confiance. Cela prend 30 secondes.
</p>
</td>
</tr>

<tr>
<td align="center" style="padding:0 32px 28px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>${stars}</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:0 32px 12px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td width="100%" style="background-color:#0a84ff; border-radius:16px; box-shadow:0 8px 16px rgba(10,132,255,0.28);">
<a href="${site.googleReviewLeaveUrl}" style="display:block; padding:14px 16px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center; border-radius:16px;">Laisser un avis Google</a>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:8px 32px 12px 32px;">
<p style="margin:0; font-size:13px; line-height:20px; color:#8a8a92; font-family:-apple-system, Helvetica, Arial, sans-serif; text-align:center;">
Une remarque &agrave; nous faire directement ? R&eacute;pondez &agrave; cet e-mail.
</p>
</td>
</tr>

<tr>
<td align="center" style="padding:0 32px 32px 32px;">
<a href="${site.instagram.url}" style="font-size:13px; font-weight:600; color:#0a5cb8; text-decoration:none; font-family:-apple-system, Helvetica, Arial, sans-serif;">Suivez-nous — ${escapeHtml(site.instagram.handle)}</a>
</td>
</tr>`;

  return emailShell({
    title: "Votre avis - New Concept by Rims",
    preheader: "Merci de votre visite chez New Concept by Rims — dites-nous ce que vous en avez pensé.",
    pillBg: "rgba(255,159,10,0.15)",
    pillBorder: "rgba(255,159,10,0.35)",
    pillColor: "#b5750a",
    pillLabel: "★ Votre avis compte",
    headingHtml: `<h1 style="margin:0; font-size:22px; font-weight:600; color:#111114; font-family:-apple-system, 'SF Pro Display', Helvetica, Arial, sans-serif;">Merci de votre visite, ${escapeHtml(data.name)} !</h1>`,
    bodyHtml,
    footerNote: "Vous recevez cet e-mail suite à votre visite chez",
  });
}

export function reviewRequestEmailText(data: BookingEmailData): string {
  return [
    `Merci de votre visite, ${data.name} !`,
    "",
    "Votre avis nous aide à nous améliorer — laissez-nous un avis Google :",
    site.googleReviewLeaveUrl,
    "",
    "Une remarque à nous faire directement ? Répondez à cet e-mail.",
    "",
    `Suivez-nous sur Instagram : ${site.instagram.url}`,
  ].join("\n");
}

// ─── Notification interne (salon) ───────────────────────────────────────────

export function salonNotificationText(
  data: BookingEmailData & { email: string; phone: string }
): string {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(data.appointmentAt);
  return [
    `Nom : ${data.name}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.phone}`,
    data.service ? `Prestation souhaitée : ${data.service}` : null,
    `Créneau réservé : ${dayName} ${dateLabel} à ${timeLabel}`,
    "",
    "Message :",
    data.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
