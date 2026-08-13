// Inline-styled HTML emails for gift-card delivery (brand: gold/cream, serif display).

const GOLD = '#FCCF08'
const CREAM = '#FDFAF5'
const DARK = '#333333'

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function shell(inner: string): string {
  return `
  <div style="background:${CREAM};padding:32px 16px;font-family:Lato,Helvetica,Arial,sans-serif;color:${DARK}">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eee5d8">
      <div style="background:${DARK};padding:20px;text-align:center">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${CREAM};letter-spacing:1px">Mimosa</span>
        <div style="font-size:10px;letter-spacing:3px;color:#cfc9bd;text-transform:uppercase">Spa Retreat</div>
      </div>
      ${inner}
      <div style="padding:18px;text-align:center;border-top:1px solid #f1ebe0;font-size:12px;color:#8B8680">
        Mimosa Spa Retreat · Costa del Este &amp; San Francisco · Ciudad de Panamá<br/>
        <a href="https://www.mimosaretreat.com" style="color:#a3701c">mimosaretreat.com</a>
      </div>
    </div>
  </div>`
}

interface GiftEmailData {
  locale: string
  recipientName: string
  buyerName: string
  amountLabel: string
  itemName: string
  message?: string | null
  giftUrl: string
}

export function recipientGiftEmail(d: GiftEmailData): { subject: string; html: string } {
  const en = d.locale === 'en'
  const subject = en
    ? `${d.buyerName} sent you a Mimosa Spa gift 🎁`
    : `${d.buyerName} te envió un regalo de Mimosa Spa 🎁`
  const html = shell(`
    <div style="padding:32px 28px;text-align:center">
      <p style="font-size:14px;color:#8B8680;margin:0 0 6px">${
        en ? 'A gift for' : 'Un regalo para'
      }</p>
      <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 18px">${esc(d.recipientName)}</h1>
      <div style="background:${CREAM};border:2px solid ${GOLD};border-radius:14px;padding:24px;margin-bottom:20px">
        <div style="font-size:13px;color:#8B8680;margin-bottom:4px">${esc(d.itemName)}</div>
        <div style="font-family:Georgia,serif;font-size:34px;color:#a3701c">${esc(d.amountLabel)}</div>
      </div>
      ${
        d.message
          ? `<p style="font-style:italic;color:#5c6157;margin:0 0 22px">“${esc(d.message)}”<br/><span style="font-style:normal;font-size:13px">— ${esc(d.buyerName)}</span></p>`
          : `<p style="color:#5c6157;margin:0 0 22px">— ${esc(d.buyerName)}</p>`
      }
      <a href="${d.giftUrl}" style="display:inline-block;background:${GOLD};color:${DARK};font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px">
        ${en ? 'View my gift card' : 'Ver mi gift card'}
      </a>
      <p style="font-size:12px;color:#8B8680;margin:20px 0 0">
        ${
          en
            ? 'Show the code on that page when you visit the spa. Book via WhatsApp +507 6404-9464.'
            : 'Muestra el código de esa página el día de tu visita. Reserva por WhatsApp +507 6404-9464.'
        }
      </p>
    </div>`)
  return { subject, html }
}

interface BuyerEmailData {
  locale: string
  buyerName: string
  recipientName: string
  amountLabel: string
  itemName: string
  orderNumber: string
  giftUrl: string
  whatsappForwardUrl: string
  bonusLabel?: string | null
  scheduledLabel?: string | null
}

export function buyerReceiptEmail(d: BuyerEmailData): { subject: string; html: string } {
  const en = d.locale === 'en'
  const subject = en
    ? `Your Mimosa gift card is ready (${d.orderNumber})`
    : `Tu gift card Mimosa está lista (${d.orderNumber})`
  const html = shell(`
    <div style="padding:32px 28px">
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 14px">
        ${en ? `Thank you, ${esc(d.buyerName)}!` : `¡Gracias, ${esc(d.buyerName)}!`}
      </h1>
      <p style="font-size:14px;color:#5c6157;margin:0 0 18px">
        ${
          en
            ? `Your gift for <b>${esc(d.recipientName)}</b> is confirmed:`
            : `Tu regalo para <b>${esc(d.recipientName)}</b> está confirmado:`
        }
      </p>
      <table style="width:100%;font-size:14px;border-collapse:collapse;margin-bottom:18px">
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Item' : 'Artículo'}</td><td style="text-align:right">${esc(d.itemName)}</td></tr>
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Value' : 'Valor'}</td><td style="text-align:right;font-weight:bold">${esc(d.amountLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#8B8680">${en ? 'Order' : 'Pedido'}</td><td style="text-align:right">${esc(d.orderNumber)}</td></tr>
        ${
          d.scheduledLabel
            ? `<tr><td style="padding:6px 0;color:#8B8680">${en ? 'Delivery' : 'Entrega'}</td><td style="text-align:right">${esc(d.scheduledLabel)}</td></tr>`
            : ''
        }
      </table>
      ${
        d.bonusLabel
          ? `<div style="background:${CREAM};border:1px dashed ${GOLD};border-radius:10px;padding:14px;margin-bottom:18px;font-size:14px">🎉 ${esc(d.bonusLabel)}</div>`
          : ''
      }
      <a href="${d.giftUrl}" style="display:inline-block;background:${GOLD};color:${DARK};font-weight:bold;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:14px;margin-right:8px">
        ${en ? 'View gift card' : 'Ver gift card'}
      </a>
      <a href="${d.whatsappForwardUrl}" style="display:inline-block;border:2px solid #25D366;color:#128C7E;font-weight:bold;text-decoration:none;padding:10px 22px;border-radius:999px;font-size:14px">
        ${en ? 'Forward via WhatsApp' : 'Enviar por WhatsApp'}
      </a>
    </div>`)
  return { subject, html }
}
