import { GlobePulse } from "./cobe-globe-pulse"

export default function GlobePulseDemo() {
  return (
    <div className="flex items-center justify-center w-full bg-black p-6 md:p-8 overflow-hidden rounded-3xl border border-slate-700/60">
      <div className="w-full max-w-lg">
        <GlobePulse />
      </div>
    </div>
  )
}