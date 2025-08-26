# Product Decisions Log

> Last Updated: 2025-08-26
> Version: 1.0.0
> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

## 2025-08-26: Initial Product Planning

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, Tech Lead, Team

### Decision

CareService will be built as a franchise-based platform connecting immigrants/expats with culturally-matched professionals, targeting MVP completion by September 2025.

### Context

The Spanish market has a large immigrant and expat population seeking professional services, but existing platforms lack cultural and language matching capabilities. Traditional service platforms don't address the unique challenges of cross-cultural service provision.

### Rationale

- Franchise model provides local market expertise while maintaining platform consistency
- Cultural matching addresses a genuine pain point not solved by existing competitors
- Spain's immigration trends create a growing target market
- Technology stack (Next.js, PostgreSQL, AI integration) supports rapid development and scaling

---

## 2025-08-26: Technology Stack Selection

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Tech Lead, Development Team

### Decision

Selected Next.js 15.4.6 with React 19, PostgreSQL with Drizzle ORM, Better-Auth for authentication, and Vercel for deployment.

### Context

Need a modern, scalable tech stack that supports rapid development, multi-role authentication, real-time features, and easy deployment for MVP timeline.

### Rationale

- Next.js 15 provides excellent developer experience and production performance
- PostgreSQL handles complex relational data for franchise/booking system
- Drizzle ORM offers type safety and excellent developer experience
- Better-Auth supports complex multi-role authentication out of the box
- Vercel deployment enables rapid iteration and scaling

---

## 2025-08-26: Commission Structure

**ID:** DEC-003
**Status:** Accepted
**Category:** Business Model
**Stakeholders:** Product Owner, Finance, Franchise Development

### Decision

Implement 20% total commission structure: 5% platform fee + 15% franchise fee on all transactions.

### Context

Need sustainable revenue model that incentivizes both platform development and franchise partner success while remaining competitive for professionals.

### Rationale

- 20% total is competitive with similar service platforms
- 15% franchise fee provides strong incentive for local market development
- 5% platform fee covers technology development and maintenance costs
- Clear split makes franchise partner value proposition transparent

---

## 2025-08-26: Multi-Language Strategy

**ID:** DEC-004
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, UX Lead, Marketing

### Decision

Launch in Spanish first, then expand to English, Dutch, and German based on user demand and market research.

### Context

Spain has diverse immigrant communities, but development resources are limited. Need to prioritize languages that provide maximum user value and business impact.

### Rationale

- Spanish is required for all users interacting with local Spanish market
- English serves largest international expat community
- Dutch and German represent significant, underserved immigrant populations in Spain
- Phased approach allows validation before major i18n investment

---

## 2025-08-26: AI Integration Approach

**ID:** DEC-005
**Status:** Accepted
**Category:** Technical/Product
**Stakeholders:** Product Owner, Tech Lead, AI Specialist

### Decision

Integrate OpenAI for cultural matching algorithms, customer support chat, and service recommendations rather than building custom ML models.

### Context

AI-powered cultural matching is a core differentiator, but building custom ML models would significantly extend development timeline and increase complexity.

### Rationale

- OpenAI API provides production-ready AI capabilities immediately
- Custom cultural matching can be built on top of OpenAI's base capabilities
- Reduces technical complexity and development time
- Can migrate to custom models later if needed for competitive advantage
- Lower infrastructure costs during MVP and early growth phases