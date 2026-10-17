# Backend Schema & API Contracts Specification
## SafeGuard: Telemetry Schemas, DTOs, and Microservice Interfaces

- **Author**: Javeria Farhan
- **Date**: October 17, 2026
- **Version**: 1.0.0

---

## 1. Core Data Models & Schemas

### 1.1 Corridor Telemetry Snapshot (`CorridorTelemetry`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CorridorTelemetry",
  "type": "object",
  "properties": {
    "corridor_id": { "type": "string", "example": "M2_LAHORE_SHEIKHUPURA" },
    "corridor_name": { "type": "string", "example": "M-2 Motorway (Babu Sabu to Kot Abdul Malik)" },
    "coordinates": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number", "example": 31.5204 },
        "longitude": { "type": "number", "example": 74.3587 }
      },
      "required": ["latitude", "longitude"]
    },
    "visibility_meters": { "type": "number", "example": 32.5 },
    "relative_humidity_percent": { "type": "number", "example": 89.2 },
    "pm25_ug_m3": { "type": "number", "example": 398.0 },
    "pm10_ug_m3": { "type": "number", "example": 542.0 },
    "temperature_celsius": { "type": "number", "example": 11.4 },
    "timestamp_utc": { "type": "string", "format": "date-time" },
    "data_source": { "type": "string", "enum": ["OPEN_METEO_LIVE", "HISTORICAL_FALLBACK", "SIMULATION"] }
  },
  "required": ["corridor_id", "visibility_meters", "relative_humidity_percent", "pm25_ug_m3"]
}
```

### 1.2 Physics Engine Output Contract (`PhysicsEvaluation`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PhysicsEvaluation",
  "type": "object",
  "properties": {
    "current_speed_kmh": { "type": "number", "example": 100.0 },
    "stopping_sight_distance_meters": { "type": "number", "example": 98.4 },
    "perception_reaction_time_seconds": { "type": "number", "example": 2.85 },
    "road_friction_coefficient": { "type": "number", "example": 0.28 },
    "is_greasy_smog_slick": { "type": "boolean", "example": true },
    "crash_probability_index": { "type": "number", "example": 1.45 },
    "risk_level": { "type": "string", "enum": ["SAFE", "WARNING", "CRITICAL"] },
    "recommended_safe_speed_kmh": { "type": "number", "example": 36.2 },
    "safety_margin_deficit_meters": { "type": "number", "example": 48.4 }
  },
  "required": ["stopping_sight_distance_meters", "crash_probability_index", "risk_level", "recommended_safe_speed_kmh"]
}
```

### 1.3 Gemma 4 Multimodal Audit Request & Response
```json
// POST /api/v1/vision/audit
// Payload: multipart/form-data or Base64 encoded JPEG
{
  "image_base64": "data:image/jpeg;base64,...",
  "telemetry_context": {
    "visibility_meters": 32.5,
    "current_speed_kmh": 90.0,
    "corridor_id": "M2_LAHORE_SHEIKHUPURA"
  }
}

// Response JSON:
{
  "status": "success",
  "model_used": "gemma-4-multimodal-it",
  "hazard_detected": true,
  "hazard_classification": "UNLIT_HEAVY_TRAILER",
  "estimated_hazard_distance_m": 24,
  "headlight_backscatter_severity": "SEVERE_HIGH_BEAM_GLARE",
  "action_guidance": {
    "english": "Severe headlight backscatter blinding vision. Unlit cargo silhouette detected at 24m. Reduce speed to 35 km/h immediately and switch to amber fog lamps.",
    "roman_urdu": "High beam ka noor andha kar raha hai! Aage baghair batti wali trolley khari hai. Speed foran 35 km/h karein aur low beam ya fog lights on karein."
  },
  "sound_beacon_frequency_hz": 880,
  "requires_emergency_brake": false
}
```

---

## 2. Enterprise REST Endpoints for Ride-Hailing (InDrive / Careem)

```http
### 1. Query Corridor Safety Score
GET /api/v1/corridor/M2_LAHORE_SHEIKHUPURA/safety
Response: 200 OK (PhysicsEvaluation)

### 2. Batch Coordinate Risk Intersect (For Dynamic Ride Routing)
POST /api/v1/routing/risk-eval
Content-Type: application/json

{
  "route_coordinates": [
    { "lat": 31.5204, "lon": 74.3587 },
    { "lat": 31.6500, "lon": 74.2800 },
    { "lat": 31.7100, "lon": 74.1500 }
  ]
}

Response: 200 OK
{
  "max_cpi_along_route": 1.48,
  "recommended_diversion": true,
  "suggested_exit_interchange": "KALA_SHAH_KAKU_INTERCHANGE",
  "safe_speed_envelope_kmh": 35
}
```
