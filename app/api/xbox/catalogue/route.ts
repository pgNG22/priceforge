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
        "Microsoft catalogue search error:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: "Microsoft catalogue search failed",
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

        if (!productId) {
          return null;
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

        return {
          id: productId,
          title,
          edition:
            localized?.ProductTitle ?? title,
          image: boxArt
            ? `https:${boxArt}`
            : null,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      games,
    });
  } catch (error) {
    console.error(
      "Xbox catalogue search failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to search Xbox catalogue",
      },
      { status: 500 }
    );
  }
}