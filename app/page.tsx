"use client";

import { useState } from "react";
import Image from "next/image";

import GameCard from "./components/GameCard";
import playstationLogo from "../img/NicePng_ps4-logo-png_61508.png";
import playstationWordmark from "../img/priceforgeps.png";
import xboxLogo from "../img/NicePng_xbox-logo-png_9962.png";
import xboxWordmark from "../img/priceforgexbox.png";

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
  const isXbox = platform === "xbox";
  const priceForgeLogo = isXbox ? xboxWordmark : playstationWordmark;

  const filteredGames = platformGames.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={`min-h-screen overflow-hidden bg-[#090a0a] text-white ${isXbox ? "[--accent:#c8f56a] [--accent-rgb:200,245,106]" : "[--accent:#70a7ff] [--accent-rgb:112,167,255]"}`}>
      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#090a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="PriceForge home">
            <Image
              src={priceForgeLogo}
              alt="PriceForge"
              width={160}
              height={60}
              className="h-10 w-30 object-fill transition-opacity duration-500"
            />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-20 pt-10 text-center sm:px-8 sm:pb-24 sm:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[rgba(var(--accent-rgb),0.07)] blur-3xl transition-colors duration-500" />
        <div className="relative">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Advanced game shopping
          </p>
          <h2 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-7xl">
            Stop overpaying
            <br />
            for games.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            Track Xbox and PlayStation prices through historical data analysis,
            and know when it&apos;s the perfect time to buy.
          </p>
        </div>

        {/* Platform Selector */}
        <div className="relative mt-10 flex w-full max-w-md rounded-xl border border-white/[0.09] bg-white/[0.035] p-1.5 shadow-2xl shadow-black/20">
          <button
            onClick={() => setPlatform("xbox")}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-4 text-sm font-semibold transition-all duration-300 ${
              platform === "xbox"
                ? "bg-[#c8f56a] text-[#10120d] shadow-[0_4px_18px_rgba(200,245,106,0.18)]"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <span className="grid h-5 w-5 place-items-center">
              <Image
                src={xboxLogo}
                alt=""
                aria-hidden="true"
                width={14}
                height={14}
                className="h-5 w-5 object-contain"
              />
            </span>
          </button>

          <button
            onClick={() => setPlatform("playstation")}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              platform === "playstation"
                ? "bg-[#70a7ff] text-[#08101d] shadow-[0_4px_18px_rgba(112,167,255,0.2)]"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <span className="grid h-5 w-5 place-items-center">
              <Image
                src={playstationLogo}
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-5 w-full max-w-md">
          <label htmlFor="game-search" className="sr-only">Search for a game</label>
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </div>
          <input
            id="game-search"
            type="text"
            placeholder="Search your next game..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-white/[0.1] bg-white/[0.045] py-4 pl-12 pr-5 text-sm text-white shadow-xl shadow-black/10 outline-none transition placeholder:text-zinc-600 focus:border-[var(--accent)]/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-[rgba(var(--accent-rgb),0.08)]"
          />
        </div>
      </section>

      {/* Featured Games */}
      <section id="games" className={`mx-auto max-w-7xl px-5 sm:px-8 ${search.trim() ? "pb-24" : ""}`}>
        {search.trim() && (filteredGames.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-white">
              No games found
            </h3>

            <p className="mt-2 text-zinc-500">
              We couldn&apos;t find any games matching &quot;{search}&quot;.
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Try searching for a different title.
            </p>
          </div>
        ))}
      </section>

    </main>
  );
}