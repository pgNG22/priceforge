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
      platformdependencyname: "windows.xbox",
      productFamilyNames: "Games",
      topProducts: "25",
    });

    const url =
      `https://displaycatalog.mp.microsoft.com/v7.0/productFamilies/autosuggest?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "Microsoft autosuggest error:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: "Microsoft autosuggest request failed",
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    const products =
      data?.Results?.flatMap(
        (result: any) => result?.Products ?? []
      ) ?? [];

    const games = products
      .filter(
        (product: any) =>
          product?.Type === "Game" &&
          product?.ProductId &&
          product?.Title
      )
      .map((product: any) => ({
        id: product.ProductId,
        title: product.Title,
        image: product.Icon
          ? `https:${product.Icon}`
          : null,
      }));

    return NextResponse.json({
      games,
    });
  } catch (error) {
    console.error("Xbox autosuggest failed:", error);

    return NextResponse.json(
      {
        error: "Unable to search Xbox Store",
      },
      { status: 500 }
    );
  }
}