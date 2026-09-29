# Cotizador ROCKET

Landing tipo calculadora para cotizar los servicios de **ROCKET Lab** y **ROCKET Consulting**, con precio individual y precio **bundle** (descuento al elegir 3 o más servicios con precio).

Es un sitio estático (HTML + CSS + JS, sin build ni dependencias), así que se despliega tal cual en Vercel.

## Editar precios, niveles y textos

Todo está en **`config.js`**:

- `levels`: nombre, precio, lista de lo que incluye y `from: true` para mostrar "Desde".
- `type`: `monthly` (mensual), `oneTime` (pago único) o `quote` (se cotiza con una llamada).
- `theme: "dark"` en una división la muestra en azul marino con acento naranja (se usa en ROCKET Consulting).
- `bundle.minServices` y `bundle.discountPct`: reglas del bundle.
- `contact.whatsapp`: WhatsApp de ventas que recibe la cotización (botón **Solicitar cotización**).
- `contact.bookingUrl`: link de calendario (Calendly, Google Calendar, etc.) para **Agendar llamada** y **Agendar brief call**. Si está vacío, esos botones abren WhatsApp pidiendo una llamada.
- `currency` y `locale`: moneda y formato.

> ⚠️ Los precios y entregables actuales son **ejemplos**. Hay que reemplazarlos con los reales.

## Cuestionario inicial

Al entrar, el visitante responde "Me interesa saber más sobre:" (una o varias opciones). Después ve arriba **"Según lo que necesitas, te podemos ayudar con…"** con los servicios de las opciones elegidas, y abajo **"Conoce nuestros otros servicios"** con el resto.

Las preguntas y qué servicios recomienda cada una se editan en `quiz.options` de `config.js`. Las respuestas se recuerdan en el navegador, viajan en el link compartido (`#i=...`) y se incluyen en el mensaje de WhatsApp. Un link con cotización (`#s=...`) abre directo la página, sin cuestionario. Para desactivarlo: `quiz.enabled: false`.

## Datos del cliente

El cotizador se usa libremente. Al pulsar **Solicitar cotización**, **Agendar llamada** o **Agendar brief call**, se abre un popup que pide **nombre completo, empresa, email y celular** antes de continuar a WhatsApp o al calendario. Los datos se guardan en el navegador del visitante (no se le vuelven a pedir) y se agregan al mensaje de WhatsApp.

Para recibir cada registro también en una hoja o CRM, pon en `lead.webhookUrl` (en `config.js`) la URL de un webhook de Make, Zapier o Google Apps Script. Se envían dos eventos: `registro` (al llenar el formulario) y `cotizacion` (al pulsar **Solicitar cotización**), con los campos `nombre`, `empresa`, `email`, `celular`, `cotizacion`, `link` y `fecha`. Para desactivar el popup: `lead.required: false`.

## Cómo funciona

- El cliente elige servicios y nivel; el resumen muestra el total individual, el ahorro del bundle y el total final.
- Web no tiene precio: se incluye en la solicitud como "a cotizar" y tiene su botón para agendar un brief call.
- **Copiar link** genera una URL con la selección (`#s=sdr.1,meta.0,...`) para que el equipo comercial se la mande a un cliente.
- Dos CTA: **Solicitar cotización** manda el resumen armado al WhatsApp de ventas; **Agendar llamada** abre el calendario.

## Correr localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Desplegar en Vercel

1. En Vercel: **Add New → Project** e importar este repositorio.
2. Framework preset: **Other**. Sin build command ni output directory.
3. Deploy. Cada push a la rama genera un nuevo deploy.
