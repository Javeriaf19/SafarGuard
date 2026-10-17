import { useRef, useState } from "react"
import type { PointerEvent } from "react"
import {
  commandCorridors,
  commandDivisions,
  commandReportCsv,
  initialCommandEvents,
} from "./lib/command-scenario"
import type {
  CommandCorridor,
  CommandEvent,
  Division,
} from "./lib/command-scenario"
import "./command-console.css"

type CommandIconName = "overview" | "arrow" | "broadcast" | "convoy" | "download" | "layers" | "locate" | "close" | "check" | "info" | "reset" | "shield"
function CommandIcon({ name }: { name: CommandIconName }) {
  const shapes = {
    overview: (
      <>
        <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    broadcast: (
      <>
        <path d="m4 10 12-5v14L4 14v-4Zm2 5 2 6h3l-2-5m11-7 2-1m-2 8 2 1" />
        <path d="M3 10H1v4h2" />
      </>
    ),
    convoy: (
      <>
        <rect x="2" y="4" width="12" height="12" />
        <path d="M5 16v3m6-3v3M2 9h12M6 4v5m11-1h5v11h-6m2 0v2" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />
      </>
    ),
    locate: (
      <>
        <circle cx="12" cy="12" r="6" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      </>
    ),
    close: <path d="m5 5 14 14M5 19 19 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v7m0-10v1" />
      </>
    ),
    reset: <path d="M20 8A9 9 0 1 0 21 15M20 2v6h-6" />,
    shield: (
      <>
        <path d="m12 2 8 4v7c0 4-8 9-8 9s-8-5-8-9V6l8-4Z" />
        <path d="m10 8-3 8m7-8 3 8m-5-8v3m0 3v3" />
      </>
    ),
  }
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  )
}

function hexagon(x: number, y: number, radius: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`
  }).join(" ")
}

function CommandMap({
  division,
  selected,
  onSelect,
  riskVisible,
  fleetVisible,
  zoom,
  offset,
  onOffset,
}: {
  division: Division | "All"
  selected: CommandCorridor
  onSelect: (corridor: CommandCorridor) => void
  riskVisible: boolean
  fleetVisible: boolean
  zoom: number
  offset: { x: number; y: number }
  onOffset: (offset: { x: number; y: number }) => void
}) {
  const drag = useRef<{
    pointerId: number
    x: number
    y: number
    originX: number
    originY: number
  } | null>(null)
  function startPan(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function pan(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current || event.pointerId !== drag.current.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const scale = Math.min(rect.width / 740, rect.height / 440)
    onOffset({
      x: drag.current.originX + (event.clientX - drag.current.x) / scale,
      y: drag.current.originY + (event.clientY - drag.current.y) / scale,
    })
  }
  return (
    <svg
      className="command-map"
      viewBox="0 0 740 440"
      role="group"
      aria-label="Interactive Central Punjab schematic risk map. Select a corridor marker for its sample conditions."
      onPointerDown={startPan}
      onPointerMove={pan}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      <g
        className="command-map-transform"
        transform={`translate(${offset.x} ${offset.y}) translate(370 220) scale(${zoom}) translate(-370 -220)`}
      >
        <g className="command-map-regions">
          <path d="m4 54 145-31 99 63-31 135-114 31L6 191Z" />
          <path d="m184 45 134-24 105 71-57 134-118-27-31-97Z" />
          <path d="m422 31 145-41 143 82-51 99-137 15-96-68Z" />
          <path d="m-13 265 124-30 97 42 32 134-113 44L3 393Z" />
          <path d="m233 241 132-43 101 93-55 135-163 18-40-97Z" />
          <path d="m483 217 127-58 114 40 30 189-150 47-126-80Z" />
        </g>
        <g className="command-map-water">
          <path d="M642-20 596 58 608 102 565 162 582 220 529 272 542 311 503 356 530 460" />
        </g>
        <g className="command-map-local-roads">
          <path d="m-30 131 171-44 118 37 130-38 146 31 223-39M-30 190l122-36 164 42 154-30 124 41 206-47M-20 281l151-40 100 38 123-27 128 43 258-38M-10 359l137-31 146 25 137-35 144 57 186-32M81-20l32 112-30 121 40 119-26 131M198-20l-21 121 40 91-21 111 45 143M342-20l-37 121 43 112-20 109 39 138M478-20l-20 107 38 115-22 120 31 128M671-20l-40 103 32 132-31 112 43 124" />
        </g>
        <g className="command-map-road-base">
          <path d="M48 410 67 337 106 244 151 192 260 169 360 211 424 307 489 347 579 382 709 420M72 56l188 113 161-11 68-50 89-37 114-44M360 211l61-53 68-50M424 307l-110 68-98 53M424 307l-13-86 48-76 119-74" />
        </g>
        <g className="command-map-roads">
          <path d="M48 410 67 337 106 244 151 192 260 169 360 211 424 307 489 347 579 382 709 420M72 56l188 113 161-11 68-50 89-37 114-44M360 211l61-53 68-50M424 307l-110 68-98 53M424 307l-13-86 48-76 119-74" />
        </g>
        <path className="command-map-critical-road" d="m360 211 31 47 33 49" />
        <path className="command-map-normal-road" d="m424 307 65 40 90 35" />
        <g className="command-map-place-labels">
          <text x="53" y="148">
            FAISALABAD
          </text>
          <text x="206" y="114">
            SHEIKHUPURA
          </text>
          <text x="465" y="54">
            GUJRANWALA
          </text>
          <text x="444" y="195">
            MURIDKE
          </text>
          <text x="485" y="414">
            LAHORE
          </text>
          <text x="640" y="238" transform="rotate(-65 640 238)">
            RAVI RIVER
          </text>
        </g>
        <g className="command-map-road-labels">
          <text x="192" y="164">
            M-2
          </text>
          <text x="399" y="110">
            N-5
          </text>
          <text x="477" y="232">
            M-11
          </text>
          <text x="39" y="282">
            M-4
          </text>
          <text x="251" y="402">
            M-3
          </text>
        </g>
        {commandCorridors.map((corridor) => {
          const inDivision =
            division === "All" || corridor.division === division
          return (
            <g
              key={corridor.id}
              className={`command-map-marker command-${corridor.severity} ${
                selected.id === corridor.id ? "command-marker-selected" : ""
              } ${inDivision ? "" : "command-marker-dimmed"}`}
              role="button"
              tabIndex={inDivision ? 0 : -1}
              aria-label={`${corridor.route} ${corridor.name}, CPI ${corridor.cpi.toFixed(2)}`}
              aria-pressed={selected.id === corridor.id}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => {
                if (inDivision) onSelect(corridor)
              }}
              onKeyDown={(event) => {
                if (
                  inDivision &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault()
                  onSelect(corridor)
                }
              }}
            >
              {riskVisible && (
                <g className="command-risk-cells" aria-hidden="true">
                  <polygon
                    points={hexagon(
                      corridor.x,
                      corridor.y,
                      corridor.severity === "critical" ? 30 : 21,
                    )}
                  />
                  <polygon
                    className="command-risk-cell-neighbor"
                    points={hexagon(corridor.x - 23, corridor.y + 13, 15)}
                  />
                  {corridor.severity !== "normal" && (
                    <polygon
                      className="command-cluster-pulse"
                      points={hexagon(corridor.x, corridor.y, 37)}
                    />
                  )}
                </g>
              )}
              <rect
                className="command-marker-hit"
                x={corridor.x - 18}
                y={corridor.y - 18}
                width="36"
                height="36"
              />
              <rect
                className="command-marker-focus"
                x={corridor.x - 11}
                y={corridor.y - 11}
                width="22"
                height="22"
              />
              <rect
                className="command-marker-core"
                x={corridor.x - 4}
                y={corridor.y - 4}
                width="8"
                height="8"
              />
              {["babu-sabu", "kala-shah-kaku", "ring-road"].includes(
                corridor.id,
              ) && (
                <g className="command-cluster-label">
                  <rect
                    x={corridor.x + 15}
                    y={corridor.y - 25}
                    width={corridor.id === "kala-shah-kaku" ? 134 : 116}
                    height="35"
                  />
                  <text x={corridor.x + 23} y={corridor.y - 12}>
                    {corridor.name.toUpperCase()}
                  </text>
                  <text
                    className="command-cluster-cpi"
                    x={corridor.x + 23}
                    y={corridor.y + 1}
                  >
                    CPI {corridor.cpi.toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          )
        })}
        {fleetVisible && (
          <g
            className="command-map-fleet"
            aria-label="Four illustrative coach positions"
          >
            {[
              [328, 211],
              [345, 246],
              [384, 291],
              [465, 355],
            ].map(([x, y], index) => (
              <g key={index} transform={`translate(${x} ${y}) rotate(34)`}>
                <rect x="-5" y="-9" width="10" height="18" />
                <path d="M-3-4h6M-3 4h6" />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  )
}

export default function CommandConsole() {
  const [division, setDivision] = useState<Division | "All">("All")
  const [selectedId, setSelectedId] = useState("babu-sabu")
  const [events, setEvents] = useState<CommandEvent[]>(initialCommandEvents)
  const [reviewFilter, setReviewFilter] = useState(false)
  const [riskVisible, setRiskVisible] = useState(true)
  const [fleetVisible, setFleetVisible] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [showAll, setShowAll] = useState(false)
  const [operations, setOperations] =
    useState<Record<string, "broadcast" | "convoy">>({})
  const [notice, setNotice] = useState(
    "Simulation workspace. No emergency systems are connected.",
  )
  const [action, setAction] = useState<"broadcast" | "convoy" | "about">(
    "about",
  )
  const [targetId, setTargetId] = useState("babu-sabu")
  const [confirmed, setConfirmed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nextEvent = useRef(4)
  const selected = commandCorridors.find(
    (corridor) => corridor.id === selectedId,
  )!
  const target = commandCorridors.find((corridor) => corridor.id === targetId)!
  const divisionCorridors = commandCorridors.filter(
    (corridor) => division === "All" || corridor.division === division,
  )
  const tableCorridors = showAll
    ? divisionCorridors
    : divisionCorridors.slice(0, 3)
  const filteredEvents = events.filter(
    (event) => !reviewFilter || !event.reviewed,
  )
  const unreviewed = events.filter((event) => !event.reviewed).length

  function changeDivision(value: Division | "All") {
    setDivision(value)
    setShowAll(false)
    const first = commandCorridors.find(
      (corridor) => value === "All" || corridor.division === value,
    )!
    setSelectedId(first.id)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }
  function openAction(value: typeof action) {
    setAction(value)
    setTargetId(selectedId)
    setConfirmed(false)
    dialogRef.current?.showModal()
  }
  function simulateAction() {
    if (!confirmed || action === "about") return
    const sequence = nextEvent.current++
    const message =
      action === "broadcast"
        ? `Demo diversion advisory drafted for ${target.route} ${target.name}. No NHMP broadcast was sent.`
        : `Demo convoy protocol staged for ${target.route} ${target.name}. No vehicles or emergency units were dispatched.`
    setEvents((current) => [
      {
        id: `session-${sequence}`,
        time: "NOW / DEMO",
        corridorId: target.id,
        severity: action === "broadcast" ? "critical" : "warning",
        category:
          action === "broadcast" ? "SIMULATED BROADCAST" : "SIMULATED CONVOY",
        title:
          action === "broadcast"
            ? "Diversion scenario recorded"
            : "Convoy scenario recorded",
        message,
        reviewed: false,
      },
      ...current,
    ])
    setOperations((current) => ({ ...current, [target.id]: action }))
    setNotice(message)
    setReviewFilter(false)
    dialogRef.current?.close()
  }
  function exportReport() {
    const url = URL.createObjectURL(
      new Blob([commandReportCsv(events)], { type: "text/csv;charset=utf-8" }),
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "safarguard-demo-24h-incidents.csv"
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice(
      `Downloaded demo 24h incident report: ${events.length} scenario records. Not a complete operational record.`,
    )
  }
  function resetDemo() {
    changeDivision("All")
    setEvents(initialCommandEvents)
    setOperations({})
    setReviewFilter(false)
    setRiskVisible(true)
    setFleetVisible(true)
    setNotice("Demo reset. No emergency systems are connected.")
    nextEvent.current = 4
  }

  return (
    <div className="command-console">
      <aside
        className="command-sidebar"
        aria-label="Command console navigation"
      >
        <div className="command-rescue-brand">
          <div className="command-rescue-badge">
            <span>RESCUE</span>
            <strong>1122</strong>
            <small>CONCEPT</small>
          </div>
          <div>
            PUNJAB EMERGENCY
            <br />
            SERVICE<small>HIGHWAY OPERATIONS</small>
          </div>
        </div>
        <a className="command-safar-brand" href="/">
          <CommandIcon name="shield" />
          <span>
            Safar<strong>Guard</strong>
            <small>FLEET TELEMATICS</small>
          </span>
        </a>
        <p className="command-nav-label">COMMAND WORKSPACE</p>
        <button
          className={`command-overview ${
            division === "All" ? "command-nav-active" : ""
          }`}
          onClick={() => changeDivision("All")}
          aria-pressed={division === "All"}
        >
          <CommandIcon name="overview" />
          <span>Regional overview</span>
          <span>01</span>
        </button>
        <button className="command-report-link" onClick={exportReport}>
          <CommandIcon name="download" />
          <span>24h incident report</span>
          <CommandIcon name="arrow" />
        </button>
        <div className="command-divisions-heading">
          <span>MONITORED DIVISIONS</span>
          <span>05</span>
        </div>
        <div className="command-division-list">
          {commandDivisions.map((item, index) => (
            <button
              key={item}
              aria-pressed={division === item}
              className={division === item ? "command-division-active" : ""}
              onClick={() => changeDivision(item)}
            >
              <span className="command-division-index">0{index + 1}</span>
              <span>{item}</span>
              <small>
                {String(
                  commandCorridors.filter(
                    (corridor) => corridor.division === item,
                  ).length,
                ).padStart(2, "0")}
              </small>
            </button>
          ))}
        </div>
        <div className="command-connectivity">
          <div>
            <i />
            <strong>10 corridors monitored</strong>
          </div>
          <p>SIMULATED FEED / NOT LIVE</p>
          <span>
            <span />
            Sample telemetry available
          </span>
        </div>
        <div className="command-other-views">
          <span>OTHER SAFARGUARD VIEWS</span>
          <a href="/">
            Web portal <CommandIcon name="arrow" />
          </a>
          <a href="/night-hud">
            Driver Night HUD <CommandIcon name="arrow" />
          </a>
          <a href="/safety-overlay">
            Captain safety overlay <CommandIcon name="arrow" />
          </a>
        </div>
        <div className="command-sidebar-bottom">
          <span className="command-operator">OP</span>
          <div>
            Training operator<small>LOCAL DEMO SESSION</small>
          </div>
          <button
            aria-label="About this command console"
            onClick={() => openAction("about")}
          >
            <CommandIcon name="info" />
          </button>
        </div>
      </aside>

      <header className="command-topbar">
        <div>
          <span>OPERATIONS</span>
          <span>/</span>
          <strong>CENTRAL PUNJAB</strong>
        </div>
        <div className="command-topbar-end">
          <span className="command-simulation-tag">
            <i /> TRAINING SIMULATION
          </span>
          <span className="command-clock">
            <span>NIGHT SHIFT</span>01:42 <small>PKT</small>
          </span>
          <button onClick={resetDemo} aria-label="Reset command demo">
            <CommandIcon name="reset" />
          </button>
        </div>
      </header>

      <main className="command-workspace">
        <div className="command-page-heading">
          <div>
            <p>RESCUE 1122 × SAFARGUARD</p>
            <h1>
              Central Punjab collision risk heatmap
              <span>& multi-corridor telemetry</span>
            </h1>
          </div>
          <div className="command-region-count">
            <strong>{String(divisionCorridors.length).padStart(2, "0")}</strong>
            <span>{division === "All" ? "CORRIDORS" : "IN DIVISION"}</span>
          </div>
        </div>
        <section
          className="command-map-panel"
          aria-labelledby="command-map-title"
        >
          <div className="command-map-toolbar">
            <h2 id="command-map-title">
              <span />
              {division === "All"
                ? "REGIONAL RISK MAP"
                : division.toUpperCase()}
            </h2>
            <div>
              <button
                onClick={() => setRiskVisible(!riskVisible)}
                aria-pressed={riskVisible}
              >
                <CommandIcon name="layers" />
                Risk cells
              </button>
              <button
                onClick={() => setFleetVisible(!fleetVisible)}
                aria-pressed={fleetVisible}
              >
                <CommandIcon name="convoy" />
                Fleet
              </button>
            </div>
          </div>
          <div className="command-map-canvas">
            <CommandMap
              division={division}
              selected={selected}
              onSelect={(corridor) => setSelectedId(corridor.id)}
              riskVisible={riskVisible}
              fleetVisible={fleetVisible}
              zoom={zoom}
              offset={offset}
              onOffset={setOffset}
            />
            <div className="command-map-orientation" aria-hidden="true">
              <span>N</span>
              <i />
            </div>
            <div
              className="command-map-controls"
              role="group"
              aria-label="Map view controls"
            >
              <button
                aria-label="Zoom map in"
                disabled={zoom >= 1.8}
                onClick={() =>
                  setZoom((value) =>
                    Math.min(1.8, Number((value + 0.2).toFixed(1))),
                  )
                }
              >
                +
              </button>
              <button
                aria-label="Zoom map out"
                disabled={zoom <= 0.8}
                onClick={() =>
                  setZoom((value) =>
                    Math.max(0.8, Number((value - 0.2).toFixed(1))),
                  )
                }
              >
                −
              </button>
              <button
                aria-label="Fit map to region"
                onClick={() => {
                  setZoom(1)
                  setOffset({ x: 0, y: 0 })
                }}
              >
                <CommandIcon name="locate" />
              </button>
            </div>
            <div className="command-map-scale">
              <span />
              10 KM / SCHEMATIC
            </div>
            <span className="command-map-geohash">
              DEMO GEOHASH CELLS · NOT GEOGRAPHICALLY VERIFIED
            </span>
          </div>
          <div
            className={`command-map-inspector command-${selected.severity}`}
            aria-live="polite"
          >
            <span className="command-route-code">{selected.route}</span>
            <div className="command-inspector-name">
              <strong>{selected.name}</strong>
              <small>DEMO CELL / {selected.cell}</small>
            </div>
            <div>
              <span>VISIBILITY</span>
              <strong>
                {selected.visibility}
                <small> m</small>
              </strong>
            </div>
            <div>
              <span>ROAD GRIP</span>
              <strong>
                {selected.friction.toFixed(2)}
                <small> μ</small>
              </strong>
            </div>
            <div className="command-inspector-risk">
              <span>CPI INDEX</span>
              <strong>{selected.cpi.toFixed(2)}</strong>
            </div>
          </div>
          <div className="command-map-legend">
            <div>
              <span>
                <i className="command-critical" />
                Elevated
              </span>
              <span>
                <i className="command-warning" />
                Caution
              </span>
              <span>
                <i className="command-normal" />
                Lower
              </span>
            </div>
            <span>UNVALIDATED SCENARIO INDEX</span>
          </div>
        </section>
        <div
          className="command-quick-actions"
          role="group"
          aria-label="Simulated command actions"
        >
          <button
            className="command-primary-action"
            onClick={() => openAction("broadcast")}
          >
            <CommandIcon name="broadcast" />
            <span>Broadcast NHMP interchange diversion</span>
          </button>
          <button onClick={() => openAction("convoy")}>
            <CommandIcon name="convoy" />
            <span>Trigger convoys</span>
          </button>
          <button onClick={exportReport}>
            <CommandIcon name="download" />
            <span>Export 24h incident report</span>
          </button>
        </div>
        <section
          className="command-telemetry"
          aria-labelledby="command-telemetry-title"
        >
          <div className="command-telemetry-heading">
            <h2 id="command-telemetry-title">MULTI-CORRIDOR TELEMETRY</h2>
            <button
              disabled={divisionCorridors.length <= 3}
              aria-expanded={showAll}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? "Show priority rows"
                : `View all ${divisionCorridors.length}`}
              <CommandIcon name="arrow" />
            </button>
          </div>
          <div
            className="command-table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Sample corridor telemetry table"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">CORRIDOR</th>
                  <th scope="col">VISIBILITY</th>
                  <th scope="col">GRIP</th>
                  <th scope="col">CPI</th>
                  <th scope="col">SCENARIO CAP</th>
                  <th scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tableCorridors.map((corridor) => (
                  <tr
                    key={corridor.id}
                    className={`${
                      selectedId === corridor.id ? "command-row-selected" : ""
                    } command-${corridor.severity}`}
                  >
                    <th scope="row">
                      <button
                        onClick={() => setSelectedId(corridor.id)}
                        aria-pressed={selectedId === corridor.id}
                      >
                        <span>{corridor.route}</span>
                        {corridor.name}
                      </button>
                    </th>
                    <td>
                      {corridor.visibility}
                      <small> m</small>
                    </td>
                    <td>{corridor.friction.toFixed(2)}</td>
                    <td className="command-table-cpi">
                      {corridor.cpi.toFixed(2)}
                    </td>
                    <td>
                      {corridor.speed}
                      <small> km/h</small>
                    </td>
                    <td>
                      <span className="command-table-status">
                        <i />
                        {operations[corridor.id] === "broadcast"
                          ? "Demo diversion"
                          : operations[corridor.id] === "convoy"
                            ? "Demo convoy"
                            : corridor.severity === "critical"
                              ? "Diversion sample"
                              : corridor.severity === "warning"
                                ? "Caution sample"
                                : "Monitoring"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <aside
        className="command-escalation"
        aria-label="Emergency escalation stream"
      >
        <div className="command-stream-heading">
          <div>
            <p>EMERGENCY ESCALATION</p>
            <h2>
              Incident stream<span>{String(unreviewed).padStart(2, "0")}</span>
            </h2>
          </div>
          <span className="command-stream-mark">
            <CommandIcon name="broadcast" />
          </span>
        </div>
        <div
          className="command-stream-filters"
          role="group"
          aria-label="Filter incident stream"
        >
          <button
            aria-pressed={!reviewFilter}
            className={!reviewFilter ? "command-stream-active" : ""}
            onClick={() => setReviewFilter(false)}
          >
            All events <span>{events.length}</span>
          </button>
          <button
            aria-pressed={reviewFilter}
            className={reviewFilter ? "command-stream-active" : ""}
            onClick={() => setReviewFilter(true)}
          >
            Needs review <span>{unreviewed}</span>
          </button>
        </div>
        <div className="command-event-list">
          {filteredEvents.length === 0 ? (
            <div className="command-empty-stream">
              <CommandIcon name="check" />
              <strong>All scenario events reviewed</strong>
              <p>No live feed is connected.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <article
                key={event.id}
                className={`command-event command-${event.severity} ${
                  event.reviewed ? "command-event-reviewed" : ""
                }`}
              >
                <div className="command-event-top">
                  <span>
                    <i />
                    {event.category}
                  </span>
                  <time>{event.time}</time>
                </div>
                <h3>{event.title}</h3>
                <p>{event.message}</p>
                <div className="command-event-bottom">
                  <span>SCENARIO EVENT</span>
                  <button
                    aria-label={`${
                      event.reviewed ? "Unmark" : "Mark"
                    } ${event.title} as reviewed`}
                    aria-pressed={event.reviewed}
                    onClick={() =>
                      setEvents((current) =>
                        current.map((item) =>
                          item.id === event.id
                            ? { ...item, reviewed: !item.reviewed }
                            : item,
                        ),
                      )
                    }
                  >
                    {event.reviewed && <CommandIcon name="check" />}
                    {event.reviewed ? "Reviewed" : "Mark reviewed"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <section
          className="command-fleet-context"
          aria-labelledby="command-fleet-title"
        >
          <div>
            <h2 id="command-fleet-title">SCENARIO FLEET</h2>
            <span>04 COACHES</span>
          </div>
          {["041", "067", "112", "138"].map((id, index) => (
            <div className="command-fleet-row" key={id}>
              <CommandIcon name="convoy" />
              <span>
                DWO-{id}
                <small>
                  {index % 2 === 0
                    ? "Ring Road diversion"
                    : "M-2 exit approach"}
                </small>
              </span>
              <span>REROUTED</span>
            </div>
          ))}
        </section>
        <div className="command-stream-footer">
          <CommandIcon name="shield" />
          <p>
            Review before response.
            <span>All actions stay inside this simulation.</span>
          </p>
        </div>
      </aside>

      <footer className="command-statusbar">
        <span role="status" aria-live="polite">
          {notice}
        </span>
        <span>
          INDEPENDENT CONCEPT · NOT AN OFFICIAL RESCUE 1122 / NHMP SYSTEM
        </span>
      </footer>

      <dialog
        className="command-dialog"
        ref={dialogRef}
        aria-labelledby="command-dialog-title"
      >
        <div className="command-dialog-top">
          <span>
            {action === "about"
              ? "WORKSPACE INFORMATION"
              : "SIMULATION CONFIRMATION"}
          </span>
          <button
            aria-label="Close command dialog"
            onClick={() => dialogRef.current?.close()}
          >
            <CommandIcon name="close" />
          </button>
        </div>
        <h2 id="command-dialog-title">
          {action === "about"
            ? "A CONTROL ROOM CONCEPT."
            : action === "broadcast"
              ? "SIMULATE A DIVERSION."
              : "SIMULATE A CONVOY."}
        </h2>
        {action === "about" ? (
          <>
            <p>
              This independent Rescue 1122 and SafarGuard interface is a local
              training concept. The ten corridors, geohash cells, map, operator,
              fleet and events are illustrative. It is not connected to Rescue
              1122, NHMP, Careem, inDrive, Daewoo, road sensors or emergency
              dispatch.
            </p>
            <p>
              CPI is an unvalidated scenario index, not a probability. The
              displayed speed caps are scripted examples, not outputs of the
              portal’s stopping-distance model or official safe-speed guidance.
              Pulsing cells show scenario severity, not live detections.
            </p>
            <p>
              The 24h CSV contains only the example events and locally simulated
              actions shown in this session. It is not a complete 24-hour
              operational record. No action sends a broadcast, deploys a convoy
              or controls a vehicle.
            </p>
          </>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              simulateAction()
            }}
          >
            <label
              className="command-target-label"
              htmlFor="command-action-target"
            >
              TARGET CORRIDOR
            </label>
            <select
              id="command-action-target"
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
            >
              {commandCorridors.map((corridor) => (
                <option key={corridor.id} value={corridor.id}>
                  {corridor.route} / {corridor.name}
                </option>
              ))}
            </select>
            <div className="command-action-preview">
              <span>LOCAL SCENARIO PREVIEW</span>
              <p>
                {action === "broadcast"
                  ? `Draft a diversion advisory for ${target.route} ${target.name}. Record the example in the incident stream.`
                  : `Stage a convoy scenario for ${target.route} ${target.name}. Record the example in the incident stream.`}
              </p>
            </div>
            <label className="command-confirm-label">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>
                I understand this updates the demo only. No live message or
                dispatch will be sent.
              </span>
            </label>
            <button
              className="command-confirm-action"
              disabled={!confirmed}
              type="submit"
            >
              {action === "broadcast"
                ? "Simulate broadcast"
                : "Simulate convoy"}
              <CommandIcon name="arrow" />
            </button>
          </form>
        )}
      </dialog>
    </div>
  )
}
