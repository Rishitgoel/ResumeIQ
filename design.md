# ResumeIQ Landing Page Design Schema

This document outlines the visual schema and architectural blueprint to replicate the reference design pixel-for-pixel.

## 1. Color Palette & Theming
- **Canvas / Background**: `#F8FAFC` to `#FAFCFF` (ultra-clean off-white with high dynamic contrast)
- **Ambient Glow**: Soft radial gradient `radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.06) 50%, transparent 75%)`
- **Primary Brand Color**: `#4338CA` / `#4F46E5` (Vibrant Royal Indigo)
- **Neutral Dark (Headings)**: `#0F172A` (Slate 900)
- **Neutral Medium (Body / Subtitles)**: `#64748B` (Slate 500)
- **Neutral Light (Borders & Dividers)**: `#E2E8F0` / `#F1F5F9`
- **Functional Accents**:
  - Emerald Green (`#10B981`): Verification badges, 90% DSA bar, 85% Python bar, 80% Communication bar, 75% System Design bar.
  - Cyan / Teal (`#06B6D4` / `#00D2B4`): 78% Overall Match score ring.
  - Amber / Orange (`#F59E0B`): 60% Cloud (AWS) bar and warning indicator.
  - Ink Blue (`#312E81` / `#3730A3`): Handwritten annotations.
  - PDF Red (`#EF4444`): Resume file icon.
  - Job Blue (`#3B82F6`): Job Description file icon and gradient button.

## 2. Typography & Fonts
- **Primary UI Font**: Inter / Plus Jakarta Sans (`font-sans`), clean geometric sans-serif.
- **Handwritten Annotation Font**: `Caveat`, cursive, bold (`font-handwriting`), mimicking natural blue pen ink with organic tilt and rotation.
- **Scale**:
  - Hero Headline: 56px (`text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.12]`)
  - Subtitle: 18px (`text-lg text-slate-500 leading-relaxed`)
  - Section Headers: 14px uppercase with tracking-widest (`text-xs font-semibold tracking-widest uppercase text-slate-400`)

## 3. Structural Component Hierarchy

### A. Navigation Header
- Container: `max-w-7xl mx-auto px-8 h-20 flex items-center justify-between`
- Brand: Squircle icon box (`rounded-xl bg-gradient-to-tr from-[#4338CA] to-[#6366F1]`) with bespoke Resume Folio & IQ Precision mark + "ResumeIQ" bold wordmark (via reusable `<Logo />` component).
- Center Links: `Features`, `How It Works`, `Use Cases`, `Testimonials`, `Pricing` with 32px gap.
- Right Actions: `Sign In` (text button) and `Get Started ->` (indigo pill button).

### B. Hero Section (Left Column)
- **Badge**: Pill with `✦ AI-Powered Resume Intelligence` in `#EEF2FF` with `#4338CA` text.
- **Headline**:
  - Line 1: "Get Hired Faster"
  - Line 2: "with Smarter"
  - Line 3: "Resume Matching" (`#4338CA`)
- **Subtitle**: "Upload your resume, paste a job description, and get AI-powered insights on your match score, missing skills, and personalized improvement suggestions."
- **CTA Row**:
  - "Get Started for Free ->" (`bg-[#4338CA] text-white px-7 py-3.5 rounded-xl`)
  - "Watch Demo" (white card button with circle play icon and "2 min" gray badge)
- **Value Props Row**:
  - "✓ No credit card required"
  - "✓ Instant analysis"
  - "✓ Actionable insights"

### C. Hero Section (Right Column - Mockup Diagram)
- **Left Stack**:
  - Handwritten annotation top: "Upload your resume" + curved ink arrow pointing down.
  - Card 1 ("Your Resume"): Red PDF icon, "Your Resume", "Rishit_Goel_Resume.pdf", "2.1 MB", green checkmark.
  - Card 2 ("Job Description"): Blue doc icon, "Job Description", "SDE - Software Engineer", "Tech Company", green checkmark.
  - Connector: Vertical dotted guide line.
  - Button: "✦ Analyze Match ->" (gradient blue-to-indigo button).
  - Dotted guide line curving toward the dashboard card.
- **Right Card (Floating Match Insights Dashboard)**:
  - White rounded card with soft 3D elevation shadow (`rounded-3xl p-6 shadow-2xl`).
  - Top Gauge Section:
    - 78% Donut gauge with cyan-teal stroke.
    - "Overall Match Score"
    - "Great Match!"
    - "Your profile matches 78% of the job requirements."
  - Segmented Tabs:
    - "Skills Match" (active royal blue pill)
    - "Missing Skills"
    - "Suggestions"
  - 5 Progress Bars:
    1. Data Structures & Algorithms (90%, Emerald)
    2. System Design (75%, Emerald)
    3. Python (85%, Emerald)
    4. Cloud (AWS) (60%, Amber)
    5. Communication (80%, Emerald)
  - Bottom-right annotation:
    - "Get detailed insights" + curved ink arrow pointing up-left toward the dashboard card.

### D. 4 Feature Cards Row
- Card 1: Bullseye target icon in purple rounded box, "Accurate Matching", "AI-powered semantic analysis".
- Card 2: Lightning bolt in blue rounded box, "Skill Gap Analysis", "Identify missing skills instantly".
- Card 3: Bar chart in green rounded box, "Actionable Suggestions", "Get personalized improvement tips".
- Card 4: Briefcase in pink/red rounded box, "Multiple JD Comparison", "Compare across multiple job roles".

### E. Social Proof Section
- Header: "TRUSTED BY STUDENTS AND PROFESSIONALS"
- Logos: Google, Microsoft, amazon, Meta, Adobe, Goldman Sachs, ATLASSIAN, and more...
