"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import ProductCard from "@/components/products/ProductCard";
import {
  categories,
  products,
} from "@/data/products";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [onlyCustomizable, setOnlyCustomizable] =
    useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLocaleLowerCase("es")
        .includes(search.trim().toLocaleLowerCase("es"));

      const matchesCategory =
        category === "Todas" ||
        product.category === category;

      const matchesCustomization =
        !onlyCustomizable || product.customizable;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCustomization
      );
    });
  }, [search, category, onlyCustomizable]);

  return (
    <div className="min-h-screen bg-[#FFFCFB] text-[#342B30]">
      <Header />

      <main>
        <section className="border-b border-[#F2E9EC] bg-[#FAF1F4] px-6 py-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#BD6687]">
            Repostería Cindy
          </p>

          <h1 className="mb-5 font-serif text-5xl md:text-6xl">
            Nuestro catálogo
          </h1>

          <p className="mx-auto max-w-2xl leading-8 text-[#766A70]">
            Descubre nuestras tortas, postres y creaciones
            artesanales para cada ocasión.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="mb-10 grid gap-5 rounded-2xl border border-[#F0E6E9] bg-white p-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-medium"
              >
                Buscar producto
              </label>

              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Ej. torta de chocolate"
                className="w-full rounded-xl border border-[#EADCE1] px-4 py-3 text-sm outline-none focus:border-[#B84F79]"
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-medium"
              >
                Categoría
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-[#EADCE1] bg-white px-4 py-3 text-sm outline-none focus:border-[#B84F79]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(event) =>
                    setOnlyCustomizable(event.target.checked)
                  }
                  className="h-4 w-4 accent-[#B84F79]"
                />
                Solo productos personalizables
              </label>
            </div>
          </div>

          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">
              Productos
            </h2>

            <p className="text-sm text-[#82747B]">
              {filteredProducts.length} resultados
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#F0E6E9] bg-white px-6 py-16 text-center">
              <h3 className="mb-3 font-serif text-2xl">
                No encontramos productos
              </h3>

              <p className="text-sm text-[#82747B]">
                Prueba con otro nombre o cambia los filtros.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}