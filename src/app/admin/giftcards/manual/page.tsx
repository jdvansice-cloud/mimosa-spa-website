import Link from 'next/link'
import { BookOpen, Gift, Printer, ShoppingCart, RefreshCw, Pencil, Search, AlertTriangle } from 'lucide-react'
import { AdminPage } from '@/components/admin/AdminPage'
import { StatusPill } from '@/components/admin/AdminTable'

/**
 * Staff manual for the gift card flow. Static content; the screenshots in
 * /public/manual/giftcards are captured from the real admin screens with
 * sample data (see the commit that added them for the capture harness).
 */

const SECTIONS = [
  { id: 'flujo', label: 'Cómo funciona' },
  { id: 'emitir', label: '1. Emitir' },
  { id: 'imprimir', label: '2. Imprimir la etiqueta' },
  { id: 'mindbody', label: '3. Vender en Mindbody' },
  { id: 'estados', label: 'Estados' },
  { id: 'editar', label: 'Editar una Gift Card' },
  { id: 'consultar', label: 'Consultar y sincronizar' },
  { id: 'problemas', label: 'Problemas frecuentes' },
]

function Section({
  id, icon: Icon, title, children,
}: { id: string; icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <span className="p-2 bg-gold/10 rounded-lg shrink-0"><Icon className="h-5 w-5 text-gold-700" /></span>
        <h2 className="text-2xl font-display font-semibold text-dark">{title}</h2>
      </div>
      <div className="space-y-4 text-dark leading-relaxed">{children}</div>
    </section>
  )
}

function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="rounded-lg border border-beige-300 bg-white overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full" loading="lazy" />
      <figcaption className="px-4 py-2 text-xs text-warm-gray-500 border-t border-beige-200">{caption}</figcaption>
    </figure>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-6 space-y-2 marker:font-semibold marker:text-gold-700">{children}</ol>
}

function Tip({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${warn ? 'border-amber-300 bg-amber-50' : 'border-beige-300 bg-beige-50'}`}>
      {children}
    </div>
  )
}

export default function GiftCardManualPage() {
  return (
    <AdminPage
      title="Manual del personal"
      icon={BookOpen}
      breadcrumb={{ href: '/admin/giftcards/issue', label: 'Emitir Gift Card' }}
      description="Todo el ciclo de una Gift Card física: emitirla en el sitio, imprimir la etiqueta, registrar la venta en Mindbody y entender cada estado."
    >
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Table of contents */}
        <nav aria-label="Contenido" className="lg:sticky lg:top-6 self-start">
          <div className="rounded-lg border border-beige-300 bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-gold-700 mb-2">Contenido</div>
            <ul className="space-y-1 text-sm">
              {SECTIONS.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block py-1 text-warm-gray-700 hover:text-dark hover:underline">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-12 max-w-3xl">
          <Section id="flujo" icon={Gift} title="Cómo funciona">
            <p>
              El sitio genera el <strong>serial</strong> y la etiqueta; <strong>Mindbody</strong> es donde vive el dinero.
              Una Gift Card solo vale cuando la venta queda registrada en Mindbody con ese mismo serial.
            </p>
            <ol className="grid gap-3 sm:grid-cols-4 list-none pl-0">
              {[
                ['Emitir', 'Datos del comprador, destinatario y monto. El sitio asigna el serial.'],
                ['Imprimir', 'La etiqueta sale de la impresora D520 y se pega en la tarjeta física.'],
                ['Vender', 'En Mindbody, escaneando el serial como número de la gift card.'],
                ['Sincronizar', 'El sitio consulta Mindbody y la tarjeta pasa a Vendida.'],
              ].map(([t, d], i) => (
                <li key={t} className="rounded-lg border border-beige-300 bg-white p-3">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gold-700">Paso {i + 1}</div>
                  <div className="font-semibold text-dark mt-1">{t}</div>
                  <div className="text-xs text-warm-gray-500 mt-1">{d}</div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="emitir" icon={Gift} title="1. Emitir una Gift Card">
            <Steps>
              <li>Entra a <Link href="/admin/giftcards/issue" className="text-gold-700 underline">Emitir Gift Card</Link>.</li>
              <li>
                <strong>Monto.</strong> Elige <em>Monto directo</em> (escribes el valor) o <em>Por tratamientos</em> (sumas
                tratamientos del menú + ITBMS; los tratamientos se imprimen en la etiqueta si dejas la casilla marcada).
              </li>
              <li>
                <strong>Comprador.</strong> Escribe el nombre y elige el cliente de Mindbody en la lista si aparece — así
                queda enlazado y se rellenan correo y teléfono. Usa el mismo cliente al vender en Mindbody.
              </li>
              <li><strong>Destinatario.</strong> Quien recibe el regalo. El nombre no se imprime en la etiqueta.</li>
              <li>
                <strong>Detalles de impresión.</strong> Mensaje/dedicatoria (sí se imprime), nota interna (nunca se imprime)
                y qué mostrar en la etiqueta: monto, mensaje, tratamientos.
              </li>
              <li>Presiona <strong>Emitir e imprimir</strong>. El sitio asigna el serial (por ejemplo <span className="font-mono">MG000123</span>) y te lleva a la pantalla de impresión.</li>
            </Steps>
            <Shot src="/manual/giftcards/01-emitir.png" alt="Formulario para emitir una Gift Card" caption="Pantalla Emitir Gift Card: monto, comprador, destinatario y detalles de impresión." />
          </Section>

          <Section id="imprimir" icon={Printer} title="2. Imprimir la etiqueta">
            <Steps>
              <li>Revisa la vista previa: es exactamente lo que va a salir de la impresora.</li>
              <li>Confirma que <strong>QZ Tray</strong> está abierto (ícono junto al reloj de la Mac) y que la impresora <strong>D520</strong> está encendida.</li>
              <li>Presiona <strong>Imprimir Etiqueta</strong>. No aparece ningún diálogo: la etiqueta sale directo.</li>
              <li>Pega la etiqueta <strong>centrada</strong> en la tarjeta física de Mimosa.</li>
            </Steps>
            <Shot src="/manual/giftcards/02-imprimir.png" alt="Pantalla de impresión de la etiqueta" caption="Pantalla de impresión: estado en Mindbody, botones Editar · Prueba · Imprimir Etiqueta, y la vista previa." />
            <Shot src="/manual/giftcards/03-etiqueta.png" alt="Etiqueta de Gift Card" caption="La etiqueta (3 × 2 pulgadas): monto, tratamientos incluidos, mensaje y el código de barras con el serial." />
            <Tip>
              <strong>Prueba</strong> imprime un patrón de calibración (marco, flecha ARRIBA, parches de oscuridad y un código de barras).
              Úsalo al cambiar de rollo: el marco debe coincidir con el borde de la etiqueta. Si no coincide, con la impresora
              encendida y el cable USB desconectado, mantén presionado el botón de avance 3–6 segundos para que recalibre, y vuelve a probar.
            </Tip>
            <Tip warn>
              Si la etiqueta no se imprime, lo más común es que QZ Tray no esté abierto. Ábrelo desde Aplicaciones y vuelve a intentar.
              Si aparece una ventana de QZ pidiendo permiso (&quot;Allow&quot;), avisa a administración: falta instalar el certificado en esa computadora.
            </Tip>
          </Section>

          <Section id="mindbody" icon={ShoppingCart} title="3. Vender la Gift Card en Mindbody">
            <p>
              Este paso es el que le da valor a la tarjeta. Lo importante: <strong>el número de la gift card en Mindbody tiene que ser el serial impreso</strong>.
              Si Mindbody genera su propio número, el sitio nunca encontrará la venta y la tarjeta se quedará en <em>Emitida</em>.
            </p>
            <Steps>
              <li>En Mindbody abre el <strong>Punto de venta</strong> (Retail → Point of Sale) y selecciona al <strong>comprador</strong> — el mismo cliente que pusiste al emitir.</li>
              <li>Elige <strong>Gift Cards</strong> y la gift card prepagada.</li>
              <li>Escribe el <strong>valor</strong> igual al monto emitido.</li>
              <li>
                En el campo del <strong>número / código de barras de la gift card</strong>, <strong>escanea la etiqueta</strong> con el lector
                (o escribe el serial tal cual, por ejemplo <span className="font-mono">MG000123</span>, respetando mayúsculas y ceros).
              </li>
              <li>Completa destinatario si Mindbody lo pide y <strong>cobra</strong> con la forma de pago real del cliente.</li>
              <li>
                De vuelta en el sitio, presiona <strong>Sincronizar</strong> en la tarjeta. Debe pasar a <StatusPill tone="green">Vendida</StatusPill> y
                mostrar el saldo. Si no presionas nada, el sitio revisa solo cada hora.
              </li>
            </Steps>
            <Tip warn>
              ¿Sincronizaste y sigue en Emitida? Casi siempre es que la venta en Mindbody quedó con otro número. Busca la venta en Mindbody,
              anúlala y vuelve a venderla escaneando la etiqueta.
            </Tip>
            <p className="text-sm text-warm-gray-500">
              Para canjear: en Mindbody, al cobrar un servicio, elige <em>Gift Card</em> como forma de pago y escanea la misma etiqueta. El saldo baja
              en Mindbody y, tras sincronizar, también aquí.
            </p>
          </Section>

          <Section id="estados" icon={RefreshCw} title="Estados de una Gift Card">
            <p>El estado sale de comparar nuestro registro con Mindbody. Cambia solo, por sincronización — nadie lo edita a mano.</p>
            <div className="overflow-x-auto rounded-lg border border-beige-300 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-beige-100 text-[11px] uppercase tracking-widest text-warm-gray-500">
                  <tr>
                    <th className="text-left px-4 py-2">Estado</th>
                    <th className="text-left px-4 py-2">Qué significa</th>
                    <th className="text-left px-4 py-2">Cómo llega ahí</th>
                    <th className="text-left px-4 py-2">Qué puedes hacer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-200 align-top">
                  <tr>
                    <td className="px-4 py-3"><StatusPill tone="amber">Emitida</StatusPill></td>
                    <td className="px-4 py-3">El serial existe en el sitio; Mindbody todavía no conoce la tarjeta. <strong>Aún no vale dinero.</strong></td>
                    <td className="px-4 py-3">Al presionar &quot;Emitir e imprimir&quot;.</td>
                    <td className="px-4 py-3">Editar, reimprimir, venderla en Mindbody.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><StatusPill tone="green">Vendida</StatusPill></td>
                    <td className="px-4 py-3">Mindbody registró la venta con este serial y la tarjeta tiene saldo.</td>
                    <td className="px-4 py-3">Sincronización (botón o cada hora) después de la venta en Mindbody.</td>
                    <td className="px-4 py-3">Reimprimir, consultar saldo. <strong>Ya no se edita</strong>: cualquier corrección va en Mindbody.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><StatusPill tone="gray">Usada</StatusPill></td>
                    <td className="px-4 py-3">El saldo en Mindbody llegó a $0.</td>
                    <td className="px-4 py-3">Sincronización después del último canje.</td>
                    <td className="px-4 py-3">Solo consulta. Queda como historial.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><StatusPill tone="red">Anulada</StatusPill></td>
                    <td className="px-4 py-3">Administración la canceló (etiqueta dañada, emitida por error…).</td>
                    <td className="px-4 py-3">Solo administración.</td>
                    <td className="px-4 py-3">Nada. Emite una nueva si hace falta.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-warm-gray-500">
              &quot;Saldo Mindbody&quot; y la fecha de sincronización aparecen en la lista de Emitidas y en el detalle de cada tarjeta.
            </p>
          </Section>

          <Section id="editar" icon={Pencil} title="Editar una Gift Card">
            <p>
              Mientras la tarjeta esté <StatusPill tone="amber">Emitida</StatusPill> puedes corregir cualquier dato: monto, tratamientos,
              comprador, destinatario, mensaje y qué se imprime. El <strong>serial nunca cambia</strong>.
            </p>
            <Steps>
              <li>En <Link href="/admin/giftcards/issued" className="text-gold-700 underline">Emitidas</Link>, busca la tarjeta y presiona el lápiz (Editar). También hay un botón Editar en la pantalla de impresión.</li>
              <li>Corrige lo necesario y presiona <strong>Guardar cambios</strong>.</li>
              <li>Vuelves a la pantalla de impresión: si cambió algo que se imprime, <strong>imprime la etiqueta de nuevo</strong> y descarta la anterior.</li>
            </Steps>
            <Shot src="/manual/giftcards/06-editar.png" alt="Pantalla Editar Gift Card" caption="Editar: el mismo formulario de emisión, con los datos actuales cargados." />
            <Tip warn>
              En cuanto la tarjeta pasa a <strong>Vendida</strong> el botón desaparece y el sistema rechaza cambios: el monto ya es dinero cobrado.
              Corrige en Mindbody y presiona Sincronizar.
            </Tip>
          </Section>

          <Section id="consultar" icon={Search} title="Consultar y sincronizar">
            <Steps>
              <li>En <Link href="/admin/giftcards/issued" className="text-gold-700 underline">Emitidas</Link> escribe el serial, un nombre, correo o teléfono en el buscador.</li>
              <li>Filtra por estado con los botones Todas · Emitidas · Vendidas · Usadas.</li>
              <li>Toca el serial para abrir el detalle completo (monto, saldo, comprador, destinatario, venta en Mindbody, quién la emitió).</li>
              <li>El botón <RefreshCw className="inline h-4 w-4 align-text-bottom" /> <strong>Sincronizar</strong> consulta Mindbody en ese momento y actualiza estado y saldo.</li>
            </Steps>
            <Shot src="/manual/giftcards/04-emitidas.png" alt="Lista de Gift Cards emitidas" caption="Emitidas: buscador, filtros por estado, saldo en Mindbody y acciones (sincronizar · editar · imprimir)." />
            <Shot src="/manual/giftcards/05-detalle.png" alt="Detalle de una Gift Card vendida" caption="Detalle de una tarjeta ya vendida: saldo en Mindbody, venta y forma de pago." />
          </Section>

          <Section id="problemas" icon={AlertTriangle} title="Problemas frecuentes">
            <div className="overflow-x-auto rounded-lg border border-beige-300 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-beige-100 text-[11px] uppercase tracking-widest text-warm-gray-500">
                  <tr>
                    <th className="text-left px-4 py-2">Qué pasa</th>
                    <th className="text-left px-4 py-2">Qué hacer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-200 align-top">
                  <tr>
                    <td className="px-4 py-3">&quot;No se pudo conectar con QZ Tray&quot;</td>
                    <td className="px-4 py-3">Abre QZ Tray desde Aplicaciones (debe verse su ícono junto al reloj) y vuelve a imprimir.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">La impresora no responde</td>
                    <td className="px-4 py-3">Revisa que esté encendida y conectada por USB. Apágala y enciéndela con la tapa cerrada.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">La etiqueta sale corrida o cada vez más abajo</td>
                    <td className="px-4 py-3">Recalibra: USB desconectado, mantén el botón de avance 3–6 s, reconecta. Luego presiona <strong>Prueba</strong>.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">La impresión sale clara</td>
                    <td className="px-4 py-3">Avisa a administración para subir la oscuridad (Darkness) de la impresora.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Sincronicé y sigue en Emitida</td>
                    <td className="px-4 py-3">La venta en Mindbody no lleva este serial. Anula esa venta y vuelve a venderla escaneando la etiqueta.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Me equivoqué en el monto o el nombre</td>
                    <td className="px-4 py-3">Si está Emitida: Editar y reimprimir. Si ya está Vendida: corregir en Mindbody y Sincronizar.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Se dañó la etiqueta</td>
                    <td className="px-4 py-3">Reimprime desde la tarjeta (mismo serial). No emitas una nueva: eso crea otro serial.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </AdminPage>
  )
}
