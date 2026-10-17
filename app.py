import streamlit as st
import numpy as np
import pandas as pd
import requests
import json
import os
import math
from PIL import Image

# ==============================================================================
# SAFARGUARD: AUTONOMOUS SMOG COLLISION PREVENTION ENGINE
# 1:1 Pixel-Perfect Implementation of Figma AI Design ("Design SafarGuard Landing Page")
# Author: Javeria Farhan | Date: October 17, 2026
# Open Source MIT License | Hacktoberfest 2026
# ==============================================================================

st.set_page_config(
    page_title="SafarGuard | Don't Outdrive What You Can See",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def html(raw_str: str):
    """Cleanly render raw HTML without markdown treating 4-space indentation as code blocks."""
    clean = " ".join(line.strip() for line in raw_str.strip().splitlines())
    st.markdown(clean, unsafe_allow_html=True)

# Figma Exact Design System CSS (Editorial Minimalist + Automotive HUD)
html("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    :root {
        --figma-bg: #F8FAFC;
        --figma-card-bg: #FFFFFF;
        --figma-text-dark: #0F172A;
        --figma-text-muted: #64748B;
        --figma-teal: #0891B2;
        --figma-teal-glow: #06B6D4;
        --figma-border: #E2E8F0;
        --figma-dark-surface: #090F1E;
        --danger-red: #EF4444;
        --amber-warning: #F59E0B;
        --safe-green: #10B981;
    }

    .stApp {
        background-color: var(--figma-bg);
        color: var(--figma-text-dark);
        font-family: 'Inter', -apple-system, sans-serif;
    }

    /* Figma Clean Top Navbar */
    .figma-navbar {
        background: #FFFFFF;
        border-bottom: 1px solid var(--figma-border);
        padding: 16px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: -4rem -4rem 2rem -4rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .figma-logo {
        font-size: 22px;
        font-weight: 900;
        letter-spacing: -0.5px;
        color: #0F172A;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .figma-logo span { color: var(--figma-teal); }

    .nav-links {
        display: flex;
        gap: 24px;
        font-size: 14px;
        font-weight: 600;
        color: var(--figma-text-muted);
        align-items: center;
    }
    .nav-links a {
        text-decoration: none;
        color: var(--figma-text-muted);
        transition: color 0.2s ease;
    }
    .nav-links a:hover { color: var(--figma-teal); }

    .btn-react-launch {
        background: #0891B2;
        color: #FFFFFF !important;
        padding: 6px 14px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(8, 145, 178, 0.25);
    }

    /* Figma Exact Hero Section */
    .hero-container {
        padding: 30px 0 40px 0;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 48px;
        align-items: center;
    }

    .hero-tagline {
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--figma-teal);
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .hero-h1 {
        font-size: 56px;
        font-weight: 900;
        line-height: 1.05;
        letter-spacing: -1.5px;
        color: #0F172A;
        margin-bottom: 20px;
        text-transform: uppercase;
    }
    .hero-h1 span {
        color: var(--figma-teal);
    }

    .hero-desc {
        font-size: 16px;
        line-height: 1.6;
        color: var(--figma-text-muted);
        margin-bottom: 28px;
        max-width: 540px;
    }

    .cta-btn-dark {
        background: #0F172A;
        color: #FFFFFF;
        border: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
    }

    /* Foggy Road Card with HUD Overlay (Exact Figma Component) */
    .fog-hud-card {
        background: #090F1E;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
        border: 1px solid #1E293B;
        position: relative;
    }
    .fog-image-wrapper {
        height: 260px;
        background: #0D162B url('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;
        position: relative;
        display: flex;
        align-items: flex-start;
        padding: 16px;
    }
    .fog-overlay-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(9, 15, 30, 0.2) 0%, rgba(9, 15, 30, 0.95) 100%);
    }
    .hud-card-footer {
        background: #090F1E;
        padding: 20px 24px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        border-top: 1px solid #1E293B;
    }
    .hud-col { text-align: left; }
    .hud-col-label { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
    .hud-col-val { font-family: 'Fira Code', monospace; font-size: 24px; font-weight: 800; color: #FFFFFF; margin-top: 2px; }

    /* Authority Partners Banner */
    .authority-bar {
        background: #FFFFFF;
        border: 1px solid var(--figma-border);
        border-radius: 12px;
        padding: 14px 28px;
        margin: 10px 0 40px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: var(--figma-text-muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    /* "PLAN THE ROAD" Section */
    .corridors-section {
        background: #FFFFFF;
        border: 1px solid var(--figma-border);
        border-radius: 18px;
        padding: 36px 40px;
        margin-bottom: 40px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .section-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 28px;
    }
    .section-h2 {
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -0.5px;
        text-transform: uppercase;
        color: #0F172A;
    }

    /* Corridor Table Rows */
    .corridor-table-row {
        background: #F8FAFC;
        border: 1px solid var(--figma-border);
        border-radius: 12px;
        padding: 18px 24px;
        margin-bottom: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;
    }
    .c-name-col { flex: 1.4; font-weight: 800; font-size: 15px; color: #0F172A; }
    .c-vis-col { flex: 0.8; font-family: 'Fira Code', monospace; font-weight: 800; font-size: 18px; }
    .c-cap-col { flex: 1; font-family: 'Fira Code', monospace; font-size: 14px; font-weight: 700; color: #0F172A; }
    .c-badge-col { flex: 0.8; text-align: right; }

    .badge-pill-danger {
        background: rgba(239, 68, 68, 0.12);
        color: var(--danger-red);
        border: 1px solid var(--danger-red);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
    }
    .badge-pill-warning {
        background: rgba(245, 158, 11, 0.12);
        color: var(--amber-warning);
        border: 1px solid var(--amber-warning);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
    }
    .badge-pill-safe {
        background: rgba(16, 185, 129, 0.12);
        color: var(--safe-green);
        border: 1px solid var(--safe-green);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
    }
</style>
""")

# ==============================================================================
# 1. CORE PHYSICS & TELEMETRY ENGINE
# ==============================================================================

def compute_highway_safety(speed_kmh, visibility_m, humidity_pct=92.0, pm25_ug_m3=410.0):
    v = speed_kmh * (5.0 / 18.0)
    g = 9.80665
    tr = 1.5 + 1.5 * min(1.0, max(0.0, (100.0 - visibility_m) / 80.0))
    is_chemical_slick = (humidity_pct > 80.0) and (pm25_ug_m3 > 250.0)
    f = 0.28 if is_chemical_slick else 0.70
    
    d_reaction = v * tr
    d_braking = (v ** 2) / (2.0 * g * f)
    ssd_total = d_reaction + d_braking
    cpi = ssd_total / max(1.0, visibility_m)
    
    # Quadratic safe speed solver
    a = 1.0 / (2.0 * g * f)
    b = tr
    c = -float(visibility_m)
    disc = (b ** 2) - (4 * a * c)
    v_safe_kmh = max(15.0, ((-b + math.sqrt(disc)) / (2 * a)) * 3.6) if disc > 0 else 20.0
    
    return {
        "ssd_m": round(ssd_total, 1),
        "cpi": round(cpi, 2),
        "v_safe_kmh": round(v_safe_kmh, 1),
        "is_slick": is_chemical_slick,
        "friction_f": f
    }

# Active Corridors Data matching Figma
CORRIDOR_LIST = [
    {"name": "M-2 Motorway (Babu Sabu Interchange)", "vis": 28, "speed": 90, "alert": "Critical Smog Dew", "status": "danger"},
    {"name": "GT Road / N-5 (Kala Shah Kaku to Muridke)", "vis": 18, "speed": 80, "alert": "Unlit Tractor Hazard", "status": "danger"},
    {"name": "M-11 Motorway (Lahore to Sialkot Sambrial)", "vis": 42, "speed": 100, "alert": "Wet Fog Slick", "status": "warning"},
    {"name": "M-3 Motorway (Faizpur to Nankana Sahib)", "vis": 30, "speed": 95, "alert": "Chemical Dew Pocket", "status": "danger"},
    {"name": "Lahore Ring Road (L-20 Northern Loop)", "vis": 55, "speed": 85, "alert": "Moderate Smog", "status": "safe"}
]

# Compute for top active route
active_route = CORRIDOR_LIST[0]
calc = compute_highway_safety(active_route['speed'], active_route['vis'])

# ==============================================================================
# 2. TOP NAVBAR (FIGMA EXACT DESIGN)
# ==============================================================================

html(f"""
<div class="figma-navbar">
    <div class="figma-logo">
        <svg width="34" height="36" viewBox="0 0 35 37" fill="none" style="vertical-align: middle;">
            <path d="M17.5 2 32 8v13c0 7-14.5 14-14.5 14S3 28 3 21V8L17.5 2Z" stroke="#007A87" stroke-width="2.6" stroke-linejoin="round" />
            <path d="m13 12-4 14m13-14 4 14M17.5 12v5m0 4v5" stroke="#007A87" stroke-width="2.6" stroke-linecap="round" />
        </svg>
        <div style="line-height: 1; margin-left: 6px;">
            <div style="font-size: 24px; font-weight: 500; letter-spacing: -0.6px; color: #0F172A;">
                Safar<span style="font-weight: 900;">Guard</span>
            </div>
            <div style="font-family: 'Fira Code', monospace; font-size: 7px; font-weight: 700; color: #0F172A; letter-spacing: 0.22em; margin-top: 3px;">
                HIGHWAY INTELLIGENCE
            </div>
        </div>
    </div>
    
    <div class="nav-links">
        <a href="#corridors">Active Corridors</a>
        <a href="#calculator">Stopping Distance Math</a>
        <a href="#figma-live">Figma Design Canvas</a>
        <a href="http://localhost:5173" target="_blank" class="btn-react-launch">⚡ Open 5-Screen React App ↗</a>
    </div>

    <div>
        <span style="font-size: 11px; font-weight: 800; color: #10B981; background: #ECFDF5; border: 1px solid #10B981; padding: 6px 14px; border-radius: 20px;">
            ● NHMP & RESCUE 1122 LIVE
        </span>
    </div>
</div>
""")

# ==============================================================================
# 3. HERO SECTION ("DON'T OUTDRIVE WHAT YOU CAN SEE.")
# ==============================================================================

html(f"""
<div class="hero-container">
    <div>
        <div class="hero-tagline">
            <span>● PROVINCIAL HIGHWAY SAFETY</span> • CENTRAL PUNJAB
        </div>
        <h1 class="hero-h1">
            Don't outdrive<br>what you<br><span>can see.</span>
        </h1>
        <p class="hero-desc">
            Standard headlights bounce off aerosol soot, while morning dew creates a greasy chemical slick. 
            SafarGuard combines AASHTO Stopping Sight Distance (SSD) physics with Google DeepMind Gemma 4 to enforce dynamic safe speed limits before multi-vehicle collisions occur.
        </p>
        <div style="display: flex; gap: 14px; align-items: center;">
            <a href="#corridors" style="text-decoration: none;">
                <button class="cta-btn-dark">
                    Explore Highway Corridors →
                </button>
            </a>
            <span style="font-size: 13px; color: #64748B; font-weight: 600;">Updated every 5 mins</span>
        </div>
    </div>

    <!-- Cinematic Fog Driving Card with HUD Overlay -->
    <div class="fog-hud-card">
        <div class="fog-image-wrapper">
            <div class="fog-overlay-gradient"></div>
            <div style="position: relative; z-index: 2; width: 100%; display: flex; justify-content: space-between;">
                <span style="background: rgba(15,23,42,0.85); color: #FFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; border: 1px solid #334155;">
                    M-2 BABU SABU • LIVE FEED
                </span>
                <span style="background: rgba(239,68,68,0.25); color: #EF4444; border: 1px solid #EF4444; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">
                    CRITICAL HAZARD
                </span>
            </div>
        </div>

        <div class="hud-card-footer">
            <div class="hud-col">
                <div class="hud-col-label">Visibility</div>
                <div class="hud-col-val" style="color: #06B6D4;">{active_route['vis']} m</div>
            </div>
            <div class="hud-col">
                <div class="hud-col-label">Crash Risk (CPI)</div>
                <div class="hud-col-val" style="color: #EF4444;">{calc['cpi']}</div>
            </div>
            <div class="hud-col">
                <div class="hud-col-label">Safe Speed Cap</div>
                <div class="hud-col-val" style="color: #10B981;">{calc['v_safe_kmh']} <span style="font-size: 12px;">km/h</span></div>
            </div>
        </div>
    </div>
</div>
""")

# Spoken Roman Urdu Audio Beacon Bar
html("""
<div style="background: #090F1E; border-radius: 12px; padding: 14px 24px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #1E293B;">
    <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-size: 20px;">🔊</span>
        <div>
            <div style="font-size: 11px; font-weight: 800; color: #38BDF8; text-transform: uppercase;">Real-Time Roman Urdu Audio Warning:</div>
            <div style="font-size: 14px; font-weight: 600; color: #FFFFFF;">"Khatra Shadeed Hai! Motorway par greasy chemical dew ki wajah se break nahi lagegi. Raftaar foran 35 km/h karein!"</div>
        </div>
    </div>
    <button onclick="
        var msg = new SpeechSynthesisUtterance('Khatra Shadeed Hai! Motorway par greasy chemical dew ki wajah se break nahi lagegi. Raftaar foran penty-saath par le aayein!');
        msg.lang = 'hi-IN';
        window.speechSynthesis.speak(msg);
    " style="background: #2563EB; color: #FFF; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
        Play Urdu Audio
    </button>
</div>
""")

# Authority Bar
html("""
<div class="authority-bar">
    <span>● NHMP Motorway Police SOPs</span>
    <span>● Punjab Rescue 1122 Incident Data</span>
    <span>● AASHTO Road Design Physics</span>
    <span>● Google DeepMind Gemma 4</span>
</div>
""")

# ==============================================================================
# 4. "PLAN THE ROAD" CORRIDORS SECTION (FIGMA MATCHING TABLE)
# ==============================================================================

corridors_html = """
<div id="corridors" class="corridors-section">
    <div class="section-header-row">
        <div>
            <div style="font-size: 12px; font-weight: 800; color: #0891B2; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                REAL-TIME ACCIDENT RISK MATRIX
            </div>
            <div class="section-h2">Plan The Road.</div>
        </div>
        <div style="font-size: 13px; color: #64748B; font-weight: 600;">
            Showing 5 high-density Punjab winter smog corridors
        </div>
    </div>
"""

for route in CORRIDOR_LIST:
    r_calc = compute_highway_safety(route['speed'], route['vis'])
    badge_class = "badge-pill-danger" if route['status'] == "danger" else ("badge-pill-warning" if route['status'] == "warning" else "badge-pill-safe")
    corridors_html += f"""
    <div class="corridor-table-row">
        <div class="c-name-col">
            <div>{route['name']}</div>
            <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-top: 2px;">Hazard Note: {route['alert']}</div>
        </div>
        <div class="c-vis-col" style="color: {'#EF4444' if route['vis'] < 30 else '#F59E0B'};">
            {route['vis']} m
            <div style="font-size: 10px; color: #94A3B8; font-weight: 600;">VISIBILITY</div>
        </div>
        <div class="c-cap-col">
            Safe Cap: <b style="color: #0891B2;">{r_calc['v_safe_kmh']} km/h</b>
            <div style="font-size: 10px; color: #94A3B8;">NORMAL LIMIT: 120 KM/H</div>
        </div>
        <div class="c-badge-col">
            <span class="{badge_class}">CPI {r_calc['cpi']} • {route['alert']}</span>
        </div>
    </div>
    """

corridors_html += "</div>"
html(corridors_html)

# ==============================================================================
# 5. LIVE FIGMA PROTOTYPE EMBED PLAYER
# ==============================================================================

html("""
<div id="figma-live" class="corridors-section">
    <div class="section-header-row">
        <div>
            <div style="font-size: 12px; font-weight: 800; color: #0891B2; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                OFFICIAL FIGMA BUILD • 5 INTERACTIVE SCREENS
            </div>
            <div class="section-h2">Live React Prototype Canvas</div>
        </div>
        <div style="display: flex; gap: 10px;">
            <a href="http://localhost:5173" target="_blank" style="text-decoration: none;">
                <button class="cta-btn-dark" style="padding: 8px 16px; font-size: 12px; background: #0891B2;">
                    ⚡ Open Dedicated App Tab ↗
                </button>
            </a>
            <a href="https://www.figma.com/make/LAayoQseOKZenxbvkMGEL4/Design-SafarGuard-Landing-Page?t=2MtCHGPp0yhUIwJj-1&preview-route=%2F%23corridors" target="_blank" style="text-decoration: none;">
                <button class="cta-btn-dark" style="padding: 8px 16px; font-size: 12px;">
                    🎨 View in Figma ↗
                </button>
            </a>
        </div>
    </div>
</div>
""")

# Embed the live running React Figma app locally
st.components.v1.iframe("http://localhost:5173", height=780, scrolling=True)

# ==============================================================================
# 6. STOPPING DISTANCE SIMULATOR & GEMMA 4 VISION (EXPANDABLE)
# ==============================================================================

html("""
<div id="calculator" class="corridors-section">
    <div class="section-h2" style="margin-bottom: 14px;">Stopping Distance Physics Simulator</div>
    <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">Adjust vehicle speed to visualize the deadly braking gap between dry asphalt and greasy smog dew.</p>
</div>
""")

col_s1, col_s2 = st.columns([1, 1.2])
with col_s1:
    speed_sim = st.slider("Simulate Vehicle Speed (km/h)", 20, 140, 90)
    vis_sim = st.slider("Simulate Visibility Horizon (m)", 10, 150, 28)
    sim_res = compute_highway_safety(speed_sim, vis_sim)
    
    html(f"""
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-top: 14px;">
        <div style="font-size: 12px; color: #64748B; font-weight: 700;">CALCULATED STOPPING DISTANCE:</div>
        <div style="font-family: 'Fira Code', monospace; font-size: 32px; font-weight: 800; color: #EF4444;">{sim_res['ssd_m']} meters</div>
        <div style="font-size: 12px; color: #0891B2; margin-top: 6px;">Safe Speed Ceiling: <b>{sim_res['v_safe_kmh']} km/h</b></div>
        <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Crash Probability Index: <b>{sim_res['cpi']}</b></div>
    </div>
    """)

with col_s2:
    speeds_arr = np.arange(20, 130, 5)
    g = 9.80665
    ssd_dry = [(s*(5/18)*1.5) + ((s*(5/18))**2)/(2*g*0.70) for s in speeds_arr]
    ssd_smog = [(s*(5/18)*2.85) + ((s*(5/18))**2)/(2*g*0.28) for s in speeds_arr]
    
    chart_data = pd.DataFrame({
        "Speed (km/h)": speeds_arr,
        "Dry Road (f=0.70)": np.round(ssd_dry, 1),
        "Chemical Smog Slick (f=0.28)": np.round(ssd_smog, 1),
        f"Visible Horizon ({vis_sim}m)": [vis_sim]*len(speeds_arr)
    }).set_index("Speed (km/h)")
    st.line_chart(chart_data, use_container_width=True)

# Footer
html("""
<div style="text-align: center; font-size: 13px; color: #94A3B8; padding: 40px 0; border-top: 1px solid #E2E8F0; margin-top: 40px;">
    <b>SafarGuard Platform</b> — 1:1 Implementation of Figma AI System.<br/>
    Built for Hacktoberfest Hack Day Lahore 2026 by <b>Javeria Farhan</b>.<br/>
    Open Source MIT License | Google DeepMind Gemma 4 Track | DigitalOcean Open-Source AI Track
</div>
""")
