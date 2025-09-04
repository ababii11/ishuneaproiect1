"use client";

import { useEffect, useMemo, useState } from "react";
 

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
    const price = Math.round((basePrice + ((i * 7) % 120) + (i % 5) * 3) * 1);
    const inStock = i % 3 !== 0;
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

const localProducts: Product[] = generateProducts(100);

// Comparison helper
function compareProductsSummary(a: Product | undefined, b: Product | undefined): string {
  if (!a || !b) return "Selecteaza doua produse pentru comparatie.";
  let summary = "";
  if (a.title !== b.title) summary += `Titlu: "${a.title}" vs "${b.title}"\n`;
  if (a.category !== b.category) summary += `Categorie: ${a.category} vs ${b.category}\n`;
  if (a.price !== b.price) summary += `Pret: ${a.price} RON vs ${b.price} RON\n`;
  if (a.inStock !== b.inStock) summary += `Stoc: ${a.inStock ? "In stoc" : "Stoc epuizat"} vs ${b.inStock ? "In stoc" : "Stoc epuizat"}\n`;
  return summary || "Produsele sunt identice.";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");

  const [products, setProducts] = useState<Product[]>(localProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const fetchApiProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const apiProducts = (json?.products ?? []) as Product[];
        if (cancelled) return;
        // Merge unique by id, keeping local first
        const existingIds = new Set(localProducts.map((p) => p.id));
        const merged = localProducts.concat(
          apiProducts.filter((p) => !existingIds.has(p.id))
        );
        setProducts(merged);
      } catch (e: unknown) {
        if (!cancelled) setError("Nu s-au putut incarca produsele din API.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchApiProducts();
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", "Electronics", "Books", "Clothing", "Home"] as const;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice !== "" ? Number(minPrice) : Number.NEGATIVE_INFINITY;
    const max = maxPrice !== "" ? Number(maxPrice) : Number.POSITIVE_INFINITY;

    return products.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (category !== "All" && p.category !== category) return false;
      if (Number.isFinite(min) && p.price < min) return false;
      if (Number.isFinite(max) && p.price > max) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });
  }, [query, category, minPrice, maxPrice, onlyInStock, products]);

  const resultsCount = filtered.length;

  const productA = products.find(p => p.id === compareA);
  const productB = products.find(p => p.id === compareB);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-12">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-10">
        {/* Hero */}
        <section className="mt-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Descopera <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]">produse</span> care te inspira
          </h1>
          <p className="mt-3 text-sm sm:text-base opacity-80 max-w-2xl mx-auto">
            Cauta si filtreaza rapid in catalogul nostru — o experienta fluida, cu un design proaspat.
          </p>
        </section>

        {/* Filters */}
        <section id="filtre" className="rounded-2xl glass p-5 sm:p-7 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cauta produse..."
                className="searchbar w-full h-11 px-3 bg-transparent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Categorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter w-full h-11 bg-transparent focus:outline-none"
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
                <label className="block text-xs font-semibold mb-1">Pret minim</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="filter w-full h-11 bg-transparent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Pret maxim</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1000"
                  className="filter w-full h-11 bg-transparent focus:outline-none"
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

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm opacity-70">
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
          </div>
        </section>

        {/* Product Comparison */}
        <section className="rounded-2xl glass p-5 border border-white/20 shadow mb-8">
          <h2 className="text-lg font-bold mb-3">Compara doua produse</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <select
              value={compareA}
              onChange={e => setCompareA(e.target.value)}
              className="filter w-full sm:w-1/2"
            >
              <option value="">Alege primul produs</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <select
              value={compareB}
              onChange={e => setCompareB(e.target.value)}
              className="filter w-full sm:w-1/2"
            >
              <option value="">Alege al doilea produs</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <pre className="bg-background rounded-lg p-3 text-sm whitespace-pre-wrap">{compareProductsSummary(productA, productB)}</pre>
        </section>

        {/* Products */}
        <section id="produse" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {error && (
            <div className="col-span-full text-center text-sm opacity-80 py-3 rounded-lg border border-red-400/40">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-black/10 dark:border-white/10 p-5 animate-pulse bg-background/50 h-48" />
              ))}
            </div>
          )}
          {!isLoading && filtered.length === 0 ? (
            <div className="col-span-full text-center text-sm opacity-80 py-16 border border-dashed rounded-2xl glass">
              Niciun rezultat. Incearca sa modifici criteriile de filtrare.
            </div>
          ) : (
            filtered.map((p) => (
              <article key={p.id} className="card rounded-2xl border border-black/10 dark:border-white/10 p-0 overflow-hidden bg-background/70">
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold tracking-tight">{p.title}</h3>
                    <span className="badge">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-lg">{p.price} RON</span>
                    <span className={p.inStock ? "in-stock" : "out-stock"}>
                      {p.inStock ? "In stoc" : "Stoc epuizat"}
                    </span>
                  </div>
                  <button className="btn mt-1 self-start">Adauga in cos</button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
