# CareService Platform - Project Prompt voor Bolt

## Project Overview
Bouw een modern intermediair platform genaamd "CareService" dat immigranten en expats in Spanje verbindt met lokale ZZP'ers en professionals die diensten aanbieden. Het platform fungeert als franchise-model met een commissiestructuur van 5% + 15% bovenop de diensten.

## Tech Stack Requirements
- **Starter Template**: https://github.com/leonvanzyl/agentic-coding-starter-kit als basis
- **Database**: Neon (PostgreSQL)
- **Authentication**: Better-Auth
- **Deployment**: Vercel
- **Frontend**: Next.js 14+ met App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Integration**: 
  - Vercel AI SDK voor chat functionaliteit
  - OpenAI/Anthropic API voor conversational AI
  - Langchain voor RAG (Retrieval Augmented Generation)
- **Payment**: Stripe of Mollie integratie
- **Real-time**: Socket.io of Pusher voor chat
- **Email**: Resend of SendGrid
- **File Storage**: Vercel Blob of Uploadthing
- **Calendar Integration**: 
  - Google Calendar API (primair)
  - Microsoft Graph API voor Outlook
  - CalDAV voor Apple Calendar
  - nylas API als unified calendar solution (optioneel)

## Landing Page met AI Assistant

### AI Chat Functionaliteit
Implementeer een intelligente chat assistant op de landing page:

**Capabilities:**
- **Service Informatie**: Uitleg over alle beschikbare diensten en categorieën
- **Matching Suggesties**: Recommendations voor geschikte Pro's op basis van behoeften
- **Prijs Indicaties**: Schatting van kosten voor verschillende diensten
- **FAQ Beantwoording**: Directe antwoorden op veelgestelde vragen
- **Lead Generation**: Verzamelen van contactgegevens voor follow-up
- **Taal Detectie**: Automatisch switchen tussen ES/EN/NL/DE
- **Booking Intent**: Doorverwijzing naar registratie/booking wanneer klant ready is

**Technische Implementatie:**
- Vercel AI SDK met streaming responses
- Knowledge base met:
  - Service catalogus en beschrijvingen
  - Pricing structuur en voorbeelden
  - Platform voordelen en USPs
  - Veelgestelde vragen
- Context-aware conversaties met chat history
- Fallback naar human support optie
- Analytics tracking van chat interacties
- Lead capture integratie met CRM

**UI/UX:**
- Floating chat widget rechtsonder
- Proactieve welkomstboodschap na 5 seconden
- Quick reply buttons voor veelvoorkomende vragen
- Typing indicators en smooth animations
- Mobile-optimized chat interface
- Mogelijkheid tot full-screen chat

## Core Functionaliteiten

### 1. Gebruikersrollen & Authenticatie
Implementeer Better-Auth met vier hoofdrollen:
- **Klant**: Immigranten/expats die diensten afnemen
- **Pro**: ZZP'ers/professionals die diensten aanbieden
- **Franchisenemer**: Regionale franchise eigenaren (vanaf Fase 4)
- **Admin**: Platform beheerders (hoofdkantoor)

### 2. Klant Module
**Profiel & CRM Integratie:**
- Volledig klantprofiel met persoonlijke gegevens, voorkeuren, taalvoorkeur
- Adresgegevens en contactinformatie
- Notities en tags voor CRM doeleinden

**Klant Dashboard:**
- **Boeking Module**: 
  - Multi-service booking systeem
  - Filter op categorie, beschikbaarheid, prijs, locatie, taal
  - Real-time beschikbaarheid van Pro's
  - Mogelijkheid om meerdere diensten tegelijk te boeken
- **Betalingssysteem**: 
  - Online betaling na bevestiging
  - Wallet systeem voor terugkerende betalingen
  - Split payment (service + platform fee)
- **Historie & Documenten**:
  - Diensten historie met ratings en reviews
  - Abonnementen beheer (recurring services)
  - Facturen downloaden (PDF)
  - Communicatie archief per boeking

**Communicatie:**
- In-app chat met Pro's per boeking
- Notificaties (email/push) voor status updates
- Dossier functie voor documentatie uitwisseling

### 3. Pro Module
**Pro Dashboard:**
- **Service Management**:
  - CRUD voor eigen diensten
  - Categorieën: Zorg, Techniek, Administratie, Oppas, Vervoer, Sport, Sociale activiteiten
  - Flexibele prijsstructuur per eenheid (uur/dag/stuk/service/km)
  - Service radius instellen
  - Talen die aangeboden worden
- **Beschikbaarheid & Planning**:
  - **Kalender Integraties**:
    - Google Calendar API (two-way sync)
    - Microsoft Outlook Calendar (via Microsoft Graph API)
    - Apple Calendar (via CalDAV)
    - Calendly webhook integratie
    - iCal feed export/import
  - Automatische synchronisatie van beschikbaarheid
  - Conflict detectie tussen kalenders
  - Blokkeren van tijdslots
  - Vakantie/afwezigheid beheer
  - Buffer tijd instellen tussen afspraken
- **Aanvragen & Communicatie**:
  - Incoming requests dashboard
  - Accept/decline met reden
  - Chat per klant/boeking
  - Response time tracking
- **Financieel Overzicht**:
  - Earnings dashboard
  - Platform fee calculator (5% + 15%)
  - Uitbetalingsverzoeken
  - Factuur historie

### 4. Franchisenemer Module (Fase 4)
**Regionaal Beheer Dashboard:**
- **Territory Management**:
  - Beheer van toegewezen regio's/steden
  - Lokale Pro werving en onboarding
  - Regionale prijsaanpassingen binnen bandbreedte
- **Lokale Marketing**:
  - Regionale campagnes beheer
  - Lokale partnerships
  - Event management
- **Financieel Overzicht**:
  - Regionale omzet rapportages
  - Franchise fee afdracht (bijvoorbeeld 30% van de 20% commissie)
  - Lokale Pro uitbetalingen
  - ROI tracking per regio
- **Lokale CRM**:
  - Regionaal klantenbeheer
  - Lokale klantenservice
  - Regio-specifieke communicatie

### 5. Admin Module (Hoofdkantoor)
**Stamgegevens Beheer (CRUD):**
- Service categorieën en subcategorieën
- Prijsstructuren en platform fees
- Locaties/regio's
- Talen
- Belastingtarieven

**CRM Systeem:**
- Unified view van alle gebruikers
- Segmentatie (Klanten vs Pro's)
- Gebruikersbeheer met status (actief/inactief/suspended)
- Verificatie proces voor Pro's
- Bevoegdheden en rol management

**Financieel & Rapportages:**
- Facturatie overzicht
- Platform revenue dashboard
- **Franchise Management**:
  - Franchise territories toewijzing
  - Franchise fee structuur beheer
  - Performance per franchise regio
  - Franchise contracten beheer
- Commissie berekeningen en splits:
  - Pro aandeel (80% van service prijs)
  - Platform aandeel (20% = 5% service + 15% franchise)
  - Franchise split (bij franchise: 14% franchisenemer, 6% hoofdkantoor)
- Uitbetalingen aan Pro's en franchisenemers
- Export functies (CSV/Excel)
- Analytics dashboard met KPIs
- Multi-level rapportages (platform, franchise, regio)

## Database Schema (Neon PostgreSQL)

```sql
-- Core tables structuur
- users (id, email, role, verified, created_at, etc.)
- profiles (user_id, name, phone, address, language, preferences)
- franchises (id, name, owner_id, region, status, contract_start, contract_end)
- franchise_territories (franchise_id, postal_code, city, province)
- services (id, pro_id, category, name, description, base_price, price_unit, franchise_id)
- bookings (id, client_id, pro_id, service_id, status, total_amount, platform_fee, franchise_id)
- commission_splits (booking_id, pro_amount, platform_amount, franchise_amount, hq_amount)
- availability (pro_id, day_of_week, start_time, end_time)
- calendar_integrations (user_id, provider, access_token, refresh_token, calendar_id)
- calendar_events (id, user_id, external_event_id, provider, start_time, end_time, synced_at)
- transactions (booking_id, amount, type, status, franchise_id)
- messages (booking_id, sender_id, content, timestamp)
- reviews (booking_id, rating, comment)
- subscriptions (client_id, service_id, frequency, next_date)
```

## Specifieke Features

### Matching Algoritme
- Geografische matching op basis van postcode/regio
- Taal matching (Pro spreekt taal van Klant)
- Beschikbaarheid matching
- Rating/review based ranking
- Prijs optimalisatie

### Notificatie Systeem
- Email notificaties voor belangrijke events
- In-app notificaties
- SMS voor urgente zaken (optioneel)
- Reminder systeem voor aankomende boekingen

### Veiligheid & Compliance
- GDPR compliant data handling
- Two-factor authenticatie voor Pro's en Admin
- Secure payment processing (PCI DSS)
- Background checks voor Pro's (integratie mogelijk)
- Contract generatie voor diensten

### Mobile Responsiveness
- Volledig responsive design
- PWA capabilities
- Native app ready API structure

## Commissie Model
Implementeer een flexibel commissie systeem met franchise support:

**Zonder Franchise (Fase 1-3):**
- Pro ontvangt: 80% van service prijs
- Platform ontvangt: 20% (5% service fee + 15% franchise fee)

**Met Franchise (vanaf Fase 4):**
- Pro ontvangt: 80% van service prijs
- Franchisenemer ontvangt: 14% van service prijs
- Hoofdkantoor ontvangt: 6% van service prijs
- Totaal platform: 20% blijft gelijk

**Features:**
- Automatische berekening en splitsing per regio
- Franchise territory detectie op basis van postcode
- Maandelijkse uitbetaling aan Pro's
- Wekelijkse/maandelijkse afrekening met franchisenemers
- Real-time earnings tracking per stakeholder
- Transparante commissie breakdown voor alle partijen

## Lokalisatie
- Multi-language support (ES, EN, NL, DE minimum)
- Locale-specific formatting (datum, valuta)
- Vertaalbare content via CMS
- Culturele aanpassingen per regio

## Additionele Functionaliteiten
- **Verzekering Integratie**: Optionele dienstverzekering
- **Loyalty Program**: Punten systeem voor frequente gebruikers
- **Referral System**: Kortingen voor doorverwijzingen
- **Emergency Services**: Spoed boekingen met premium pricing
- **Group Bookings**: Meerdere Pro's voor één event
- **Service Packages**: Bundel deals voor meerdere diensten
- **Seasonal Promotions**: Kortingsacties beheer
- **Quality Control**: Mystery shopping functionaliteit
- **Training Module**: Onboarding voor nieuwe Pro's
- **API voor Partners**: Third-party integraties
- **Smart Scheduling**: 
  - AI-powered optimale tijdslot suggesties
  - Automatische herplanning bij annuleringen
  - Reistijd berekening tussen afspraken (Google Maps API)
  - Timezone handling voor internationale klanten

## Development Prioriteiten
1. **Fase 0**: Setup met agentic-coding-starter-kit
   - Fork en customize starter template
   - Neon database setup
   - Better-Auth configuratie
   - Landing page met AI chat widget
2. **Fase 1**: Auth, gebruikersrollen (Klant, Pro, Admin), basis CRUD
3. **Fase 2**: Booking systeem, availability, matching, kalender integraties
4. **Fase 3**: Payment integratie, basis commissie systeem (20% flat)
5. **Fase 4**: **FRANCHISE UITBREIDING**
   - Franchisenemer rol toevoegen
   - Territory management systeem
   - Commission split logic (14% franchise, 6% HQ)
   - Franchise dashboard en rapportages
   - Multi-tenant architectuur optimalisatie
6. **Fase 5**: Chat, notificaties, reviews
7. **Fase 6**: Admin dashboard uitbreiding, advanced analytics
8. **Fase 7**: Optimalisatie, extra features, mobile app
9. **Fase 8**: Internationale expansie, multi-country support

## Testing Requirements
- Unit tests voor business logic
- Integration tests voor payment flow
- E2E tests voor critical user journeys
- Load testing voor matching algoritme
- Security audit voor data handling

## Implementatie Instructies

### Stap 1: Project Setup
1. Clone de agentic-coding-starter-kit: `git clone https://github.com/leonvanzyl/agentic-coding-starter-kit`
2. Hernoem het project naar `careservice-platform`
3. Update package.json met project details
4. Configureer Neon database connectie in `.env`
5. Setup Better-Auth ter vervanging van bestaande auth

### Stap 2: Landing Page met AI
1. Creëer een moderne, professionele landing page
2. Implementeer AI chat widget met Vercel AI SDK
3. Train de AI assistant met service informatie
4. Setup lead capture formulieren
5. Implementeer multi-language support

### Stap 3: Core Platform
Begin met het bouwen van de kernfunctionaliteiten volgens de development prioriteiten. Zorg voor een schaalbare folder structuur:

```
/app
  /(landing)        # Public landing page met AI chat
  /(auth)          # Auth flows
  /(dashboard)
    /client        # Klant dashboard
    /pro           # Pro dashboard  
    /admin         # Admin dashboard
    /franchise     # Franchise dashboard (Fase 4)
/components
  /ui              # shadcn/ui components
  /chat            # AI chat components
  /booking         # Booking components
/lib
  /db              # Neon/Drizzle setup
  /auth            # Better-Auth config
  /ai              # AI/Chat logic
  /payments        # Stripe/Mollie
/api              # API routes
```

Start met het opzetten van de basis architectuur met Neon database connectie, Better-Auth implementatie en Vercel deployment configuratie. Focus eerst op een werkende landing page met AI chat voordat je verder gaat met de complexere platform functionaliteiten.