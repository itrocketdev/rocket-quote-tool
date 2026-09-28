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
