import { useState } from "react"

export default function GroundRealityPanel() {
  const [speed, setSpeed] = useState<number>(100)
  const [vis, setVis] = useState<number>(40)
  const [tr, setTr] = useState<number>(2.85) // high-beam glare
  const [f, setF] = useState<number>(0.28) // chemical dew slick

  const vMs = (speed * 1000) / 3600
  const dReaction = vMs * tr
  const dBraking = (vMs * vMs) / (2 * 9.81 * f)
  const ssd = dReaction + dBraking
  const cpi = ssd / vis
  const deficit = ssd - vis

  // Safe Speed quadratic calculation
  const a = 1
  const b = 2 * 9.81 * f * tr
  const c = -2 * 9.81 * f * vis
  const vSafeMs = (-b + Math.sqrt(b * b - 4 * a * c)) / 2
  const vSafeKmh = Math.max(0, Math.round((vSafeMs * 3600) / 1000))

  return (
    <div className="w-full bg-[#070b14] border border-slate-800 rounded-2xl p-6 lg:p-8 my-10 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
              Empirical Evidence & Kinetic Physics Lab
            </span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white mt-1">
            Ground Reality: Why Motorway Smog Causes Multi-Vehicle Pileups
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
          Source: <span className="text-cyan-400">Rescue 1122 + NHMP Incident Registries</span>
        </div>
      </div>

      {/* Verified Investigative News Cards */}
      <div className="my-8">
        <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
          Verified National Media Accident Evidence
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dawn News 2025 */}
          <a
            href="https://www.dawn.com/news/1960107/7-injured-as-6-trailer-trucks-collide-on-multan-sukkur-motorway-due-to-fog-rescue-1122"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-bold">DAWN NEWS</span>
              <span>Dec 9, 2025</span>
            </div>
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-3">
              7 injured as 6 trailer trucks collide on Multan-Sukkur Motorway due to fog: Rescue 1122
            </p>
            <span className="inline-block mt-3 text-xs text-cyan-400 font-mono group-hover:underline">
              Read Investigation &rarr;
            </span>
          </a>

          {/* Pakistan Today 2021 */}
          <a
            href="https://www.pakistantoday.com.pk/2021/12/22/at-least-three-dead-several-injured-as-fog-causes-m-2-motorway-pile-up"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-bold">PAKISTAN TODAY</span>
              <span>Dec 22, 2021</span>
            </div>
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-3">
              At least three dead, several injured as fog causes M-2 motorway pile-up near Sheikhupura
            </p>
            <span className="inline-block mt-3 text-xs text-cyan-400 font-mono group-hover:underline">
              Read Investigation &rarr;
            </span>
          </a>

          {/* Dawn News 2016 */}
          <a
            href="https://www.dawn.com/news/1294136/16-die-in-accidents-caused-by-fog-in-punjab"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-bold">DAWN ARCHIVES</span>
              <span>Nov 4, 2016</span>
            </div>
            <p className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-3">
              16 die in accidents caused by dense winter fog across Punjab transit corridors
            </p>
            <span className="inline-block mt-3 text-xs text-cyan-400 font-mono group-hover:underline">
              Read Investigation &rarr;
            </span>
          </a>
        </div>
      </div>

      {/* Live AASHTO Formula Interactive Calculator */}
      <div className="bg-[#040711] border border-slate-800/80 rounded-xl p-6 my-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h4 className="text-base font-bold text-white font-display">
              AASHTO Kinetic Stopping Distance Simulator
            </h4>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Formula: $SSD = (v \cdot t_r) + \frac&#123;v^2&#125;&#123;2 \cdot g \cdot f&#125;$ | Gravitational constant $g = 9.81 \text&#123; m/s&#125;^2$
            </p>
          </div>
          <div className="text-right mt-3 md:mt-0 font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Quadratic Safe Speed</span>
            <span className="text-2xl font-bold text-cyan-400">{vSafeKmh} km/h</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Cruising Speed (v):</span>
              <span className="text-white font-bold">{speed} km/h</span>
            </div>
            <input
              type="range"
              min="30"
              max="130"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Forward Visibility:</span>
              <span className="text-white font-bold">{vis} m</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              value={vis}
              onChange={(e) => setVis(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Tire Friction (f):</span>
              <span className="text-amber-400 font-bold">{f.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.20"
              max="0.80"
              step="0.02"
              value={f}
              onChange={(e) => setF(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-500">
              {f < 0.35 ? "Chemical Dew Slick" : f < 0.55 ? "Wet Road" : "Clean Dry Asphalt"}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Reaction Time (tr):</span>
              <span className="text-red-400 font-bold">{tr.toFixed(2)} s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.1"
              value={tr}
              onChange={(e) => setTr(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <span className="text-[10px] text-slate-500">
              {tr > 2.0 ? "Severe Backscatter Glare" : "Baseline Daylight"}
            </span>
          </div>
        </div>

        {/* Results Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Reaction Distance</span>
            <span className="text-lg font-bold text-white">{Math.round(dReaction)} m</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Braking Distance</span>
            <span className="text-lg font-bold text-white">{Math.round(dBraking)} m</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">Total Stopping (SSD)</span>
            <span className="text-lg font-bold text-cyan-400">{Math.round(ssd)} m</span>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              deficit > 0 ? "bg-red-950/40 border-red-800" : "bg-emerald-950/40 border-emerald-800"
            }`}
          >
            <span className="text-[10px] uppercase block text-slate-300">
              {deficit > 0 ? "Blind Crash Deficit" : "Safe Stopping Margin"}
            </span>
            <span className={`text-lg font-bold ${deficit > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {deficit > 0 ? `-${Math.round(deficit)} m (CRASH)` : `+${Math.round(-deficit)} m (SAFE)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
