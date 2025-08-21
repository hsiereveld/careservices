# CareService Platform Documentation

## 📁 Documentation Structure

### Business Documentation
- **[Project Prompt](business/# CareService Platform - Project Prompt .md)** - Complete project requirements and specifications
- **[Development Phases](business/development-phases.md)** - 8-phase development plan with agent assignments
- **[Portfolio Tracker](business/portfolio tracker.md)** - Original portfolio tracking concept
- **[Starter Prompt](business/starter-prompt.md)** - Original agentic coding prompt

### Technical Documentation
- **[CareService Architecture](technical/careservice-architecture.md)** - Complete project structure and agent responsibilities
- **[AI Integration](technical/ai/streaming.md)** - AI SDK implementation guidelines
- **[React Markdown](technical/react-markdown.md)** - Markdown rendering implementation

### Setup & Coordination
- **[Agent Coordination](setup/agent-coordination.md)** - Agent collaboration protocols and workflows

## 🚀 Quick Start for Agents

### 1. **Foundation Agents** (Start Here)
```bash
# Activate these agents first
@backend-architect - Setup database and API structure
@devops-deployment - Configure deployment pipeline
@ui-developer - Implement basic UI framework
```

### 2. **Feature Agents** (Phase-based)
```bash
# Activate based on development phase
@ai-chat @localization-multitenant    # Phase 1: Landing & AI
@calendar-integration                  # Phase 3: Booking System
@payment-finance @security-compliance # Phase 4: Payments
@analytics-crm                        # Phase 7: Advanced Features
```

## 📊 Development Progress Tracking

### Current Phase: **Phase 0 - Foundation Setup**
- [ ] Database schema design
- [ ] Authentication system
- [ ] Basic UI framework
- [ ] Deployment pipeline

### Next Phases:
1. **Phase 1:** Landing Page & AI Chat
2. **Phase 2:** User Management
3. **Phase 3:** Booking System
4. **Phase 4:** Payment Integration
5. **Phase 5:** Franchise System (Critical)
6. **Phase 6:** Communication & Matching
7. **Phase 7:** Advanced Features
8. **Phase 8:** Production Optimization

## 🎯 Key Platform Features

### Multi-Role System
- **Clients**: Immigrants/expats seeking services
- **Pros**: Local professionals offering services
- **Franchise Owners**: Regional territory managers
- **Admins**: Platform administrators

### Service Categories
- 🏥 Healthcare & Care
- 🔧 Technical Services
- 📋 Administrative Support
- 👶 Childcare & Babysitting
- 🚗 Transportation
- ⚽ Sports & Recreation
- 🎉 Social Activities

### Commission Model
- **Without Franchise**: 80% Pro, 20% Platform
- **With Franchise**: 80% Pro, 14% Franchise, 6% HQ
- **Territory-based**: Automatic routing by postcode

## 🛠️ Technical Stack

### Core Technologies
- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth with multi-role support
- **Payments**: Stripe (primary), Mollie (backup)
- **AI**: Vercel AI SDK with OpenAI/Anthropic
- **Styling**: Tailwind CSS with shadcn/ui
- **Deployment**: Vercel with edge functions

### Integrations
- **Calendars**: Google, Outlook, Apple Calendar
- **Communication**: Real-time chat, email notifications
- **Analytics**: Custom dashboards, business intelligence
- **Localization**: Multi-language support (ES/EN/NL/DE)

## 📈 Success Metrics

### Technical KPIs
- Code coverage > 80%
- Core Web Vitals < 2.5s
- API response time < 200ms
- Uptime > 99.9%

### Business KPIs
- User registration conversion
- Booking completion rate
- Commission accuracy > 99%
- Customer satisfaction > 4.5/5

### Agent Collaboration KPIs
- Cross-agent integration success rate
- Code review turnaround time
- Documentation completeness
- Knowledge sharing frequency

## 🔗 Quick Links

- [Agent Definitions](../.claude/agents/) - All agent role definitions
- [Commands](../.claude/commands/) - CareService-specific commands
- [Environment Setup](../env.example) - Configuration template
- [Project Structure](technical/careservice-architecture.md) - Complete architecture

## 🆘 Support & Escalation

### For Agents:
1. Check agent-specific documentation
2. Review cross-agent dependencies
3. Use daily standup for blockers
4. Escalate to Backend Architect for architecture issues

### For Stakeholders:
1. Review business documentation
2. Track progress via phase documentation
3. Weekly demos and reviews
4. Monthly architecture reviews

---

**Ready to build the future of service marketplaces with agentic coding! 🚀**
