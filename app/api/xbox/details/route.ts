import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const ids = searchParams.get("ids")?.trim();

  if (!ids) {
    return NextResponse.json({ games: [] });
  }

  try {
    const params = new URLSearchParams({
      market: "GB",
      languages: "en-GB",
      bigIds: ids,
      fieldsTemplate: "details",
    });

    const url =
      `https://displaycatalog.mp.microsoft.com/v7.0/products?${params.toString()}`;

    console.log("Xbox details request:", url);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "Microsoft product details error:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: "Microsoft product details request failed",
          status: response.status,
          details: text,
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const products = data?.Products ?? [];

    console.log(
      `Xbox details returned ${products.length} products`
    );

    const games = products
      .map((product: any) => {
        const localized =
          product?.LocalizedProperties?.[0];

        const productGroupName =
            product?.Properties?.ProductGroupName?.trim();

            const productTitle =
            localized?.ProductTitle?.trim();

            const title =
            productGroupName ||
            productTitle ||
            "Unknown game";

            // Microsoft sometimes returns a short name such as
            // "Trilogy" as ProductTitle even though the full
            // ProductGroupName is already the correct game title.
            //
            // Only expose ProductTitle as an edition when it
            // actually adds useful information.
            let edition: string | null = null;

            if (
            productTitle &&
            productGroupName &&
            productTitle.toLowerCase() !==
                productGroupName.toLowerCase()
            ) {
            const normalizedTitle =
                productGroupName.toLowerCase();

            const normalizedProductTitle =
                productTitle.toLowerCase();

            // Ignore cases where ProductTitle is simply
            // a shortened/repeated part of the main title.
            if (
                !normalizedTitle.endsWith(
                normalizedProductTitle
                )
            ) {
                edition = productTitle;
            }
            }

        const productId = product?.ProductId;

        if (!productId) {
          return null;
        }

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
            edition,
            price: currentPrice,
            originalPrice:
                typeof originalPrice === "number"
                ? originalPrice
                : currentPrice,
            discount,
            currency: priceData.CurrencyCode,
            platform: "Xbox",
            image: imageUrl,
            lowestPrice,
            };
      })
      .filter(Boolean);

    return NextResponse.json({
      games,
    });
  } catch (error) {
    console.error(
      "Xbox product details failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to retrieve Xbox product details",
      },
      { status: 500 }
    );
  }
}