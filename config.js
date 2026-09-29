/*
 * ============================================================
 *  ROCKET · Cotizador — CONFIGURACIÓN
 * ============================================================
 *  Este es el ÚNICO archivo que hay que editar para cambiar
 *  precios, niveles, textos, descuento de bundle y contacto.
 *
 *  ⚠️  Los precios actuales son EJEMPLOS (placeholders).
 *      Reemplázalos con los precios reales antes de publicar.
 *
 *  Tipos de servicio ("type"):
 *    - "monthly"  → precio mensual recurrente
 *    - "oneTime"  → pago único
 *    - "quote"    → sin precio: requiere llamada / estimación
 *
 *  "from: true" en un nivel muestra el precio como "Desde $X".
 * ============================================================
 */
window.ROCKET_CONFIG = {
  currency: "USD",       // "USD", "MXN", "COP", etc.
  locale: "es-MX",       // formato de números

  bundle: {
    minServices: 3,      // servicios con precio necesarios para activar el bundle
    discountPct: 15,     // % de descuento del bundle
  },

  contact: {
    // WhatsApp de ventas en formato internacional, sin "+" ni espacios.
    // Recibe la cotización armada por el cliente (botón "Solicitar cotización").
    whatsapp: "50765902559",
    // Link para agendar llamada (Calendly, Google Calendar, HubSpot Meetings, etc.).
    // Si se deja vacío, "Agendar llamada" abre WhatsApp pidiendo agendar una llamada.
    bookingUrl: "",
  },

  // Mini cuestionario al entrar. Según lo que elija el cliente, esos servicios
  // se muestran arriba como recomendados y el resto en "Conoce nuestros otros servicios".
  quiz: {
    enabled: true,
    title: "¿En qué te podemos ayudar?",
    question: "Me interesa saber más sobre:",
    options: [
      {
        id: "estrategia",
        label: "Estrategia / Consultoría comercial digital",
        services: ["estrategia", "auditoria", "cmo"],
      },
      {
        id: "leads",
        label: "Generación de leads o mejorar la calidad de mis leads",
        services: ["meta", "google", "seo"],
      },
      {
        id: "web",
        label: "Crear un nuevo sitio web o posicionar mi web",
        services: ["seo", "tech", "web"],
      },
    ],
  },

  // Datos del cliente (nombre, empresa, email, celular): se piden al pulsar
  // "Solicitar cotización" o "Agendar llamada", antes de ir a WhatsApp / calendario.
  lead: {
    required: true,        // false = no pedir datos
    // URL que recibe los datos (webhook de Make, Zapier, Google Apps Script, etc.).
    // Se envía como formulario (application/x-www-form-urlencoded) con los campos:
    //   evento ("registro" o "cotizacion"), nombre, empresa, email, celular, cotizacion, link, fecha
    // Si se deja vacío, los datos solo viajan en el mensaje de WhatsApp.
    webhookUrl: "",
  },

  divisions: [
    {
      id: "lab",
      name: "ROCKET LAB",
      tagline: "Ejecución: generamos demanda, pipeline y presencia digital.",
      services: [
        {
          id: "sdr",
          name: "SDR",
          description: "Prospección outbound y calificación de leads para llenar tu agenda comercial.",
          type: "monthly",
          levels: [
            { name: "Starter", price: 1200, features: ["1 SDR part-time", "Hasta 300 contactos / mes", "Reporte mensual"] },
            { name: "Growth",  price: 2200, features: ["1 SDR full-time", "Hasta 800 contactos / mes", "Secuencias multicanal", "Reporte quincenal"] },
            { name: "Scale",   price: 3800, features: ["Equipo de 2 SDRs", "Hasta 2,000 contactos / mes", "Secuencias multicanal + LinkedIn", "Reporte semanal"] },
          ],
        },
        {
          id: "meta",
          name: "Paid Ads Meta",
          description: "Campañas en Facebook e Instagram enfocadas en conversión.",
          note: "No incluye inversión publicitaria.",
          type: "monthly",
          levels: [
            { name: "Esencial", price: 600,  features: ["Hasta 2 campañas activas", "Creativos básicos", "Reporte mensual"] },
            { name: "Pro",      price: 1100, features: ["Campañas ilimitadas", "Pruebas A/B de creativos", "Retargeting avanzado", "Reporte quincenal"] },
          ],
        },
        {
          id: "google",
          name: "Paid Ads Google",
          description: "Search, Display y Performance Max para capturar demanda activa.",
          note: "No incluye inversión publicitaria.",
          type: "monthly",
          levels: [
            { name: "Esencial", price: 600,  features: ["Search + 1 tipo de campaña", "Optimización mensual", "Reporte mensual"] },
            { name: "Pro",      price: 1100, features: ["Search, Display y PMax", "Optimización semanal", "Tracking de conversiones", "Reporte quincenal"] },
          ],
        },
        {
          id: "tech",
          name: "Tech Support",
          description: "Soporte técnico para tu stack digital: web, CRM, integraciones y automatizaciones.",
          type: "monthly",
          levels: [
            { name: "Básico",   price: 400,  features: ["Hasta 5 h / mes", "Respuesta en 48 h"] },
            { name: "Avanzado", price: 800,  features: ["Hasta 12 h / mes", "Respuesta en 24 h", "Mantenimiento preventivo"] },
            { name: "Premium",  price: 1500, features: ["Hasta 25 h / mes", "Respuesta en 4 h", "Automatizaciones e integraciones"] },
          ],
        },
        {
          id: "seo",
          name: "SEO + GEO",
          description: "Posicionamiento en buscadores y en motores de IA generativa (ChatGPT, Gemini, Perplexity).",
          type: "monthly",
          levels: [
            { name: "Starter", price: 700,  features: ["Auditoría técnica inicial", "2 artículos / mes", "Optimización on-page"] },
            { name: "Growth",  price: 1300, features: ["4 artículos / mes", "Link building", "Optimización para IA (GEO)"] },
            { name: "Scale",   price: 2200, features: ["8 artículos / mes", "Link building avanzado", "GEO + monitoreo de marca en IA", "Reporte quincenal"] },
          ],
        },
        {
          id: "web",
          name: "Web",
          description: "Sitios web, landings y e-commerce a la medida.",
          type: "quote",
          quoteMessage: "Cada proyecto web es distinto. Necesitamos una breve llamada (brief call) para entender tu proyecto y estimarlo.",
          cta: "Agendar brief call",
        },
      ],
    },
    {
      id: "consulting",
      theme: "dark",       // "dark" = sección en azul marino para diferenciarla
      name: "ROCKET CONSULTING",
      tagline: "Estrategia: diseñamos cómo crecer y te acompañamos a lograrlo.",
      services: [
        {
          id: "estrategia",
          name: "Estrategia Comercial Digital",
          description: "Plan comercial digital: canales, embudo, mensajes y métricas.",
          type: "monthly",
          levels: [
            { name: "Starter", price: 1000, features: ["Diagnóstico del embudo", "Plan de canales", "1 sesión mensual"] },
            { name: "Growth",  price: 1800, features: ["Todo lo de Starter", "Definición de KPIs y tablero", "2 sesiones mensuales"] },
            { name: "Scale",   price: 3000, features: ["Todo lo de Growth", "Alineación ventas–marketing", "Sesiones semanales"] },
          ],
        },
        {
          id: "auditoria",
          name: "Auditoría / Discovery de alcance",
          description: "Diagnóstico de tu operación comercial y digital para definir el alcance de la consultoría.",
          type: "oneTime",
          levels: [
            { name: "Discovery", price: 1500, features: ["Entrevistas con el equipo", "Revisión de procesos y herramientas", "Informe de hallazgos y alcance"] },
          ],
        },
        {
          id: "cmo",
          name: "CMO Parcial",
          description: "Un CMO senior liderando tu marketing, sin el costo de uno de tiempo completo.",
          type: "monthly",
          levels: [
            { name: "Fractional", price: 2500, from: true, features: ["Liderazgo de marketing part-time", "Gestión de equipo / proveedores", "Comité mensual con dirección"] },
          ],
        },
      ],
    },
  ],
};
