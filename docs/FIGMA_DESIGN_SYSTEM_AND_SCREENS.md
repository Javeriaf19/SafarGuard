# Figma Design System & Multi-Screen Production Architecture
## SafarGuard: Autonomous Winter Smog Collision Prevention Engine

- **Lead Designer / Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Design Intelligence**: Governed by UI/UX Pro Max & Automotive Human Factors Standards

---

## 1. Master Logo Specification & Brand Geometry

### 1.1 The Luminous Shield Concept (Approved Master)
- **Primary Mark**: Aerodynamic chamfered shield with dual-layered neon cyan glow (`#06B6D4` / `#38BDF8`).
- **Focal Symbolism**: Converging M-2 highway corridor with high-contrast amber lane markers (`#F59E0B`). Slicing through the shield are two **volumetric amber-red fog beams** representing headlights piercing dense smog.
- **Central Optic Node**: Cyan AI sensor eye representing Google DeepMind's **Gemma 4** multimodal vision system.
- **Master Vector File**: [`g:/SafeGuard/assets/safarguard_master_logo.svg`](file:///g:/SafeGuard/assets/safarguard_master_logo.svg)
- **High-Res Render**: [`g:/SafeGuard/assets/safarguard_luminous_shield_1792176912169.jpg`](file:///g:/SafeGuard/assets/safarguard_luminous_shield_1792176912169.jpg)

---

## 2. Global Design Tokens (Figma Variables)

### 2.1 Color Styles
```css
/* Surface Tokens */
Canvas/Background:      #020617  (OLED Pitch Black - Zero Cabin Glare)
Surface/Elevation-1:    #090F1E  (Container Background)
Surface/Elevation-2:    #0F172A  (Card Default)
Surface/Elevation-Hover:#162038  (Interactive State)
Border/Subtle:          #1E293B  (1px separator)
Border/Active:          #334155  (Focused card border)

/* Safety Triage Accents */
Brand/Cyan-HUD:         #06B6D4  (Primary Instrument Highlight)
Brand/Cyan-Glow:        rgba(6, 182, 212, 0.25)
Safety/Amber-Fog:       #F59E0B  (Optical Boundary Caution)
Safety/Danger-Red:      #EF4444  (Critical Crash Hazard / CPI > 1.0)
Safety/Danger-Glow:     rgba(239, 68, 68, 0.35)
Safety/Verified-Green:  #10B981  (Nominal Cruise Safe Buffer)

/* Typography Tokens */
Text/Primary:           #F8FAFC  (High contrast white)
Text/Secondary:         #94A3B8  (Muted telemetry label)
Text/Muted:             #64748B  (Footnotes & legal citations)
```

### 2.2 Typography Scale (Figma Text Styles)
- **Display 1 (HUD Big Speed)**: `Fira Code`, 64px, ExtraBold (Weight: 800), Line Height: 1.0
- **Heading 1 (Web Hero)**: `Inter`, 42px, Black (Weight: 900), Line Height: 1.15
- **Heading 2 (Section Titles)**: `Inter`, 20px, ExtraBold (Weight: 800)
- **Data / Metrics**: `Fira Code`, 24px - 28px, Bold (Weight: 700)
- **Body Regular**: `Inter`, 14px - 16px, Regular/Medium (Weight: 400/500)
- **Spoken Prompt Callout**: `Inter`, 14px, SemiBold (Weight: 600)

---

## 3. Screen-by-Screen Architecture

### Screen 1: Public Web & Incident Corridor Map (Desktop 1440 × 900)
- **Purpose**: Citizen awareness portal, commuter route planning, and live NHMP motorway closure updates.
- **Key Components**:
  1. *Global Navigation*: Master Logo, Route Search Bar, Live Status (`● NHMP SYNCED`).
  2. *Hero Section*: High-impact headline ("Predicting Highway Pileups Before You Reach The Fog Bank"), live provincial crash probability ticker.
  3. *Corridor Risk Grid (Auto-Layout 3-Column)*: Real-time telemetry cards for M-2 Babu Sabu, GT Road Kala Shah Kaku, and M-11 Sialkot with live visibility badges and enforced speed caps.

### Screen 2: Driver Night HUD (Mobile 390 × 844 — iPhone 16 Pro)
- **Purpose**: In-vehicle phone mount interface for commercial truckers, Daewoo drivers, and night commuters.
- **Human Factors**: True OLED pitch black (`#020617`) eliminates interior windshield reflections.
- **Key Components**:
  1. *Oversized Speed Limit Ceiling Gauge*: 64px numeric display with pulsing danger border when $CPI > 1.0$.
  2. *2×2 Telemetry Matrix*: Sight Visibility (28m), Stopping Sight Distance (115m), Greasy Road Grip ($f = 0.28$), and Crash Probability ($CPI = 3.82$).
  3. *Urgent Spoken Roman Urdu Beacon Card*: High-contrast red card with one-tap audio playback button.

### Screen 3: Careem / InDrive Native Safety Overlay (Mobile 390 × 844)
- **Purpose**: Demonstrates how ride-hailing applications natively incorporate SafarGuard via the open-source SDK.
- **Key Components**:
  1. *Live Ride Navigation Map*: Active passenger trip view (Fare: PKR 840, Destination: Gulberg III).
  2. *Floating SafarGuard Safety Pill / Co-Pilot Widget*: Draggable, floating overlay with dynamic speed ceiling (`CAP: 35 KM/H`) and chemical slick detection banner.
  3. *Crowdsourced Hazard Pin*: Interactive radar callout on map ("⚠️ Stationary Tractor-Trolley reported 200m ahead in left lane").

### Screen 4: Commercial Fleet Dispatch & Rescue 1122 Command Console (Desktop 1440 × 900)
- **Purpose**: Multi-corridor operations console for Punjab Emergency Service (Rescue 1122), NHMP dispatchers, and Daewoo/TCS fleet managers.
- **Key Components**:
  1. *Regional Navigation Drawer*: Division-wise monitoring (Lahore, Sheikhupura, Muridke, Gujranwala, Faisalabad).
  2. *Central Collision Heatmap*: Real-time geohash cluster visualizer highlighting high-risk highway sectors.
  3. *Live Incident Escalations Feed*: Chronological stream of automated diversion broadcasts and hazard logs.

---

## 4. Interactive Prototype File Location

Open the interactive HTML Figma prototype directly in your browser:
👉 [`g:/SafeGuard/figma/figma_interactive_prototype.html`](file:///g:/SafeGuard/figma/figma_interactive_prototype.html)

Includes responsive device mockups, dynamic screen switching tabs, and direct visual rendering of all 4 production interfaces.
