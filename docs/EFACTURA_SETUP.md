# Facturación electrónica directa (PAC efacturapty)

Emitimos los documentos fiscales desde nuestra propia plataforma, sin pasar por
el puente Mindbody→proveedor. Así controlamos línea por línea el ITBMS, la
forma de pago y el tipo de receptor.

## Regla contable (confirmada, ago 2026)

- La **venta de una gift card NO genera factura** — es un pasivo (valor
  almacenado). Se entrega un **recibo de venta**.
- La **factura se emite al canjear** la gift card: el servicio va facturado y la
  gift card aparece como **forma de pago 07 (Tarjeta de Regalo)**.
- En una transacción mixta (servicio + gift card), **la factura lleva solo las
  líneas de servicio** y la gift card va en un recibo aparte.

Esto está implementado en `src/lib/efactura/emit.ts`: se filtran los ítems de
tipo `gift_card` y, si la orden no tiene servicios, no se emite documento.

## Puesta en marcha

1. **Credenciales.** Pedir a efacturapty la API key (ambiente de pruebas
   primero). Se guarda en Supabase, no en variables de entorno:

   ```sql
   UPDATE efactura_config
      SET api_key = '<api key>', enabled = true
    WHERE location_id = 0;   -- canal en línea (Mimosa Online)
   ```

   > ⚠️ **No existe ambiente de pruebas.** La cuenta de efacturapty es LIVE:
   > todo documento emitido es fiscal y real ante la DGI. Las pruebas se hacen
   > emitiendo documentos de monto mínimo y **anulándolos** después en la
   > plataforma de efacturapty (o con el botón Anular en `/admin/facturas`).

2. **Sucursales (verificado contra documentos reales).** El PAC distingue las
   sucursales por `informacionEmisor.codigoSucursal` (4 dígitos), NO por
   `puntoFacturacion` (que es `001` para todo el RUC):

   | codigoSucursal | Sucursal |
   |---|---|
   | `0000` | Costa del Este (Star Plaza) |
   | `0001` | San Francisco (Calle 74 este) |
   | `0002` | **Mimosa Online** ← las ventas web |

   Los pedidos en línea se facturan bajo **0002**, sin importar en qué spa se
   preste el servicio, para que el ingreso web sea identificable. La numeración
   la asigna el PAC en una sola serie compartida, así que no hay colisión con
   las facturas del mostrador.

3. **Probar.** `npm run efactura:dryrun` construye e valida los payloads sin
   enviar nada. Para una prueba real: emitir un documento de monto mínimo,
   verificar el CAFE y el QR de la DGI, y **anularlo** enseguida.

## Referencia fiscal dentro de Mindbody

La venta que registramos en Mindbody lleva la referencia de la factura en el
campo `SalesNotes` de la primera línea (verificado en sandbox: Mindbody lo
devuelve como `PurchasedItems[].Notes` en `GET /sale/sales`):

```
Orden MO-0003E9 | Factura 0002-001-0000001104 | CUFE FE0120000229… | Tilopay TLP-77123456
```

Así el contador concilia Mindbody ↔ efactura sin salir de Mindbody. Por eso el
orden del pipeline es **preflight → factura → venta**: el preflight (`Test:true`)
valida los totales contra Mindbody sin comprometer nada, luego se emite la
factura, y la venta se registra ya con el CUFE. Si la facturación falla, la
venta igual se registra (sin CUFE en la nota) y el cron reintenta.

## Sucursal de las gift cards (Mindbody)

Una gift card no tiene sucursal propia, así que la venta se registra en
Mindbody según el contexto:

| Pedido | Sucursal Mindbody |
|---|---|
| **Solo gift cards** (el cliente no eligió spa) | la configurada en `/admin/giftcards/shop` → **San Francisco** |
| **Gift card + servicio** | el spa donde se presta el servicio, para que todo el pedido quede en una sola sucursal |

El override por pedido vive en `gc_orders.mindbody_location_id`; cuando está
vacío se usa `gc_shop_settings.default_mindbody_location_id`. Esto es solo
atribución en Mindbody — **no afecta la facturación**, porque la venta de gift
cards no genera factura (se factura el servicio al canjearla).

## Cómo funciona

- La emisión ocurre en el paso 5 del pipeline de pedidos, después de registrar
  la venta en Mindbody. **Nunca bloquea al cliente**: si falla, el pedido queda
  pagado y reservado y el cron reintenta.
- `POST /api/cron/efactura` (cada 15 min) emite pedidos sin factura y reintenta
  rechazados hasta 5 veces; después quedan para revisión manual.
- Los reembolsos emiten **nota de crédito** (tipo 04) referenciando el CUFE
  original, desde el botón Reembolsar en `/admin/pedidos`.
- `/admin/facturas` permite descargar el CAFE (PDF), abrir el QR de la DGI,
  reintentar rechazados y anular documentos autorizados (motivo ≥10 caracteres).

## Impresión del CAFE en el mostrador

El cliente que paga en el spa debe salir con su CAFE impreso. La impresión es
una **cola con confirmación**, no un "enviar y olvidar": si se atasca el rollo
o la MUNBYN se cae del WiFi, nadie se enteraría hasta que el cliente ya se fue.

```
emisión → print_jobs(pending) → estación reclama(printing) → printed
                                          └── error ──────→ failed → reimprimir
```

- **`/admin/impresion`** es la estación. Se activa **solo en la Mac del
  mostrador** que tiene QZ Tray y la impresora; cualquier otra pantalla puede
  abrir la misma página para *mirar* la cola sin reclamar trabajos.
- Cada estación tiene un id propio, así que dos mostradores nunca imprimen el
  mismo documento. Un trabajo reclamado que queda colgado más de 90 segundos
  vuelve a la cola.
- **Ver muestra** dibuja un CAFE de ejemplo en pantalla e **Imprimir prueba**
  lo manda a la impresora — para calibrar el papel sin esperar a que llegue un
  cliente.
- Una **reimpresión crea una fila nueva** (`reprint_of`), no reinicia la
  anterior: el rastro debe mostrar que un documento fiscal se imprimió dos
  veces y por qué falló el primero.
- Los **pedidos en línea no entran a la cola** — su CAFE va por correo.

Detalles técnicos: el recibo se rasteriza a 576 puntos (72 mm útiles de un
rollo de 80 mm) a los 203 dpi nativos de la impresora y QZ lo recibe con todo
el escalado desactivado, igual que las etiquetas de gift card. Cualquier
escalado en el camino es lo que vuelve **ilegible el QR**, y un QR que no
escanea es un CAFE que el cliente no puede verificar ante la DGI.

> ⚠️ **Antes de imprimir el primer CAFE** hay que llenar los datos del emisor,
> que hasta ahora nunca hicieron falta (el PAC nos identifica por la API key,
> pero el papel lleva razón social y RUC):
>
> ```sql
> UPDATE efactura_config
>    SET razon_social = '…', ruc = '…', dv = '…',
>        direccion = '…', telefono = '…',
>        receipt_footer = 'Gracias por su visita'
>  WHERE location_id IN (1, 2);
> ```
>
> La estación se niega a imprimir mientras falten `razon_social` o `ruc` — es
> preferible un error visible a entregar un documento con un RUC inventado.

## Detalles que la DGI rechaza (ya resueltos en el código)

| Regla | Implementación |
|---|---|
| El PAC asigna la numeración | Nunca enviamos `numeroDocumento` |
| Recalcula `precioUnitario × cantidad` (error 2053) | Precio unitario a **6 decimales** |
| `codigoInternoItem` ≤ 20 caracteres (error 10103) | `sanitizeItemCode()` |
| `formaPago` 99 exige descripción de 10–100 caracteres (regla 2601) | `paymentFormaDescripcion()` |
| Los rechazos llegan con **HTTP 200** | Se valida `autorizada === true` y se extrae `gResProc[]` |
| Precios de Mindbody son **con ITBMS incluido** | `splitInclusive()` separa neto e impuesto por línea |

## Reembolsos: paridad de documentos

Un reembolso **nunca anula** la venta original. Anular la borraría, y la factura
que la respalda no se puede des-emitir — se emite una nota de crédito. Por eso
cada sistema conserva dos documentos que se corresponden entre sí:

| Sitio | Fiscal (DGI) | Mindbody |
|---|---|---|
| pedido + reembolso | factura + nota de crédito | venta + reembolso |

La API de Mindbody **no puede** devolver una venta pagada con tender Custom
(`POST /sale/returnsale` la rechaza con `InvalidSaleReturn`, verificado en
sandbox), así que el reembolso se registra a mano en el POS. El pedido queda
marcado en `/admin/pedidos` con "Falta registrar el reembolso…" hasta que
alguien confirma con **Ya registré el reembolso** (se guarda quién y cuándo).

## Pendiente

- ~~Código CPBS~~ **resuelto**: el puente actual envía
  `codigoItemCodificacionPanamenaAbreviada: null`, así que no es obligatorio.
- Definir la forma de pago para **Yappy**: hoy va como `99` con descripción
  "Pago por Yappy" (no existe código propio en el catálogo DGI). Confirmar con
  el contador si prefiere `08` (transferencia).
- Facturación de las ventas del POS (mostrador). Hoy solo facturamos los
  pedidos en línea; el resto sigue saliendo por el puente hasta que se migre.
  El mapeo ya existe (`src/lib/efactura/fromMindbodySale.ts`, validado con
  `npm run efactura:pos-dryrun`) y la cola de impresión ya está lista; falta
  resolver la diferencia de documentos contra el puente en modo sombra y
  coordinar la fecha de corte con efacturapty.
