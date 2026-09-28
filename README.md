# Cotizador ROCKET

Landing tipo calculadora para cotizar los servicios de **ROCKET Lab** y **ROCKET Consulting**, con precio individual y precio **bundle** (descuento al elegir 3 o más servicios con precio).

Es un sitio estático (HTML + CSS + JS, sin build ni dependencias), así que se despliega tal cual en Vercel.

## Editar precios, niveles y textos

Todo está en **`config.js`**:

- `levels`: nombre, precio, lista de lo que incluye y `from: true` para mostrar "Desde".
- `type`: `monthly` (mensual), `oneTime` (pago único) o `quote` (se cotiza con llamada / tras el discovery).
- `bundle.minServices` y `bundle.discountPct`: reglas del bundle.
- `contact.whatsapp`, `contact.email`, `contact.bookingUrl`: destino del botón **Solicitar propuesta** y de **Agendar brief call**.
- `currency` y `locale`: moneda y formato.

> ⚠️ Los precios y entregables actuales son **ejemplos**. Hay que reemplazarlos con los reales.

## Cómo funciona

- El cliente elige servicios y nivel; el resumen muestra el total individual, el ahorro del bundle y el total final.
- Web, Playbook y Acompañamiento no tienen precio: se incluyen en la solicitud como "a cotizar".
- **Copiar link** genera una URL con la selección (`#s=sdr.1,meta.0,...`) para que el equipo comercial se la mande a un cliente.
- **Solicitar propuesta** abre WhatsApp (si hay número), si no el correo, si no copia el resumen y abre el link para agendar.

## Correr localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Desplegar en Vercel

1. En Vercel: **Add New → Project** e importar este repositorio.
2. Framework preset: **Other**. Sin build command ni output directory.
3. Deploy. Cada push a la rama genera un nuevo deploy.
