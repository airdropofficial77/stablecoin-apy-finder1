"use client";

import { useEffect, useState } from "react";

interface Pool {
  symbol: string;
  apy: number;
  tvlUsd: number;
  chain: string;
  project: string;
}

export default function Home() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  // list of stablecoins we want to allow
  const stablecoins = ["USDT", "USDC", "DAI", "BUSD", "TUSD", "FRAX", "USDD"];

  useEffect(() => {
    async function fetchPools() {
      try {
        const res = await fetch("https://yields.llama.fi/pools");
        const data = await res.json();

        const filtered = data.data
          .filter(
            (pool: any) =>
              pool.apy &&
              pool.tvlUsd &&
              stablecoins.some((s) => pool.symbol.toUpperCase().includes(s))
          )
          .sort((a: Pool, b: Pool) => b.apy - a.apy);

        setPools(filtered.slice(0, 30)); // top 30 pools
      } catch (err) {
        console.error("Error fetching pools:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPools();
  }, []);

  if (loading) return <p className="text-center p-10">Loading pools...</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Stablecoin Staking Pools (High → Low APY)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg mb-2">{pool.symbol}</h2>
            <p className="text-green-600 font-bold text-xl">
              {pool.apy.toFixed(2)}% APY
            </p>
            <p className="text-gray-700">
              TVL: ${pool.tvlUsd.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {pool.chain} • {pool.project}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
