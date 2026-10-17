import { useRef, useState } from "react"
import type { PointerEvent } from "react"
import "./safety-overlay.css"

type IconName = "arrow" | "back" | "shield" | "hazard" | "turn" | "locate" | "info" | "close" | "check" | "chevron"

function RideIcon({ name }: { name: IconName }) {
  const shapes = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    back: <path d="M20 12H4m6-6-6 6 6 6" />,
    shield: (
      <>
        <path d="m12 2 8 4v7c0 4-8 9-8 9s-8-5-8-9V6l8-4Z" />
        <path d="m10 8-3 8m7-8 3 8m-5-8v3m0 3v3" />
      </>
    ),
    hazard: (
      <>
        <path d="m12 3 10 18H2L12 3Z" />
        <path d="M12 9v5m0 3v1" />
      </>
    ),
    turn: <path d="M5 21V10a4 4 0 0 1 4-4h11m-6-5 6 5-6 5" />,
    locate: (
      <>
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 1v4m0 14v4M1 12h4m14 0h4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v7m0-10v1" />
      </>
    ),
    close: <path d="m5 5 14 14M5 19 19 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 14 6-6 6 6" />,
  }
  return (
    <svg
      width="22"
      height="22"
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

function RideStatusBar() {
  return (
    <div className="ride-status-bar" aria-label="Illustrative phone status">
      <time dateTime="01:42">
        1:42 <span>AM</span>
      </time>
      <div className="ride-island" aria-hidden="true">
        <i />
      </div>
      <div className="ride-device-icons">
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M0 9h3v3H0zm4-3h3v6H4zm4-3h3v9H8zm4-3h3v12h-3z" />
        </svg>
        <span>5G</span>
        <svg
          width="25"
          height="13"
          viewBox="0 0 27 14"
          fill="none"
          role="img"
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
          <rect x="3" y="3" width="16" height="8" rx="1" fill="currentColor" />
          <path d="M25 5v4" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

function HighwayMap({
  zoom,
  offset,
  onOffsetChange,
  active,
}: {
  zoom: number
  offset: { x: number; y: number }
  onOffsetChange: (offset: { x: number; y: number }) => void
  active: boolean
}) {
  const drag = useRef<{
    pointerId: number
    x: number
    y: number
    originX: number
    originY: number
  } | null>(null)
  function startDrag(event: PointerEvent<SVGSVGElement>) {
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
  function moveDrag(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const scale = Math.max(rect.width / 393, rect.height / 852)
    onOffsetChange({
      x: drag.current.originX + (event.clientX - drag.current.x) / scale,
      y: drag.current.originY + (event.clientY - drag.current.y) / scale,
    })
  }
  return (
    <svg
      className="ride-map"
      viewBox="0 0 393 852"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Interactive schematic map of the Lahore M-2 approach, Ring Road and Thokar Niaz Baig. Not for navigation."
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      <rect width="393" height="852" className="ride-map-ground" />
      <g
        transform={`translate(${offset.x} ${offset.y}) translate(196.5 426) scale(${zoom}) translate(-196.5 -426)`}
      >
        <g className="ride-map-land">
          <path d="m-30 185 99-16 28 65-67 31-45-15Z" />
          <path d="m91 133 94-18 28 77-100 31Z" />
          <path d="m261 104 117 9 45 92-121 33-48-72Z" />
          <path d="m-24 365 74-28 59 80-38 103-91-10Z" />
          <path d="m242 313 131-30 59 72-24 70-133-11Z" />
          <path d="m286 488 107-36 34 97-72 41-44-31Z" />
          <path d="m-21 564 105-29 42 82-52 76-83-30Z" />
          <path d="m113 658 63-13 40 58-59 85-70-39Z" />
        </g>
        <g className="ride-map-minor-roads">
          <path d="m-20 226 145-47 172-4 116-41M-10 258l158-45 143 7 111-43M-10 293l117-41 143 25 158-33M-20 325l101-30 103 15 101-45 130 20M-20 389l70-28 94-18 98 17 174-46M-10 431l86-27 62-28 91 32 169-38M-10 472l111-33 78 23 104-21 126-13M-8 534l86-34 97 16 82-34 145 14M-10 589l129-45 80 10 93-34 112 33M-20 630l103-48 132 26 199-26M-10 678l126-47 98 33 194-13M-20 725l107-46 125 21 196-11" />
          <path d="m22 168 49 142-8 105 49 138-26 177M61 148l58 134-19 120 47 127-28 211M152 135l-18 116 48 115-12 98 60 119-19 160M210 124l-20 126 52 107-15 114 62 133-17 141M282 123l-32 100 61 128-24 102 62 164-20 133M346 155l-16 96 55 114-31 126 43 168" />
        </g>
        <g className="ride-map-arterial-casing">
          <path d="M-55 154 94 237 144 300 204 342 239 417 251 510 299 597 449 652" />
          <path d="M-30 481 84 459 182 416 289 403 426 349" />
          <path d="m315 103-58 143-33 87-28 141-47 144-5 189" />
        </g>
        <g className="ride-map-arterials">
          <path d="M-55 154 94 237 144 300 204 342 239 417 251 510 299 597 449 652" />
          <path d="M-30 481 84 459 182 416 289 403 426 349" />
          <path d="m315 103-58 143-33 87-28 141-47 144-5 189" />
        </g>
        <path
          className={`ride-map-route ${active ? "ride-map-route-active" : ""}`}
          d="M-55 154 94 237 144 300 204 342 239 417 251 510 299 597 449 652"
        />
        <g className="ride-map-labels">
          <text x="44" y="209">
            BABU SABU
          </text>
          <text x="289" y="277">
            GULSHAN-E-RAVI
          </text>
          <text x="37" y="384">
            SABZAZAR
          </text>
          <text x="281" y="444">
            LAHORE
          </text>
          <text x="72" y="576">
            MULTAN ROAD
          </text>
          <text x="283" y="622">
            THOKAR
          </text>
          <text x="283" y="634">
            NIAZ BAIG
          </text>
          <text transform="translate(321 398) rotate(-20)">RING ROAD</text>
        </g>
        <g className="ride-map-route-sign" transform="translate(101 272)">
          <rect x="-12" y="-10" width="31" height="20" />
          <text x="3.5" y="3" textAnchor="middle">
            M-2
          </text>
        </g>
        <g className="ride-map-car" transform="translate(174 321) rotate(142)">
          <path className="ride-car-outline" d="m0-18 12 29-12-5-12 5L0-18Z" />
          <path d="m0-9 5 13-5-2-5 2L0-9Z" />
        </g>
        <g className="ride-map-hazard" transform="translate(219 395)">
          <rect x="-12" y="-12" width="24" height="24" />
          <path d="m0-7 8 14H-8L0-7Zm0 5v4m0 2v1" />
        </g>
      </g>
    </svg>
  )
}

export default function SafetyOverlay() {
  const [expanded, setExpanded] = useState(true)
  const [following, setFollowing] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dialogContent, setDialogContent] = useState<"scenario" | "fare">(
    "scenario",
  )
  const dialogRef = useRef<HTMLDialogElement>(null)
  function openInfo(content: "scenario" | "fare") {
    setDialogContent(content)
    dialogRef.current?.showModal()
  }

  return (
    <main className="ride-demo-stage">
      <aside className="ride-presentation">
        <a className="ride-back-link" href="/">
          <RideIcon name="back" /> BACK TO CORRIDOR MONITOR
        </a>
        <p className="eyebrow">
          <span className="small-rule" /> SAFARGUARD / DRIVER INTERFACE 03
        </p>
        <h1>
          SAFETY.
          <br />
          <span>IN VIEW.</span>
        </h1>
        <p className="ride-presentation-copy">
          A co-pilot, not another app to watch.
          <br />
          Corridor risk sits above the trip, so the next decision stays in
          sight.
        </p>
        <dl className="ride-design-spec">
          <div>
            <dt>VIEWPORT</dt>
            <dd>393 × 852</dd>
          </div>
          <div>
            <dt>CONCEPT</dt>
            <dd>Careem Captain / Safety overlay</dd>
          </div>
          <div>
            <dt>TYPE SYSTEM</dt>
            <dd>Barlow / Barlow Condensed / Fira Code</dd>
          </div>
        </dl>
        <div className="ride-concept-note">
          <RideIcon name="info" />
          <p>
            Independent interface concept. Not affiliated with Careem or
            inDrive. Trip, fare, map and alerts are illustrative.
          </p>
        </div>
        <nav className="ride-demo-links" aria-label="Other SafarGuard demos">
          <a href="/night-hud">
            Night HUD <RideIcon name="arrow" />
          </a>
          <a href="/">
            Web portal <RideIcon name="arrow" />
          </a>
        </nav>
      </aside>

      <div className="ride-phone">
        <h1 className="sr-only">
          Careem Captain concept with SafarGuard safety co-pilot
        </h1>
        <HighwayMap
          zoom={zoom}
          offset={offset}
          onOffsetChange={setOffset}
          active={following}
        />
        <div className="ride-top">
          <RideStatusBar />
          <header className="ride-app-header">
            <a href="/" aria-label="Back to SafarGuard web portal">
              <RideIcon name="back" />
            </a>
            <div className="ride-careem-brand">
              careem<span>CAPTAIN / CONCEPT</span>
            </div>
            <span className="ride-trip-state">
              <i /> ON TRIP
            </span>
          </header>
          <section
            className="ride-trip-summary"
            aria-label="Example passenger trip"
          >
            <div className="ride-destination">
              <div>
                <span>PASSENGER DROPOFF</span>
                <h2>Gulberg III, Lahore</h2>
              </div>
              <div className="ride-fare">
                <span>PKR</span>
                <strong>840</strong>
              </div>
            </div>
            <button className="ride-bonus" onClick={() => openInfo("fare")}>
              <RideIcon name="shield" />
              <span>
                Includes <strong>+PKR 120</strong> smog safety bonus
              </span>
              <RideIcon name="info" />
            </button>
          </section>
        </div>

        <div className="ride-map-heading">
          <span className={following ? "ride-corridor-enabled" : ""}>
            <i /> {following ? "CORRIDOR MODE / DEMO" : "M-2 SOUTHBOUND"}
          </span>
          <small>SCHEMATIC MAP</small>
        </div>
        <div
          className="ride-map-controls"
          role="group"
          aria-label="Map controls"
        >
          <span className="ride-compass" aria-hidden="true">
            <span>N</span>
            <i />
          </span>
          <button
            onClick={() =>
              setZoom((value) =>
                Math.min(1.6, Number((value + 0.2).toFixed(1))),
              )
            }
            disabled={zoom >= 1.6}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() =>
              setZoom((value) =>
                Math.max(0.8, Number((value - 0.2).toFixed(1))),
              )
            }
            disabled={zoom <= 0.8}
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            className="ride-recenter"
            onClick={() => {
              setZoom(1)
              setOffset({ x: 0, y: 0 })
            }}
            aria-label="Recenter map"
          >
            <RideIcon name="locate" />
          </button>
        </div>
        <p className="ride-map-scale">
          <span /> 200 M · ILLUSTRATIVE
        </p>

        <section
          className={`ride-copilot ${expanded ? "" : "ride-copilot-collapsed"}`}
          aria-labelledby="ride-copilot-title"
        >
          <div className="ride-copilot-heading">
            <span className="ride-copilot-mark">
              <RideIcon name="shield" />
            </span>
            <div>
              <h2 id="ride-copilot-title">
                SafarGuard <span>Co-Pilot</span>
              </h2>
              <span className="ride-overlay-label">
                SAFETY LAYER / DEMO ALERT
              </span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="ride-copilot-details"
              aria-label={
                expanded ? "Collapse safety overlay" : "Expand safety overlay"
              }
            >
              <RideIcon name="chevron" />
            </button>
          </div>
          <div className="ride-warning-summary">
            <div className="ride-speed-cap">
              <span>{following ? "TARGET SET" : "SPEED CAP"}</span>
              <strong>
                35<small> KM/H</small>
              </strong>
              <span>DEMO · NOT ENFORCED</span>
            </div>
            <div className="ride-warning-copy">
              <h3>
                Chemical smog
                <br />
                slick active.
              </h3>
              <p>
                <strong>110 m</strong> to stop. Only <strong>30 m</strong> of
                visible road.
              </p>
            </div>
          </div>
          {expanded && (
            <div id="ride-copilot-details">
              <div
                className="ride-sight-comparison"
                aria-label="Visible horizon 30 metres versus stopping distance 110 metres"
              >
                <div>
                  <span>
                    VISIBLE HORIZON <b>30 M</b>
                  </span>
                  <span>
                    STOPPING DISTANCE <b>110 M</b>
                  </span>
                </div>
                <span className="ride-distance-track">
                  <i />
                </span>
              </div>
              <div className="ride-hazard-alert">
                <RideIcon name="hazard" />
                <div>
                  <span>HAZARD RADAR / 200 M AHEAD</span>
                  <strong>Unlit sugarcane tractor-trolley</strong>
                  <p>Left lane · trailing-driver camera report</p>
                  <small>ILLUSTRATIVE REPORT · NOT VERIFIED</small>
                </div>
              </div>
            </div>
          )}
          <div className="ride-copilot-footer">
            <span>
              <i />{" "}
              {following
                ? "DEMO PREFERENCE ACTIVE"
                : "ILLUSTRATIVE CORRIDOR CONDITIONS"}
            </span>
            <button
              onClick={() => openInfo("scenario")}
              aria-label="About this safety scenario"
            >
              <RideIcon name="info" />
            </button>
          </div>
        </section>

        <section
          className="ride-navigation"
          aria-label="Example route guidance"
        >
          <div className="ride-drawer-handle" aria-hidden="true" />
          <div className="ride-next-turn">
            <span className="ride-turn-icon">
              <RideIcon name="turn" />
            </span>
            <div>
              <span>NEXT / M-2 EXIT</span>
              <h2>Ring Road</h2>
              <p>Towards Thokar Niaz Baig</p>
            </div>
            <div className="ride-eta">
              <strong>
                14 <small>min</small>
              </strong>
              <span>3.2 KM</span>
            </div>
          </div>
          <button
            className={`ride-follow-button ${
              following ? "ride-following" : ""
            }`}
            aria-pressed={following}
            onClick={() => setFollowing(!following)}
          >
            <RideIcon name={following ? "check" : "shield"} />
            <span>
              {following
                ? "Demo corridor enabled"
                : "Follow safe speed corridor"}
              <small>
                {following
                  ? "TAP TO CLEAR THE DEMO PREFERENCE"
                  : "SCENARIO TARGET · NOT VEHICLE SPEED CONTROL"}
              </small>
            </span>
            <strong>
              35<small>KM/H</small>
            </strong>
          </button>
          <p className="ride-demo-disclaimer" role="status">
            {following
              ? "Demo preference set. Vehicle speed is not controlled."
              : "DEMO TRIP · NOT LIVE GUIDANCE · INTERACT ONLY WHEN PARKED"}
          </p>
          <div className="ride-home-indicator" aria-hidden="true">
            <span />
          </div>
        </section>
      </div>

      <dialog
        className="ride-info-dialog"
        ref={dialogRef}
        aria-labelledby="ride-dialog-title"
      >
        <div className="ride-dialog-heading">
          <span>
            {dialogContent === "fare"
              ? "ILLUSTRATIVE TRIP FARE"
              : "ABOUT THIS SAFETY LAYER"}
          </span>
          <button
            onClick={() => dialogRef.current?.close()}
            aria-label="Close information"
          >
            <RideIcon name="close" />
          </button>
        </div>
        <h2 id="ride-dialog-title">
          {dialogContent === "fare" ? (
            <>
              A SAFER TRIP.
              <br />A CLEARER FARE.
            </>
          ) : (
            <>
              A CONCEPT.
              <br />
              NOT A LIVE CO-PILOT.
            </>
          )}
        </h2>
        {dialogContent === "fare" ? (
          <>
            <dl className="ride-fare-breakdown">
              <div>
                <dt>Example trip fare</dt>
                <dd>PKR 720</dd>
              </div>
              <div>
                <dt>Smog safety bonus</dt>
                <dd>+ PKR 120</dd>
              </div>
              <div>
                <dt>Example total</dt>
                <dd>PKR 840</dd>
              </div>
            </dl>
            <p>
              This is a fictional fare breakdown for this interface concept. No
              payment, bonus or reward is offered by SafarGuard or any
              ride-hailing service.
            </p>
          </>
        ) : (
          <>
            <p>
              The map is a manually drawn Lahore-area schematic, not a
              geographically accurate map or a navigation service. The trip,
              hazard report, 35 km/h target and 110 m / 30 m comparison are
              scripted design examples, not live or verified readings.
            </p>
            <p>
              The corridor button only changes this demo’s visual state. It
              cannot enforce a speed limit, control a vehicle, reroute a trip or
              connect to Careem, inDrive, a driver camera or NHMP.
            </p>
            <p>
              Do not rely on this scenario as a safe-speed recommendation.
              Follow official restrictions, actual conditions and Motorway
              Police instructions. Park before interacting.
            </p>
          </>
        )}
        <div className="ride-dialog-links">
          <a href="/">
            Web portal <RideIcon name="arrow" />
          </a>
          <a href="/night-hud">
            Night HUD <RideIcon name="arrow" />
          </a>
        </div>
      </dialog>
    </main>
  )
}
