# CareService Agent Coordination Guide

## Agent Activation Protocol

### 1. **Foundation Phase Agents** (Start Immediately)
```bash
# Activate these agents first
@backend-architect - Database setup en API architectuur
@devops-deployment - Deployment pipeline en monitoring
@ui-developer - Basic UI framework en rebranding
```

### 2. **Feature Development Agents** (Phase-based Activation)
```bash
# Phase 1: Landing & AI  
@ai-chat - AI assistant implementatie ✅ ACTIVE
@localization-multitenant - Multi-language support ⏳ NEXT

# Phase 3: Booking System  
@calendar-integration - Calendar API integraties

# Phase 4: Payments
@payment-finance - Payment processing en commissies
@security-compliance - Security audit en compliance

# Phase 5: Franchise
# (All agents collaborate for franchise system)

# Phase 6+: Advanced Features
@analytics-crm - Advanced analytics en reporting
```

## Agent Collaboration Matrix

| Agent | Collaborates With | Shared Deliverables |
|-------|------------------|-------------------|
| **Backend Architect** | All agents | API contracts, Database schema |
| **UI Developer** | AI Chat, Analytics | Component interfaces |
| **Payment & Finance** | Security, Backend | Payment flows, Commission logic |
| **AI Chat** | UI Developer, Localization | Chat interfaces, Multi-language |
| **Calendar Integration** | Backend, UI | Calendar APIs, Booking flows |
| **Security & Compliance** | All agents | Security reviews, Compliance |
| **Analytics & CRM** | Backend, UI | Dashboard components, Metrics |
| **Localization** | UI Developer, AI Chat | i18n implementation |
| **DevOps** | All agents | Deployment, Monitoring |

## Communication Protocols

### Daily Standups (Per Phase)
**Time:** 09:00 CET
**Duration:** 15 minutes
**Attendees:** Active phase agents + Project lead

**Format:**
- What did you complete yesterday?
- What will you work on today?
- Any blockers or dependencies?

### Weekly Agent Sync
**Time:** Friday 14:00 CET
**Duration:** 60 minutes
**Attendees:** All agents

**Agenda:**
1. Phase progress review
2. Cross-agent dependency discussion
3. Code review assignments
4. Next week coordination
5. Issue escalation

### Monthly Architecture Review
**Time:** Last Friday of month
**Duration:** 90 minutes
**Attendees:** All agents + Stakeholders

**Agenda:**
1. Architecture decisions review
2. Performance metrics analysis
3. Security assessment
4. Scalability planning
5. Technical debt review

## Code Collaboration Standards

### Branch Strategy
```bash
main                    # Production ready code
├── develop            # Integration branch
├── feature/agent-*    # Agent-specific features
├── hotfix/*          # Critical fixes
└── release/*         # Release preparation
```

### Agent Branch Naming
```bash
feature/backend-architect/user-roles
feature/payment-finance/stripe-integration
feature/ai-chat/knowledge-base
feature/ui-developer/dashboard-layout
```

### Code Review Process
1. **Self Review:** Agent reviews own code
2. **Peer Review:** Another agent reviews (assigned rotation)
3. **Architecture Review:** Backend Architect reviews structural changes
4. **Security Review:** Security Agent reviews sensitive code
5. **Integration Test:** DevOps Agent validates deployment

### Pull Request Template
```markdown
## Agent: [Agent Name]
## Feature: [Feature Description]
## Phase: [Development Phase]

### Changes Made:
- [ ] Feature implementation
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Security considerations addressed

### Dependencies:
- [ ] Requires work from: [Other Agent]
- [ ] Blocks work by: [Other Agent]
- [ ] Database changes: Yes/No

### Testing:
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

### Deployment:
- [ ] Environment variables updated
- [ ] Migration scripts provided
- [ ] Rollback plan documented
```

## Dependency Management

### Critical Dependencies (Must be Sequential)
1. **Database Schema** → All data-dependent features
2. **Authentication** → All protected features  
3. **Payment System** → Commission calculations
4. **Territory System** → Franchise features

### Parallel Development Opportunities
- UI components while APIs are being built
- Frontend localization while backend features develop
- Analytics components while data is being generated
- Documentation while features are being implemented

## Quality Gates

### Phase Completion Criteria
- [ ] All agent tasks completed
- [ ] Cross-agent integration tested
- [ ] Security review passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Stakeholder approval received

### Continuous Quality Checks
- **Daily:** Automated tests run
- **Weekly:** Code coverage report
- **Bi-weekly:** Security scan
- **Monthly:** Performance audit
- **Per Phase:** Full system test

## Escalation Procedures

### Technical Issues
1. **Agent Level:** Try to resolve within agent expertise
2. **Cross-Agent:** Discuss in daily standup
3. **Architecture:** Escalate to Backend Architect
4. **Project Level:** Escalate to Project Lead

### Timeline Issues
1. **Minor Delays:** Communicate in daily standup
2. **Major Delays:** Escalate immediately to Project Lead
3. **Critical Path:** Emergency meeting with all affected agents

### Resource Conflicts
1. **Agent Bandwidth:** Redistribute tasks within agent capabilities
2. **External Dependencies:** Escalate to Project Lead
3. **Technical Limitations:** Architecture review meeting

## Multi-Language Development Protocol ⚠️ CRITICAL

### Current Language Status:
- **Development Language:** Nederlands (voor Nederlandse gebruiker)
- **Target Languages:** ES/EN/NL/DE (production)
- **Current Implementation:** Content tijdelijk in Nederlands voor development

### Language Transition Protocol:
1. **Development Phase:** Nederlandse content voor gebruiker feedback
2. **Pre-Production:** Command 5 implementeert i18n framework
3. **Production:** Multi-language switching via @localization-multitenant

### Agent Language Responsibilities:
- **@ui-developer:** Implementeert taal-agnostic components
- **@ai-chat:** Meertalige chat responses (currently ES, needs NL)
- **@localization-multitenant:** i18n framework en content management

## Success Metrics

### Agent Performance KPIs
- **Task Completion Rate:** % of planned tasks completed on time
- **Code Quality Score:** Based on reviews and bug reports
- **Collaboration Score:** Based on peer feedback
- **Knowledge Sharing:** Documentation contributions

### Cross-Agent Metrics
- **Integration Success Rate:** % of integrations working first time
- **Communication Effectiveness:** Measured via feedback surveys
- **Dependency Resolution Time:** Average time to resolve blockers
- **Code Review Turnaround:** Average review completion time

## Tools & Platforms

### Communication
- **Slack/Discord:** Daily communication
- **Zoom/Meet:** Video calls and screen sharing
- **Miro/Figma:** Visual collaboration

### Development
- **GitHub:** Code repository and project management
- **Vercel:** Deployment and preview environments
- **Neon:** Database management
- **Linear/Jira:** Task tracking

### Documentation
- **Notion/Confluence:** Centralized documentation
- **GitHub Wiki:** Technical documentation
- **Loom:** Video explanations and demos

This coordination framework ensures all agents work efficiently together while maintaining high quality standards and meeting the ambitious CareService platform timeline.
