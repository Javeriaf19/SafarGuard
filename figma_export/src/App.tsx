import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { maximumModelSpeed, stoppingDistance } from "./lib/safety"
import SafetyOverlay from "./SafetyOverlay"
import CorridorMap from "./CorridorMap"
import GroundRealityPanel from "./GroundRealityPanel"

const CommandConsole = lazy(() => import("./CommandConsole"))

type Corridor = {
  id: string
  route: string
  name: string
  journey: string
  location: string
  visibility: number
  friction: number
  condition: string
}

type Surface = "dry" | "wet" | "sample"

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="/"
      aria-label="SafarGuard home"
    >
      <svg
        className="brand-mark"
        width="35"
        height="37"
        viewBox="0 0 35 37"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M17.5 2 32 8v13c0 7-14.5 14-14.5 14S3 28 3 21V8L17.5 2Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m13 12-4 14m13-14 4 14M17.5 12v5m0 4v5"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span>
        Safar<span className="brand-weight">Guard</span>
        <small>HIGHWAY INTELLIGENCE</small>
      </span>
    </a>
  )
}

function Header({ legal = false }: { legal?: boolean }) {
  return (
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/#corridors">Corridors</a>
        <a href="/#simulator">Simulator</a>
        <a href="/#ai-engine">AI Physics Core</a>
        <a href="/#methodology">The Science</a>
        <a href="/night-hud">Night HUD</a>
        <a href="/safety-overlay">Careem App HUD</a>
        <a href="/command-console">Command Console</a>
      </nav>
      <div className="header-end">
        <span className="demo-status">
          <span /> DEMO ENVIRONMENT
        </span>
        <a
          className="header-cta"
          href="https://safarguard.streamlit.app"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Streamlit Python Engine in New Tab"
          style={{
            background: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
            color: "#ffffff",
            fontWeight: 700,
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.45rem 0.85rem",
            borderRadius: "6px"
          }}
        >
          <span>⚡ AI Physics Core ↗</span>
        </a>
        <a className="header-cta" href={legal ? "/" : "#corridors"}>
          {legal ? "Back to overview" : "Explore"}
          <Arrow />
        </a>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand footer />
        <p>
          Built for the roads we share.
          <br />
          Pakistan highway safety research.
        </p>
        <a className="footer-back" href="#top">
          BACK TO TOP <Arrow diagonal />
        </a>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} SAFARGUARD · RESEARCH PROTOTYPE
        </span>
        <div>
          <a href="/data/corridors.json" download>
            Demo dataset <Arrow diagonal />
          </a>
          <a href="https://safarguard.streamlit.app" target="_blank" rel="noopener noreferrer">
            Live Streamlit AI Core <Arrow diagonal />
          </a>
          <a href="/terms">Terms of service</a>
          <a href="/privacy">Privacy policy</a>
          <a href="/night-hud">Night HUD</a>
        </div>
        <span>NOT AN OFFICIAL NHMP SERVICE</span>
      </div>
    </footer>
  )
}

function isCorridor(value: unknown): value is Corridor {
  if (!value || typeof value !== "object") return false
  const item = value as Record<string, unknown>
  return (
    ["id", "route", "name", "journey", "location", "condition"].every(
      (key) => typeof item[key] === "string",
    ) &&
    typeof item.visibility === "number" &&
    Number.isFinite(item.visibility) &&
    item.visibility > 0 &&
    typeof item.friction === "number" &&
    Number.isFinite(item.friction) &&
    item.friction > 0 &&
    item.friction <= 1
  )
}

function RoadDiagram({
  reaction,
  braking,
  visibility,
}: {
  reaction: number
  braking: number
  visibility: number
}) {
  const total = reaction + braking
  const limit =
    Math.ceil(Math.max(150, total * 1.15, visibility * 1.3) / 50) * 50
  const x = (metres: number) => 55 + (metres / limit) * 600
  return (
    <svg
      className="road-diagram"
      viewBox="0 0 720 226"
      role="img"
      aria-label={`Reaction distance ${reaction.toFixed(1)} metres, braking distance ${braking.toFixed(1)} metres, visibility ${visibility} metres.`}
    >
      <defs>
        <pattern
          id="fog-hatching"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="9"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        className="fog-area"
        x={x(visibility)}
        y="37"
        width={665 - x(visibility)}
        height="106"
        fill="url(#fog-hatching)"
      />
      <path className="road-edge" d="M25 37h655M25 143h655" />
      <path className="lane-line" d="M25 90h655" />
      <rect
        className="reaction-bar"
        x="55"
        y="66"
        width={Math.max(0, x(reaction) - 55)}
        height="13"
      />
      <rect
        className="braking-bar"
        x={x(reaction)}
        y="66"
        width={Math.max(0, x(total) - x(reaction))}
        height="13"
      />
      <line
        className="visibility-line"
        x1={x(visibility)}
        x2={x(visibility)}
        y1="18"
        y2="158"
      />
      <text
        className="diagram-label visibility-label"
        x={x(visibility) + 7}
        y="24"
      >
        VISIBILITY LIMIT
      </text>
      <line
        className="stop-line"
        x1={x(total)}
        x2={x(total)}
        y1="58"
        y2="125"
      />
      <text className="diagram-label" x={Math.min(x(total) + 7, 613)} y="122">
        STOP
      </text>
      <g className="diagram-car" transform="translate(30 99)">
        <rect x="0" y="0" width="42" height="22" rx="3" />
        <path d="M10 2v18M31 2v18M12 4h16v14H12Z" />
        <path d="M7-2h7m15 0h7M7 24h7m15 0h7" />
      </g>
      {Array.from({ length: 7 }, (_, index) => {
        const metres = (limit / 6) * index
        return (
          <g key={index}>
            <line
              className="scale-tick"
              x1={x(metres)}
              x2={x(metres)}
              y1="153"
              y2="159"
            />
            <text
              className="scale-label"
              x={x(metres)}
              y="178"
              textAnchor="middle"
            >
              {Math.round(metres)} m
            </text>
          </g>
        )
      })}
      <text className="diagram-caption" x="55" y="212">
        SCHEMATIC · LEVEL ROAD · NOT TO VEHICLE SCALE
      </text>
    </svg>
  )
}

function App() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/"
  if (pathname === "/command-console")
    return (
      <Suspense
        fallback={
          <main className="simulator-section section-shell" role="status">
            Loading command console...
          </main>
        }
      >
        <CommandConsole />
      </Suspense>
    )
  if (pathname === "/safety-overlay") return <SafetyOverlay />
  if (pathname === "/night-hud") return <NightHud />
  if (pathname === "/terms" || pathname === "/privacy")
    return <LegalPage kind={pathname === "/terms" ? "terms" : "privacy"} />
  return <Dashboard />
}

function Dashboard() {
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedId, setSelectedId] = useState("m2")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All corridors")
  const [speed, setSpeed] = useState(60)
  const [surface, setSurface] = useState<Surface>("sample")
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        target?.closest("input, textarea, select, [contenteditable]")
      )
        return
      event.preventDefault()
      document.getElementById("corridor-search")?.focus()
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError("")
    fetch("/data/corridors.json", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Dataset could not be loaded.")
        return response.json()
      })
      .then((data: unknown) => {
        if (
          !Array.isArray(data) ||
          data.length === 0 ||
          !data.every(isCorridor)
        )
          throw new Error("The sample dataset is not in the expected format.")
        setCorridors(data)
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setError(
          reason instanceof Error
            ? reason.message
            : "Dataset could not be loaded.",
        )
        setLoading(false)
      })
    return () => controller.abort()
  }, [refreshKey])

  const selected =
    corridors.find((corridor) => corridor.id === selectedId) ?? corridors[0]
  const friction =
    surface === "dry"
      ? 0.7
      : surface === "wet"
        ? 0.45
        : (selected?.friction ?? 0.28)
  const visibility = selected?.visibility ?? 28
  const distances = stoppingDistance(speed, friction)
  const dry = stoppingDistance(speed, 0.7)
  const margin = visibility - distances.total
  const filtered = corridors.filter((corridor) => {
    const matchesRoute =
      filter === "All corridors" ||
      corridor.route === filter ||
      (filter === "GT Road" && corridor.route === "N-5")
    return (
      matchesRoute &&
      `${corridor.route} ${corridor.name} ${corridor.journey} ${corridor.location} ${
        corridor.id === "n5" ? "GT Road" : ""
      }`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )
  })

  return (
    <div id="top">
      <div className="utility-bar">
        <span>PAKISTAN / HIGHWAY SAFETY RESEARCH</span>
        <span>LOW VISIBILITY. HIGHER AWARENESS.</span>
        <a href="tel:130">
          MOTORWAY HELPLINE <b>130</b>
          <Arrow diagonal />
        </a>
      </div>
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="small-rule" /> AHEAD OF THE HAZARD
            </p>
            <h1 id="hero-title">
              DON’T OUTDRIVE
              <br />
              WHAT YOU
              <br />
              <span>CAN SEE.</span>
              <span className="heading-square" />
            </h1>
            <p className="hero-description">
              Smog hides the road. Moisture changes the grip.
              <br className="desktop-break" /> Know the stopping distance
              between you and the unexpected.
            </p>
            <a className="primary-button" href="#simulator">
              Find your stopping distance <Arrow />
            </a>
            <div className="hero-footnote">
              <span className="hero-index">01 / 03</span>
              <span>
                M-2 · M-11 · GT ROAD
                <br />
                <b>Three corridors. One critical calculation.</b>
              </span>
            </div>
          </div>
          <figure className="hero-visual">
            <div className="hero-photo">
              <img
                src="/images/wet-motorway.jpg"
                alt="Vehicles travelling on a wet motorway with spray reducing visibility"
                fetchPriority="high"
              />
              <div className="photo-topline">
                <span>
                  <span className="record-square" /> ROAD CONDITION STUDY
                </span>
                <span>REF. 001</span>
              </div>
              <div className="viewfinder" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <span>REDUCED SIGHT DISTANCE</span>
              </div>
              <figcaption className="photo-caption">
                PROJECT-SUPPLIED REFERENCE IMAGE · NOT A LIVE CAMERA
              </figcaption>
            </div>
            <div className="observation-strip">
              <div className="observation-title">
                <span className="eyebrow">SAMPLE CORRIDOR</span>
                <strong>
                  M-2 <span>Babu Sabu</span>
                </strong>
              </div>
              <div>
                <span>VISIBILITY</span>
                <strong>
                  28<small> m</small>
                </strong>
              </div>
              <div>
                <span>ROAD GRIP</span>
                <strong>
                  0.28<small> μ</small>
                </strong>
              </div>
              <span className="observation-tag">
                LOW
                <br />
                VISIBILITY <Arrow diagonal />
              </span>
            </div>
          </figure>
        </section>

        <div className="demo-notice">
          <span className="notice-symbol" aria-hidden="true">
            i
          </span>
          <p>
            <strong>A working demo, not a live traffic feed.</strong> Conditions
            are illustrative. Follow NHMP directions and posted restrictions.
          </p>
          <a href="#methodology">
            Understand the model <Arrow diagonal />
          </a>
        </div>

        <section
          className="corridor-section section-shell"
          id="corridors"
          aria-labelledby="corridor-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / CORRIDOR MONITOR</p>
              <h2 id="corridor-title">READ THE ROAD.</h2>
            </div>
            <p>
              Visibility, traction and a modelled speed ceiling.
              <br />
              The conditions that matter, without the noise.
            </p>
          </div>
          <div className="monitor-toolbar">
            <div
              className="route-filters"
              role="group"
              aria-label="Filter corridors"
            >
              {["All corridors", "M-2", "M-11", "GT Road"].map((route) => (
                <button
                  className={filter === route ? "active" : ""}
                  aria-pressed={filter === route}
                  onClick={() => setFilter(route)}
                  key={route}
                >
                  {route}
                  {route === "All corridors" && <span>03</span>}
                </button>
              ))}
            </div>
            <label className="corridor-search">
              <svg
                width="17"
                height="17"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" />
                <path d="m12 12 5 5" stroke="currentColor" />
              </svg>
              <input
                id="corridor-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search route or interchange"
                aria-label="Search route or interchange"
              />
              <kbd>/</kbd>
            </label>
          </div>
          <div
            className="table-scroll"
            role="region"
            aria-label="Corridor conditions. Scroll horizontally on smaller screens."
            tabIndex={0}
          >
            <table className="corridor-table" aria-busy={loading}>
              <thead>
                <tr>
                  <th scope="col">CORRIDOR / LOCATION</th>
                  <th scope="col">VISIBILITY</th>
                  <th scope="col">ROAD GRIP</th>
                  <th scope="col">
                    MODEL CEILING{" "}
                    <span title="Rounded down to the nearest 5 km/h. Not a guarantee of safe travel.">
                      ⓘ
                    </span>
                  </th>
                  <th scope="col">CONDITIONS</th>
                  <th scope="col">
                    <span className="sr-only">Select corridor</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [0, 1, 2].map((row) => (
                    <tr className="skeleton-row" key={row}>
                      <td colSpan={6}>
                        <span className="skeleton skeleton-route" />
                        <span className="skeleton" />
                        <span className="skeleton" />
                        <span className="skeleton" />
                        <span className="skeleton" />
                        <span className="sr-only">
                          Loading corridor conditions
                        </span>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="empty-state" role="alert">
                      {error}{" "}
                      <button
                        className="text-button"
                        onClick={() => setRefreshKey((key) => key + 1)}
                      >
                        Try again <Arrow />
                      </button>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      No corridors match “{query}”.{" "}
                      <button
                        className="text-button"
                        onClick={() => {
                          setQuery("")
                          setFilter("All corridors")
                        }}
                      >
                        Clear filters <Arrow />
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((corridor) => (
                    <tr
                      key={corridor.id}
                      className={
                        selected?.id === corridor.id ? "selected-row" : ""
                      }
                    >
                      <td>
                        <div className="route-cell">
                          <span className="route-badge">{corridor.route}</span>
                          <span>
                            <strong>{corridor.name}</strong>
                            <small>{corridor.journey}</small>
                          </span>
                        </div>
                      </td>
                      <td className="table-number">
                        {corridor.visibility}
                        <small> m</small>
                        <span className="visibility-meter">
                          <i
                            style={{
                              width: `${Math.min(corridor.visibility, 100)}%`,
                            }}
                          />
                        </span>
                      </td>
                      <td className="table-number">
                        {corridor.friction.toFixed(2)}
                        <small> μ</small>
                      </td>
                      <td className="table-number speed-ceiling">
                        {maximumModelSpeed(
                          corridor.visibility,
                          corridor.friction,
                        )}
                        <small> km/h</small>
                      </td>
                      <td>
                        <span
                          className={`condition-label ${
                            corridor.visibility >= 40
                              ? "condition-moderate"
                              : ""
                          }`}
                        >
                          <i />
                          {corridor.condition}
                        </span>
                      </td>
                      <td>
                        <button
                          className="select-route"
                          aria-label={`Use ${corridor.route} ${corridor.name} conditions`}
                          aria-pressed={selected?.id === corridor.id}
                          onClick={() => {
                            setSelectedId(corridor.id)
                            setSurface("sample")
                          }}
                        >
                          <Arrow />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="monitor-bottom">
            <span>
              <span className="status-square" /> STATIC RESEARCH DATASET{" "}
              <span className="dataset-divider">/</span>{" "}
              {loading ? "LOADING" : `${filtered.length} CORRIDORS SHOWN`}
            </span>
            <button
              className="text-button"
              disabled={loading}
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Reload sample data{" "}
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14.5 7A6 6 0 1 0 15 11M14.5 2v5h-5"
                  stroke="currentColor"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Live Interactive Punjab Motorway Leaflet Radar Map */}
        <div className="section-shell">
          <CorridorMap />
        </div>

        {/* Empirical Ground Reality & National News Verification */}
        <div className="section-shell">
          <GroundRealityPanel />
        </div>

        <section
          className="simulator-section"
          id="simulator"
          aria-labelledby="simulator-title"
        >
          <div className="section-shell">
            <div className="section-heading simulator-heading">
              <div>
                <p className="eyebrow">02 / STOPPING DISTANCE LAB</p>
                <h2 id="simulator-title">SPEED CHANGES EVERYTHING.</h2>
              </div>
              <span className="interactive-tag">
                <span /> INTERACTIVE SIMULATOR
              </span>
            </div>
            <div className="simulator-layout">
              <div className="simulator-controls">
                <div className="control-heading">
                  <span>YOUR INPUTS</span>
                  <span>01 / 03</span>
                </div>
                <label className="control-label" htmlFor="scenario">
                  <span>01</span> Corridor conditions
                </label>
                <select
                  id="scenario"
                  value={selected?.id ?? "m2"}
                  disabled={loading || !selected}
                  onChange={(event) => {
                    setSelectedId(event.target.value)
                    setSurface("sample")
                  }}
                >
                  {!selected && (
                    <option value="m2">
                      M-2 · Babu Sabu (default example)
                    </option>
                  )}
                  {corridors.map((corridor) => (
                    <option value={corridor.id} key={corridor.id}>
                      {corridor.route} · {corridor.name}
                    </option>
                  ))}
                </select>
                <div className="speed-label-row">
                  <label className="control-label" htmlFor="speed">
                    <span>02</span> Vehicle speed
                  </label>
                  <output htmlFor="speed">
                    {speed}
                    <small> km/h</small>
                  </output>
                </div>
                <input
                  id="speed"
                  className="speed-slider"
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  aria-valuetext={`${speed} kilometres per hour`}
                />
                <div className="slider-labels">
                  <span>10 KM/H</span>
                  <span>120 KM/H</span>
                </div>
                <fieldset className="surface-control">
                  <legend className="control-label">
                    <span>03</span> Road surface
                  </legend>
                  <div className="surface-options">
                    {([
                      { id: "dry", label: "Dry" },
                      { id: "wet", label: "Wet" },
                      { id: "sample", label: "Smog film" },
                    ] as const).map((item) => (
                      <button
                        key={item.id}
                        aria-pressed={surface === item.id}
                        className={surface === item.id ? "active" : ""}
                        onClick={() => setSurface(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="input-assumptions">
                  <span>
                    FRICTION COEFFICIENT <b>μ {friction.toFixed(2)}</b>
                  </span>
                  <span>
                    REACTION TIME <b>2.5 SEC</b>
                  </span>
                </div>
                <button
                  className="reset-button"
                  onClick={() => {
                    setSpeed(60)
                    setSurface("sample")
                    setSelectedId("m2")
                  }}
                >
                  Reset inputs <span>↺</span>
                </button>
              </div>
              <div className="simulator-results">
                <div className="result-top">
                  <span className="eyebrow">TOTAL STOPPING DISTANCE</span>
                  <span className="result-scenario">
                    {selected?.route ?? "M-2"} /{" "}
                    {surface === "sample" ? "SMOG FILM" : surface.toUpperCase()}
                  </span>
                </div>
                <div className="distance-result">
                  <output aria-live="polite" aria-atomic="true">
                    {distances.total.toFixed(1)}
                    <span>METRES</span>
                  </output>
                  <p>
                    At {speed} km/h, you travel{" "}
                    <strong>{distances.reaction.toFixed(1)} m</strong>
                    <br />
                    before braking even begins.
                  </p>
                </div>
                <div className="diagram-legend">
                  <span>
                    <i className="reaction-key" />
                    Reaction distance
                  </span>
                  <span>
                    <i className="braking-key" />
                    Braking distance
                  </span>
                  <span>
                    <i className="visibility-key" />
                    Visible road
                  </span>
                </div>
                <RoadDiagram
                  reaction={distances.reaction}
                  braking={distances.braking}
                  visibility={visibility}
                />
                <div
                  className={`risk-verdict ${
                    margin >= 0 ? "within-visibility" : ""
                  }`}
                  role="status"
                >
                  <span className="verdict-symbol" aria-hidden="true">
                    {margin >= 0 ? "✓" : "!"}
                  </span>
                  <div>
                    <strong>
                      {Math.abs(margin).toFixed(1)} m{" "}
                      {margin < 0
                        ? "beyond your visibility"
                        : "inside your visibility"}
                    </strong>
                    <p>
                      {margin < 0
                        ? "The model needs more road than you can see. Reduce speed."
                        : "Within the modelled sight distance. This is not a safety guarantee."}
                    </p>
                  </div>
                  <span className="verdict-state">
                    {margin < 0 ? "LIMIT EXCEEDED" : "WITHIN MODEL"}
                  </span>
                </div>
                <div className="result-breakdown">
                  <span>
                    REACTION <b>{distances.reaction.toFixed(1)} m</b>
                  </span>
                  <span>
                    BRAKING <b>{distances.braking.toFixed(1)} m</b>
                  </span>
                  <span>
                    VS. DRY ROAD{" "}
                    <b>
                      +{Math.max(0, distances.total - dry.total).toFixed(1)} m
                    </b>
                  </span>
                </div>
              </div>
            </div>
            <div className="simulator-disclaimer">
              <span>AN ESTIMATE, NOT A PROMISE.</span>
              <p>
                Passenger-vehicle model on a level road. Tyres, gradient,
                vehicle load and driver response change real-world stopping
                distance. Never use this tool while driving.
              </p>
            </div>
          </div>
        </section>

        {/* Section 03: Live Streamlit AI Physics Core Embed (Method 2 Integration) */}
        <section
          className="section-shell"
          id="ai-engine"
          aria-labelledby="ai-engine-title"
          style={{ marginTop: "4rem", marginBottom: "4rem" }}
        >
          <div className="section-heading mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="eyebrow" style={{ color: "#06b6d4" }}>
                03 / LIVE CLOUD PYTHON ENGINE (STREAMLIT COMMUNITY CLOUD)
              </p>
              <h2 id="ai-engine-title" style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.5rem 0" }}>
                AASHTO Stopping Kinematics & DeepMind Gemma 4 Vision
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "48rem" }}>
                Directly interact with the cloud-hosted Python Streamlit engine below, running live telemetry feeds, real-time Open-Meteo atmospheric readings, and AASHTO hazard forecasting without leaving this portal.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <a
                href="https://safarguard.streamlit.app"
                target="_blank"
                rel="noopener noreferrer"
                className="header-cta"
                style={{
                  background: "#0891b2",
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none"
                }}
              >
                <span>Launch in Full Screen ↗</span>
              </a>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              background: "#050811",
              border: "1px solid #1e293b",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
          >
            <iframe
              src="https://safarguard.streamlit.app/?embed=true"
              style={{
                width: "100%",
                minHeight: "850px",
                border: "none"
              }}
              title="SafarGuard Live Streamlit AI & Physics Core"
              loading="lazy"
            />
          </div>
        </section>

        <section
          className="research-section section-shell"
          id="methodology"
          aria-labelledby="research-title"
        >
          <div className="research-image">
            <img
              src="/images/smog-highway-reference.png"
              alt="Project-supplied photograph of highway traffic in dense smog, with an inset showing a bus and a roadside incident"
              loading="lazy"
            />
            <div className="evidence-caption">
              <span>FIELD EVIDENCE / 002</span>
              <span>PROJECT-SUPPLIED IMAGE</span>
            </div>
          </div>
          <div className="research-copy">
            <p className="eyebrow">04 / THE SCIENCE BEHIND THE SIGNAL</p>
            <h2 id="research-title">
              FOG HIDES THE HAZARD.
              <br />
              LOW GRIP EXTENDS
              <br />
              THE CONSEQUENCE.
            </h2>
            <p>
              A collision is not only a visibility problem. A wet surface can
              reduce tyre grip, increasing the distance needed to stop.
              SafarGuard puts both variables in the same calculation.
            </p>
            <div className="model-formula">
              <span>STOPPING SIGHT DISTANCE</span>
              <code>SSD = 0.278 Vt + V² / (254μ)</code>
              <small>
                V = km/h · t = 2.5 seconds · μ = friction coefficient
              </small>
            </div>
            <button
              className="methodology-toggle"
              aria-expanded={showDetails}
              aria-controls="methodology-details"
              onClick={() => setShowDetails(!showDetails)}
            >
              Model assumptions & limitations{" "}
              <span>{showDetails ? "−" : "+"}</span>
            </button>
            {showDetails && (
              <div className="methodology-details" id="methodology-details">
                <p>
                  The first term estimates perception and reaction travel. The
                  second estimates braking distance on a level road. The
                  displayed speed ceiling solves the same equation for V and
                  rounds down to the nearest 5 km/h.
                </p>
                <p>
                  Dry (0.70), wet (0.45) and corridor-specific smog-film
                  coefficients are illustrative inputs, not measured or
                  validated road readings. The model does not account for
                  gradient, tyre condition, vehicle mass effects, brake
                  performance or driver variation. No visibility margin is a
                  guarantee of safety.
                </p>
                <a
                  href="https://highways.dot.gov/safety/speed-management/speed-concepts-informational-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  FHWA: speed concepts and stopping sight distance{" "}
                  <Arrow diagonal />
                </a>
              </div>
            )}
          </div>
        </section>
        <section className="safety-band">
          <span className="safety-band-label">ON THE ROAD?</span>
          <p>
            Let the journey wait.
            <br />
            <strong>Not the emergency.</strong>
          </p>
          <div>
            <a href="tel:130">
              <span>MOTORWAY POLICE</span>
              <strong>
                130 <Arrow diagonal />
              </strong>
            </a>
            <a href="tel:1122">
              <span>RESCUE SERVICES</span>
              <strong>
                1122 <Arrow diagonal />
              </strong>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const legalContent = {
  terms: {
    label: "TERMS OF SERVICE",
    title: "THE TERMS, IN PLAIN SIGHT.",
    intro:
      "SafarGuard is a highway-safety research prototype. These draft terms describe the current demonstration, not an official traffic or emergency service.",
    sections: [
      [
        "1. What this service provides",
        "The portal provides illustrative corridor conditions and an educational stopping-distance model. It does not provide live road telemetry, verified closures, navigation, professional driving advice or emergency response.",
      ],
      [
        "2. Safety comes first",
        "Do not interact with the portal while driving. Follow NHMP instructions, posted limits, official closures and local conditions. A modelled speed ceiling is not permission to travel or a guarantee that a speed is safe. Contact Motorway Police on 130 or Rescue Services on 1122 when appropriate.",
      ],
      [
        "3. Limits of the calculation",
        "The model assumes a level road, a 2.5-second perception and reaction time and the selected friction coefficient. Real stopping distances vary with vehicle, tyres, brakes, load, gradient, weather and driver behaviour. Sample coefficients are not validated measurements.",
      ],
      [
        "4. Availability and permitted use",
        "You may use this demo for personal evaluation, education and research. Do not misrepresent its sample data as official or current, interfere with the service or use it to provide safety-critical instructions. Availability and accuracy are not guaranteed.",
      ],
      [
        "5. Images and third-party material",
        "Photographs are project-supplied reference material and are not live camera feeds or verified records of the selected corridors. Their appearance does not imply endorsement by NHMP, Rescue 1122 or any other organisation. No licence to redistribute photographs is granted by these terms.",
      ],
      [
        "6. Responsibility and changes",
        "Use the demonstration with independent judgement. Nothing in these draft terms excludes rights or liabilities that cannot lawfully be excluded. Features and these terms may change as the project develops.",
      ],
      [
        "7. Prototype status",
        "These documents are a draft for the demo and have not been represented as legally reviewed. An operator identity, contact channel and reviewed terms must be published before offering this as a production service.",
      ],
    ],
  },
  privacy: {
    label: "PRIVACY POLICY",
    title: "YOUR INPUTS STAY YOURS.",
    intro:
      "This draft policy describes the SafarGuard demonstration as implemented. No account, location permission or personal profile is required.",
    sections: [
      [
        "1. Information you enter",
        "Route searches, corridor selections, speed and surface inputs are processed in your browser. The application does not send these inputs to a backend or save them across visits. Please do not enter personal or sensitive information into the search field.",
      ],
      [
        "2. Requests needed to display the app",
        "Your browser requests application files, locally hosted photographs and the sample JSON dataset from the hosting provider. Standard network metadata, such as IP address, request time, device information and requested URL, may be processed by that provider under its own policies.",
      ],
      [
        "3. Fonts and external links",
        "Barlow, Barlow Condensed and Fira Code are served locally with the application. Loading these fonts does not make requests to Google. If you play the Night HUD advisory, your browser or operating system's speech service processes the fixed advisory text under its own privacy settings. Synthesis may be local or network-based depending on your device. External research links and telephone links are activated only when you follow them; those services have their own policies.",
      ],
      [
        "4. Cookies and analytics",
        "SafarGuard's application code does not set cookies, use browser local storage, add advertising trackers or collect analytics. The preview platform or hosting infrastructure may have its own operational logging or cookies outside this application's control.",
      ],
      [
        "5. Location and road data",
        "The demo does not request GPS access or upload camera footage. Corridor readings are fictional example values distributed as a static dataset. The reference photographs are supplied by the project and are not captured from your device.",
      ],
      [
        "6. Retention and control",
        "Inputs held in application memory are discarded when the page is closed or reloaded. The hosting provider controls retention of its own request metadata. You can stop further requests by closing the app and can review the hosting provider's privacy information.",
      ],
      [
        "7. Before a production launch",
        "An operator identity, privacy contact, applicable retention periods and any future sensor or account processing must be documented before production use. This demo policy does not claim to cover those unimplemented features.",
      ],
    ],
  },
}

function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const content = legalContent[kind]
  return (
    <div id="top">
      <Header legal />
      <main className="legal-page section-shell">
        <a className="legal-back" href="/">
          <Arrow /> Back to SafarGuard
        </a>
        <p className="eyebrow">SAFARGUARD / {content.label}</p>
        <h1>{content.title}</h1>
        <span className="legal-version">
          DEMO DOCUMENT · VERSION 1.0 · DRAFT
        </span>
        <p className="legal-intro">{content.intro}</p>
        <div className="legal-sections">
          {content.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <a
          className="text-button"
          href={kind === "terms" ? "/privacy" : "/terms"}
        >
          Read the {kind === "terms" ? "privacy policy" : "terms of service"}{" "}
          <Arrow />
        </a>
      </main>
      <Footer />
    </div>
  )
}

const romanAdvisory =
  "Yeh aik demo advisory hai, live rehnumai nahin. Khatra shadeed hai. Motorway par smog aur geeli satah ki wajah se braking ka faasla barh sakta hai. Raftaar kam karein. Low beam rakhein aur Motorway Police ki hidayaat par amal karein."

const urduAdvisory =
  "یہ ایک ڈیمو ایڈوائزری ہے، لائیو رہنمائی نہیں۔ خطرہ شدید ہے۔ موٹروے پر سموگ اور گیلی سطح کی وجہ سے بریک لگانے کا فاصلہ بڑھ سکتا ہے۔ رفتار کم کریں۔ لو بیم رکھیں اور موٹروے پولیس کی ہدایات پر عمل کریں۔"

function HudIcon({
  kind,
}: {
  kind: "speaker" | "warning" | "info" | "stop" | "moon"
}) {
  const paths = {
    speaker: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
      </>
    ),
    warning: (
      <>
        <path d="m12 3 10 18H2L12 3Z" />
        <path d="M12 9v5m0 3v1" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10v1" />
      </>
    ),
    stop: <rect x="6" y="6" width="12" height="12" />,
    moon: <path d="M20.5 13.5A9 9 0 0 1 10.5 3.5a9 9 0 1 0 10 10Z" />,
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  )
}

function NightGauge() {
  return (
    <section className="hud-gauge" aria-labelledby="hud-ceiling-title">
      <div className="hud-gauge-heading">
        <h2 id="hud-ceiling-title">
          SAFE SPEED CEILING <span>(v_max)</span>
        </h2>
        <span>SCENARIO VALUE</span>
      </div>
      <div className="hud-dial">
        <svg viewBox="0 0 220 184" fill="none" aria-hidden="true">
          <path className="hud-dial-track" d="M48 157a83 83 0 1 1 124 0" />
          <path className="hud-dial-arc" d="M48 157A83 83 0 1 1 185 76" />
          {Array.from({ length: 33 }, (_, index) => {
            const angle = ((138 + index * 8.25) * Math.PI) / 180
            const major = index % 4 === 0
            return (
              <line
                key={index}
                className={index < 23 ? "hud-tick-active" : "hud-tick"}
                x1={110 + Math.cos(angle) * 93}
                y1={101 + Math.sin(angle) * 93}
                x2={110 + Math.cos(angle) * (major ? 101 : 97)}
                y2={101 + Math.sin(angle) * (major ? 101 : 97)}
              />
            )
          })}
          <text className="hud-dial-scale" x="28" y="170">
            0
          </text>
          <text className="hud-dial-scale" x="179" y="170">
            60
          </text>
        </svg>
        <div className="hud-speed">
          <strong>36</strong>
          <span>KM/H</span>
          <small>DEMO CAP · NOT AN OFFICIAL LIMIT</small>
        </div>
        <div className="hud-gauge-hazard">
          <HudIcon kind="warning" />
          <span>STOPPING LIMIT EXCEEDED</span>
        </div>
      </div>
    </section>
  )
}

function NightHud() {
  const [audioState, setAudioState] = useState<"idle" | "speaking" | "error">(
    "idle",
  )
  const [audioSupported, setAudioSupported] = useState<boolean | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceNotice, setVoiceNotice] = useState("")
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setAudioSupported(false)
      return
    }
    const synth = window.speechSynthesis
    const updateVoices = () => setVoices(synth.getVoices())
    setAudioSupported(true)
    updateVoices()
    synth.addEventListener("voiceschanged", updateVoices)
    return () => {
      synth.removeEventListener("voiceschanged", updateVoices)
      utteranceRef.current = null
      synth.cancel()
    }
  }, [])

  function toggleAudio() {
    if (!audioSupported) return
    const synth = window.speechSynthesis
    if (audioState === "speaking") {
      utteranceRef.current = null
      synth.cancel()
      setAudioState("idle")
      return
    }
    const availableVoices = synth.getVoices().length
      ? synth.getVoices()
      : voices
    const urduVoice = availableVoices.find((voice) =>
      /^ur(?:-|$)/i.test(voice.lang),
    )
    const fallbackVoice =
      availableVoices.find((voice) => /^en-(PK|IN)$/i.test(voice.lang)) ??
      availableVoices.find((voice) => voice.default) ??
      availableVoices.find((voice) => /^en(?:-|$)/i.test(voice.lang))
    const voice = urduVoice ?? fallbackVoice
    const utterance = new SpeechSynthesisUtterance(
      urduVoice ? urduAdvisory : romanAdvisory,
    )
    utterance.lang = voice?.lang ?? "en-PK"
    if (voice) utterance.voice = voice
    utterance.rate = 0.88
    utterance.pitch = 1
    utterance.onend = () => {
      if (utteranceRef.current !== utterance) return
      utteranceRef.current = null
      setAudioState("idle")
    }
    utterance.onerror = () => {
      if (utteranceRef.current !== utterance) return
      utteranceRef.current = null
      setAudioState("error")
    }
    try {
      synth.cancel()
      utteranceRef.current = utterance
      setVoiceNotice(
        urduVoice ? "Urdu device voice" : "Device pronunciation may vary",
      )
      setAudioState("speaking")
      synth.speak(utterance)
    } catch {
      utteranceRef.current = null
      setAudioState("error")
    }
  }

  const isSpeaking = audioState === "speaking"
  const playbackMessage =
    audioSupported === false
      ? "Audio unsupported. Read the advisory above."
      : audioState === "error"
        ? "Audio unavailable. Read the advisory above."
        : isSpeaking
          ? voiceNotice
          : "DEMO ONLY · SET UP WHILE SAFELY PARKED"

  return (
    <main className="night-hud-stage">
      <aside className="hud-presentation">
        <a className="hud-back-link" href="/">
          <span>
            <Arrow />
          </span>{" "}
          BACK TO CORRIDOR MONITOR
        </a>
        <p className="eyebrow">
          <span className="small-rule" /> SAFARGUARD / DRIVER INTERFACE 02
        </p>
        <h1>
          NIGHT
          <br />
          <span>WATCH.</span>
        </h1>
        <p className="hud-presentation-copy">
          Less screen light. The same road intelligence.
          <br />A focused mobile view with corridor telemetry and a spoken Roman
          Urdu advisory.
        </p>
        <dl className="hud-design-spec">
          <div>
            <dt>VIEWPORT</dt>
            <dd>393 × 852</dd>
          </div>
          <div>
            <dt>DISPLAY</dt>
            <dd>OLED black / Night HUD</dd>
          </div>
          <div>
            <dt>TYPOGRAPHY</dt>
            <dd>Barlow / Barlow Condensed / Fira Code</dd>
          </div>
        </dl>
        <div className="hud-prototype-note">
          <HudIcon kind="info" />
          <p>
            Research prototype. All readings are illustrative.
            <br />
            Not a live traffic feed or windshield projection.
          </p>
        </div>
        <div className="hud-desktop-links">
          <a href="/terms">
            Terms of service <Arrow diagonal />
          </a>
          <a href="/privacy">
            Privacy policy <Arrow diagonal />
          </a>
        </div>
      </aside>

      <div className="night-hud-screen">
        <div className="hud-status-bar" aria-label="Illustrative device status">
          <time dateTime="01:42">
            1:42 <span>AM</span>
          </time>
          <div className="hud-dynamic-island" aria-hidden="true">
            <span />
          </div>
          <div className="hud-device-status">
            <svg
              width="17"
              height="13"
              viewBox="0 0 17 13"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="0" y="9" width="3" height="4" />
              <rect x="4.5" y="6" width="3" height="7" />
              <rect x="9" y="3" width="3" height="10" />
              <rect x="13.5" width="3" height="13" />
            </svg>
            <span>5G</span>
            <svg
              width="25"
              height="13"
              viewBox="0 0 27 14"
              fill="none"
              aria-label="82 percent battery"
            >
              <rect
                x="1"
                y="1"
                width="22"
                height="12"
                rx="2"
                stroke="currentColor"
              />
              <rect
                x="3"
                y="3"
                width="16"
                height="8"
                rx="1"
                fill="currentColor"
              />
              <path d="M25 5v4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="hud-content">
          <header className="hud-app-header">
            <Brand />
            <div className="hud-mode">
              <HudIcon kind="moon" />
              <span>NIGHT HUD</span>
            </div>
          </header>
          <div className="hud-corridor">
            <span className="hud-corridor-route">M-2</span>
            <span>BABU SABU INTERCHANGE</span>
            <button
              aria-label="About the demo readings"
              onClick={() => dialogRef.current?.showModal()}
            >
              DEMO <HudIcon kind="info" />
            </button>
          </div>
          <h1 className="sr-only">SafarGuard driver night HUD</h1>
          <NightGauge />
          <section
            className="hud-telemetry"
            aria-label="Illustrative corridor telemetry"
          >
            <div className="hud-metric">
              <span>SIGHT VISIBILITY</span>
              <strong className="hud-cyan">
                28<small> m</small>
              </strong>
              <p>Dense smog corridor</p>
            </div>
            <div className="hud-metric">
              <span>STOPPING DISTANCE</span>
              <strong>
                115<small> m</small>
              </strong>
              <p>
                <i className="hud-limit-marker" />
                Beyond visible road
              </p>
            </div>
            <div className="hud-metric">
              <span>
                ROAD GRIP <small>(f)</small>
              </span>
              <strong className="hud-cyan">0.28</strong>
              <p>Chemical smog dew</p>
            </div>
            <div className="hud-metric">
              <span>
                CRASH-RISK INDEX <small>(CPI)</small>
              </span>
              <strong>3.82</strong>
              <p>High risk / unvalidated</p>
            </div>
          </section>
          <section
            className="hud-advisory"
            aria-labelledby="hud-advisory-title"
          >
            <div className="hud-advisory-heading">
              <HudIcon kind="speaker" />
              <h2 id="hud-advisory-title">ROMAN URDU ADVISORY</h2>
              <span className="hud-waveform" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <p lang="ur-Latn">
              <strong>Khatra shadeed hai.</strong> Motorway par smog aur geeli
              satah ki wajah se braking ka faasla barh sakta hai. Raftaar kam
              karein. Low beam rakhein aur Motorway Police ki hidayaat par amal
              karein.
            </p>
          </section>
          <button
            className="hud-audio-button"
            onClick={toggleAudio}
            disabled={!audioSupported}
            aria-pressed={isSpeaking}
            aria-label={
              isSpeaking
                ? "Stop spoken Roman Urdu audio beacon"
                : "Play spoken Roman Urdu audio beacon"
            }
          >
            <HudIcon kind={isSpeaking ? "stop" : "speaker"} />
            <span>
              <strong>
                {isSpeaking
                  ? "Stop audio beacon"
                  : audioState === "error"
                    ? "Retry Roman Urdu beacon"
                    : "Play Roman Urdu beacon"}
              </strong>
              <small>
                {isSpeaking
                  ? "SPOKEN ADVISORY IN PROGRESS"
                  : "SPOKEN SAFETY ADVISORY · TAP TO PLAY"}
              </small>
            </span>
            <Arrow />
          </button>
          <p className="hud-playback-status" role="status" aria-live="polite">
            {playbackMessage}
          </p>
        </div>
        <div className="hud-home-indicator" aria-hidden="true">
          <span />
        </div>
      </div>

      <dialog
        className="hud-info-dialog"
        ref={dialogRef}
        aria-labelledby="hud-info-title"
      >
        <div className="hud-dialog-top">
          <span>ABOUT THIS SCENARIO</span>
          <button
            onClick={() => dialogRef.current?.close()}
            aria-label="Close demo information"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m4 4 12 12M4 16 16 4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
        <h2 id="hud-info-title">
          DEMO, NOT
          <br />
          DRIVING GUIDANCE.
        </h2>
        <p>
          The 36 km/h cap, 115 m stopping distance and CPI 3.82 are supplied
          design-scenario values, not live measurements. CPI is an unvalidated
          index, not a probability or a prediction of a collision.
        </p>
        <p>
          These figures are not outputs from the portal’s level-road model. For
          28 m visibility and friction 0.28, that model’s rounded ceiling is{" "}
          {maximumModelSpeed(28, 0.28)} km/h. Neither figure guarantees safety
          or replaces official restrictions.
        </p>
        <p>
          The spoken advisory begins with a demo disclaimer. It uses an Urdu
          voice when your device provides one, otherwise device pronunciation
          may vary. No audio plays automatically.
        </p>
        <p>
          Park before interacting. Follow Motorway Police instructions. For
          assistance, call <a href="tel:130">130</a>.
        </p>
        <a className="hud-dialog-portal" href="/">
          Open the corridor monitor <Arrow />
        </a>
      </dialog>
    </main>
  )
}

export default App
