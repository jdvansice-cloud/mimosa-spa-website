import type Anthropic from '@anthropic-ai/sdk'

const suc = { type: 'string', enum: ['cde', 'sfc'], description: 'cde = Costa del Este, sfc = San Francisco' }

const tool = (name: string, description: string, properties: Record<string, unknown>, required: string[] = []): Anthropic.Tool =>
  ({ name, description, strict: true, input_schema: { type: 'object', properties, required, additionalProperties: false } } as Anthropic.Tool)

export const TOOLS: Anthropic.Tool[] = [
  tool('get_location_info', 'Dirección, plaza, enlaces de Waze y Google Maps y estacionamiento de una sucursal.', { sucursal: suc }, ['sucursal']),
  tool('get_hours', 'Horario de atención del spa.', {}),
  tool('get_payment_info', 'Formas de pago: Yappy, transferencia/ACH y link de tarjeta. Única fuente de datos bancarios; envíalos en su propia burbuja.', {}),
  tool('list_services', 'Lista tratamientos con duración y precio (fuente única de precios). query filtra por nombre.', { sucursal: suc, query: { type: 'string' } }, ['sucursal', 'query']),
  tool('send_image', 'Envía una imagen de la biblioteca al cliente (promo, precios, mapa). Usa la clave listada en el prompt.', { key: { type: 'string' } }, ['key']),
  tool('send_buttons', 'Envía un mensaje con hasta 3 botones (máx 20 caracteres cada uno).', { body: { type: 'string' }, buttons: { type: 'array', items: { type: 'string' } } }, ['body', 'buttons']),
  tool('find_client', 'Busca al cliente en Mindbody por su teléfono; devuelve nombre, correo y últimas visitas.', {}),
  tool('create_client', 'Crea el cliente en Mindbody. Solo después de pedir nombre, apellido y correo.', { first_name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' } }, ['first_name', 'last_name', 'email']),
  tool('check_availability', 'Horas disponibles para los tratamientos en una fecha. people=2 devuelve solo horas con dos terapeutas libres a la vez.', { sucursal: suc, date: { type: 'string', description: 'YYYY-MM-DD' }, service_ids: { type: 'array', items: { type: 'integer' } }, people: { type: 'integer', enum: [1, 2] } }, ['sucursal', 'date', 'service_ids', 'people']),
  tool('book', 'Crea la cita en Mindbody. Requiere customer_confirmation con el texto exacto con el que el cliente dijo que sí al resumen.', { sucursal: suc, date: { type: 'string' }, time: { type: 'string', description: 'HH:mm 24h' }, service_ids: { type: 'array', items: { type: 'integer' } }, people: { type: 'integer', enum: [1, 2] }, customer_confirmation: { type: 'string' } }, ['sucursal', 'date', 'time', 'service_ids', 'people', 'customer_confirmation']),
  tool('list_my_appointments', 'Próximas citas del cliente.', {}),
  tool('reschedule', 'Mueve una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, date: { type: 'string' }, time: { type: 'string' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'date', 'time', 'customer_confirmation']),
  tool('cancel', 'Cancela una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'customer_confirmation']),
  tool('handoff', 'Pasa la conversación a una recepcionista humana. resumen: 2 líneas con lo que quiere el cliente y lo ya recopilado.', { motivo: { type: 'string' }, resumen: { type: 'string' } }, ['motivo', 'resumen']),
  tool('close_chat', 'Marca la conversación como resuelta después de despedirte.', {}),
  tool('note_to_self', 'Guarda un dato útil para el resto de la conversación (preferencias, sucursal, etc.).', { text: { type: 'string' } }, ['text']),
]
