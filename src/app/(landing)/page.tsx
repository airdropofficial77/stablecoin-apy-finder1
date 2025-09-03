'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- UI Helpers ---
function formatNumber(n: number) {
  if (!n || isNaN(n)) return '-'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
  return n.toLocaleString()
}

function clampApy(apy: number) {
  if (apy > 10000) return 10000
  return apy
}

// --- Component ---
export default function StablecoinAPYFinder() {
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch('https://yields.llama.fi/pools')
        const data = await res.json()
        const stablePools = (data.data || []).filter((p: any) =>
          /(USDT|USDC|DAI|FRAX|TUSD|FDUSD|PYUSD|LUSD|MIM|GHO|crvUSD|USDS)/i.test(
            p.symbol
          )
        )
        stablePools.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0))
        setPools(stablePools)
      } catch (e) {
        console.error('Error fetching pools', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <h1 className="mb-4 text-3xl font-bold">
        Stablecoin Staking & Yield Pools
      </h1>
      <p className="mb-6 text-slate-600">
        Live APYs across chains and protocols. Sorted high → low.
      </p>

      {loading ? (
        <p className="text-slate-600">Loading pools...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {pools.map((p, i) => (
              <motion.div
                key={p.pool || i}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="truncate text-lg font-semibold">
                      {p.project}
                    </h2>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">
                      {p.chain}
                    </span>
                  </div>
                  <div className="mb-2 truncate text-sm text-slate-600">
                    {p.symbol}
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {clampApy(p.apy).toFixed(2)}%
                      </div>
                      <div className="text-xs text-slate-500">APY</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        ${formatNumber(p.tvlUsd)}
                      </div>
                      <div className="text-xs text-slate-500">TVL</div>
                    </div>
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block text-sm text-blue-600 hover:underline"
                    >
                      Open Pool →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <footer className="mt-8 text-xs text-slate-500">
        Data source: DeFiLlama Yields API. Informational only. Not financial
        advice.
      </footer>
    </div>
  )
}
