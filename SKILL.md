---
name: safeguard-smog-safety-engine
description: Autonomous Stopping Sight Distance (SSD) physics engine and multimodal road safety auditor for Pakistani winter smog corridors. Calculates dynamic speed ceilings (v_max) and evaluates multi-vehicle crash probability.
---

# SafeGuard: Autonomous Winter Smog Accident Prevention Skill

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Standard**: Agent Skill Open Standard (SKILL.md)
- **Primary Use**: Autonomous telematics, ride-hailing safety routing (InDrive/Careem), and highway collision prevention.

---

## 1. Skill Purpose & Invocation Triggers

Use this skill whenever an autonomous agent or workflow needs to:
1. Assess highway collision risks during winter fog or photochemical smog conditions in Pakistan (M-2, M-11, GT Road, Ring Road).
2. Compute AASHTO-standard Stopping Sight Distance ($SSD$) with dynamic friction adjustments for greasy chemical dew ($f \le 0.28$).
3. Derive the Crash Probability Index ($CPI$) and enforce dynamic safe speed limits ($v_{max}$).
4. Audit a vehicle windshield or dashcam image using Google DeepMind's **Gemma 4** to identify high-beam backscatter glare or unlit road obstacles (e.g., sugarcane tractor-trolleys).
5. Generate clear, actionable Roman Urdu auditory warnings for drivers.

---

## 2. Core Physics Equations

### 2.1 Stopping Sight Distance ($SSD$)
$$SSD = (v \cdot t_r) + \frac{v^2}{2 \cdot g \cdot f}$$
- $v$ = Vehicle speed in m/s ($v = \text{km/h} \times 0.27778$)
- $g = 9.80665 \text{ m/s}^2$
- $t_r = 1.5s$ baseline; scales up to $3.0s$ when visibility $< 30m$ due to contrast loss.
- $f = 0.70$ dry baseline; drops to $f = 0.28$ when Relative Humidity $> 80\%$ and $PM_{2.5} > 250 \ \mu\text{g/m}^3$ (chemical dew film).

### 2.2 Crash Probability Index ($CPI$)
$$CPI = \frac{SSD}{\text{Visibility (meters)}}$$
- **$CPI < 0.8$**: Safe (Green).
- **$0.8 \le CPI \le 1.0$**: Elevated Risk (Amber).
- **$CPI > 1.0$**: Critical Crash Probability (Red) — Stopping distance exceeds sight horizon!

### 2.3 Dynamic Safe Speed Ceiling ($v_{max}$)
When $CPI > 1.0$, solve the quadratic equation $SSD = \text{Visibility}$ for velocity $v$:
$$v_{\text{safe}} = \frac{-t_r + \sqrt{t_r^2 + 4 \cdot \left(\frac{1}{2gf}\right) \cdot \text{Visibility}}}{2 \cdot \left(\frac{1}{2gf}\right)} \times 3.6 \quad (\text{km/h})$$

---

## 3. Tool Function Specification

```python
def evaluate_corridor_safety(
    visibility_m: float,
    current_speed_kmh: float,
    humidity_pct: float,
    pm25_ug_m3: float
) -> dict:
    """
    Evaluates real-time stopping sight distance and crash risk index.
    
    Returns:
        dict: {
            "ssd_meters": float,
            "cpi": float,
            "risk_level": "SAFE" | "WARNING" | "CRITICAL",
            "safe_speed_cap_kmh": float,
            "is_chemical_slick": bool,
            "roman_urdu_alert": str
        }
    """
```

---

## 4. Multimodal Gemma 4 Vision Integration

When analyzing camera inputs:
- Call Gemma 4 (`models/gemma-4-it` or `gemini-2.5-flash`) via the Gemini API or local Ollama.
- Classify:
  1. Optical backscatter: High-beam glare that blinds the vehicle driver.
  2. Unlit static obstacles: Sugarcane tractor-trolleys, broken-down buses, unreflective barriers.
- Prompt:
  *"Analyze this windshield image during zero-visibility winter smog. Identify blinding glare, road obstacles, and formulate a 2-line direct Roman Urdu advisory."*
