type GameCardProps = {
  title: string;
  platform: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  lowestPrice: string;
};

export default function GameCard({
  title,
  platform,
  price,
  originalPrice,
  discount,
  rating,
  lowestPrice,
}: GameCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-zinc-600">
      
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {platform}
      </p>

      <h3 className="mt-3 text-xl font-semibold text-white">
        {title}
      </h3>

      <div className="mt-6 flex items-end gap-3">
        <p className="text-3xl font-bold text-white">
          {price}
        </p>

        <p className="pb-1 text-sm text-zinc-500 line-through">
          {originalPrice}
        </p>

        <p className="pb-1 text-sm font-semibold text-green-400">
          {discount}
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-zinc-900 px-4 py-3">
        <p className="text-sm font-medium text-white">
          🟢 {rating}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Lowest ever: {lowestPrice}
        </p>
      </div>

    </div>
  );
}