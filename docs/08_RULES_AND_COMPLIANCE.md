# Rules, Compliance & Academic Integrity
## SafeGuard: MLH Hack Day & Open-Source Adherence

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0
- **Governing Policies**: MLH Standard Hackathon Rules & Hacktoberfest 2026 Directives

---

## 1. Compliance Matrix with MLH Standard Rules

| MLH Competition Rule | SafeGuard Implementation & Compliance Strategy |
| :--- | :--- |
| **Fresh Code Rule** | Repository initialization, commits, and integration occur exclusively within the Hack Day hacking period (post-kickoff). |
| **Third-Party Assets** | All third-party libraries (Open-Meteo, Streamlit, Google GenAI SDK) are declared transparently in `requirements.txt` and `README.md`. |
| **Working Prototype** | The application runs as a fully functional interactive local web dashboard with live API calls and verified fallback presets. |
| **Academic Integrity & AI Disclosure** | Transparent attribution provided in `README.md`: *"Scaffolded with guidance from Antigravity & Google Gemini; all physics models and architecture built during Hack Day."* |
| **Open Source Requirement** | Source code licensed under OSI-approved MIT License in the public GitHub root (`LICENSE`). |

---

## 2. Category Prize Qualification Alignment

### 2.1 Category 1: Best Use of Gemma 4 (Google DeepMind)
- **Eligibility Requirement**: Uses Google DeepMind's open-weight Gemma 4 model via the Gemini API.
- **Verification**: The codebase explicitly invokes Gemma 4 (`models/gemma-4-it` or `models/gemini-2.5-flash`) for multimodal windshield optical evaluation and Roman Urdu advisory synthesis.
- **Live Evidence**: Model identifier and inference latency are displayed natively on the UI screen during judging demos.

### 2.2 Category 2: Best Open-Source AI Project (DigitalOcean)
- **Eligibility Requirement**: Original open-source AI project published in a public GitHub repository with an open-source license, compliant with the Agent Skill Open Standard (`SKILL.md`).
- **Verification**:
  - `SKILL.md` provided at project root matching the specification standard.
  - Public repository under MIT license.
  - Core functionality powered by open-weight models (Gemma 4 with local Ollama fallback support).

---

## 3. Road Safety & Medical Non-Liability Disclaimer

> [!IMPORTANT]
> **Safety Notice**: SafeGuard is an advisory driving-assistance system developed for academic, hackathon, and open-source demonstration purposes. It does not replace physical driver alertness, statutory traffic regulations, or instructions from the National Highway & Motorway Police (NHMP). Drivers are legally required to maintain vehicle control and obey official road closures at all times.
