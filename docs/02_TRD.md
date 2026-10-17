# Technical Requirement Document (TRD)
## SafeGuard: Autonomous Winter Smog Accident Prevention Engine

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Status**: Production Architecture Specification

---

## 1. System Technology Stack

| Layer | Component / Technology | Specification & Rationale |
| :--- | :--- | :--- |
| **Runtime Environment** | Python 3.12+ | High-performance async runtime, standard scientific math libraries |
| **Presentation / UI** | Streamlit | Rapid reactive web framework; zero-boilerplate real-time re-rendering |
| **Multimodal Intelligence** | Google DeepMind Gemma 4 | Accessed via `google-genai` SDK (Gemini API) + Local Ollama fallback (`localhost:11434`) |
| **External Telemetry** | Open-Meteo Free API | Real-time weather, solar, and aerosol indices (no API key friction) |
| **Physics Computation** | NumPy / Pure Python Math | Sub-millisecond deterministic calculation of SSD, CPI, and Koschmieder optical transmission |
| **Audio Alert Synthesis** | Browser Speech Synthesis / Pygame / HTML5 Audio | Audio beacons and synthesized Roman Urdu voice prompts |
| **Standardization** | Agent Skill Open Standard (`SKILL.md`) | Interoperable AI agent definition for programmatic tool execution |

---

## 2. Mathematical Models & Physics Formulation

### 2.1 Stopping Sight Distance ($SSD$)
The standard American Association of State Highway and Transportation Officials (AASHTO) model augmented with aerosol boundary friction modifications:

$$SSD = d_{\text{perception-reaction}} + d_{\text{braking}}$$

$$d_{\text{perception-reaction}} = v \cdot t_r$$

$$d_{\text{braking}} = \frac{v^2}{2 \cdot g \cdot (f \pm G)}$$

Where:
- $v$ = Vehicle velocity in meters per second ($v = \text{speed\_kmh} \times \frac{5}{18}$)
- $t_r$ = Driver perception-reaction time (seconds)
- $g$ = Gravitational acceleration ($9.80665 \text{ m/s}^2$)
- $f$ = Dynamic tire-tarmac friction coefficient
- $G$ = Longitudinal roadway grade percent (assumed $0.00$ for flat Punjab plains)

#### Smog-Degraded Driver Reaction Time ($t_r$):
$$t_r = 1.5 + 1.5 \cdot \min\left(1.0, \max\left(0.0, \frac{100 - \text{Visibility}}{80}\right)\right)$$
*When visibility drops below 20m, reaction time scales from $1.5s$ to $3.0s$ due to low-contrast visual delay.*

#### Chemical Dew Friction Degradation ($f$):
$$f = f_{\text{baseline}} \cdot (1 - \delta_{\text{smog}})$$
- Standard dry asphalt $f_{\text{baseline}} = 0.70$
- If Relative Humidity ($RH$) $> 80\%$ and $PM_{2.5} > 250 \ \mu\text{g/m}^3$:
  $$\delta_{\text{smog}} = 0.60 \implies f \approx 0.28$$
  *(Reflecting the oily hydrocarbon soot and sulfate condensation film on cold pavement).*

### 2.2 Koschmieder's Law (Meteorological Optical Range)
Meteorological visibility ($V$) relates to the atmospheric extinction coefficient ($\beta_{\text{ext}}$):
$$V = \frac{-\ln(C)}{\beta_{\text{ext}}} \approx \frac{3.912}{\beta_{\text{ext}}}$$
Where $C = 0.02$ is the minimum human contrast threshold.
$$\beta_{\text{ext}} = \beta_{\text{Rayleigh}} + \beta_{\text{PM2.5}} + \beta_{\text{water\_droplets}}$$

### 2.3 Crash Probability Index ($CPI$)
$$CPI = \frac{SSD}{V_{\text{actual}}}$$
- **$CPI \le 0.80$**: SAFE (Velocity allows complete stopping within visible envelope).
- **$0.80 < CPI \le 1.00$**: ELEVATED WARNING (Stopping boundary matches visible horizon).
- **$CPI > 1.00$**: CRITICAL PROBABILITY (Physical collision guaranteed if stationary hazard exists).

### 2.4 Dynamic Safe Speed Cap ($v_{max}$)
When $CPI > 1.00$, the system solves for the velocity $v$ such that $SSD = V_{\text{actual}}$:
$$v \cdot t_r + \frac{v^2}{2 \cdot g \cdot f} - V_{\text{actual}} = 0$$
Using the quadratic equation roots:
$$a = \frac{1}{2 \cdot g \cdot f}, \quad b = t_r, \quad c = -V_{\text{actual}}$$
$$v_{\text{safe}} = \frac{-b + \sqrt{b^2 - 4ac}}{2a} \quad (\text{converted to km/h by multiplying by } 3.6)$$

---

## 3. Gemma 4 & Vision Pipeline Architecture

### 3.1 Primary Provider: Google Gemini API (Gemma 4)
- **Model Identifier**: `models/gemma-4-it` or `models/gemini-2.5-flash` (compatible via `google-genai` SDK).
- **Prompt Structure**:
  ```text
  You are SafeGuard's High-Speed Smog Road Safety Auditor for Pakistani Highways.
  Analyze this road/windshield camera frame:
  1. Detect headlight backscatter and high-beam blinding glare.
  2. Identify low-visibility hazards (unlit tractor-trolleys, broken-down vehicles, barricades).
  3. Estimate physical atmospheric density (clear vs thick chemical smog).
  Return JSON:
  {
    "hazard_detected": bool,
    "hazard_description": string,
    "glare_risk": "low" | "medium" | "severe",
    "recommended_action_roman_urdu": string,
    "recommended_speed_limit_kmh": int
  }
  ```

### 3.2 Secondary Provider: Ollama Local Edge Fallback
- **Endpoint**: `http://localhost:11434/api/generate`
- **Model**: `gemma4:latest` or `gemma:2b`
- **Behavior**: If Gemini API returns an HTTP 5xx, network timeout, or offline indicator, the system gracefully routes the request to local Ollama on loopback interface without interrupting the driver's interface.

---

## 4. API & External Data Ingestion Specs

### Open-Meteo Endpoints:
```http
GET https://api.open-meteo.com/v1/forecast?latitude=31.5204&longitude=74.3587&current=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m&hourly=visibility
GET https://air-quality-api.open-meteo.com/v1/air-quality?latitude=31.5204&longitude=74.3587&current=pm2_5,pm10,carbon_monoxide
```
- **Caching Mechanism**: Local LRU memory cache with a TTL (Time-To-Live) of 300 seconds to prevent rate limiting.
- **Failover Strategy**: Static regional fallbacks containing historical November–January median figures if endpoint is unreachable.
