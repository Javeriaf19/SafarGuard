import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette matching website
    C_BG = RGBColor(248, 250, 252)        # #F8FAFC
    C_TEXT = RGBColor(15, 23, 42)         # #0F172A
    C_MUTED = RGBColor(100, 116, 139)     # #64748B
    C_TEAL = RGBColor(0, 122, 135)        # #007A87
    C_RED = RGBColor(239, 68, 68)         # #EF4444
    C_AMBER = RGBColor(245, 158, 11)      # #F59E0B
    C_GREEN = RGBColor(16, 185, 129)      # #10B981
    C_CARD_BG = RGBColor(255, 255, 255)   # #FFFFFF
    C_DARK = RGBColor(9, 15, 30)          # #090F1E
    C_BORDER = RGBColor(226, 232, 240)    # #E2E8F0

    img_dir = os.path.join(os.path.dirname(__file__), "slides", "images")
    fog_img = os.path.join(img_dir, "fog-collision.jpg")

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

    def add_header(slide):
        # Header Brand
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(6), Inches(0.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = "SafarGuard  |  HIGHWAY INTELLIGENCE"
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_TEAL

        # Header Track Badges
        tb2 = slide.shapes.add_textbox(Inches(7.5), Inches(0.35), Inches(5), Inches(0.6))
        tf2 = tb2.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.alignment = PP_ALIGN.RIGHT
        p2.text = "GOOGLE DEEPMIND • GEMMA 4   |   DIGITALOCEAN OPEN SOURCE"
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 1: REAL ACCIDENT HOOK
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_background(s1)
    add_header(s1)

    # Left Copy
    tb1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(6.8), Inches(5.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "● PROVINCIAL HIGHWAY SAFETY • CENTRAL PUNJAB"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_RED

    p = tf1.add_paragraph()
    p.text = "THE WINTER\nDEATH TRAP."
    p.font.name = "Arial"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = tf1.add_paragraph()
    p.text = "\nEvery winter, dense smog paralyzes the M-2, M-11, and GT Road.\n" \
             "Conventional apps treat smog merely as an air quality issue.\n" \
             "Drivers continue cruising at 100 km/h until blinding whiteout glare and a greasy chemical dew slick turn the highway into fatal multi-vehicle pileups."
    p.font.name = "Calibri"
    p.font.size = Pt(15)
    p.font.color.rgb = C_MUTED

    p = tf1.add_paragraph()
    p.text = "\nPresenter: Javeria Farhan  •  Hacktoberfest Hack Day Lahore 2026"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    # Right Image
    if os.path.exists(fog_img):
        s1.shapes.add_picture(fog_img, Inches(7.8), Inches(1.4), Inches(4.7), Inches(5.0))

    # =========================================================================
    # SLIDE 2: EMPIRICAL DATASETS & GRAPHS
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_background(s2)
    add_header(s2)

    tb2 = s2.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(0.8))
    tf2 = tb2.text_frame
    p = tf2.paragraphs[0]
    p.text = "REAL-TIME ACCIDENT RISK MATRIX  —  THE GROUND REALITY"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf2.add_paragraph()
    p.text = "Punjab Rescue 1122 Highway Dispatch Benchmarks"
    p.font.name = "Arial"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    # 3 Stat Cards on Left
    stats = [
        ("+34.8%", "Winter Collision Dispatch Surge", "Rescue 1122 emergency dispatches surge on M-2 & GT Road (Nov - Feb)", C_RED),
        ("0.28 f", "Chemical Dew Friction Collapse", "Aerosol soot + 90% humidity collapses road friction from 0.70 to 0.28", C_AMBER),
        ("2.85 s", "Driver Perception Delay", "Aerosol optical particle scattering expands driver reaction lag by over 80%", C_TEAL),
    ]

    for i, (num, title, desc, color) in enumerate(stats):
        top_pos = Inches(2.2 + (i * 1.5))
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_pos, Inches(5.6), Inches(1.3))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_BORDER

        ctb = s2.shapes.add_textbox(Inches(1.0), top_pos + Inches(0.1), Inches(5.2), Inches(1.1))
        ctf = ctb.text_frame
        ctf.word_wrap = True
        p = ctf.paragraphs[0]
        p.text = f"{num}   —   {title}"
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        p = ctf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED

    # Table on Right: Stopping Distance Expansion
    tb_table = s2.shapes.add_table(6, 3, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.3))
    table = tb_table.table
    table.columns[0].width = Inches(1.8)
    table.columns[1].width = Inches(1.9)
    table.columns[2].width = Inches(2.0)

    headers = ["Speed", "Dry Asphalt (f=0.70)", "Smog Slick (f=0.28)"]
    for col_idx, h in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)

    data_rows = [
        ("40 km/h", "26 meters", "48 meters  (+84%)"),
        ("60 km/h", "45 meters", "91 meters  (+102%)"),
        ("80 km/h", "69 meters", "147 meters (+113%)"),
        ("100 km/h", "98 meters", "216 meters (+120%)"),
        ("120 km/h", "131 meters", "297 meters (+126%)")
    ]
    for row_idx, r in enumerate(data_rows):
        for col_idx, val in enumerate(r):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_CARD_BG if row_idx % 2 == 0 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Calibri"
            p.font.size = Pt(12)
            p.font.bold = (col_idx == 2)
            p.font.color.rgb = C_RED if col_idx == 2 else (C_GREEN if col_idx == 1 else C_TEXT)

    # =========================================================================
    # SLIDE 3: SCIENCE & GEMMA 4
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_background(s3)
    add_header(s3)

    tb3 = s3.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(0.8))
    tf3 = tb3.text_frame
    p = tf3.paragraphs[0]
    p.text = "HIGHWAY SAFETY MATHEMATICS  —  DETERMINISTIC PHYSICS & AI"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf3.add_paragraph()
    p.text = "AASHTO Stopping Sight Distance + Google DeepMind Gemma 4"
    p.font.name = "Arial"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    # Left Box: Formulas
    f_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5))
    f_card.fill.solid()
    f_card.fill.fore_color.rgb = C_CARD_BG
    f_card.line.color.rgb = C_BORDER

    ftb = s3.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(5.0), Inches(4.1))
    ftf = ftb.text_frame
    ftf.word_wrap = True

    p = ftf.paragraphs[0]
    p.text = "AASHTO Stopping Sight Distance (SSD):"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = ftf.add_paragraph()
    p.text = "SSD = (v · tr) + [ v² / (2 · g · f) ]"
    p.font.name = "Arial"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = ftf.add_paragraph()
    p.text = "• v = velocity (m/s)  • tr = perception lag (2.85s in smog)\n• f = friction coefficient (0.28 on chemical dew)\n• Crash Probability Index: CPI = SSD / Visibility (Safe: < 1.0)\n\n" \
             "Quadratic Safe Speed Solver:\n" \
             "v_safe = [ -b + √(b² + 4ac) ] / 2a\n\n" \
             "Dynamically calculates the exact speed cap where vehicle stopping distance never exceeds visible road boundary."
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    # Right Box: Gemma 4 AI Vision
    g_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5))
    g_card.fill.solid()
    g_card.fill.fore_color.rgb = C_DARK
    g_card.line.color.rgb = RGBColor(30, 41, 59)

    gtb = s3.shapes.add_textbox(Inches(7.1), Inches(2.4), Inches(5.1), Inches(4.1))
    gtf = gtb.text_frame
    gtf.word_wrap = True

    p = gtf.paragraphs[0]
    p.text = "GOOGLE DEEPMIND AI ENGINE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(56, 189, 248)

    p = gtf.add_paragraph()
    p.text = "Gemma 4 Multimodal Vision"
    p.font.name = "Arial"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    p = gtf.add_paragraph()
    p.text = "\nAudits forward dashcam camera frames in real-time:\n\n" \
             "1. Glare & Backscatter Audit:\n" \
             "Detects blinding high-beam reflection bouncing off aerosol soot.\n\n" \
             "2. Low-Contrast Obstacle Alert:\n" \
             "Identifies unlit sugarcane tractor-trolleys and broken-down buses.\n\n" \
             "3. Roman Urdu Audio Beacons:\n" \
             "Synthesizes direct spoken voice warnings tailored for Pakistani drivers."
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # =========================================================================
    # SLIDE 4: MULTI-INTERFACE ARCHITECTURE (NO FIGMA MENTION)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_background(s4)
    add_header(s4)

    tb4 = s4.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(0.8))
    tf4 = tb4.text_frame
    p = tf4.paragraphs[0]
    p.text = "MULTI-INTERFACE SYSTEM ARCHITECTURE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf4.add_paragraph()
    p.text = "\"Don't Outdrive What You Can See.\""
    p.font.name = "Arial"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    screens = [
        ("SCREEN 01", "Corridor Monitor", "Live risk table across 5 Punjab corridors (M-2, M-11, N-5, Ring Road, M-4) with sensor tracking and dynamic safe speed caps."),
        ("SCREEN 02", "Careem / In-Ride HUD", "Dedicated mobile companion for Careem, InDrive, and Uber drivers with live GPS map, hazard pins, and non-distracting audio alerts."),
        ("SCREEN 03", "Police Command Console", "Control room console for Motorway Police (NHMP) and Rescue 1122 with geohash cluster maps and emergency broadcast controls."),
        ("SCREEN 04", "Night HUD Cockpit", "Pitch-black OLED cockpit mode with big contrast speedometer, CPI danger dial, and one-tap Roman Urdu audio beacon."),
        ("SCREEN 05", "Stopping Simulator", "Interactive dynamic road diagram showing real-time collision gaps between reaction time, braking distance, and visibility."),
        ("SYSTEM SPEC", "Automotive Telematics", "Barlow & Fira Code typography, automotive ISO safety colors, 100% WCAG AAA night contrast ratios for zero glare.")
    ]

    for i, (tag, title, desc) in enumerate(screens):
        col = i % 3
        row = i // 3
        left = Inches(0.8 + (col * 3.9))
        top = Inches(2.2 + (row * 2.3))

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = C_BORDER

        stb = s4.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), Inches(3.3), Inches(1.8))
        stf = stb.text_frame
        stf.word_wrap = True

        p = stf.paragraphs[0]
        p.text = tag
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_TEAL

        p = stf.add_paragraph()
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_TEXT

        p = stf.add_paragraph()
        p.text = desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 5: LIVE AUDIO BEACON & DEMO
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_background(s5)
    add_header(s5)

    tb5 = s5.shapes.add_textbox(Inches(1.5), Inches(1.3), Inches(10.3), Inches(1.2))
    tf5 = tb5.text_frame
    tf5.word_wrap = True
    p = tf5.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "ACOUSTIC SAFETY BEACON"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf5.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "Urgent Roman Urdu Audio Warning"
    p.font.name = "Arial"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = tf5.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "Drivers in zero-visibility fog cannot look down at phone screens.\nSafarGuard speaks directly to them in urgent, clear Roman Urdu:"
    p.font.name = "Calibri"
    p.font.size = Pt(14)
    p.font.color.rgb = C_MUTED

    # Center Dark Box with Roman Urdu Quote
    abox = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(3.2), Inches(8.9), Inches(2.4))
    abox.fill.solid()
    abox.fill.fore_color.rgb = C_DARK
    abox.line.color.rgb = RGBColor(30, 41, 59)

    atb = s5.shapes.add_textbox(Inches(2.5), Inches(3.5), Inches(8.3), Inches(1.8))
    atf = atb.text_frame
    atf.word_wrap = True
    p = atf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "🔊 \"Khatra shadeed hai! Motorway par greasy chemical dew ki wajah se break nahi lagegi. Raftaar foran 35 km/h karein!\""
    p.font.name = "Arial"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    p = atf.add_paragraph()
    p.alignment = PP_ALIGN.CENTER
    p.text = "\n[Live Browser Speech Synthesis & Google Gemma 4 Audio Guidance]"
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(56, 189, 248)

    # Links footer
    tb_links = s5.shapes.add_textbox(Inches(2.2), Inches(6.0), Inches(8.9), Inches(0.8))
    tfl = tb_links.text_frame
    p = tfl.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Live Web App: http://localhost:5173  |  AI & Physics Dashboard: http://localhost:8501"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    # =========================================================================
    # SLIDE 6: ENGINEERING ARCHITECTURE & OPEN STANDARDS
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_background(s6)
    add_header(s6)

    tb6 = s6.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(0.8))
    tf6 = tb6.text_frame
    p = tf6.paragraphs[0]
    p.text = "ENGINEERING & OPEN TELEMETRY"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf6.add_paragraph()
    p.text = "Core Architecture & Standardized Tooling"
    p.font.name = "Arial"
    p.font.size = Pt(26)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    # Left Track: Gemma 4
    t1 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.5))
    t1.fill.solid()
    t1.fill.fore_color.rgb = C_CARD_BG
    t1.line.color.rgb = C_TEAL

    tb_t1 = s6.shapes.add_textbox(Inches(1.1), Inches(2.5), Inches(5.0), Inches(3.9))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True
    p = tf_t1.paragraphs[0]
    p.text = "COMPUTER VISION ENGINE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf_t1.add_paragraph()
    p.text = "Google Gemma 4 Pipeline"
    p.font.name = "Arial"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = tf_t1.add_paragraph()
    p.text = "\n• Multimodal Frame Inspection: Continuous windshield dashcam stream analysis via Google DeepMind Gemma 4.\n" \
             "• Hazard Classification: Identifies low-contrast unlit sugarcane trolleys, broken-down buses, and high-beam aerosol backscatter.\n" \
             "• Edge & Cloud Dual-Mode: Cloud Gemini API speed with local edge inference fallback for zero-connectivity highway stretches.\n\n" \
             "✔ Standardized REST & Web Speech Synthesis Architecture"
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    # Right Track: DigitalOcean Open Standards
    t2 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5))
    t2.fill.solid()
    t2.fill.fore_color.rgb = C_CARD_BG
    t2.line.color.rgb = C_GREEN

    tb_t2 = s6.shapes.add_textbox(Inches(7.1), Inches(2.5), Inches(5.1), Inches(3.9))
    tf_t2 = tb_t2.text_frame
    tf_t2.word_wrap = True
    p = tf_t2.paragraphs[0]
    p.text = "OPEN STANDARDS & REPRODUCIBILITY"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GREEN

    p = tf_t2.add_paragraph()
    p.text = "Agent Skill Standard & Data"
    p.font.name = "Arial"
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = tf_t2.add_paragraph()
    p.text = "\n• Permissive Open Source: 100% MIT Licensed for public safety adoption.\n" \
             "• Agent Skill Open Standard (SKILL.md): Fully formatted so autonomous AI agents can invoke SafarGuard telemetry as an automated safety tool.\n" \
             "• Empirical Foundation: Integrated Punjab Rescue 1122 dispatch logs and NHMP motorway closure criteria.\n\n" \
             "✔ Zero Vendor Lock-in & Clean Modular Codebase"
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 7: THE VISION & OPEN-SOURCE ROADMAP (CTA)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_background(s7)
    add_header(s7)

    tb7 = s7.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.7), Inches(0.9))
    tf7 = tb7.text_frame
    p = tf7.paragraphs[0]
    p.text = "OPEN-SOURCE ROADMAP & CALL TO ACTION"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_TEAL

    p = tf7.add_paragraph()
    p.text = "A Federated National Safety Grid: Scaling to Save Lives"
    p.font.name = "Arial"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p = tf7.add_paragraph()
    p.text = "Zero preventable highway collision deaths is the only acceptable metric. Smog doesn't stop at provincial borders—and neither should intelligent highway safety."
    p.font.name = "Calibri"
    p.font.size = Pt(12)
    p.font.color.rgb = C_MUTED

    pillars = [
        ("01. MULTI-CITY EXPANSION", "Beyond Central Punjab",
         "Expanding corridor telemetry and dynamic speed modeling to:\n\n"
         "• Karachi Port Corridors: Dense coastal morning sea-fog and heavy container freight.\n"
         "• Khyber Pakhtunkhwa (M-1): Mountain winter fog and sudden elevation visibility drops.\n"
         "• South Punjab & Sindh (M-5): Multan-Sukkur high-speed freight logistics spine.", C_TEAL),

        ("02. FLEET INTEGRATION", "Crowdsourced Telematics",
         "Partnering with intercity transport and courier fleets:\n\n"
         "• Live Ingestion: Connect dashcam optical feeds from Daewoo, Faisal Movers, and TCS logistics.\n"
         "• Cabin Audio Alerts: Deliver audible Roman Urdu speed cap alerts directly into bus and truck cabins.\n"
         "• Peer-to-Peer Mesh: Vehicles share localized friction slick alerts.", C_AMBER),

        ("03. OPEN SOURCE CTA", "Contribute & Save Lives",
         "SafarGuard is an open platform for developers, researchers, and road safety authorities:\n\n"
         "• Add Your City: Contribute local highway coordinate nodes.\n"
         "• Improve Models: Train localized vision models on regional fog datasets.\n"
         "• Integrate Services: Connect with provincial 1122 & NHMP dispatch desks.\n\n"
         "⭐ Star, Fork & Contribute:\ngithub.com/javeriafarhan/SafarGuard", C_GREEN)
    ]

    for i, (tag, title, desc, col_accent) in enumerate(pillars):
        left = Inches(0.8 + (i * 3.9))
        top = Inches(2.3)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG if i < 2 else C_DARK
        card.line.color.rgb = col_accent

        ctb = s7.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), Inches(3.3), Inches(4.1))
        ctf = ctb.text_frame
        ctf.word_wrap = True

        p = ctf.paragraphs[0]
        p.text = tag
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = col_accent

        p = ctf.add_paragraph()
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255) if i == 2 else C_TEXT

        p = ctf.add_paragraph()
        p.text = "\n" + desc
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(203, 213, 225) if i == 2 else C_MUTED

    out_path = os.path.join(os.path.dirname(__file__), "slides", "SafarGuard_Master_Pitch_Deck.pptx")
    prs.save(out_path)
    print(f"PowerPoint Presentation successfully saved to: {out_path}")

if __name__ == "__main__":
    create_presentation()
