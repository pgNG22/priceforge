import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ games: [] });
  }

  try {
    const params = new URLSearchParams({
      query,
      market: "GB",
      languages: "en-GB",
      fieldsTemplate: "details",
      platformdependencyname: "windows.xbox",
    });

    const url =
      `https://displaycatalog.mp.microsoft.com/v7.0/productFamilies/Games/products?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "Microsoft Store error:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: "Microsoft Store request failed",
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const products = data?.Products ?? [];

    const games = products
      .map((product: any) => {
        const localized =
          product?.LocalizedProperties?.[0];

        const title =
          product?.Properties?.ProductGroupName ||
          localized?.ProductTitle ||
          "Unknown game";

        const productId = product?.ProductId;

        /*
         * Find the best available UK Xbox price.
         */
        const availabilities =
          product?.DisplaySkuAvailabilities ?? [];

        let bestAvailability: any = null;

        for (const sku of availabilities) {
          const skuAvailabilities =
            sku?.Availabilities ?? [];

          for (const availability of skuAvailabilities) {
            const price =
              availability?.OrderManagementData?.Price;

            if (
              availability?.Markets?.includes("GB") &&
              price?.CurrencyCode === "GBP" &&
              typeof price?.ListPrice === "number" &&
              price.ListPrice > 0
            ) {
              if (
                !bestAvailability ||
                availability.DisplayRank <
                  bestAvailability.DisplayRank
              ) {
                bestAvailability = availability;
              }
            }
          }
        }

        /*
         * Skip products that don't have a purchasable
         * UK price.
         */
        if (!bestAvailability) {
          return null;
        }

        const priceData =
          bestAvailability.OrderManagementData.Price;

        const currentPrice = priceData.ListPrice;
        const originalPrice = priceData.MSRP;

        let discount = 0;

        if (
          typeof originalPrice === "number" &&
          originalPrice > currentPrice
        ) {
          discount = Math.round(
            ((originalPrice - currentPrice) /
              originalPrice) *
              100
          );
        }

        /*
         * Find Microsoft's historical lowest price.
         */
        let lowestPrice: number | null = null;

        for (const sku of availabilities) {
          const historical =
            sku?.HistoricalBestAvailabilities ?? [];

          for (const historicalAvailability of historical) {
            const price =
              historicalAvailability
                ?.OrderManagementData
                ?.Price;

            if (
              historicalAvailability?.Markets?.includes("GB") &&
              price?.CurrencyCode === "GBP" &&
              typeof price?.ListPrice === "number" &&
              price.ListPrice > 0
            ) {
              if (
                lowestPrice === null ||
                price.ListPrice < lowestPrice
              ) {
                lowestPrice = price.ListPrice;
              }
            }
          }
        }

        /*
         * Find the Xbox box art.
         */
        const images =
          localized?.Images ?? [];

        const boxArt =
          images.find(
            (image: any) =>
              image?.ImagePurpose === "BoxArt"
          )?.Uri ??
          images.find(
            (image: any) =>
              image?.ImagePurpose === "Poster"
          )?.Uri ??
          null;

        const imageUrl = boxArt
          ? `https:${boxArt}`
          : null;

        return {
        id: productId,
        title,
        edition: localized?.ProductTitle ?? title,

        price: currentPrice,

        originalPrice:
            typeof originalPrice === "number"
            ? originalPrice
            : currentPrice,

        discount,
        isOnSale: discount > 0,

        currency: priceData.CurrencyCode,
        platform: "Xbox",

        image: imageUrl,

        lowestPrice,

        storeUrl: productId
            ? `https://www.xbox.com/en-GB/games/store/${productId}`
            : null,
        };
      })
      .filter(Boolean);

    /*
     * Remove duplicate game names.
     */
    const uniqueGames = Array.from(
      new Map(
        games.map((game: any) => [
          game.title,
          game,
        ])
      ).values()
    );

    return NextResponse.json({
      games: uniqueGames,
    });
  } catch (error) {
    console.error("Xbox Store search failed:", error);

    return NextResponse.json(
      {
        error: "Unable to search Xbox Store",
      },
      { status: 500 }
    );
  }
}