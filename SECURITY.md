# Security Policy and Telemetry Safety

## Supported Versions

SafarGuard actively maintains security updates and vulnerability patches for the current release:

| Version | Supported | Release Date |
| :--- | :---: | :--- |
| **v1.0.x (Current)** | Yes | October 2026 |
| **< v1.0.0** | No | Legacy Prototyping |

---

## Safety-Critical Vulnerability Protocol

As a road safety telematics platform, vulnerabilities fall into two distinct classifications:

### 1. Cyber Security & Credential Safeguards
- **Zero API Key Exposure**: The Google Gemini / Gemma 4 API key is strictly isolated within environment files (`.env`) and parsed exclusively on the serverless/backend layer (`app.py`). It is never bundled into public client-side JavaScript or exposed in URL query parameters.
- **Client-Side Data Isolation**: The React public web application does not transmit GPS coordinates, device fingerprints, or passenger telemetry to third-party ad networks or remote tracking databases.

### 2. Algorithmic & Kinematic Safety Integrity
- **Deterministic Bounds Enforcement**: The quadratic safe-speed calculation enforces a physical ceiling $v_{\text{safe}} \le \text{Speed Limit}$ and handles edge cases (such as zero or negative visibility) gracefully without causing integer division-by-zero crashes.
- **Offline Fail-Safe Protocol**: If an optical dashcam feed suffers from packet loss or disconnection, SafarGuard automatically switches to conservative baseline AASHTO values ($f=0.28, t_r=2.85s$) rather than leaving the driver unprotected.

---

## Reporting a Vulnerability

If you discover a security vulnerability or algorithmic anomaly within SafarGuard:

1. **Do NOT open a public GitHub issue** detailing the vulnerability.
2. Email your detailed findings directly to the lead maintainer:
   - **Contact**: Javeria Farhan (`javeriafarhan19@gmail.com`)
3. Include:
   - Description of the vulnerability.
   - Steps to reproduce or sample payload.
   - Potential safety or privacy implications.
4. We will acknowledge receipt within 24 hours and coordinate a private remediation before public disclosure.

---

## Community Security Best Practices

- Always copy `.env.example` to `.env` and verify that `.env` is listed in `.gitignore` prior to committing.
- Run `npm audit` and `pip check` regularly before deploying production instances.
- Never run production telemetry nodes with debug mode enabled (`DEBUG=False`).
