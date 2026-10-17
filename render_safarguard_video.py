#!/usr/bin/env python3
"""
SafarGuard — Cinematic Documentary Video Renderer
Generates a ~90s MP4 with 6 phases:
  Phase 1: The Dark Highway & Looming Crash (0:00-0:28)
  Phase 2: Ground Reality News Montage (0:28-0:45)
  Phase 3: The Invisible Physics (0:45-1:05)
  Phase 4: The Solution — SafarGuard (1:05-1:25)
  Phase 5: Tech Architecture (1:25-1:35)
  Phase 6: Open Source & Closing (1:35-1:50)

Uses: Pillow + NumPy for frames, piped to FFmpeg for MP4.
Author: Javeria Farhan / BrightBench Labs
"""

import subprocess, struct, math, random, os, sys, time
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ─── Configuration ───────────────────────────────────────────────────────
W, H = 1920, 1080
FPS = 30
TOTAL_DURATION = 90  # seconds
TOTAL_FRAMES = FPS * TOTAL_DURATION

FFMPEG = r"C:\Users\Javeria\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
OUTPUT = r"C:\Users\Javeria\Downloads\SafarGuard_Documentary.mp4"
ASSETS = r"G:\SafeGuard\video_assets"

# Colors (SafarGuard brand)
NAVY = (14, 23, 38)         # #0E1726
TEAL = (26, 139, 127)       # #1A8B7F
RED_ALERT = (220, 50, 50)   # #DC3232
AMBER = (255, 180, 30)      # #FFB41E
WHITE = (255, 255, 255)
LIGHT_GREY = (200, 200, 200)
DARK_GREY = (40, 40, 40)
BLACK = (0, 0, 0)
PALE_TEAL = (180, 230, 225)

# Phase timing (frame ranges)
P1_START, P1_END = 0, 28 * FPS                 # 0-28s
P2_START, P2_END = 28 * FPS, 45 * FPS          # 28-45s  
P3_START, P3_END = 45 * FPS, 65 * FPS          # 45-65s
P4_START, P4_END = 65 * FPS, 80 * FPS          # 65-80s
P5_START, P5_END = 80 * FPS, 85 * FPS          # 80-85s
P6_START, P6_END = 85 * FPS, 90 * FPS          # 85-90s

# ─── Load Assets ─────────────────────────────────────────────────────────
print("Loading image assets...", flush=True)

def load_img(name):
    for ext in ['.jpg', '.png']:
        p = os.path.join(ASSETS, name + ext)
        if os.path.exists(p):
            img = Image.open(p).convert('RGB')
            img = img.resize((W, H), Image.LANCZOS)
            return np.array(img)
    print(f"  WARNING: Asset not found: {name}", flush=True)
    return np.zeros((H, W, 3), dtype=np.uint8)

IMG_FOGGY = load_img('foggy_motorway_pov')
IMG_DRIVER = load_img('driver_silhouette')
IMG_TRACTOR = load_img('tractor_obstacle')
IMG_CRASH = load_img('crash_aftermath')
IMG_FOG_COLLISION = load_img('fog_collision')
IMG_WET_MOTORWAY = load_img('wet_motorway')
IMG_SMOG = load_img('smog_highway')
IMG_HUD = load_img('safarguard_hud')
IMG_SHIELD = load_img('luminous_shield')

# Load logo as RGBA for compositing
logo_path = os.path.join(ASSETS, 'logo.png')
if os.path.exists(logo_path):
    LOGO_IMG = Image.open(logo_path).convert('RGBA')
else:
    LOGO_IMG = None

print("Assets loaded.", flush=True)

# ─── Font Helper ─────────────────────────────────────────────────────────
def get_font(size, bold=False):
    """Try system fonts, fall back to default."""
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for f in candidates:
        if os.path.exists(f):
            try:
                return ImageFont.truetype(f, size)
            except:
                pass
    return ImageFont.load_default()

FONT_HUGE = get_font(72, bold=True)
FONT_LARGE = get_font(52, bold=True)
FONT_MED = get_font(36, bold=True)
FONT_SMALL = get_font(28)
FONT_TINY = get_font(20)
FONT_TITLE = get_font(64, bold=True)
FONT_SUBTITLE = get_font(40)
FONT_STAT = get_font(80, bold=True)

# ─── Audio Synthesis ─────────────────────────────────────────────────────
SR = 44100
AUDIO_SAMPLES = SR * TOTAL_DURATION

print("Synthesizing audio...", flush=True)

def make_audio():
    """Create the entire audio track."""
    t = np.linspace(0, TOTAL_DURATION, AUDIO_SAMPLES, dtype=np.float32)
    audio = np.zeros(AUDIO_SAMPLES, dtype=np.float32)
    
    # 1. Dark ambient drone (Phase 1: 0-28s)
    drone = np.sin(2 * np.pi * 55 * t) * 0.08  # Low A1
    drone += np.sin(2 * np.pi * 82.5 * t) * 0.04  # E2
    drone += np.sin(2 * np.pi * 41.25 * t) * 0.06  # Sub bass
    # Fade drone in/out for Phase 1
    drone_env = np.zeros_like(t)
    mask1 = t < 28
    drone_env[mask1] = 1.0
    drone_env[(t >= 26) & (t < 28)] = np.linspace(1, 0, np.sum((t >= 26) & (t < 28)))
    drone *= drone_env
    audio += drone
    
    # 2. Heartbeat pulses (Phase 1, every 1.2s)
    for beat_t in np.arange(5, 28, 1.2):
        idx = int(beat_t * SR)
        beat_len = int(0.15 * SR)
        if idx + beat_len < AUDIO_SAMPLES:
            bt = np.linspace(0, 0.15, beat_len)
            pulse = np.sin(2 * np.pi * 60 * bt) * np.exp(-bt * 20) * 0.15
            audio[idx:idx+beat_len] += pulse
    
    # 3. Tire screech at 22s
    screech_start = int(22 * SR)
    screech_len = int(1.5 * SR)
    if screech_start + screech_len < AUDIO_SAMPLES:
        st = np.linspace(0, 1.5, screech_len)
        screech = np.random.randn(screech_len) * 0.12
        screech *= np.exp(-st * 2)
        # High-pass filter approximation
        screech = np.diff(np.concatenate([[0], screech]))
        audio[screech_start:screech_start+screech_len] += screech
    
    # 4. Impact boom at 23.5s
    boom_start = int(23.5 * SR)
    boom_len = int(1.0 * SR)
    if boom_start + boom_len < AUDIO_SAMPLES:
        bt = np.linspace(0, 1.0, boom_len)
        boom = np.sin(2 * np.pi * 35 * bt) * np.exp(-bt * 4) * 0.25
        audio[boom_start:boom_start+boom_len] += boom
    
    # 5. News pulse rhythm (Phase 2: 28-45s, rapid clicking/ticking)
    for tick_t in np.arange(28, 45, 0.3):
        idx = int(tick_t * SR)
        tick_len = int(0.05 * SR)
        if idx + tick_len < AUDIO_SAMPLES:
            tt = np.linspace(0, 0.05, tick_len)
            tick = np.sin(2 * np.pi * 1200 * tt) * np.exp(-tt * 80) * 0.08
            audio[idx:idx+tick_len] += tick
    
    # 6. Glitch whooshes for Phase 2 transitions
    for whoosh_t in [29, 31, 33, 35, 37, 39, 41, 43]:
        idx = int(whoosh_t * SR)
        wlen = int(0.4 * SR)
        if idx + wlen < AUDIO_SAMPLES:
            wt = np.linspace(0, 0.4, wlen)
            whoosh = np.sin(2 * np.pi * (200 + 2000 * wt) * wt) * np.exp(-wt * 5) * 0.1
            audio[idx:idx+wlen] += whoosh
    
    # 7. Tech synth pad (Phase 3-6: 45-90s)
    synth_env = np.zeros_like(t)
    mask3 = (t >= 45) & (t < 88)
    synth_env[mask3] = 1.0
    synth_env[(t >= 44) & (t < 45)] = np.linspace(0, 1, np.sum((t >= 44) & (t < 45)))
    synth_env[(t >= 88) & (t < 90)] = np.linspace(1, 0, np.sum((t >= 88) & (t < 90)))
    synth = np.sin(2 * np.pi * 110 * t) * 0.04  # A2
    synth += np.sin(2 * np.pi * 164.81 * t) * 0.03  # E3
    synth += np.sin(2 * np.pi * 220 * t) * 0.02  # A3
    synth *= synth_env
    audio += synth
    
    # 8. Alert chimes for Phase 3 (stats pop)
    for chime_t in [47, 49, 51, 53, 55, 58, 61]:
        idx = int(chime_t * SR)
        clen = int(0.3 * SR)
        if idx + clen < AUDIO_SAMPLES:
            ct = np.linspace(0, 0.3, clen)
            chime = np.sin(2 * np.pi * 880 * ct) * np.exp(-ct * 10) * 0.08
            chime += np.sin(2 * np.pi * 1320 * ct) * np.exp(-ct * 12) * 0.04
            audio[idx:idx+clen] += chime
    
    # 9. Satisfying click for Phase 4 (app reveal)
    for click_t in [66, 68, 70, 73]:
        idx = int(click_t * SR)
        click_len = int(0.08 * SR)
        if idx + click_len < AUDIO_SAMPLES:
            ct = np.linspace(0, 0.08, click_len)
            click = np.sin(2 * np.pi * 2000 * ct) * np.exp(-ct * 50) * 0.12
            audio[idx:idx+click_len] += click
    
    # 10. Rising shimmer for finale (Phase 6)
    shimmer_start = int(85 * SR)
    shimmer_len = int(5 * SR)
    if shimmer_start + shimmer_len < AUDIO_SAMPLES:
        st = np.linspace(0, 5, shimmer_len)
        shimmer = np.sin(2 * np.pi * (440 + 200 * st) * st) * 0.04
        shimmer += np.sin(2 * np.pi * (660 + 300 * st) * st) * 0.03
        shimmer *= np.minimum(st / 2, 1) * np.maximum(1 - (st - 4), 0.3)
        audio[shimmer_start:shimmer_start+shimmer_len] += shimmer
    
    # 11. Final boom at 87s
    final_boom = int(87 * SR)
    fb_len = int(2.0 * SR)
    if final_boom + fb_len < AUDIO_SAMPLES:
        bt = np.linspace(0, 2.0, fb_len)
        fb = np.sin(2 * np.pi * 30 * bt) * np.exp(-bt * 2) * 0.2
        audio[final_boom:final_boom+fb_len] += fb
    
    # Normalize
    peak = np.max(np.abs(audio))
    if peak > 0:
        audio = audio / peak * 0.85
    
    return audio

audio_data = make_audio()
print("Audio synthesized.", flush=True)

# ─── Frame Generation Functions ──────────────────────────────────────────

def ease_out_cubic(t):
    return 1 - (1 - t) ** 3

def ease_in_out(t):
    return t * t * (3 - 2 * t)

def lerp(a, b, t):
    return a + (b - a) * max(0, min(1, t))

def apply_camera(img_np, frame, duration, zoom_start=1.0, zoom_end=1.1, 
                 pan_x=0, pan_y=0):
    """Apply slow zoom + pan to image array."""
    t = frame / max(duration, 1)
    t = ease_in_out(t)
    zoom = lerp(zoom_start, zoom_end, t)
    
    h, w = img_np.shape[:2]
    new_w = int(w / zoom)
    new_h = int(h / zoom)
    
    cx = w // 2 + int(pan_x * t)
    cy = h // 2 + int(pan_y * t)
    
    x1 = max(0, cx - new_w // 2)
    y1 = max(0, cy - new_h // 2)
    x2 = min(w, x1 + new_w)
    y2 = min(h, y1 + new_h)
    
    cropped = img_np[y1:y2, x1:x2]
    if cropped.shape[0] < 2 or cropped.shape[1] < 2:
        return img_np
    
    pil = Image.fromarray(cropped).resize((W, H), Image.BILINEAR)
    return np.array(pil)

# Precomputed vignette mask
_Y, _X = np.ogrid[:H, :W]
_cx, _cy = W / 2, H / 2
_dist = np.sqrt((_X - _cx)**2 / (_cx**2) + (_Y - _cy)**2 / (_cy**2))
_dist = np.clip(_dist, 0, 1.5)
VIGNETTE_MASK_04 = (np.clip(1.0 - 0.4 * _dist**1.5, 0, 1)[:, :, np.newaxis]).astype(np.float32)
VIGNETTE_MASK_05 = (np.clip(1.0 - 0.5 * _dist**1.5, 0, 1)[:, :, np.newaxis]).astype(np.float32)

# Precomputed film grain pool (16 static grain masks)
GRAIN_POOL = [np.random.randint(-12, 12, (H, W, 3), dtype=np.int16) for _ in range(16)]

def add_vignette(frame_np, strength=0.4):
    """Add dark vignette around edges using precomputed mask."""
    mask = VIGNETTE_MASK_05 if strength >= 0.45 else VIGNETTE_MASK_04
    result = frame_np.astype(np.float32) * mask
    return result.astype(np.uint8)

def add_film_grain(frame_np, amount=15):
    """Add subtle film grain fast from pool."""
    idx = random.randint(0, 15)
    result = frame_np.astype(np.int16) + GRAIN_POOL[idx]
    return np.clip(result, 0, 255).astype(np.uint8)

def color_grade_dark(frame_np, tint=(0.9, 0.95, 1.1)):
    """Apply dark, cold color grade."""
    result = frame_np.astype(np.float32)
    result[:, :, 0] *= tint[0]
    result[:, :, 1] *= tint[1]
    result[:, :, 2] *= tint[2]
    # Crush blacks slightly
    result = result * 0.85 + 10
    return np.clip(result, 0, 255).astype(np.uint8)

def draw_text_shadow(draw, pos, text, font, fill, shadow_color=(0,0,0), offset=3):
    """Draw text with shadow."""
    x, y = pos
    draw.text((x + offset, y + offset), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=fill)

def crossfade(img_a, img_b, t):
    """Crossfade between two numpy images."""
    t = max(0, min(1, t))
    return (img_a.astype(np.float32) * (1 - t) + img_b.astype(np.float32) * t).astype(np.uint8)

def glitch_effect(frame_np, intensity=0.3):
    """Add digital glitch effect."""
    result = frame_np.copy()
    h, w = result.shape[:2]
    num_slices = random.randint(3, 8)
    for _ in range(num_slices):
        y = random.randint(0, h - 20)
        slice_h = random.randint(5, 30)
        shift = random.randint(-int(w * intensity), int(w * intensity))
        if y + slice_h < h:
            slice_data = result[y:y+slice_h, :, :]
            result[y:y+slice_h, :, :] = np.roll(slice_data, shift, axis=1)
    # Color channel shift
    if random.random() > 0.5:
        ch_shift = random.randint(-10, 10)
        result[:, :, random.randint(0, 2)] = np.roll(
            result[:, :, random.randint(0, 2)], ch_shift, axis=1)
    return result

def draw_speed_counter(draw, speed, x, y, font):
    """Draw animated speedometer number."""
    text = f"{speed} km/h"
    draw_text_shadow(draw, (x, y), text, font, WHITE)

def draw_rounded_rect(draw, bbox, fill, radius=15, outline=None, width=2):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = bbox
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_stat_card(draw, x, y, w_card, h_card, label, value, color, alpha_t=1.0):
    """Draw a frosted stat card."""
    if alpha_t <= 0:
        return
    # Semi-transparent background
    draw_rounded_rect(draw, (x, y, x + w_card, y + h_card), 
                      fill=(20, 30, 50), outline=color, width=3)
    draw_text_shadow(draw, (x + 20, y + 15), label, FONT_SMALL, LIGHT_GREY)
    draw_text_shadow(draw, (x + 20, y + 50), value, FONT_LARGE, color)

def draw_progress_bar(draw, x, y, w_bar, h_bar, progress, color, bg=(40, 40, 50)):
    """Draw a progress/danger bar."""
    draw_rounded_rect(draw, (x, y, x + w_bar, y + h_bar), fill=bg, radius=h_bar//2)
    fill_w = int(w_bar * progress)
    if fill_w > 0:
        draw_rounded_rect(draw, (x, y, x + fill_w, y + h_bar), fill=color, radius=h_bar//2)


# ─── Phase Renderers ─────────────────────────────────────────────────────

def render_phase1(f, local_f):
    """The Dark Highway (0-28s)"""
    total_p1 = P1_END - P1_START
    t = local_f / total_p1
    
    # Sub-phases within Phase 1
    if local_f < 8 * FPS:
        # Foggy motorway POV with slow zoom
        frame = apply_camera(IMG_FOGGY, local_f, 8 * FPS, 1.0, 1.15, pan_x=30)
        frame = color_grade_dark(frame, (0.85, 0.9, 1.15))
    elif local_f < 16 * FPS:
        # Driver silhouette
        sub_f = local_f - 8 * FPS
        if sub_f < FPS:  # 1s crossfade
            frame = crossfade(
                apply_camera(IMG_FOGGY, 8*FPS, 8*FPS, 1.0, 1.15),
                IMG_DRIVER, sub_f / FPS
            )
        else:
            frame = apply_camera(IMG_DRIVER, sub_f, 8 * FPS, 1.0, 1.08, pan_x=-20)
        frame = color_grade_dark(frame, (0.85, 0.92, 1.1))
        
        # Draw speedometer overlay
        pil = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil)
        if sub_f > 2 * FPS:
            speed = 100
            draw_text_shadow(draw, (W - 280, H - 120), f"{speed} km/h", 
                           FONT_LARGE, (0, 255, 100))
        frame = np.array(pil)
        
    elif local_f < 22 * FPS:
        # Tractor obstacle appears
        sub_f = local_f - 16 * FPS
        if sub_f < FPS:
            frame = crossfade(IMG_DRIVER, IMG_TRACTOR, sub_f / FPS)
        else:
            frame = apply_camera(IMG_TRACTOR, sub_f, 6 * FPS, 1.0, 1.3, pan_y=-30)
        frame = color_grade_dark(frame, (1.1, 0.85, 0.85))  # Red tint for danger
        
        # Flash effect for sudden appearance
        if sub_f < int(0.3 * FPS):
            brightness = 1.0 + (1.0 - sub_f / (0.3 * FPS)) * 0.5
            frame = np.clip(frame.astype(np.float32) * brightness, 0, 255).astype(np.uint8)
            
    else:
        # Black screen with tire screech aftermath
        sub_f = local_f - 22 * FPS
        
        if sub_f < int(0.5 * FPS):
            # Quick flash of tractor then black
            flash_t = sub_f / (0.5 * FPS)
            frame = (IMG_TRACTOR.astype(np.float32) * (1 - flash_t)).astype(np.uint8)
        else:
            frame = np.zeros((H, W, 3), dtype=np.uint8)
            # Fade in red text
            text_t = (sub_f - 0.5 * FPS) / (5.5 * FPS)
            if text_t > 0:
                pil = Image.fromarray(frame)
                draw = ImageDraw.Draw(pil)
                alpha = min(1.0, text_t * 2)
                r = int(220 * alpha)
                
                # Big impact text
                if text_t > 0.3:
                    draw_text_shadow(draw, (W//2 - 450, H//2 - 60), 
                                   "EVERY WINTER.", FONT_HUGE,
                                   (r, int(50*alpha), int(50*alpha)))
                if text_t > 0.6:
                    draw_text_shadow(draw, (W//2 - 400, H//2 + 40), 
                                   "HUNDREDS DIE.", FONT_HUGE,
                                   (r, int(50*alpha), int(50*alpha)))
                if text_t > 0.8:
                    draw_text_shadow(draw, (W//2 - 300, H//2 + 140), 
                                   "ON PAKISTAN'S HIGHWAYS.", FONT_TITLE,
                                   (200, 200, 200))
                frame = np.array(pil)
    
    # Apply consistent vignette and grain
    frame = add_vignette(frame, 0.5)
    frame = add_film_grain(frame, 12)
    return frame


def render_phase2(f, local_f):
    """Ground Reality News Montage (28-45s)"""
    total_p2 = P2_END - P2_START
    t = local_f / total_p2
    
    # Rapid 2-second cuts between crash images
    cycle = (local_f // (2 * FPS)) % 4
    sub_in_cycle = (local_f % (2 * FPS)) / (2 * FPS)
    
    images = [IMG_FOG_COLLISION, IMG_CRASH, IMG_WET_MOTORWAY, IMG_SMOG]
    headlines = [
        "6 TRAILER TRUCKS COLLIDE ON MULTAN-SUKKUR MOTORWAY",
        "AT LEAST 16 DEAD IN PUNJAB FOG PILEUP",
        "M-2 MOTORWAY CLOSED AS SMOG BLANKETS LAHORE",
        "RESCUE 1122: 47 ACCIDENTS IN SINGLE NIGHT"
    ]
    sources = ["— DAWN NEWS", "— PAKISTAN TODAY", "— GEO NEWS", "— RESCUE 1122"]
    
    base_img = images[cycle]
    frame = apply_camera(base_img, local_f, total_p2, 1.0, 1.12, 
                        pan_x=(-30 if cycle % 2 == 0 else 30))
    
    # Glitch transition between cuts
    transition_point = local_f % (2 * FPS)
    if transition_point < int(0.15 * FPS):
        frame = glitch_effect(frame, 0.5)
    
    # Dark overlay for text readability
    frame = (frame.astype(np.float32) * 0.55).astype(np.uint8)
    
    pil = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil)
    
    # Red "BREAKING" flash bar
    bar_y = 80
    draw.rectangle((0, bar_y, W, bar_y + 50), fill=(180, 20, 20))
    if (local_f // (FPS // 3)) % 2 == 0:
        draw.text((30, bar_y + 8), "⚠ BREAKING", font=FONT_MED, fill=WHITE)
    
    # Headline text with typewriter effect
    headline = headlines[cycle]
    chars_visible = int(len(headline) * min(1, sub_in_cycle * 2))
    visible_text = headline[:chars_visible]
    
    draw_text_shadow(draw, (60, H - 250), visible_text, FONT_LARGE, WHITE)
    draw.text((60, H - 180), sources[cycle], font=FONT_SMALL, fill=(200, 200, 200))
    
    # Death counter
    death_count = int(lerp(0, 247, t))
    draw_text_shadow(draw, (W - 350, 160), f"{death_count}", FONT_STAT, RED_ALERT)
    draw.text((W - 350, 260), "DEATHS IN 2023", font=FONT_SMALL, fill=LIGHT_GREY)
    draw.text((W - 350, 290), "FROM FOG CRASHES", font=FONT_TINY, fill=(150, 150, 150))
    
    # Scan line effect
    scan_y = (local_f * 3) % H
    draw.line([(0, scan_y), (W, scan_y)], fill=(255, 255, 255, 30), width=1)
    
    frame = np.array(pil)
    frame = add_film_grain(frame, 18)
    return frame


def render_phase3(f, local_f):
    """The Invisible Physics (45-65s)"""
    total_p3 = P3_END - P3_START
    t = local_f / total_p3
    
    # Dark navy background
    frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
    pil = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil)
    
    # Subtle grid pattern
    for gx in range(0, W, 60):
        draw.line([(gx, 0), (gx, H)], fill=(25, 35, 55), width=1)
    for gy in range(0, H, 60):
        draw.line([(0, gy), (W, gy)], fill=(25, 35, 55), width=1)
    
    if t < 0.25:
        # Title: "THE PHYSICS NO ONE TELLS YOU"
        title_t = t / 0.25
        alpha = ease_out_cubic(min(1, title_t * 2))
        r, g, b = [int(c * alpha) for c in TEAL]
        draw_text_shadow(draw, (W//2 - 450, H//2 - 80), 
                        "THE PHYSICS", FONT_HUGE, (r, g, b))
        if title_t > 0.4:
            draw_text_shadow(draw, (W//2 - 400, H//2 + 20), 
                           "NO ONE TELLS YOU", FONT_TITLE, WHITE)
    
    elif t < 0.5:
        # Friction drop infographic
        info_t = (t - 0.25) / 0.25
        
        draw_text_shadow(draw, (100, 80), "COEFFICIENT OF FRICTION", 
                        FONT_MED, TEAL)
        
        # DRY road bar
        dry_progress = min(1, info_t * 2)
        draw.text((100, 160), "DRY ROAD", font=FONT_SMALL, fill=LIGHT_GREY)
        draw_progress_bar(draw, 100, 200, 700, 40, 0.70 * dry_progress, 
                         (50, 200, 100))
        if dry_progress > 0.5:
            draw_text_shadow(draw, (820, 195), "f = 0.70", FONT_MED, 
                           (50, 200, 100))
        
        # WET SMOG road bar  
        if info_t > 0.5:
            wet_progress = min(1, (info_t - 0.5) * 2)
            draw.text((100, 300), "CHEMICAL DEW (SMOG)", font=FONT_SMALL, 
                     fill=LIGHT_GREY)
            draw_progress_bar(draw, 100, 340, 700, 40, 0.28 * wet_progress, 
                             RED_ALERT)
            if wet_progress > 0.5:
                draw_text_shadow(draw, (820, 335), "f = 0.28", FONT_MED, 
                               RED_ALERT)
        
        # Arrow showing the drop
        if info_t > 0.8:
            draw.text((400, 260), "▼  60% DROP", font=FONT_MED, fill=AMBER)
        
        # SSD equation
        if info_t > 0.6:
            eq_t = (info_t - 0.6) / 0.4
            draw.text((100, 450), "Stopping Sight Distance (AASHTO):", 
                     font=FONT_SMALL, fill=PALE_TEAL)
            draw_text_shadow(draw, (100, 500), 
                           "SSD = v·tᵣ + v² / (2·g·f)", FONT_LARGE, WHITE)
    
    elif t < 0.75:
        # Stopping distance comparison
        dist_t = (t - 0.5) / 0.25
        
        draw_text_shadow(draw, (100, 60), "STOPPING DISTANCE @ 100 km/h", 
                        FONT_MED, TEAL)
        
        # DRY: 98m
        dry_anim = min(1, dist_t * 2)
        bar_w_dry = int(500 * 0.45 * dry_anim)  # scaled
        draw.text((100, 160), "DRY ASPHALT", font=FONT_SMALL, fill=LIGHT_GREY)
        draw.rectangle((100, 200, 100 + bar_w_dry, 250), fill=(50, 200, 100))
        draw_text_shadow(draw, (120 + bar_w_dry, 200), "98m", FONT_LARGE, 
                        (50, 200, 100))
        
        # WET SMOG: 216m
        if dist_t > 0.3:
            wet_anim = min(1, (dist_t - 0.3) * 2)
            bar_w_wet = int(500 * wet_anim)
            draw.text((100, 320), "CHEMICAL DEW (SMOG)", font=FONT_SMALL, 
                     fill=LIGHT_GREY)
            draw.rectangle((100, 360, 100 + bar_w_wet, 410), fill=RED_ALERT)
            draw_text_shadow(draw, (120 + bar_w_wet, 360), "216m", FONT_LARGE, 
                           RED_ALERT)
        
        # Visibility line at 40m
        if dist_t > 0.5:
            vis_x = 100 + int(500 * 0.185)  # 40/216 scaled
            draw.line([(vis_x, 130), (vis_x, 450)], fill=AMBER, width=3)
            draw.text((vis_x + 10, 130), "VISIBILITY: 40m", font=FONT_SMALL, 
                     fill=AMBER)
        
        # BLIND CRASH ZONE
        if dist_t > 0.7:
            blink = (local_f // (FPS // 3)) % 2 == 0
            if blink:
                draw_rounded_rect(draw, (100, 500, 900, 580), 
                                 fill=(180, 30, 30), radius=10)
                draw_text_shadow(draw, (140, 510), 
                               "⚠ 176m BLIND CRASH ZONE", FONT_LARGE, WHITE)
    
    else:
        # CPI equation and risk gauge
        cpi_t = (t - 0.75) / 0.25
        
        draw_text_shadow(draw, (100, 60), "CRASH PROBABILITY INDEX (CPI)", 
                        FONT_MED, TEAL)
        draw.text((100, 120), "CPI = SSD / Visibility", font=FONT_SUBTITLE, 
                 fill=WHITE)
        
        # Animated CPI value counting up
        cpi_val = lerp(0, 5.4, min(1, cpi_t * 1.5))
        cpi_color = (50, 200, 100) if cpi_val < 0.8 else (
            AMBER if cpi_val < 1.0 else RED_ALERT)
        
        draw_text_shadow(draw, (W//2 - 100, H//2 - 80), 
                        f"{cpi_val:.1f}", FONT_STAT, cpi_color)
        
        # Risk level label
        if cpi_val >= 1.0:
            blink = (local_f // (FPS // 4)) % 2 == 0
            if blink:
                draw_text_shadow(draw, (W//2 - 200, H//2 + 40), 
                               "CRITICAL — CRASH CERTAIN", FONT_MED, RED_ALERT)
        
        # Risk scale bar at bottom
        draw.text((100, H - 200), "RISK SCALE:", font=FONT_SMALL, fill=LIGHT_GREY)
        # Green zone
        draw.rectangle((100, H - 160, 500, H - 130), fill=(50, 200, 100))
        draw.text((110, H - 158), "SAFE", font=FONT_TINY, fill=BLACK)
        # Amber zone
        draw.rectangle((500, H - 160, 700, H - 130), fill=AMBER)
        draw.text((510, H - 158), "WARNING", font=FONT_TINY, fill=BLACK)
        # Red zone
        draw.rectangle((700, H - 160, 1200, H - 130), fill=RED_ALERT)
        draw.text((710, H - 158), "CRITICAL", font=FONT_TINY, fill=WHITE)
        
        # Needle position
        needle_x = int(lerp(100, 1200, min(1, cpi_val / 6)))
        draw.polygon([(needle_x - 8, H - 125), (needle_x + 8, H - 125),
                      (needle_x, H - 165)], fill=WHITE)
    
    frame = np.array(pil)
    frame = add_film_grain(frame, 8)
    return frame


def render_phase4(f, local_f):
    """The Solution — SafarGuard (65-80s)"""
    total_p4 = P4_END - P4_START
    t = local_f / total_p4
    
    if t < 0.15:
        # Transition from physics — "WHAT IF..." text
        trans_t = t / 0.15
        frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
        pil = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil)
        
        alpha = ease_out_cubic(trans_t)
        r, g, b = [int(c * alpha) for c in TEAL]
        draw_text_shadow(draw, (W//2 - 250, H//2 - 40), "WHAT IF...", 
                        FONT_HUGE, (r, g, b))
        frame = np.array(pil)
        
    elif t < 0.4:
        # Logo reveal with glow
        logo_t = (t - 0.15) / 0.25
        frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
        pil = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil)
        
        # Glow effect behind logo
        glow_r = int(200 * ease_out_cubic(min(1, logo_t * 1.5)))
        for r_val in range(glow_r, 0, -5):
            alpha_g = int(15 * (1 - r_val / max(glow_r, 1)))
            draw.ellipse((W//2 - r_val, H//2 - r_val//2, 
                         W//2 + r_val, H//2 + r_val//2),
                        fill=(TEAL[0]//4, TEAL[1]//4, TEAL[2]//4))
        
        # Composite logo
        if LOGO_IMG:
            logo_scale = ease_out_cubic(min(1, logo_t * 1.5))
            lw = int(400 * logo_scale)
            lh = int(lw * LOGO_IMG.height / LOGO_IMG.width)
            if lw > 0 and lh > 0:
                logo_resized = LOGO_IMG.resize((lw, lh), Image.LANCZOS)
                lx = W // 2 - lw // 2
                ly = H // 2 - lh // 2 - 60
                pil.paste(logo_resized, (lx, ly), logo_resized)
                draw = ImageDraw.Draw(pil)
        
        # "HIGHWAY INTELLIGENCE" tagline
        if logo_t > 0.5:
            tag_alpha = min(1, (logo_t - 0.5) * 2)
            r, g, b = [int(c * tag_alpha) for c in LIGHT_GREY]
            draw_text_shadow(draw, (W//2 - 250, H//2 + 100), 
                           "HIGHWAY INTELLIGENCE", FONT_SUBTITLE, (r, g, b))
        
        frame = np.array(pil)
    
    elif t < 0.7:
        # SafarGuard HUD demo
        hud_t = (t - 0.4) / 0.3
        
        if hud_t < 0.1:
            frame = crossfade(np.full((H, W, 3), NAVY, dtype=np.uint8), 
                            IMG_HUD, hud_t / 0.1)
        else:
            frame = apply_camera(IMG_HUD, int(hud_t * 100), 100, 1.0, 1.05)
        
        pil = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil)
        
        # Animated elements on top of HUD
        if hud_t > 0.3:
            # Pulsing alert border
            pulse = abs(math.sin(local_f * 0.15))
            border_w = int(4 + pulse * 3)
            draw.rectangle((0, 0, W-1, H-1), outline=RED_ALERT, width=border_w)
        
        # Bottom text
        if hud_t > 0.5:
            draw_rounded_rect(draw, (50, H-100, W-50, H-30), 
                            fill=(10, 20, 35), outline=TEAL, width=2)
            draw.text((80, H-90), "🔊 Aage fog hai, speed kam karein. "
                     "Brake distance 216 meter hai.", 
                     font=FONT_MED, fill=PALE_TEAL)
        
        frame = np.array(pil)
    
    else:
        # Feature cards
        feat_t = (t - 0.7) / 0.3
        frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
        pil = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil)
        
        draw_text_shadow(draw, (W//2 - 200, 60), "HOW IT WORKS", 
                        FONT_LARGE, TEAL)
        
        features = [
            ("🛰️", "Real-Time Smog Data", "PM2.5, Humidity, Visibility"),
            ("🧠", "Gemma 4 Vision AI", "Obstacle & Glare Detection"),
            ("📐", "AASHTO Physics Engine", "Dynamic SSD Calculation"),
            ("🔊", "Roman Urdu Alerts", "Driver-Native Voice Warnings"),
        ]
        
        card_w, card_h = 400, 180
        start_x = (W - 2 * card_w - 40) // 2
        
        for i, (icon, title, desc) in enumerate(features):
            card_t = max(0, feat_t * 4 - i * 0.8)
            if card_t <= 0:
                continue
            
            anim = ease_out_cubic(min(1, card_t))
            cx = start_x + (i % 2) * (card_w + 40)
            cy = 160 + (i // 2) * (card_h + 30) + int(30 * (1 - anim))
            
            draw_rounded_rect(draw, (cx, cy, cx + card_w, cy + card_h),
                            fill=(20, 35, 55), outline=TEAL, width=2)
            draw.text((cx + 20, cy + 15), icon, font=FONT_LARGE, fill=WHITE)
            draw_text_shadow(draw, (cx + 80, cy + 20), title, FONT_MED, WHITE)
            draw.text((cx + 80, cy + 70), desc, font=FONT_SMALL, fill=LIGHT_GREY)
        
        frame = np.array(pil)
    
    frame = add_film_grain(frame, 6)
    return frame


def render_phase5(f, local_f):
    """Tech Architecture (80-85s)"""
    total_p5 = P5_END - P5_START
    t = local_f / total_p5
    
    frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
    pil = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil)
    
    # Grid
    for gx in range(0, W, 80):
        draw.line([(gx, 0), (gx, H)], fill=(20, 30, 48), width=1)
    for gy in range(0, H, 80):
        draw.line([(0, gy), (W, gy)], fill=(20, 30, 48), width=1)
    
    draw_text_shadow(draw, (W//2 - 250, 40), "ARCHITECTURE", FONT_LARGE, TEAL)
    
    # Pipeline nodes
    nodes = [
        (150, H//2, "📡 SENSORS", "PM2.5 + Humidity\n+ Visibility"),
        (500, H//2, "📷 CAMERA", "Dashcam Feed\nGemma 4 Vision"),
        (850, H//2, "⚙️ PHYSICS", "SSD Calculator\nCPI Engine"),
        (1200, H//2, "🔊 ALERT", "Roman Urdu\nVoice Beacon"),
        (1550, H//2, "📱 HUD", "Night Display\nSpeed Cap"),
    ]
    
    for i, (nx, ny, label, desc) in enumerate(nodes):
        node_t = max(0, t * 5 - i * 0.8)
        if node_t <= 0:
            continue
        anim = ease_out_cubic(min(1, node_t))
        
        # Node circle
        r = int(55 * anim)
        draw.ellipse((nx - r, ny - r, nx + r, ny + r), 
                    fill=(25, 45, 65), outline=TEAL, width=3)
        
        # Label
        if anim > 0.5:
            draw.text((nx - 50, ny - 15), label, font=FONT_SMALL, fill=WHITE)
            draw.text((nx - 60, ny + 70), desc, font=FONT_TINY, fill=LIGHT_GREY)
        
        # Connection line to next node
        if i < len(nodes) - 1 and node_t > 0.5:
            next_x = nodes[i + 1][0]
            line_end = int(lerp(nx + r + 10, next_x - 55, 
                               min(1, (node_t - 0.5) * 2)))
            draw.line([(nx + r + 5, ny), (line_end, ny)], fill=TEAL, width=3)
            # Arrow
            if line_end > nx + r + 30:
                draw.polygon([(line_end, ny - 8), (line_end, ny + 8), 
                             (line_end + 12, ny)], fill=TEAL)
    
    # Bottom: Open source badge
    if t > 0.6:
        badge_t = (t - 0.6) / 0.4
        badge_anim = ease_out_cubic(min(1, badge_t))
        by = H - 120 + int(30 * (1 - badge_anim))
        draw_rounded_rect(draw, (W//2 - 250, by, W//2 + 250, by + 60),
                        fill=(20, 35, 55), outline=TEAL, width=2)
        draw.text((W//2 - 230, by + 12), "🔓 MIT Licensed  •  Open Source  •  "
                 "Built for Pakistan", font=FONT_SMALL, fill=PALE_TEAL)
    
    frame = np.array(pil)
    frame = add_film_grain(frame, 5)
    return frame


def render_phase6(f, local_f):
    """Open Source & Closing (85-90s)"""
    total_p6 = P6_END - P6_START
    t = local_f / total_p6
    
    frame = np.full((H, W, 3), NAVY, dtype=np.uint8)
    pil = Image.fromarray(frame)
    draw = ImageDraw.Draw(pil)
    
    # Radiating glow from center
    for r_val in range(300, 0, -3):
        intensity = int(8 * (1 - r_val / 300) * ease_out_cubic(min(1, t * 2)))
        color = (TEAL[0]//6 + intensity, TEAL[1]//6 + intensity, 
                TEAL[2]//6 + intensity)
        draw.ellipse((W//2 - r_val, H//2 - r_val, 
                     W//2 + r_val, H//2 + r_val), fill=color)
    
    # Logo in center
    if LOGO_IMG and t > 0.1:
        logo_anim = ease_out_cubic(min(1, (t - 0.1) * 3))
        lw = int(350 * logo_anim)
        lh = int(lw * LOGO_IMG.height / LOGO_IMG.width)
        if lw > 0 and lh > 0:
            logo_r = LOGO_IMG.resize((lw, lh), Image.LANCZOS)
            lx = W // 2 - lw // 2
            ly = H // 2 - lh // 2 - 100
            pil.paste(logo_r, (lx, ly), logo_r)
            draw = ImageDraw.Draw(pil)
    
    # Main CTA
    if t > 0.25:
        cta_anim = ease_out_cubic(min(1, (t - 0.25) * 3))
        cy = int(H // 2 + 30 + 20 * (1 - cta_anim))
        draw_text_shadow(draw, (W//2 - 350, cy), 
                        "PROTECT EVERY JOURNEY.", FONT_LARGE, WHITE)
    
    # GitHub link
    if t > 0.4:
        gh_anim = ease_out_cubic(min(1, (t - 0.4) * 3))
        gy = int(H // 2 + 100 + 15 * (1 - gh_anim))
        draw_rounded_rect(draw, (W//2 - 280, gy, W//2 + 280, gy + 50),
                        fill=(30, 45, 65), outline=TEAL, width=2)
        draw.text((W//2 - 260, gy + 8), 
                 "github.com/Javeriaf19/SafarGuard", 
                 font=FONT_MED, fill=PALE_TEAL)
    
    # Author credit
    if t > 0.55:
        draw.text((W//2 - 180, H - 180), "Built by Javeria Farhan", 
                 font=FONT_SUBTITLE, fill=LIGHT_GREY)
        draw.text((W//2 - 100, H - 130), "Lahore, Pakistan", 
                 font=FONT_SMALL, fill=(120, 120, 120))
    
    # Powered by line
    if t > 0.7:
        draw.text((W//2 - 250, H - 80), 
                 "Powered by Google DeepMind Gemma 4", 
                 font=FONT_SMALL, fill=(100, 120, 140))
    
    # Fade to black at the very end
    if t > 0.85:
        fade = (t - 0.85) / 0.15
        frame_np = np.array(pil)
        frame_np = (frame_np.astype(np.float32) * (1 - fade)).astype(np.uint8)
        return frame_np
    
    frame = np.array(pil)
    return frame


# ─── Main Render Loop ────────────────────────────────────────────────────

def render_frame(f):
    """Render a single frame."""
    if f < P1_END:
        return render_phase1(f, f - P1_START)
    elif f < P2_END:
        # Crossfade transition (0.5s)
        if f < P2_START + FPS // 2:
            p1_frame = render_phase1(f, P1_END - P1_START - 1)
            p2_frame = render_phase2(f, f - P2_START)
            return crossfade(p1_frame, p2_frame, (f - P2_START) / (FPS // 2))
        return render_phase2(f, f - P2_START)
    elif f < P3_END:
        if f < P3_START + FPS // 2:
            p2_frame = render_phase2(f, P2_END - P2_START - 1)
            p3_frame = render_phase3(f, f - P3_START)
            return crossfade(p2_frame, p3_frame, (f - P3_START) / (FPS // 2))
        return render_phase3(f, f - P3_START)
    elif f < P4_END:
        if f < P4_START + FPS // 2:
            p3_frame = render_phase3(f, P3_END - P3_START - 1)
            p4_frame = render_phase4(f, f - P4_START)
            return crossfade(p3_frame, p4_frame, (f - P4_START) / (FPS // 2))
        return render_phase4(f, f - P4_START)
    elif f < P5_END:
        if f < P5_START + FPS // 2:
            p4_frame = render_phase4(f, P4_END - P4_START - 1)
            p5_frame = render_phase5(f, f - P5_START)
            return crossfade(p4_frame, p5_frame, (f - P5_START) / (FPS // 2))
        return render_phase5(f, f - P5_START)
    else:
        if f < P6_START + FPS // 2:
            p5_frame = render_phase5(f, P5_END - P5_START - 1)
            p6_frame = render_phase6(f, f - P6_START)
            return crossfade(p5_frame, p6_frame, (f - P6_START) / (FPS // 2))
        return render_phase6(f, f - P6_START)


print(f"Starting render: {TOTAL_FRAMES} frames @ {FPS}fps = {TOTAL_DURATION}s", flush=True)
print(f"Output: {OUTPUT}", flush=True)

# Convert audio to 16-bit PCM
audio_int16 = (audio_data * 32767).astype(np.int16)
# Write raw PCM to temp file
audio_raw_path = os.path.join(ASSETS, "audio_raw.pcm")
audio_int16.tofile(audio_raw_path)
print("Audio PCM written.", flush=True)

# Start FFmpeg with both video and audio pipes
cmd = [
    FFMPEG, '-y',
    # Video input (raw frames from pipe)
    '-f', 'rawvideo', '-pix_fmt', 'rgb24',
    '-s', f'{W}x{H}', '-r', str(FPS),
    '-i', 'pipe:0',
    # Audio input (raw PCM file)
    '-f', 's16le', '-ar', str(SR), '-ac', '1',
    '-i', audio_raw_path,
    # Output settings
    '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest',
    OUTPUT
]

proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, 
                       stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

start_time = time.time()
try:
    for f in range(TOTAL_FRAMES):
        frame = render_frame(f)
        
        # Ensure correct shape
        if frame.shape != (H, W, 3):
            frame = np.array(Image.fromarray(frame).resize((W, H), Image.LANCZOS))
        
        proc.stdin.write(frame.tobytes())
        
        if f % (FPS * 5) == 0:  # Progress every 5 seconds of video
            elapsed = time.time() - start_time
            pct = (f / TOTAL_FRAMES) * 100
            phase_names = ["Phase 1: Dark Highway", "Phase 2: News Montage",
                          "Phase 3: Physics", "Phase 4: Solution",
                          "Phase 5: Architecture", "Phase 6: Closing"]
            current_phase = 0
            if f >= P6_START: current_phase = 5
            elif f >= P5_START: current_phase = 4
            elif f >= P4_START: current_phase = 3
            elif f >= P3_START: current_phase = 2
            elif f >= P2_START: current_phase = 1
            
            fps_actual = f / max(elapsed, 0.01)
            eta = (TOTAL_FRAMES - f) / max(fps_actual, 0.01)
            print(f"  [{pct:5.1f}%] Frame {f}/{TOTAL_FRAMES} | "
                  f"{phase_names[current_phase]} | "
                  f"{fps_actual:.1f} fps | ETA: {eta:.0f}s", flush=True)
    
    proc.stdin.close()
    proc.wait()
    
    elapsed = time.time() - start_time
    file_size = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f"\n✅ RENDER COMPLETE!", flush=True)
    print(f"   Duration: {TOTAL_DURATION}s", flush=True)
    print(f"   Resolution: {W}x{H} @ {FPS}fps", flush=True)
    print(f"   File: {OUTPUT}", flush=True)
    print(f"   Size: {file_size:.1f} MB", flush=True)
    print(f"   Render time: {elapsed:.1f}s", flush=True)

except Exception as e:
    print(f"❌ ERROR: {e}", flush=True)
    proc.stdin.close()
    proc.kill()
    raise

finally:
    # Cleanup temp audio
    if os.path.exists(audio_raw_path):
        os.remove(audio_raw_path)
