# SPREAD VERSE V4

## Overview
SPREAD VERSE V4 is a private partner platform for banking CRM, designed as a multi-user lead management system. Its core purpose is to streamline lead management, enhance sales efficiency, and provide comprehensive CRM functionalities within the banking sector. Key capabilities include AI-powered recommendations, call tracking, EMI calculations, task and campaign management, analytics, a proposal module with DBR calculation, and advanced data import. The platform supports multi-tenancy with workspace isolation, role-based access control, and offers a responsive user experience across devices. The business vision is to provide a robust, scalable CRM solution that empowers banking professionals with intelligent tools for lead conversion and customer relationship management.

## User Preferences
- The agent should prioritize an iterative development approach.
- Before implementing major changes or new features, the agent should ask for confirmation.
- Explanations should be detailed, providing sufficient context and reasoning for decisions.
- The agent should use clear and simple language in all communications.
- The agent should avoid making changes to the `shared/schema.ts` file without explicit instruction.

## System Architecture

### UI/UX Decisions
The application features a responsive design adapting to both mobile and laptop interfaces. It includes a theme toggle for dark/light mode. Navigation is primarily managed via a 5-tab bottom navigation bar for core modules (CRM, Calling, Tasks, Campaigns, Data) and a gear icon in the CRM header for settings. UI components leverage Shadcn/UI for a consistent and modern look. Key visual elements include AECB score indicators (VHS, HS, MS, LS, VLS), DBR badges, and lead quality badges (Hot/Warm/Cold).

### Technical Implementations
- **Frontend**: Built with React 18, TypeScript, Tailwind CSS, and Shadcn/UI for component-based development and styling. State management is handled by TanStack Query, and Wouter is used for routing.
- **Backend**: Implemented using Express.js and Node.js.
- **Database**: PostgreSQL is used as the relational database, interfaced via Drizzle ORM.
- **Authentication**: Session-based authentication is managed with `express-session` and `connect-pg-simple`, utilizing bcrypt for secure password hashing.

### Data Flow
- Client-side routing and API calls are managed through TanStack Query.
- Server-side API endpoints are defined in Express.js routes (`server/routes.ts`).
- Database interactions are handled via Drizzle ORM with schema defined in `shared/schema.ts`.
- AI features integrate with Google Gemini API for lead recommendations and insights.

### External Integrations
- **Google Gemini AI**: For AI-powered lead scoring, recommendations, and insights.
- **PostgreSQL**: Primary database for all application data.
- **ExcelJS**: For advanced Excel/CSV data import and export functionality.
- **WhatsApp API**: For quick messaging and campaign management.
