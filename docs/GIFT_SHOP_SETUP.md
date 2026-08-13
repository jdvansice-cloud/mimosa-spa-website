# Tienda Online de Gift Cards — Setup y Runbook

Estado: **Fase 1 construida (sin ventas)**. La tienda queda inerte hasta que
existan las credenciales de Tilopay y el admin active `Tienda activa`.

## Arquitectura (resumen)

- **Compra**: `/es/giftcards` (3 pasos) → `POST /api/giftcards/checkout` crea
  `gc_orders` (pending) → redirect a checkout hospedado de Tilopay (tarjetas +
  Yappy) → `GET /api/giftcards/checkout/callback` valida el `OrderHash`
  (HMAC-SHA256, clave `orderId|apiKey|password`), marca `paid` idempotente y
  ejecuta el fulfillment.
- **Fulfillment** (`src/lib/giftshop/fulfillment.ts`, idempotente, con
  checkpoint por columna): mint serial `MW-######` → fila en `gift_cards`
  (channel=online, `view_token`) → registro async en Mindbody
  (`POST /sale/purchasegiftcard`, tender "Yappy Web"/"Visa/MC Web"/"AMEX Web"
  según el método usado en Tilopay; fallback Comp) → bonus card si aplica regla →
  entrega (email Resend + WhatsApp WATI opcional).
- **Código de canje late-bound**: la página `/gift/[token]` muestra
  `mindbody_barcode_id ?? serial`. Si el registro Mindbody funciona, el POS
  canjea el barcode nativo; si no, el front desk vende el serial MW- en el POS
  en la primera visita (el cron de sync detecta `sold_at` solo).
- **Cron**: `/api/cron/giftcard-orders` cada 10 min — completa pedidos pagados
  atascados, envía entregas programadas, reintenta Mindbody (≤5), expira
  abandonados (>24 h) y alerta pagados sin fulfillment (>1 h).

## Checklist de activación (cuando lleguen las credenciales Tilopay, ~1 semana)

1. **Vercel env** (scope `mimosa-spa`): `TILOPAY_API_KEY`, `TILOPAY_API_USER`,
   `TILOPAY_PASSWORD`, `RESEND_API_KEY`, `GIFTCARD_EMAIL_FROM`
   (`Mimosa Spa Retreat <regalos@mimosaretreat.com>`), `GIFTCARD_TEST_MODE=1`
   (quitar al lanzar).
2. **Resend**: crear cuenta, verificar dominio `mimosaretreat.com`
   (SPF + DKIM en el DNS).
3. **Mindbody (una vez, en el sitio de Mindbody)**:
   - Crear productos de Gift Card por denominación ($50/$100/$150/$200) y por
     experiencia (Ritual Mimosa, Ritual en Pareja, Escape Romántico,
     Aniversario Mimosa), vendibles.
   - Crear TRES métodos de pago custom: **"Yappy Web"**, **"Visa/MC Web"** y
     **"AMEX Web"**. El fulfillment elige el que corresponde según cómo pagó
     el cliente en Tilopay, así el contador cruza Mindbody ↔ transacciones
     Tilopay ↔ depósitos bancarios por método. (Los KPIs tratan cualquier
     tender terminado en " Web" como dinero ya cobrado — no se cuenta doble.)
   - Anotar los IDs de producto en `/admin/giftcards/shop` (columna
     "Mindbody GC ID").
   - **Spike**: probar `purchasegiftcard` con `Test:true` y tender Custom (vía
     una compra en modo test). Si Mindbody rechaza el tender, dejar los IDs
     vacíos → los pedidos quedan `mindbody_status=skipped` y aplica el flujo
     operativo (vender serial MW- en POS al canjear).
4. **Migraciones** (SQL editor de Supabase, en orden):
   `20260815_fy27_flagship.sql` → `20260818_gc_shop.sql` →
   `20260901_bonus_referral.sql` → `20260902_gc_payment_method.sql`.
5. **WATI**: enviar a aprobación la plantilla `giftcard_entrega` (UTILITY):
   - Body sugerido: `Hola {{nombre}} 🎁 {{remitente}} te envió una Gift Card
     de Mimosa Spa por {{monto}}. Tócala aquí para verla y reservar tu cita.`
   - Botón URL dinámico: `https://www.mimosaretreat.com/gift/{{1}}`
   - Hasta su aprobación, la entrega por WhatsApp queda apagada
     (`whatsapp_delivery_enabled`); el correo del comprador incluye un enlace
     wa.me para reenviar el regalo.
6. **Activar**: `/admin/giftcards/shop` → activar artículos → `Tienda activa`.

## Pruebas E2E (modo test)

- Compra de prueba con tarjeta test de Tilopay y con Yappy sandbox.
- **Una compra por método** (Yappy, Visa, Mastercard, AMEX): verificar en
  `/admin/giftcards/orders` que la columna "Método" muestra el tender correcto
  y que la venta en Mindbody quedó con ese método de pago. Si Tilopay usa
  nombres de parámetro distintos a `selected_method`/`crd`, el valor crudo
  queda en `callback_raw` del pedido — ajustar el mapeo con ese dato real.
- Replay del callback exacto (curl) → pasa; alterar `amount` → redirect a
  error `invalid` (hash mismatch).
- Matar el fulfillment a mitad (lanzar error tras insertar la card) → el cron
  lo completa sin duplicar card/bonus/correo.
- Correos a Gmail/Outlook/iCloud: DKIM pass, no spam.
- Escanear el barcode de `/gift/[token]` desde el teléfono en el lector del
  front desk.
- Cron manual: `curl -H "Authorization: Bearer $CRON_SECRET"
  https://…/api/cron/giftcard-orders`.
- Lanzamiento suave: 1 compra real + 1 Yappy + 1 reembolso (vía Tilopay
  portal + anular la card en Supabase `voided_at` — la acción de reembolso
  one-click llega en la fase de refunds).

## Pendiente (fases siguientes, ya diseñadas)

- **Fase 2 (día Tilopay)**: credenciales + E2E test-mode + soft launch.
- **W7 Bonus**: pantalla de canje front-desk (`/admin/giftcards/bonus/redeem`),
  reglas en admin (la emisión automática YA funciona: regla seed
  "$150+ → $25" está inactiva hasta activarla en `bonus_rules`).
- **W8**: reembolso one-click (Tilopay `processModification` + `returnsale`),
  bandeja corporativa, formulario corporativo en la tienda.
- **WS-B**: prepago de reservas en el widget (elige "Pagar ahora" con
  descuento configurable vs "Pagar en el spa"; flag
  `booking_pay_at_spa_enabled` para deprecarlo después).
- **Referidos (feb 14)**: mecánica "Regala $20, Recibe $20" sobre
  `bonus_cards`/`referral_codes` (tablas ya creadas).
