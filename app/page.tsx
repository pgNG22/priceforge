"use client";

import { useState } from "react";

import GameCard from "./components/GameCard";

const games = {
  xbox: [
    {
      id: 1,
      title: "Forza Horizon 5",
      platform: "Xbox",
      price: "£24.99",
      originalPrice: "£49.99",
      discount: "-50%",
      rating: "Excellent price",
      lowestPrice: "£19.99",
    },
    {
      id: 2,
      title: "Grand Theft Auto V",
      platform: "Xbox",
      price: "£19.99",
      originalPrice: "£39.99",
      discount: "-50%",
      rating: "Good price",
      lowestPrice: "£14.99",
    },
    {
      id: 3,
      title: "Minecraft",
      platform: "Xbox",
      price: "£14.99",
      originalPrice: "£19.99",
      discount: "-25%",
      rating: "Good price",
      lowestPrice: "£9.99",
    },
  ],

  playstation: [
    {
      id: 4,
      title: "EA Sports FC 26",
      platform: "PlayStation",
      price: "£49.99",
      originalPrice: "£69.99",
      discount: "-29%",
      rating: "High price",
      lowestPrice: "£34.99",
    },
    {
      id: 5,
      title: "Grand Theft Auto V",
      platform: "PlayStation",
      price: "£19.99",
      originalPrice: "£39.99",
      discount: "-50%",
      rating: "Good price",
      lowestPrice: "£14.99",
    },
    {
      id: 6,
      title: "God of War Ragnarök",
      platform: "PlayStation",
      price: "£39.99",
      originalPrice: "£69.99",
      discount: "-43%",
      rating: "Fair price",
      lowestPrice: "£29.99",
    },
  ],
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<"xbox" | "playstation">("xbox");

  const platformGames = games[platform];

  const filteredGames = platformGames.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black">
      
      {/* Header */}
      <header className="border-b border-zinc-200 bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight text-white">
            PriceForge
          </h1>

          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="transition-colors hover:text-white">Games</a>
            <a href="#" className="transition-colors hover:text-white">Deals</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-white">
          Stop overpaying for games.
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-zinc-400">
          Track Xbox and PlayStation prices, discover great deals,
          and know when it's the right time to buy.
        </p>

      {/* Platform Selector */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPlatform("playstation")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold ${
              platform === "playstation"
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400"
            }`}
          >
            PlayStation
          </button>

          <button
            onClick={() => setPlatform("xbox")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold ${
              platform === "xbox"
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400"
            }`}
          >
            Xbox
          </button>
        </div>

        {/* Search */}
        <div className="mt-10 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for a game..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-zinc-300 bg-white px-5 py-4 text-base shadow-sm outline-none focus:border-zinc-500"
          />
        </div>
      </section>

      {/* Featured Games */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-bold text-white">
           Games
        </h2>

      {filteredGames.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              platform={game.platform}
              price={game.price}
              originalPrice={game.originalPrice}
              discount={game.discount}
              rating={game.rating}
              lowestPrice={game.lowestPrice}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-12 text-center">
          <h3 className="text-xl font-semibold text-white">
            No games found
          </h3>

          <p className="mt-2 text-zinc-500">
            We couldn't find any games matching "{search}".
          </p>

          <p className="mt-1 text-sm text-zinc-600">
            Try searching for a different title.
          </p>
        </div>
      )}
      </section>

    </main>
  );
}