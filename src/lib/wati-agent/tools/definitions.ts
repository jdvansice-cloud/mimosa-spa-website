import type Anthropic from '@anthropic-ai/sdk'

const suc = { type: 'string', enum: ['cde', 'sfc'], description: 'cde = Costa del Este, sfc = San Francisco' }

const tool = (name: string, description: string, properties: Record<string, unknown>, required: string[] = []): Anthropic.Tool =>
  ({ name, description, strict: true, input_schema: { type: 'object', properties, required, additionalProperties: false } } as Anthropic.Tool)

export const TOOLS: Anthropic.Tool[] = [
  tool('get_location_info', 'Dirección, plaza, enlaces de Waze y Google Maps y estacionamiento de una sucursal. La respuesta al cliente debe ser una línea corta seguida de los dos links (Google Maps y Waze), sin más texto.', { sucursal: suc }, ['sucursal']),
  tool('get_hours', 'Horario de atención del spa.', {}),
  tool('get_payment_info', 'Formas de pago: Yappy, transferencia/ACH y link de tarjeta. Única fuente de datos bancarios; envíalos en su propia burbuja.', {}),
  tool('list_services', 'Lista tratamientos con duración y precio (fuente única de precios). query filtra por nombre.', { sucursal: suc, query: { type: 'string' } }, ['sucursal', 'query']),
  tool('get_suggestions', 'Sugerencias para un cliente que pide "un masaje" sin especificar: las promociones activas de la web primero y luego los más pedidos, con precio y duración.', { sucursal: suc }, ['sucursal']),
  tool('list_addons', 'Extras (adicionales) que se pueden agregar a un tratamiento, con duración y precio.', { sucursal: suc }, ['sucursal']),
  tool('list_therapists', 'Terapeutas con disponibilidad ese día para esos tratamientos, y a qué horas. Úsala solo si el cliente pide una terapeuta en particular o pregunta quién está.', { sucursal: suc, date: { type: 'string', description: 'YYYY-MM-DD' }, service_ids: { type: 'array', items: { type: 'integer' } } }, ['sucursal', 'date', 'service_ids']),
  tool('get_treatment_details', 'Descripción completa, duración, precio y categoría de un tratamiento del catálogo de la web. Úsala cuando el cliente pregunte "¿en qué consiste?" o quiera el detalle de un tratamiento.', { name: { type: 'string', description: 'Nombre del tratamiento tal como lo dijo el cliente' } }, ['name']),
  tool('get_site_info', 'Información completa de una página de la web: parejas y ocasiones, Club Mimosa, empresas, primera visita, referidos, certificados de regalo, políticas de cambios y cancelaciones, o ubicaciones y horarios.', { tema: { type: 'string', enum: ['parejas', 'club', 'empresas', 'primera_visita', 'referidos', 'giftcards', 'politicas', 'ubicaciones'] } }, ['tema']),
  tool('get_menu_link', 'Enlace de la página del menú o de reservas en la web, para que el cliente vea más opciones.', { seccion: { type: 'string', enum: ['menu', 'faciales', 'corporales', 'paquetes', 'promociones', 'parejas', 'reservar'] } }, ['seccion']),
  tool('send_image', 'Envía una imagen de la biblioteca al cliente (promo, precios, mapa). Usa la clave listada en el prompt.', { key: { type: 'string' } }, ['key']),
  tool('send_buttons', 'Envía un mensaje con hasta 3 botones (máx 20 caracteres cada uno).', { body: { type: 'string' }, buttons: { type: 'array', items: { type: 'string' } } }, ['body', 'buttons']),
  tool('find_client', 'Busca al cliente en Mindbody por su teléfono; devuelve nombre, correo y últimas visitas.', {}),
  tool('create_client', 'Crea el cliente en Mindbody. Solo después de pedir nombre, apellido y correo.', { first_name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' } }, ['first_name', 'last_name', 'email']),
  tool('check_availability', 'Horas disponibles para los tratamientos en una fecha. people=2 devuelve solo horas con dos terapeutas libres a la vez.', { sucursal: suc, date: { type: 'string', description: 'YYYY-MM-DD' }, service_ids: { type: 'array', items: { type: 'integer' } }, people: { type: 'integer', enum: [1, 2] } }, ['sucursal', 'date', 'service_ids', 'people']),
  tool('book', 'Crea la cita en Mindbody. Requiere customer_confirmation con el texto exacto con el que el cliente dijo que sí al resumen.', { sucursal: suc, date: { type: 'string' }, time: { type: 'string', description: 'HH:mm 24h' }, service_ids: { type: 'array', items: { type: 'integer' } }, addon_ids: { type: 'array', items: { type: 'integer' }, description: 'Extras a agregar; lista vacía si no lleva' }, staff_id: { type: 'integer', description: 'Id de la terapeuta pedida por el cliente; 0 = cualquiera disponible' }, people: { type: 'integer', enum: [1, 2] }, customer_confirmation: { type: 'string' } }, ['sucursal', 'date', 'time', 'service_ids', 'addon_ids', 'staff_id', 'people', 'customer_confirmation']),
  tool('list_my_appointments', 'Próximas citas del cliente.', {}),
  tool('reschedule', 'Mueve una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, date: { type: 'string' }, time: { type: 'string' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'date', 'time', 'customer_confirmation']),
  tool('cancel', 'Cancela una cita. Requiere confirmación del cliente.', { appointment_id: { type: 'integer' }, customer_confirmation: { type: 'string' } }, ['appointment_id', 'customer_confirmation']),
  tool('handoff', 'Pasa la conversación a una recepcionista humana. resumen: 2 líneas con lo que quiere el cliente y lo ya recopilado.', { motivo: { type: 'string' }, resumen: { type: 'string' }, sucursal: { type: 'string', enum: ['cde', 'sfc', ''], description: 'cde, sfc o cadena vacía si no se conoce' } }, ['motivo', 'resumen', 'sucursal']),
  tool('close_chat', 'Marca la conversación como resuelta después de despedirte.', {}),
  tool(
    'note_to_self',
    'Guarda un dato útil. text: nota para el resto de esta conversación. perfil: datos que el cliente confirmó y que debemos recordar para siempre; deja en blanco (cadena vacía o lista vacía) los campos que no cambian.',
    {
      text: { type: 'string' },
      perfil: {
        type: 'object',
        description: 'Memoria permanente del cliente. Solo hechos que el cliente dijo o que se reservaron; nunca suposiciones.',
        properties: {
          nombre: { type: 'string', description: 'Nombre y apellido, o cadena vacía' },
          correo: { type: 'string', description: 'Correo, o cadena vacía' },
          sucursal_preferida: { type: 'string', enum: ['cde', 'sfc', ''], description: 'cde, sfc o cadena vacía' },
          tratamientos: { type: 'array', items: { type: 'string' }, description: 'Tratamientos que suele tomar; lista vacía si no hay nada nuevo' },
          preferencias: { type: 'array', items: { type: 'string' }, description: 'Preferencias (terapeuta, presión, horario); lista vacía si no hay nada nuevo' },
          notas: { type: 'array', items: { type: 'string' }, description: 'Notas duraderas (alergias, embarazo, cumpleaños); lista vacía si no hay nada nuevo' },
        },
        required: ['nombre', 'correo', 'sucursal_preferida', 'tratamientos', 'preferencias', 'notas'],
        additionalProperties: false,
      },
    },
    ['text', 'perfil'],
  ),
]
