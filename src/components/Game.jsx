import React, { useEffect, useRef, useState } from 'react'
import { createGameConfig, getGlobalGame } from '../game'

export default function Game() {
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let g = getGlobalGame()
    if (!g && containerRef.current) {
      createGameConfig(containerRef.current) // creates and stores game globally
    }
    const timer = setInterval(() => {
      if (window.__ECLIPSE_READY__) {
        setReady(true)
        clearInterval(timer)
      }
    }, 200)
    return () => {
      // persist game across navigations
    }
  }, [])

  const handleAdBuff = () => {
    window.dispatchEvent(new CustomEvent('ad:reward', { detail: { type: 'buff', value: 1.2, duration: 600 } }))
  }
  const handleTimeSkip = () => {
    window.dispatchEvent(new CustomEvent('premium:timeskip', { detail: { seconds: 3600 } }))
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-slate-900">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-2 items-center justify-between z-50 pointer-events-auto">
        <div className="flex gap-2">
          <button onClick={handleAdBuff} className="px-3 py-2 rounded bg-amber-500 text-black text-sm font-semibold shadow">Watch Ad: 20% Boost</button>
          <button onClick={handleTimeSkip} className="px-3 py-2 rounded bg-emerald-500 text-black text-sm font-semibold shadow">Time Skip 1h</button>
        </div>
        {!ready && <div className="px-3 py-2 rounded bg-slate-800/80 text-white text-sm">Loading...</div>}
      </div>
    </div>
  )
}
