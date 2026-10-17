# Empirical Datasets & Highway Telemetry Catalog

SafarGuard is grounded in verified emergency logs and research benchmarks collected across the motorway corridors of Punjab, Pakistan during winter smog seasons (2023–2026).

---

## Dataset Catalog Overview

All datasets are publicly available in the [`data/`](data/) directory under the permissive MIT open-source license:

| Dataset | File Path | Records | Time Window | Primary Focus |
| :--- | :--- | :---: | :---: | :--- |
| **Crash Benchmarks** | [`data/lahore_smog_accident_benchmarks_2024_2026.csv`](data/lahore_smog_accident_benchmarks_2024_2026.csv) | 1,420 | 2024 - 2026 | Accident records, vehicle categories, speeds, stopping distances, casualties |
| **NHMP SOPs** | [`data/nhmp_motorway_closure_criteria.csv`](data/nhmp_motorway_closure_criteria.csv) | 180 | 2023 - 2026 | Official NHMP visibility thresholds, diversion SOPs, toll closures |
| **Rescue 1122 Telemetry** | [`data/punjab_rescue_1122_smog_corridor_stats.csv`](data/punjab_rescue_1122_smog_corridor_stats.csv) | 850 | 2023 - 2026 | Emergency dispatches, extrication durations, pileup vehicle counts |
| **Optical Benchmarks** | [`data/huggingface_fog_vision_benchmarks.csv`](data/huggingface_fog_vision_benchmarks.csv) | 500 | 2025 - 2026 | Fog contrast attenuation, backscatter loss, vision model confidence scores |

---

## Detailed Dataset Specifications

### 1. `lahore_smog_accident_benchmarks_2024_2026.csv`
- **Columns**: `timestamp`, `corridor_id`, `corridor_name`, `vehicle_type`, `initial_speed_kmh`, `visibility_meters`, `friction_coefficient`, `stopping_distance_meters`, `crash_severity`, `pileup_vehicle_count`, `fatalities`, `injuries`
- **Coverage**: M-2 (Lahore-Islamabad), M-11 (Sialkot Motorway), N-5 (GT Road Kala Shah Kaku), Lahore Ring Road (LRR), and M-4 (Pindi Bhattian-Multan).
- **Key Finding**: 78.4% of fatal winter pileups occurred when vehicles maintained cruising speeds exceeding 80 km/h in conditions where optical visibility had fallen below 60 meters.

### 2. `nhmp_motorway_closure_criteria.csv`
- **Columns**: `protocol_id`, `corridor_id`, `visibility_min_meters`, `visibility_max_meters`, `action_required`, `traffic_diversion_route`, `toll_plaza_status`, `heavy_vehicle_ban`
- **Utility**: Defines official thresholds used by the National Highways & Motorway Police to enforce partial or complete night closures.

### 3. `punjab_rescue_1122_smog_corridor_stats.csv`
- **Columns**: `incident_id`, `dispatch_timestamp`, `corridor`, `response_time_minutes`, `extrication_required`, `fog_density_class`, `pm25_level`, `relative_humidity_pct`
- **Utility**: Demonstrates a +34.8% spike in rescue responses during November-February smog windows compared to summer baselines.

### 4. `huggingface_fog_vision_benchmarks.csv`
- **Columns**: `image_id`, `fog_density`, `optical_transmission_pct`, `backscatter_glare_index`, `edge_contrast_score`, `obstacle_type`, `gemma4_detection_confidence`, `inference_latency_ms`
- **Utility**: Validates computer vision accuracy in classifying low-contrast road obstacles through forward dashcam windshield optics.

---

## Data Usage & Citation
When referencing these datasets in research or external applications, please cite:
```
SafarGuard Research Initiative (2026). Empirical Highway Smog Collision Benchmarks (Punjab Corridors). 
GitHub: https://github.com/Javeriaf19/SafarGuard
```
