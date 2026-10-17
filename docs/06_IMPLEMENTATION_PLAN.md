# Implementation Plan & 2-Hour Vertical Slices
## SafeGuard: Agile Hackathon Execution Roadmap

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Scope**: MLH Hacktoberfest Hack Day Lahore Build Slices

---

## 1. Hackathon Execution Strategy (The "Thin Vertical Slice")

During a 90 to 120-minute hackathon build window, teams often fail because they build horizontally (trying to build the complete database, then the complete API, then the complete frontend, and end up with zero working integration).

SafeGuard uses a **Thin Vertical Slice Strategy**:
1. **Slice 1 (Minutes 00–25)**: Core Physics Math Engine & Mock Data in Python (`app.py`).
2. **Slice 2 (Minutes 25–50)**: Live Open-Meteo REST Telemetry Ingestion + Streamlit HUD UI.
3. **Slice 3 (Minutes 50–80)**: Google DeepMind Gemma 4 Multimodal Vision + Roman Urdu Alert Logic.
4. **Slice 4 (Minutes 80–100)**: Fail-Safe Hardware Demo Presets + Edge Offline Ollama Fallback.
5. **Slice 5 (Minutes 100–120)**: Git repository initialization, `SKILL.md`, `README.md`, MIT License, and OrganizerHQ project submission.

---

## 2. Phase-wise Implementation Milestones

### Phase 1: Local Scaffolding & Virtual Environment
- Verify Python 3.12+ runtime.
- Install essential lightweight dependencies (`streamlit`, `google-genai`, `requests`, `pillow`).
- Configure Google AI Studio Gemini API Key environment variable (`GEMINI_API_KEY`).

### Phase 2: Core Physics Module Development
- Implement Stopping Sight Distance ($SSD$) formula with AASHTO road design constants.
- Implement dynamic friction ($f$) degradation model for oily smog dew.
- Implement Crash Probability Index ($CPI$) and dynamic speed ceiling ($v_{max}$) quadratic solver.

### Phase 3: Telemetry Connector & Data Pipeline
- Write non-blocking requests wrapper for Open-Meteo current air quality & weather endpoints.
- Establish LRU memory cache (TTL = 300s) to guard against network dropouts on motorway segments.
- Map coordinates for high-risk Punjab corridors:
  - Lahore M-2 Babu Sabu (`31.5204, 74.3587`)
  - GT Road Kala Shah Kaku (`31.7167, 74.2667`)
  - M-11 Sialkot Motorway (`31.6000, 74.3200`)
  - Ring Road Northern Loop (`31.6200, 74.3800`)

### Phase 4: Gemma 4 Multimodal Vision & Audio Engine
- Implement `google-genai` client invocation targeting Gemma 4.
- Provide multimodal image upload input for dashcam/windshield frames.
- Format prompt to return structured JSON containing hazard classification, headlight glare index, and contextual Roman Urdu advisory.
- Wire Web Speech API / HTML5 Audio synthesis for acoustic warning pings.

### Phase 5: Bulletproof Demo Hardening (The Winning Edge)
- Implement 3 pre-baked scenario buttons so judges see instant real-time results even if venue Wi-Fi fails completely:
  - Preset A: Clear Daytime Commute (Green Baseline)
  - Preset B: M-2 Babu Sabu Midnight Smog Dew (Red Critical Warning)
  - Preset C: GT Road Unlit Sugarcane Trolley Obstruction (High-Beam Backscatter & Vision Alert)

### Phase 6: Submission & Showcase Deployment
- Initialize Git repository on venue machine during build hours.
- Verify `LICENSE` (MIT) and `SKILL.md` (Agent Skill Open Standard).
- Submit project on OrganizerHQ selecting **both** challenge tracks:
  - *Best Use of Gemma 4 (Google DeepMind)*
  - *Best Open-Source AI Project (DigitalOcean)*
- Conduct 2-minute elevator pitch rehearsal before judging panel.
