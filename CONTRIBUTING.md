# Open Source Contribution Guide

Thank you for your interest in contributing to **SafarGuard**! Together, we are building an open-source highway collision prevention engine designed to eliminate multi-vehicle pileups during severe winter smog events.

---

## Areas Where Contributions Are Actively Needed

### 1. Provincial Highway Corridors & Weather Datasets
- **Expand Corridors**: Add new waypoint nodes and micro-climate profiles for:
  - Sindh: M-9 (Karachi-Hyderabad), N-55 (Indus Highway)
  - Khyber Pakhtunkhwa: M-1 (Peshawar-Islamabad), Swat Expressway
  - Balochistan: N-25 (RCD Highway)
- **Sensor Time-Series**: Add local particulate matter ($PM_{2.5}, PM_{10}$) and relative humidity logs to refine the chemical dew friction coefficient curves in `data/`.

### 2. UI/UX Design & Localized Driver Interfaces
- **Regional Voice Beacons**: Help translate acoustic safety announcements into regional languages (Punjabi, Pashto, Sindhi, Balochi, and standardized Urdu).
- **Specialized Vehicle Views**: Design new cockpit views tailored for heavy commercial freight, inter-city passenger buses, and agricultural machinery.
- **Accessibility**: Enhance high-contrast OLED themes for night driving and color-blind drivers.

### 3. Computer Vision & Local Model Harnesses
- **Local Edge Runtimes**: Contribute adapters for **Ollama**, **llama.cpp**, or **ONNX Runtime** to run quantized vision models (such as `gemma-4-2b` or `qwen2.5-vl`) locally on vehicle edge devices without internet access.
- **Backscatter Analysis**: Refine optical algorithms modeling headlight backscatter and contrast attenuation under sodium-vapor versus LED lighting.

### 4. Vehicle Telematics & Hardware Integrations
- **OBD-II Bluetooth**: Implement ELM327 Bluetooth dongle decoders to stream live wheel speed, ABS braking triggers, and wiper motor frequency into the physics engine.

---

## Development Workflow

### Step 1: Fork and Clone
1. Fork the repository on GitHub: `https://github.com/Javeriaf19/SafarGuard/fork`
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SafarGuard.git
   cd SafarGuard
   ```

### Step 2: Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Step 3: Implement & Test
- **Frontend changes**: Run `npm run dev` inside `figma_export/` and verify that `npm run build` succeeds cleanly.
- **Backend changes**: Run `streamlit run app.py` and verify that the AASHTO calculations and vision pipelines execute without warnings.

### Step 4: Commit Guidelines
Use clear, conventional commit messages:
- `feat: Add Sindh M-9 corridor telemetry`
- `fix: Handle zero-visibility division edge case in CPI solver`
- `docs: Update dataset citations for Rescue 1122`

### Step 5: Submit a Pull Request
1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against `Javeriaf19/SafarGuard:main`.
3. Provide a clear summary of your changes, including before/after screenshots for any UI modifications.

---

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). We maintain a collaborative, welcoming, and safety-focused community.
