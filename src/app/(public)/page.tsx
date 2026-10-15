import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";

const categories = [
  {
    name: "Tortas de cumpleaños",
    description: "Celebraciones que merecen algo especial.",
    icon: "🎂",
    href: "/catalogo",
  },
  {
    name: "Tortas personalizadas",
    description: "Creaciones únicas para cada ocasión.",
    icon: "✨",
    href: "/catalogo",
  },
  {
    name: "Postres y porciones",
    description: "Pequeños placeres para compartir.",
    icon: "🍰",
    href: "/catalogo",
  },
  {
    name: "Cupcakes y galletas",
    description: "Detalles dulces hechos con cariño.",
    icon: "🧁",
    href: "/catalogo",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFCFB] text-[#342B30]">
      <Header />

      <main>
        {/* PORTADA */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#BD6687]">
              Repostería artesanal
            </p>

            <h1 className="mb-7 font-serif text-5xl leading-[1.12] tracking-tight md:text-6xl lg:text-7xl">
              Dulces momentos,
              <span className="block italic text-[#C65F88]">
                creaciones inolvidables.
              </span>
            </h1>

            <p className="mb-9 max-w-lg text-base leading-8 text-[#766A70] md:text-lg">
              Tortas, postres y creaciones especiales elaboradas
              con dedicación para acompañarte en cada celebración.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="rounded-full bg-[#B84F79] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#963B61]"
              >
                Explorar catálogo
              </Link>

              <Link
                href="/contacto"
                className="rounded-full border border-[#D9B7C4] px-7 py-4 text-sm font-semibold text-[#81435C] transition hover:bg-[#FFF0F5]"
              >
                Solicitar una creación
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#F9EDF1] p-8 md:min-h-[560px]">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#F3DCE5]" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/60" />

            <div className="relative text-center">
              <Image
                src="/images/logo-reposteria-cindy.png"
                alt="Repostería Cindy"
                width={350}
                height={350}
                priority
                className="mx-auto h-auto w-full max-w-[310px] rounded-full drop-shadow-xl"
              />
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#956B7D]">
                Hecho con cariño en Honduras
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="border-y border-[#F2E9EC] bg-white px-6 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#BD6687]">
                  Descubre nuestros sabores
                </p>
                <h2 className="font-serif text-4xl md:text-5xl">
                  Algo especial para ti
                </h2>
              </div>

              <Link
                href="/catalogo"
                className="text-sm font-semibold text-[#B84F79] hover:underline"
              >
                Ver todo el catálogo →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  href={category.href}
                  key={category.name}
                  className="group overflow-hidden rounded-2xl border border-[#F0E6E9] bg-[#FFFCFB] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-52 items-center justify-center bg-[#F8EDF1] text-7xl">
                    <span className="transition group-hover:scale-110">
                      {category.icon}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 font-serif text-xl">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-6 text-[#82747B]">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HISTORIA */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-8">
          <div className="flex min-h-80 items-center justify-center rounded-[2rem] bg-[#F6E9E5] p-10">
            <div className="text-center">
              <span className="text-7xl">♡</span>
              <p className="mt-5 font-serif text-2xl text-[#8E6171]">
                Preparado con amor
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#BD6687]">
              Nuestra esencia
            </p>

            <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
              El cariño se nota en cada detalle.
            </h2>

            <p className="mb-8 leading-8 text-[#766A70]">
              En Repostería Cindy creemos que los momentos
              especiales merecen sabores memorables. Cada
              creación nace de nuestra pasión por la repostería
              y del cuidado que ponemos en nuestro trabajo.
            </p>

            <Link
              href="/nosotros"
              className="font-semibold text-[#B84F79] hover:underline"
            >
              Conoce nuestra historia →
            </Link>
          </div>
        </section>

        {/* CONTACTO */}
        <section className="bg-[#F8EDF1] px-6 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#BD6687]">
              Celebremos juntos
            </p>

            <h2 className="mb-6 font-serif text-4xl md:text-5xl">
              Hagamos dulce tu próxima ocasión.
            </h2>

            <p className="mb-9 leading-8 text-[#766A70]">
              Cuéntanos qué estás imaginando. Nos encantará
              ayudarte a encontrar una creación especial.
            </p>

            <Link
              href="/contacto"
              className="inline-block rounded-full bg-[#B84F79] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#963B61]"
            >
              Contáctanos
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#342B30] px-6 py-12 text-center text-white">
        <p className="font-serif text-2xl">Repostería Cindy</p>

        <p className="mt-3 text-sm text-[#D7C3CB]">
          Dulces momentos, creaciones inolvidables.
        </p>

        <p className="mt-8 text-xs text-[#B7A5AD]">
          ©Repostería Cindy.
          Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}