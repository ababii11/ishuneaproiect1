"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  title: string;
  category: "Electronics" | "Books" | "Clothing" | "Home";
  price: number;
  inStock: boolean;
};

const categoryValues: Product["category"][] = ["Electronics", "Books", "Clothing", "Home"];

function generateProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const category = categoryValues[(i - 1) % categoryValues.length];
    const basePrice = category === "Electronics" ? 80 : category === "Books" ? 20 : category === "Clothing" ? 40 : 30;
    const price = Math.round((basePrice + ((i * 7) % 120) + (i % 5) * 3) * 1); // 20 - ~200+
    const inStock = i % 3 !== 0; // about ~66% in stock
    const adjective = ["Premium", "Compact", "Eco", "Classic", "Smart", "Urban", "Pro", "Lite"][i % 8];
    const noun = category === "Electronics"
      ? ["Headphones", "Speaker", "Mouse", "Keyboard", "Charger"][i % 5]
      : category === "Books"
      ? ["Guide", "Handbook", "Stories", "Cookbook", "Workbook"][i % 5]
      : category === "Clothing"
      ? ["Jacket", "T-Shirt", "Hoodie", "Sneakers", "Jeans"][i % 5]
      : ["Lamp", "Mug", "Towel", "Curtains", "Organizer"][i % 5];
    products.push({
      id: String(i),
      title: `${adjective} ${noun} ${i}`,
      category,
      price,
      inStock,
    });
  }
  return products;
}

const allProducts: Product[] = generateProducts(100);

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const categories = ["All", "Electronics", "Books", "Clothing", "Home"] as const;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice !== "" ? Number(minPrice) : Number.NEGATIVE_INFINITY;
    const max = maxPrice !== "" ? Number(maxPrice) : Number.POSITIVE_INFINITY;

    return allProducts.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (category !== "All" && p.category !== category) return false;
      if (Number.isFinite(min) && p.price < min) return false;
      if (Number.isFinite(max) && p.price > max) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });
  }, [query, category, minPrice, maxPrice, onlyInStock]);

  const resultsCount = filtered.length;

  return (
    <div className="font-sans min-h-screen p-8 sm:p-12">
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Catalog produse</h1>
          <p className="text-sm text-foreground/70">Cauta si filtreaza produsele dupa categorie, pret si stoc.</p>
        </header>

        <section className="rounded-xl border border-black/[.08] dark:border-white/[.14] p-4 sm:p-6 bg-background/60 backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-medium mb-1">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cauta produse..."
                className="w-full h-10 px-3 rounded-md border border-black/[.12] dark:border-white/[.12] bg-transparent focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Categorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-black/[.12] dark:border-white/[.12] bg-transparent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-background text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Pret minim</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-3 rounded-md border border-black/[.12] dark:border-white/[.12] bg-transparent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Pret maxim</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full h-10 px-3 rounded-md border border-black/[.12] dark:border-white/[.12] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="in-stock"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              <label htmlFor="in-stock" className="text-sm">Doar produse in stoc</label>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between">
          <p className="text-sm text-foreground/70">
            {resultsCount} rezultat{resultsCount === 1 ? "" : "e"}
          </p>
          {(query || category !== "All" || minPrice || maxPrice || onlyInStock) && (
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
                setMinPrice("");
                setMaxPrice("");
                setOnlyInStock(false);
              }}
              className="text-sm underline underline-offset-4 hover:opacity-80"
            >
              Reseteaza filtrele
            </button>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-sm text-foreground/70 py-12 border border-dashed rounded-lg">
              Niciun rezultat. Incearca sa modifici criteriile de filtrare.
            </div>
          ) : (
            filtered.map((p) => (
              <article key={p.id} className="rounded-xl border border-black/[.08] dark:border-white/[.14] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-black/[.12] dark:border-white/[.12]">
                    {p.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{p.price} RON</span>
                  <span className={p.inStock ? "text-green-600" : "text-red-600"}>
                    {p.inStock ? "In stoc" : "Stoc epuizat"}
                  </span>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
