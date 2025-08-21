import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// Request validation schema
const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1).max(1000),
  })),
  locale: z.enum(["nl", "es", "en", "de"]).optional().default("nl"),
});

// Rate limiter configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max users per interval
});

// Multilingual Knowledge Base
const AI_CONTEXTS = {
  nl: {
    context: "Je bent een virtuele assistent voor Care & Service, een platform dat immigranten en expats in Spanje verbindt met geverifieerde lokale professionals.",
    categories: `SERVICECATEGORIEËN:
1. 🏥 Zorg & Gezondheid - Medische zorg, thuiszorg, fysiotherapie
2. 🔧 Technische Diensten - Reparaties, installaties, onderhoud
3. 📋 Administratief & Juridisch - Belastingen, juridisch advies, documentatie
4. 👶 Kinderopvang - Oppassen, kinderdagverblijven, kinderopvang
5. 🚗 Transport - Taxi's, verhuizingen, bezorgdiensten
6. ⚽ Sport & Recreatie - Trainers, sportlessen
7. 🎉 Sociale Activiteiten - Begeleiding, evenementen, sociale ondersteuning
8. 🏠 Huishoudelijke Diensten - Schoonmaak, tuinonderhoud, huishoudtaken`,
    features: `BELANGRIJKSTE KENMERKEN:
- Geverifieerde professionals met geldige documentatie
- Meertalige ondersteuning (Spaans, Engels, Nederlands, Duits)
- Beoordelings- en classificatiesysteem
- Veilige betalingen via het platform
- 24/7 ondersteuning
- Transparante prijzen`,
    tone: "Houd een vriendelijke, professionele en empathische toon aan. Onthoud dat veel gebruikers nieuw zijn in Spanje en mogelijk extra begeleiding nodig hebben."
  },
  es: {
    context: "Eres un asistente virtual para Care & Service, una plataforma que conecta inmigrantes y expatriados en España con profesionales locales verificados.",
    categories: `CATEGORÍAS DE SERVICIOS:
1. 🏥 Cuidado y Salud - Atención médica, cuidado domiciliario, fisioterapia
2. 🔧 Servicios Técnicos - Reparaciones, instalaciones, mantenimiento
3. 📋 Administrativo y Legal - Impuestos, asesoría legal, documentación
4. 👶 Cuidado Infantil - Niñeras, guarderías, cuidado de niños
5. 🚗 Transporte - Taxis, mudanzas, servicios de entrega
6. ⚽ Deporte y Recreación - Entrenadores, clases deportivas
7. 🎉 Actividades Sociales - Acompañamiento, eventos, apoyo social
8. 🏠 Servicios Domésticos - Limpieza, jardinería, tareas del hogar`,
    features: `CARACTERÍSTICAS CLAVE:
- Profesionales verificados con documentación válida
- Soporte multiidioma (Español, Inglés, Holandés, Alemán)
- Sistema de reseñas y calificaciones
- Pagos seguros a través de la plataforma
- Soporte 24/7
- Precios transparentes`,
    tone: "Mantén un tono amigable, profesional y empático. Recuerda que muchos usuarios son nuevos en España y pueden necesitar orientación adicional."
  },
  en: {
    context: "You are a virtual assistant for Care & Service, a platform that connects immigrants and expats in Spain with verified local professionals.",
    categories: `SERVICE CATEGORIES:
1. 🏥 Care & Health - Medical care, home care, physiotherapy
2. 🔧 Technical Services - Repairs, installations, maintenance
3. 📋 Administrative & Legal - Taxes, legal advice, documentation
4. 👶 Childcare - Babysitters, nurseries, child care
5. 🚗 Transport - Taxis, moving, delivery services
6. ⚽ Sports & Recreation - Trainers, sports classes
7. 🎉 Social Activities - Companionship, events, social support
8. 🏠 Domestic Services - Cleaning, gardening, household tasks`,
    features: `KEY FEATURES:
- Verified professionals with valid documentation
- Multi-language support (Spanish, English, Dutch, German)
- Review and rating system
- Secure payments through the platform
- 24/7 support
- Transparent pricing`,
    tone: "Maintain a friendly, professional and empathetic tone. Remember that many users are new to Spain and may need additional guidance."
  },
  de: {
    context: "Sie sind ein virtueller Assistent für Care & Service, eine Plattform, die Einwanderer und Expats in Spanien mit verifizierten lokalen Profis verbindet.",
    categories: `SERVICE-KATEGORIEN:
1. 🏥 Pflege & Gesundheit - Medizinische Versorgung, häusliche Pflege, Physiotherapie
2. 🔧 Technische Services - Reparaturen, Installationen, Wartung
3. 📋 Verwaltung & Recht - Steuern, Rechtsberatung, Dokumentation
4. 👶 Kinderbetreuung - Babysitter, Kindergärten, Kinderbetreuung
5. 🚗 Transport - Taxis, Umzüge, Lieferdienste
6. ⚽ Sport & Freizeit - Trainer, Sportkurse
7. 🎉 Soziale Aktivitäten - Begleitung, Veranstaltungen, soziale Unterstützung
8. 🏠 Haushaltsservice - Reinigung, Gartenpflege, Haushaltstätigkeiten`,
    features: `HAUPTMERKMALE:
- Verifizierte Profis mit gültiger Dokumentation
- Mehrsprachiger Support (Spanisch, Englisch, Niederländisch, Deutsch)
- Bewertungs- und Bewertungssystem
- Sichere Zahlungen über die Plattform
- 24/7 Support
- Transparente Preise`,
    tone: "Behalten Sie einen freundlichen, professionellen und empathischen Ton bei. Denken Sie daran, dass viele Benutzer neu in Spanien sind und möglicherweise zusätzliche Anleitung benötigen."
  }
};

function getContextForLocale(locale: string = 'nl') {
  const validLocale = locale as keyof typeof AI_CONTEXTS;
  const context = AI_CONTEXTS[validLocale] || AI_CONTEXTS.nl;
  
  return `${context.context}

${context.categories}

${context.features}

HOW TO HELP:
1. Identify the user's need
2. Recommend the appropriate service category
3. Explain the booking process
4. Provide pricing information (general ranges)
5. If you detect booking intent, guide towards registration

${context.tone}

SECURITY & PRIVACY:
- Never ask for personal information like passwords, credit card numbers, or social security numbers
- Guide users to the secure platform for payments and sensitive transactions
- Respect user privacy and data protection regulations (GDPR)`;
}

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || 
               headersList.get("x-real-ip") || 
               "unknown";
    
    try {
      await limiter.check(20, ip); // 20 requests per minute per IP
    } catch {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate and sanitize input
    const body = await req.json();
    const validatedData = requestSchema.parse(body);
    
    // Get context based on user's language preference
    const contextContent = getContextForLocale(validatedData.locale);
    
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "Chat service is not configured properly." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream text using Vercel AI SDK
    const result = streamText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
      system: contextContent,
      messages: validatedData.messages,
      temperature: 0.7,
      maxRetries: 3,
      onFinish: ({ usage }) => {
        // Log usage for monitoring
        console.log("Chat usage:", {
          tokens: usage.totalTokens,
          locale: validatedData.locale,
          ip: ip,
        });
      },
    });

    // Return the streaming response
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid request format", details: error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Generic error response
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}