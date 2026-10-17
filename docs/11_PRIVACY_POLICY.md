# Privacy Policy
## SafeGuard Open-Source Telematics Platform

- **Effective Date**: October 17, 2026
- **Lead Developer**: Javeria Farhan
- **Project Contact**: open-source@safeguard-pk.org

---

## 1. Our Privacy Commitment
SafeGuard is designed from the ground up on the principle of **Zero-Knowledge Telematics**. We believe that safety tools must protect physical lives without compromising personal digital privacy.

## 2. Information We Do NOT Collect
- **No Personal Identifiers**: SafeGuard does not collect driver names, national identity numbers (CNIC), phone numbers, or vehicle registration plates.
- **No Persistent Track Tracing**: SafeGuard does not log continuous route breadcrumb histories. Once a vehicle calculates its local Stopping Sight Distance ($SSD$), precise coordinate snapshots are immediately purged from active memory.

## 3. Information We Process
- **Corridor Coordinates**: Instantaneous latitude and longitude are mapped to general 2km geohashes (e.g., M-2 Motorway Babu Sabu Sector) solely to fetch atmospheric conditions from public Open-Meteo weather servers.
- **Sensor Camera Frames**: Windshield camera snapshots submitted for Gemma 4 multimodal hazard auditing are processed in ephemeral memory and discarded immediately following analysis. Images are never archived or utilized for model training.

## 4. Third-Party Services
- **Open-Meteo**: Queries are sent via anonymous HTTPS requests to retrieve public air quality indices.
- **Google DeepMind / Gemini API**: Multimodal inference is conducted via encrypted API channels adhering to Google Cloud's enterprise confidentiality standards.

## 5. Open-Source Transparency
SafeGuard's source code is publicly accessible on GitHub under the MIT License. Anyone can audit our code to verify that no secret tracking or data monetization routines exist.
