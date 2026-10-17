# System Architecture & Technical Topology
## SafeGuard: Autonomous Smog Accident Prevention Platform

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Classification**: Open-Source Distributed Telematics Architecture

---

## 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph DataSources["1. Real-Time Telemetry & Vision Feeds"]
        A1["Open-Meteo Weather API\n(PM2.5, Humidity, Visibility)"]
        A2["Mobile / Dashcam Sensor\n(Windshield Optical Feed)"]
        A3["GPS Telemetry\n(Speed, Heading, Corridor Geohash)"]
    end

    subgraph CoreEngine["2. SafeGuard Core Engine (Python Runtime)"]
        B1["Telemetry Ingestion & Cache\n(LRU In-Memory Cache TTL 300s)"]
        B2["AASHTO Physics Engine\n(Dynamic SSD, Greasy Friction f, CPI)"]
        B3["Quadratic Safe Speed Solver\n(Computes v_max ceiling)"]
        B4["Dual-Engine Vision Router\n(Gemini Cloud / Ollama Local Edge)"]
    end

    subgraph AIProviders["3. Multimodal Intelligence Layer"]
        C1["Primary: Google Gemini API\n(Gemma 4 Multimodal Model)"]
        C2["Offline Fallback: Local Ollama\n(gemma4:latest / gemma:2b)"]
        C3["Acoustic Roman Urdu Generator\n(Voice & Sonar Beacons)"]
    end

    subgraph DeliveryLayers["4. Presentation & Integration Tiers"]
        D1["Dark-Mode Driver HUD UI\n(Streamlit Reactive Dashboard)"]
        D2["Agent Skill Interface\n(SKILL.md Agent Standard)"]
        D3["Enterprise Telematics SDK\n(InDrive / Careem / NHMP Dispatch)"]
    end

    A1 --> B1
    A2 --> B4
    A3 --> B2
    B1 --> B2
    B2 --> B3
    B4 --> C1
    B4 -.->|Network Timeout / Offline| C2
    C1 --> C3
    C2 --> C3
    B2 --> D1
    B3 --> D1
    C3 --> D1
    B2 --> D2
    B2 --> D3
```

---

## 2. Architectural Subsystems

### 2.1 Subsystem A: Telemetry & Ingestion Pipeline
- **Input Channels**: REST calls to Open-Meteo Air Quality and Weather APIs.
- **Fail-Safe Mechanism**: If network is unavailable on remote stretches of M-2 Motorway (e.g., Salt Range / Sukheki corridor), the engine switches to the local embedded historical dataset (`lahore_smog_accident_benchmarks_2024_2026.csv`).

### 2.2 Subsystem B: Deterministic Safety Physics Engine
- Operates independently of AI hallucination risks. 
- All safety margins, braking distances ($SSD$), and maximum velocities ($v_{max}$) are derived via rigorous mechanical engineering equations.
- Takes dynamic account of the **chemical dew slick**:
  $$\text{If } RH > 80\% \land PM_{2.5} > 250 \implies f \to 0.28, \ t_r \to 2.85s$$

### 2.3 Subsystem C: Dual-Mode Multimodal AI (Gemma 4 + Ollama)
- **Why Dual-Mode?**
  1. *Online Mode (Google Gemini API)*: Provides zero-install cloud execution of Gemma 4 with rich multimodal reasoning.
  2. *Edge Mode (Ollama)*: Meets the DigitalOcean & MLH partner challenge requirement for local edge inference on devices without persistent 4G connections.
- **Vision Tasks**:
  - Optical density & fog extinction mapping.
  - Identification of glare backscatter caused by high beams.
  - Spatial detection of unlit objects (bullock carts, sugarcane tractor-trolleys, broken-down vehicles).

### 2.4 Subsystem D: Integration & Agent Standard (`SKILL.md`)
- The system exposes an Agent Skill Open Standard interface (`SKILL.md`) in the repository root.
- This allows external AI orchestrators (e.g., Antigravity, Claude, AutoGPT, Hermes Agent) to call SafeGuard as a deterministic tool for route risk evaluation.

---

## 3. Security & Resilience Principles

1. **Zero Personally Identifiable Information (Zero-PII)**: GPS coordinates are snapped to regional corridor geohashes; no individual license plate or phone identity is stored.
2. **Sub-second Circuit Breaker**: If the multimodal vision API does not respond within 1800ms, the physics warning is dispatched immediately without waiting for vision analysis.
3. **Open-Source MIT Architecture**: Free from proprietary closed vendor locks. Permissive for commercial ride-hailing and emergency transport integration.
