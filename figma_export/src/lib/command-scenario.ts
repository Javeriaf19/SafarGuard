export type Severity = "critical" | "warning" | "normal"
export type Division = "Lahore" | "Sheikhupura" | "Muridke" | "Gujranwala" | "Faisalabad M-4"
export type CommandCorridor = {
  id: string
  route: string
  name: string
  division: Division
  visibility: number
  friction: number
  speed: number
  cpi: number
  severity: Severity
  cell: string
  x: number
  y: number
}
export type CommandEvent = {
  id: string
  time: string
  corridorId: string
  severity: Severity
  category: string
  title: string
  message: string
  reviewed: boolean
}

export const commandDivisions: Division[] = [
  "Lahore",
  "Sheikhupura",
  "Muridke",
  "Gujranwala",
  "Faisalabad M-4",
]

export const commandCorridors: CommandCorridor[] = [
  {
    id: "babu-sabu",
    route: "M-2",
    name: "Babu Sabu",
    division: "Lahore",
    visibility: 28,
    friction: 0.28,
    speed: 35,
    cpi: 3.82,
    severity: "critical",
    cell: "ttnf7u",
    x: 424,
    y: 307,
  },
  {
    id: "kala-shah-kaku",
    route: "N-5",
    name: "Kala Shah Kaku",
    division: "Sheikhupura",
    visibility: 30,
    friction: 0.32,
    speed: 35,
    cpi: 1.95,
    severity: "warning",
    cell: "ttngh2",
    x: 360,
    y: 211,
  },
  {
    id: "ring-road",
    route: "LRR",
    name: "Ring Road",
    division: "Lahore",
    visibility: 110,
    friction: 0.58,
    speed: 60,
    cpi: 0.42,
    severity: "normal",
    cell: "ttnfb4",
    x: 489,
    y: 347,
  },
  {
    id: "sialkot",
    route: "M-11",
    name: "Sialkot approach",
    division: "Gujranwala",
    visibility: 45,
    friction: 0.36,
    speed: 50,
    cpi: 1.12,
    severity: "normal",
    cell: "ttq51m",
    x: 578,
    y: 71,
  },
  {
    id: "sheikhupura",
    route: "M-2",
    name: "Sheikhupura interchange",
    division: "Sheikhupura",
    visibility: 60,
    friction: 0.42,
    speed: 45,
    cpi: 0.87,
    severity: "normal",
    cell: "ttn7dk",
    x: 260,
    y: 169,
  },
  {
    id: "muridke",
    route: "N-5",
    name: "Muridke KM-18",
    division: "Muridke",
    visibility: 32,
    friction: 0.31,
    speed: 35,
    cpi: 1.73,
    severity: "warning",
    cell: "ttngkm",
    x: 421,
    y: 158,
  },
  {
    id: "faisalabad",
    route: "M-4",
    name: "Faisalabad interchange",
    division: "Faisalabad M-4",
    visibility: 90,
    friction: 0.52,
    speed: 55,
    cpi: 0.61,
    severity: "normal",
    cell: "ttj4r8",
    x: 106,
    y: 244,
  },
  {
    id: "abdul-hakeem",
    route: "M-3",
    name: "Lahore south approach",
    division: "Lahore",
    visibility: 75,
    friction: 0.48,
    speed: 50,
    cpi: 0.76,
    severity: "normal",
    cell: "ttn95w",
    x: 314,
    y: 375,
  },
  {
    id: "gujranwala",
    route: "N-5",
    name: "Gujranwala sector",
    division: "Gujranwala",
    visibility: 70,
    friction: 0.46,
    speed: 45,
    cpi: 0.92,
    severity: "normal",
    cell: "ttq0xe",
    x: 489,
    y: 108,
  },
  {
    id: "gojra",
    route: "M-4",
    name: "Gojra interchange",
    division: "Faisalabad M-4",
    visibility: 100,
    friction: 0.55,
    speed: 60,
    cpi: 0.54,
    severity: "normal",
    cell: "ttj0nd",
    x: 67,
    y: 337,
  },
]

export const initialCommandEvents: CommandEvent[] = [
  {
    id: "event-003",
    time: "01:38 AM",
    corridorId: "babu-sabu",
    severity: "critical",
    category: "EMERGENCY DIVERSION",
    title: "M-2 entrance sealed",
    message:
      "M-2 Babu Sabu entrance sealed. 4 trailing Daewoo buses auto-rerouted.",
    reviewed: false,
  },
  {
    id: "event-002",
    time: "01:22 AM",
    corridorId: "muridke",
    severity: "warning",
    category: "HAZARD TELEMETRY",
    title: "Unlit vehicle at KM-18",
    message:
      "InDrive driver camera detected an unlit tractor-trolley at KM-18. A 500 m geofence is active.",
    reviewed: false,
  },
  {
    id: "event-001",
    time: "01:05 AM",
    corridorId: "sialkot",
    severity: "normal",
    category: "CORRIDOR UPDATE",
    title: "M-11 visibility improving",
    message:
      "M-11 Sialkot visibility elevated to 45 m. Scenario speed cap updated to 50 km/h.",
    reviewed: false,
  },
]

export function commandReportCsv(events: CommandEvent[]) {
  const rows = [
    [
      "scope",
      "event_id",
      "scenario_time",
      "division",
      "corridor",
      "category",
      "message",
      "reviewed",
    ],
    ...events.map((event) => {
      const corridor = commandCorridors.find(
        (item) => item.id === event.corridorId,
      )
      return [
        "24h demo sample; not a complete operational record",
        event.id,
        event.time,
        corridor?.division ?? "",
        `${corridor?.route ?? ""} ${corridor?.name ?? ""}`.trim(),
        event.category,
        `SIMULATION: ${event.message}`,
        event.reviewed ? "yes" : "no",
      ]
    }),
  ]
  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\r\n")
}
