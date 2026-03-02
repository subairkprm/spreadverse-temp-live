# Design Guidelines for SPREAD VERSE V4

## Design Approach
**System-Based Approach**: Given this is a productivity-focused banking CRM platform, we'll use Material Design principles adapted for finance/enterprise, prioritizing clarity, data hierarchy, and professional trustworthiness.

## Core Design Elements

### Typography
- **Primary Font**: Inter (already loaded via CDN)
- **Hierarchy**:
  - Headers: `text-2xl font-bold` (24px)
  - Subheaders: `text-lg font-semibold` (18px)
  - Body text: `text-base` (16px)
  - Small/meta: `text-sm text-muted-foreground` (14px)
  - Data values: `font-mono text-base` for numerical precision

### Layout System
**Spacing Units**: Use Tailwind units of **2, 4, 8, 12, and 16** consistently
- Component padding: `p-4` or `p-8`
- Section spacing: `space-y-4` or `space-y-8`
- Container gaps: `gap-4` or `gap-8`
- Margins: `mb-8`, `mt-12` for major sections

**Container Structure**:
- Desktop: `max-w-7xl mx-auto px-8`
- Mobile: `px-4`
- Cards/Panels: `rounded-lg` with `p-6`

### Component Library

**Navigation**
- Fixed sidebar (desktop): `w-64`, icons + labels, collapsible
- Bottom nav (mobile): Fixed bar with 4-5 primary actions
- Header: `h-16`, contains branding, search, user profile

**Data Display**
- Lead cards: White background, subtle `border border-slate-200`, include status badge, contact info, AI insights preview
- Tables: Striped rows `even:bg-slate-50`, sticky headers, sortable columns
- Status badges: `px-3 py-1 rounded-full text-xs font-medium` with status-specific background colors
- Charts: Use Chart.js with muted color palette (blues, grays)

**Forms & Inputs**
- Input fields: `border border-slate-300 rounded-lg px-4 py-3`, focus state with `ring-2 ring-blue-500`
- Dropdowns: Native select styled with custom arrow
- File upload: Drag-and-drop zone with dashed border `border-2 border-dashed border-slate-300`
- CSV import: Large dropzone area with icon and helper text

**Action Elements**
- Primary CTA: `bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold`
- Secondary: `bg-white border-2 border-slate-300 hover:border-slate-400`
- Icon buttons: `p-2 rounded-lg hover:bg-slate-100`
- Call button: Prominent `bg-green-600` with phone icon
- AI Generate: `bg-purple-600` with sparkles icon

**Modal/Overlay**
- Backdrop: `bg-black/50`
- Panel: `bg-white rounded-xl shadow-2xl max-w-2xl` centered
- Settings panel: Slide-in from right on desktop, full screen on mobile

**Glass Panel Treatment**
- Continue using `.glass-panel` class (already defined)
- Apply to stat cards, AI recommendation cards, and floating action panels

### Color System
- Primary: Blue (`blue-600`) — trust, professionalism
- Success: Green (`green-600`) — positive actions, call button
- Warning: Amber (`amber-500`) — alerts, attention needed
- Danger: Red (`red-600`) — destructive actions, overdue items
- AI/Smart: Purple (`purple-600`) — AI-powered features
- Neutral: Slate scale — backgrounds, borders, text

### Responsive Breakpoints
- Mobile: `< 768px` — single column, bottom nav, full-width cards
- Tablet: `768px – 1024px` — two columns, collapsible sidebar
- Desktop: `> 1024px` — full sidebar, multi-column layouts

### Iconography
- Use Lucide React icons consistently
- Size: `w-5 h-5` for inline, `w-6 h-6` for navigation, `w-8 h-8` for feature highlights
- Optional: Subtle brand logo in sidebar/header
