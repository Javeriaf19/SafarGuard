# UI/UX Design Brief & Design System
## SafeGuard: Automotive Driver HUD & Safety Telemetry Interface

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Context**: In-Vehicle Night Smog Navigation & Dashboard Ergonomics

---

## 1. Visual Design Philosophy & Human Factors

When driving at night in zero-visibility smog (e.g., M-2 Motorway near Babu Sabu), standard high-luminance UI screens cause severe night-blindness (scotopic vision degradation). Bright white backgrounds reflect off the foggy windshield right back into the driver's eyes, compounding the outdoor blackout.

### Core Design Tenets:
1. **OLED True-Black Foundation (`#050811`)**: Deep pitch-black background minimizes cabin light leakage and eliminates windshield reflections.
2. **High-Contrast Safety Triage**: Chromatic indicators follow standard aviation/automotive emergency colors (Safety Amber `#FFB800`, Critical Danger Red `#FF3B30`, Safe Verified Green `#34C759`).
3. **Glanceability (< 250ms Rule)**: Vital metrics (Current Safe Speed Cap, CPI indicator, Road Grip) are displayed in oversized numeric typography readable from an arm's length phone mount.
4. **Auditory & Haptic Redundancy**: Visual data is always mirrored by distinct audio tones and concise Roman Urdu verbal prompts.

---

## 2. Color Palette & Design Tokens

```css
:root {
  /* Surface & Background */
  --bg-primary: #050811;
  --bg-secondary: #0D1322;
  --bg-card: #151D31;
  --border-subtle: #242E47;

  /* Typography */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Safety Accents */
  --hazard-safe: #34C759;
  --hazard-safe-glow: rgba(52, 199, 89, 0.25);
  --hazard-warning: #FFB800;
  --hazard-warning-glow: rgba(255, 184, 0, 0.25);
  --hazard-critical: #FF3B30;
  --hazard-critical-glow: rgba(255, 59, 48, 0.35);

  /* Smog Indicator Accent */
  --smog-amber: #F59E0B;
  --hud-cyan: #06B6D4;
}
```

---

## 3. Typography & Hierarchy

- **Display Numbers (HUD Speed Cap & CPI)**: `Inter`, `SF Pro Display`, or `JetBrains Mono`, 48px to 64px, ExtraBold (Weight: 800).
- **Metric Headers**: 12px uppercase, tracked wide (`letter-spacing: 0.1em`), SemiBold (Weight: 600), Color: `--text-secondary`.
- **Alert Banner**: 18px to 22px, Bold (Weight: 700), High-contrast banner with flashing pulse when $CPI > 1.0$.
- **Roman Urdu Guidance Callouts**: 16px, Regular/Medium, High-legibility sans-serif.

---

## 4. Component Architecture & Screen Layout

```
+-------------------------------------------------------------------------+
| [SAFARGUARD]  M-2 Babu Sabu Interchange  | LIVE SMOG TELEMETRY  ● ONLINE|
+-------------------------------------------------------------------------+
|                                                                         |
|   +-------------------+  +-------------------+  +-------------------+   |
|   | VISIBILITY (MET)  |  | ROAD GRIP (f)     |  | CRASH PROB (CPI)  |   |
|   |      28 m         |  |   0.28 (SLICK)    |  |   1.42 (CRITICAL) |   |
|   +-------------------+  +-------------------+  +-------------------+   |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |                    SAFE SPEED CEILING (v_max)                   |   |
|   |                              34 km/h                            |   |
|   |         (Recommended: 34 km/h | Highway Posted: 120 km/h)       |   |
|   +-----------------------------------------------------------------+   |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | [CRITICAL ALERT]  KHATRA SHADEED HAI!                           |   |
|   | "High beams off karein. Aage unlit trolley ka imkaan hai.       |   |
|   | Speed foran 35 km/h se kam karein aur agle service area rukein."|   |
|   +-----------------------------------------------------------------+   |
|                                                                         |
|   +----------------------------------+  +---------------------------+   |
|   | GEMMA 4 VISION AUDIT             |  | ONE-CLICK HARDWARE DEMOS  |   |
|   | [ Upload Windshield Snapshot ]   |  | [1. Clear Highway]        |   |
|   | Glare: SEVERE (High-Beam Back)   |  | [2. M-2 Smog Night Wall]  |   |
|   | Obstacle: 18m Unlit Silhouette   |  | [3. Trolley Hazard Red]   |   |
|   +----------------------------------+  +---------------------------+   |
+-------------------------------------------------------------------------+
```

---

## 5. Acoustic Guidance & Audio UX

- **Nominal State ($CPI < 0.8$)**: Silent / subtle confirmation ping.
- **Approaching Limit ($0.8 \le CPI \le 1.0$)**: Intermittent double-beep (550 Hz, 80ms) alerting driver to deceleration need.
- **Critical Danger ($CPI > 1.0$)**: Immediate pulsing klaxon followed by high-clarity synthesized Roman Urdu voice:
  *"Khatra! Dhund intehai shadeed hai. Speed foran penty-saath (35) par le aayein."*
