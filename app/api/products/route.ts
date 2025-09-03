export const dynamic = "force-dynamic";

export async function GET() {
  const categories = ["Electronics", "Books", "Clothing", "Home"] as const;
  const extra = Array.from({ length: 24 }).map((_, idx) => {
    const i = idx + 1;
    const category = categories[i % categories.length];
    const basePrice = category === "Electronics" ? 120 : category === "Books" ? 35 : category === "Clothing" ? 60 : 45;
    const price = Math.round(basePrice + ((i * 9) % 140));
    const inStock = i % 4 !== 0;
    const adjective = ["Nova", "Aero", "Fusion", "Prime", "Flex", "Aura"][i % 6];
    const noun = category === "Electronics"
      ? ["Tablet", "Camera", "Router", "Monitor", "SSD"][i % 5]
      : category === "Books"
      ? ["Novel", "Poems", "Essays", "Atlas", "Manual"][i % 5]
      : category === "Clothing"
      ? ["Coat", "Shirt", "Cap", "Boots", "Shorts"][i % 5]
      : ["Vase", "Frame", "Chair", "Shelf", "Mirror"][i % 5];

    return {
      id: `api-${i}`,
      title: `${adjective} ${noun} API ${i}`,
      category,
      price,
      inStock,
      image: `https://picsum.photos/seed/api-${i}/640/400`,
    };
  });

  return Response.json({ products: extra });
}
