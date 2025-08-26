# Technical Stack

> Last Updated: 2025-08-26
> Version: 1.0.0

## Application Framework

- **Framework:** Next.js
- **Version:** 15.4.6
- **Runtime:** React 19.1.0
- **Language:** TypeScript 5.x

## Database

- **Primary Database:** PostgreSQL
- **ORM:** Drizzle ORM 0.44.4
- **Migrations:** Drizzle Kit
- **Schema:** 18 tables covering users, services, bookings, franchises, and business logic

## Authentication

- **Framework:** Better-Auth 1.3.4
- **Features:** Multi-role authentication (client/professional/franchise/admin)
- **Security:** Session management, role-based access control

## CSS Framework

- **Framework:** Tailwind CSS 4
- **Component Library:** shadcn/ui
- **Design System:** Custom components with consistent styling

## AI Integration

- **Provider:** OpenAI SDK
- **Features:** Chat support, cultural matching algorithms, service recommendations

## Payment Processing

- **Primary:** Stripe (credit/debit cards)
- **EU Payments:** Mollie (SEPA, iDEAL, Bancontact)
- **Commission Structure:** 5% platform + 15% franchise

## Calendar Integration

- **Planned:** Google Calendar API, Microsoft Graph API (Outlook), Apple CalDAV
- **Purpose:** Professional availability and booking synchronization

## Deployment & Hosting

- **Platform:** Vercel
- **Environment:** Production, Staging, Development
- **Domain Management:** Custom domain with SSL

## Development Tools

- **Package Manager:** npm
- **Code Quality:** ESLint, Prettier, TypeScript strict mode
- **Version Control:** Git with GitHub
- **IDE:** VS Code with recommended extensions

## Internationalization

- **Planned Languages:** Spanish (primary), English, Dutch, German
- **Library:** Next.js i18n or react-i18next
- **Content Management:** JSON-based translation files

## Monitoring & Analytics

- **Planned:** Vercel Analytics, Sentry for error tracking
- **Database Monitoring:** Connection pooling and query optimization
- **Performance:** Web Vitals tracking