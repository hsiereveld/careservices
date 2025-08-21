# Care & Service Platform - Technical Architecture

## Project Structure

```
/src/app
├── (landing)/              # Public landing page with AI chat
│   ├── page.tsx            # Main landing page
│   ├── about/              # About Care & Service
│   ├── services/           # Service categories showcase
│   └── contact/            # Contact information
│
├── (auth)/                 # Authentication flows
│   ├── login/
│   ├── register/
│   ├── verify/
│   └── forgot-password/
│
├── (dashboard)/            # Protected dashboard area
│   ├── client/             # Client dashboard
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── bookings/       # Booking management
│   │   ├── services/       # Service discovery
│   │   ├── messages/       # Communication center
│   │   ├── wallet/         # Payment & wallet
│   │   └── profile/        # Profile management
│   │
│   ├── pro/                # Pro dashboard
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── services/       # Service management
│   │   ├── calendar/       # Availability & bookings
│   │   ├── earnings/       # Financial tracking
│   │   ├── clients/        # Client management
│   │   └── profile/        # Professional profile
│   │
│   ├── franchise/          # Franchise dashboard
│   │   ├── page.tsx        # Territory overview
│   │   ├── territory/      # Territory management
│   │   ├── pros/           # Local Pro management
│   │   ├── analytics/      # Regional analytics
│   │   ├── marketing/      # Local marketing
│   │   └── financials/     # Franchise earnings
│   │
│   └── admin/              # Admin dashboard
│       ├── page.tsx        # Platform overview
│       ├── users/          # User management
│       ├── franchises/     # Franchise management
│       ├── services/       # Service categories
│       ├── analytics/      # Platform analytics
│       ├── financials/     # Commission management
│       └── settings/       # System configuration
│
├── api/                    # API routes
│   ├── auth/               # Authentication endpoints
│   ├── chat/               # AI chat endpoints
│   ├── users/              # User management
│   ├── services/           # Service CRUD
│   ├── bookings/           # Booking system
│   ├── payments/           # Payment processing
│   ├── calendar/           # Calendar integrations
│   ├── franchises/         # Franchise management
│   ├── analytics/          # Analytics data
│   └── webhooks/           # External webhooks
│
└── globals.css             # Global styles

/src/components
├── ui/                     # shadcn/ui components
├── layout/                 # Layout components
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── dashboard-nav.tsx
│   └── mobile-nav.tsx
│
├── auth/                   # Authentication components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── user-profile.tsx
│
├── chat/                   # AI chat components
│   ├── chat-widget.tsx
│   ├── chat-interface.tsx
│   ├── message-bubble.tsx
│   └── quick-replies.tsx
│
├── booking/                # Booking system components
│   ├── service-card.tsx
│   ├── booking-form.tsx
│   ├── calendar-picker.tsx
│   ├── pro-selector.tsx
│   └── booking-summary.tsx
│
├── dashboard/              # Dashboard components
│   ├── analytics-card.tsx
│   ├── earnings-chart.tsx
│   ├── booking-list.tsx
│   ├── service-manager.tsx
│   └── territory-map.tsx
│
├── payments/               # Payment components
│   ├── payment-form.tsx
│   ├── wallet-balance.tsx
│   ├── transaction-list.tsx
│   └── payout-request.tsx
│
└── franchise/              # Franchise components
    ├── territory-selector.tsx
    ├── pro-recruitment.tsx
    ├── regional-analytics.tsx
    └── commission-tracker.tsx

/src/lib
├── auth/                   # Better-Auth configuration
│   ├── auth.ts
│   ├── auth-client.ts
│   └── middleware.ts
│
├── db/                     # Database configuration
│   ├── index.ts            # Neon connection
│   ├── schema.ts           # Drizzle schema
│   ├── queries.ts          # Database queries
│   └── migrations/         # Migration files
│
├── ai/                     # AI & Chat logic
│   ├── chat-engine.ts
│   ├── knowledge-base.ts
│   ├── matching-algorithm.ts
│   └── lead-capture.ts
│
├── payments/               # Payment processing
│   ├── stripe.ts
│   ├── mollie.ts
│   ├── commission.ts
│   └── wallet.ts
│
├── calendar/               # Calendar integrations
│   ├── google-calendar.ts
│   ├── outlook-calendar.ts
│   ├── apple-calendar.ts
│   └── sync-manager.ts
│
├── franchise/              # Franchise logic
│   ├── territory.ts
│   ├── commission-split.ts
│   ├── regional-config.ts
│   └── multi-tenant.ts
│
├── analytics/              # Analytics & CRM
│   ├── tracking.ts
│   ├── metrics.ts
│   ├── reporting.ts
│   └── crm.ts
│
├── localization/           # i18n support
│   ├── config.ts
│   ├── translations/
│   │   ├── es.json
│   │   ├── en.json
│   │   ├── nl.json
│   │   └── de.json
│   └── utils.ts
│
└── utils/                  # Utility functions
    ├── validation.ts
    ├── formatting.ts
    ├── constants.ts
    └── helpers.ts
```

## Agent Responsibilities by Folder

### Backend Architect
- `/src/lib/db/` - Database schema and queries
- `/src/app/api/` - API route implementation
- `/src/lib/franchise/` - Multi-tenant architecture

### Payment & Finance
- `/src/lib/payments/` - Payment processing logic
- `/src/components/payments/` - Payment UI components
- `/src/app/api/payments/` - Payment API endpoints

### AI Chat Agent
- `/src/lib/ai/` - AI chat engine and knowledge base
- `/src/components/chat/` - Chat UI components
- `/src/app/api/chat/` - Chat API endpoints

### Calendar Integration
- `/src/lib/calendar/` - Calendar API integrations
- `/src/app/api/calendar/` - Calendar endpoints
- Calendar-related components in booking system

### UI Developer
- `/src/components/ui/` - Base UI components
- `/src/components/layout/` - Layout components
- All dashboard and form components

### Security & Compliance
- `/src/lib/auth/` - Authentication security
- Security middleware across API routes
- GDPR compliance implementations

### Analytics & CRM
- `/src/lib/analytics/` - Analytics logic
- `/src/components/dashboard/` - Analytics components
- `/src/app/api/analytics/` - Analytics endpoints

### Localization & Multi-tenant
- `/src/lib/localization/` - i18n implementation
- `/src/lib/franchise/` - Multi-tenant logic
- Regional customization components

### DevOps & Deployment
- Root configuration files
- CI/CD pipeline setup
- Monitoring and deployment scripts

## Development Workflow

1. **Phase-based Development**: Each phase focuses on specific agents
2. **Cross-Agent Collaboration**: Regular sync meetings between agents
3. **Code Reviews**: Inter-agent code review process
4. **Integration Testing**: Continuous integration between agent work
5. **Documentation**: Shared documentation standards

## Quality Standards

- **Type Safety**: Full TypeScript coverage
- **Testing**: Unit tests for business logic
- **Performance**: Core Web Vitals optimization
- **Security**: Regular security audits
- **Accessibility**: WCAG 2.1 compliance
- **Mobile**: Mobile-first responsive design
