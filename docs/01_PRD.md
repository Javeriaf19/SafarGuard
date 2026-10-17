# Product Requirement Document (PRD)
## SafeGuard: Autonomous Winter Smog Accident Prevention & Dynamic Stopping Sight Distance (SSD) Engine

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Status**: Ready for Production / Hackathon Evaluation
- **Classification**: Open-Source Road Safety Intelligence Platform

---

## 1. Executive Summary & Problem Space

### 1.1 The Real-World Crisis
Every year between late October and February, Central Punjab (specifically Lahore, Gujranwala, Faisalabad, and Sheikhupura) faces a dual environmental and humanitarian disaster: severe photochemical smog combined with radiation fog.

While mainstream applications treat smog strictly as an **air-quality index (AQI) or respiratory problem**, real-world data demonstrates that **transport fatalities spike precipitously**. The intersection of dense particulate matter (PM2.5 > 350 µg/m³), relative humidity (> 85%), and cold overnight dew causes:
1. **The Chemical Blackout Effect**: Industrial carbon and aerosol sulfates absorb and scatter white headlight beams, reducing practical human visual range from kilometers to under 15 meters.
2. **The Greasy Asphalt Slick**: Smog particulates coalesce with overnight dew, forming an oily, chemical-laden liquid film on tarmac surfaces. This slashes the tire-road friction coefficient ($f$) from a dry $0.70$ down to $0.25 - 0.30$.
3. **Delayed Perception & Phantom Depth**: In yellowish-grey smog banks, contrast disappears. Human driver reaction time ($t_r$) expands from $1.5$ seconds to over $2.8$ seconds.
4. **Catastrophic Highway Pileups**: Vehicles travelling at regular highway limits (100–120 km/h) on routes like the M-2 Motorway (Babu Sabu to Kot Abdul Malik) or N-5 National Highway cannot physically stop within their visual range, triggering multi-vehicle chain reactions and unlit tractor-trolley collisions.

### 1.2 The SafeGuard Solution
**SafeGuard** is an open-source, dual-architecture safety platform that stops smog-induced crashes before they happen by coupling:
- **Deterministic Road Safety Physics**: Real-time computation of Stopping Sight Distance (SSD) and Crash Probability Index (CPI) based on live meteorological data.
- **Multimodal Edge Vision (Gemma 4)**: Windshield and dashcam optical contrast auditing, detecting blinding high-beam backscatter and unlit road obstructions.
- **Urgent Auditory Telemetry**: Contextual Roman Urdu / Urdu acoustic warnings and dynamic speed caps ($v_{max}$) distributed to commercial drivers, ride-hailing services (InDrive/Careem), and everyday commuters.

---

## 2. Target Personas & Use Cases

### 2.1 Persona 1: Tariq (Intercity Bus & Truck Fleet Operator)
- **Profile**: Drives long-distance Daewoo/Faisal Movers or cargo trucks across M-2 / M-11 late at night.
- **Pain Point**: Phone mounted on windshield far away; cannot read text alerts; cannot perceive unlit sugarcane tractor-trolleys stalled on the shoulder.
- **SafeGuard Solution**: High-contrast, hands-free acoustic alerts ("Siren + Roman Urdu audio beacon") that beep progressively faster when proximity narrows beyond safe stopping distance.

### 2.2 Persona 2: Bilal (Ride-Hailing Driver - InDrive / Yango)
- **Profile**: Daily commuter and commercial driver navigating Lahore city arteries (Canal Road, Ring Road, Ferozepur Road).
- **Pain Point**: Cannot exit his navigation or ride-hailing app to look at a separate smog alert application.
- **SafeGuard Solution**: Minimalist background service / widget with dynamic speed cap ($v_{max}$) overlay indicating real-time stopping thresholds.

### 2.3 Persona 3: Rescue 1122 & Motorway Police (NHMP Dispatchers)
- **Profile**: Traffic safety managers responsible for preemptive interchange closures.
- **Pain Point**: Delayed manual reporting of zero-visibility fog corridors leading to stranded motorists.
- **SafeGuard Solution**: Real-time corridor telemetry dashboard with automated Crash Probability Index (CPI) heatmaps.

---

## 3. Product Goals & Measurable Objectives (OKRs)

- **Objective 1 (Safety Accuracy)**: Compute real-time Stopping Sight Distance ($SSD$) with < 5% variance from standard AASHTO / NHMP highway physics models.
- **Objective 2 (Latency & Edge Resilience)**: Render safety scores in < 250ms using deterministic math, with an automated offline fallback when internet connectivity degrades on open motorways.
- **Objective 3 (Multimodal Intelligence)**: Integrate Google DeepMind's **Gemma 4** open-weight model to analyze dashcam frames, classify high-beam backscatter risk, and generate actionable natural-language advisories.
- **Objective 4 (Open Source & Extensibility)**: Deliver a 100% MIT-licensed repository featuring standard `SKILL.md` (Agent Skill Open Standard) compliant interfaces for effortless enterprise SDK integration.

---

## 4. Functional Requirements

### FR-1: Real-Time Corridor Telemetry Ingestion
- Ingest live meteorological variables without authentication barriers via Open-Meteo Air Quality & Weather endpoints (PM2.5, PM10, Relative Humidity, Temperature, Dew Point, Wind Speed, Visibility).
- Support major high-risk Punjab corridors:
  - M-2 Motorway (Lahore - Babu Sabu to Sheikhupura)
  - M-11 Motorway (Lahore to Sialkot Sambrial)
  - N-5 National Highway / GT Road (Kala Shah Kaku to Gujranwala)
  - Lahore Ring Road (L-20 Northern Loop)
  - Multan Road (Thokar Niaz Baig to Manga Mandi)

### FR-2: Deterministic Physics Engine (SSD & CPI Calculation)
- **Dynamic Friction Coefficient ($f$)**: Compute surface lubricity dynamically. If $RH > 80\%$ and $PM_{2.5} > 250$, reduce $f$ from $0.70$ to $0.28$.
- **Perception-Reaction Delay ($t_r$)**: Scale human driver reaction time dynamically up to $3.0$ seconds based on contrast degradation.
- **Crash Probability Index ($CPI$)**: Evaluate $\frac{SSD}{\text{Visibility}}$. Categorize into:
  - $CPI < 0.8$: Normal / Green
  - $0.8 \le CPI \le 1.0$: Elevated Alert / Amber
  - $CPI > 1.0$: Critical Crash Hazard / Flashing Red ($v_{max}$ cap enforced)

### FR-3: Gemma 4 Multimodal Vision Auditor
- Support image upload or snapshot capture of road windshield view.
- Send tensor/image to Gemma 4 via Gemini API / local Ollama endpoint.
- Classify:
  1. Headlight glare scatter (High-beam backscatter index).
  2. Unlit static or moving obstacles in zero-contrast field.
  3. Structural atmospheric turbidity (smog-fog density).
- Generate a 2-line direct Roman Urdu advisory and high-priority action code.

### FR-4: Bulletproof Pre-baked Presets (Fail-Safe Protocol)
- Include three instant hardware/offline simulation presets:
  1. *Clear Daylight Commute* (Baseline control)
  2. *M-2 Midnight Chemical Smog Wall* (High Crash Risk)
  3. *GT Road Unlit Tractor-Trolley Hazard* (Critical Emergency)

---

## 5. Non-Functional Requirements

- **Performance**: Deterministic physics execution < 50ms; Multimodal response < 2.0s via API.
- **Reliability**: Zero crash guarantee on API timeout (graceful offline degradation to local simulated inference).
- **Usability**: Dark-mode HUD interface optimized for in-vehicle night ergonomics (minimizing interior cabin glare).
- **Accessibility**: Multi-language support (English technical telemetry + clear Roman Urdu audio guidance).
- **License Compliance**: 100% open-source under MIT License.
