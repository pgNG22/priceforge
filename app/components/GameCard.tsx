import Image from "next/image";
import playstationLogo from "../../img/NicePng_ps4-logo-png_61508.png";
import xboxLogo from "../../img/NicePng_xbox-logo-png_9962.png";

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
  const isXbox = platform === "Xbox";
  const platformLogo = isXbox
    ? xboxLogo
    : playstationLogo;
  const accentClasses = isXbox
    ? {
        glow: "bg-[#c8f56a]/[0.08]",
        hover: "hover:border-[#c8f56a]/30",
        mark: "bg-[#c8f56a]",
        badge: "bg-[#c8f56a]/10 text-[#c8f56a]",
        dot: "bg-[#c8f56a] shadow-[0_0_8px_#c8f56a]",
      }
    : {
        glow: "bg-[#70a7ff]/[0.1]",
        hover: "hover:border-[#70a7ff]/35",
        mark: "bg-[#70a7ff]",
        badge: "bg-[#70a7ff]/10 text-[#70a7ff]",
        dot: "bg-[#70a7ff] shadow-[0_0_8px_#70a7ff]",
      };

  return (
    <article className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111313] p-5 transition-all duration-300 hover:-translate-y-1 ${accentClasses.hover} hover:bg-[#151817] hover:shadow-2xl hover:shadow-black/30`}>
      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${accentClasses.glow}`} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          <span className={`grid h-7 w-7 place-items-center rounded-lg text-[10px] font-black text-[#10120d] ${accentClasses.mark}`}>
            <Image
              src={platformLogo}
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
          </span>
          {platform}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${accentClasses.badge}`}>{discount}</span>
      </div>

      <h3 className="relative mt-8 text-xl font-semibold tracking-[-0.03em] text-white">
        {title}
      </h3>

      <div className="relative mt-6 flex items-end gap-3">
        <p className="text-3xl font-semibold tracking-[-0.04em] text-white">
          {price}
        </p>

        <p className="pb-1 text-sm text-zinc-500 line-through">
          {originalPrice}
        </p>

      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <div>
          <p className="text-sm font-medium text-white">
            <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${accentClasses.dot}`} />
            {rating}
          </p>
          <p className="mt-1 text-xs text-zinc-600">Current market price</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">Lowest</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-300">{lowestPrice}</p>
        </div>
      </div>
    </article>
  );
}