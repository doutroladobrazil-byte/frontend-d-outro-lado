"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
};

const fashionSlides: Slide[] = [
  {
    title: "MODA, VESTUÁRIO E ACESSÓRIOS",
    subtitle: "Elegância brasileira com curadoria premium",
    description:
      "Bolsas de crochê, bolsas de couro, coturnos femininos, sapatos sociais, óculos de sol, carteiras e nécessaires em uma seleção sofisticada e contemporânea.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "TEXTURAS, COURO E ESTILO",
    subtitle: "Peças versáteis para um lifestyle refinado",
    description:
      "Uma estética neutra, moderna e elegante, pensada para clientes internacionais que buscam autenticidade e acabamento premium.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "ACESSÓRIOS COM PRESENÇA",
    subtitle: "Curadoria visual forte e comercial",
    description:
      "Seleção com apelo editorial e excelente leitura de marca para compor um catálogo internacional mais desejável.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
];

const homeSlides: Slide[] = [
  {
    title: "CERÂMICA, DECORAÇÕES E ENXOVAL",
    subtitle: "Casa brasileira com sofisticação contemporânea",
    description:
      "Peças de decoração em cerâmica, pratos, xícaras, travessas e itens de enxoval com linguagem minimalista e acabamento elegante.",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "FORMAS, MATÉRIA E ATMOSFERA",
    subtitle: "Curadoria para interiores com identidade",
    description:
      "Objetos que unem presença estética, textura artesanal e leitura premium para um público que valoriza casa, estilo e autenticidade.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "ENXOVAL E DETALHES DE CASA",
    subtitle: "Funcionalidade elevada com apelo visual",
    description:
      "Uma seleção pensada para transmitir cuidado, conforto e sofisticação em cada ambiente.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
];

function SliderSection({
  slides,
  eyebrow,
}: {
  slides: Slide[];
  eyebrow: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[current];

  return (
    <section className="px-4 pb-6 sm:px-6 lg:px-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
          {eyebrow}
        </p>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir para slide ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <Link
        href={currentSlide.href}
        className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d]"
      >
        <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-black/45" />

          <div className="relative z-10 flex h-full items-end">
            <div className="max-w-3xl px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#d6c2a1]">
                {currentSlide.subtitle}
              </p>

              <h2
                className="max-w-4xl text-3xl font-light leading-[0.95] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "serif" }}
              >
                {currentSlide.title}
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {currentSlide.description}
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition group-hover:bg-white group-hover:text-black">
                Explorar coleção
                <span className="text-base">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default function HomePage() {
  const regions = useMemo(() => ["Europe"], []);
  const currencies = useMemo(() => ["EUR"], []);
  const languages = useMemo(() => ["EN"], []);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="flex h-[88px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Abrir menu"
              className="rounded-full border border-white/10 p-3 transition hover:border-white/30 hover:bg-white/5"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link href="/">
              <span
                className="block text-[18px] tracking-[0.42em] text-white sm:text-[22px]"
                style={{ fontFamily: "serif" }}
              >
                D&apos;OUTRO LADO
              </span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="rounded-full border border-white/10 px-4 py-3 text-sm transition hover:border-white/30 hover:bg-white/5">
              {languages[0]}
            </button>

            <button className="hidden rounded-full border border-white/10 px-6 py-3 text-sm transition hover:border-white/30 hover:bg-white/5 sm:block">
              {regions[0]}
            </button>

            <button className="rounded-full border border-white/10 px-4 py-3 text-sm transition hover:border-white/30 hover:bg-white/5">
              {currencies[0]}
            </button>

            <button
              aria-label="Pesquisar"
              className="rounded-full p-3 transition hover:bg-white/5"
            >
              <Search size={20} />
            </button>

            <Link
              href="/login"
              aria-label="Login"
              className="rounded-full p-3 transition hover:bg-white/5"
            >
              <User size={20} />
            </Link>

            <Link
              href="/bag"
              aria-label="Sacola"
              className="rounded-full p-3 transition hover:bg-white/5"
            >
              <ShoppingBag size={20} />
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-6 text-[12px] uppercase tracking-[0.38em] text-[#ccb691]">
            Brasil sofisticado para o mundo
          </p>

          <h1
            className="mx-auto max-w-5xl text-5xl font-light leading-[0.92] text-white sm:text-7xl lg:text-[110px]"
            style={{ fontFamily: "serif" }}
          >
            D&apos;OUTRO LADO
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
            Uma curadoria internacional de produtos brasileiros sofisticados,
            com linguagem premium, visual refinado e experiência pensada para
            clientes de alto poder aquisitivo.
          </p>
        </div>
      </section>

      <SliderSection
        slides={fashionSlides}
        eyebrow="Moda, vestuário e acessórios"
      />

      <SliderSection
        slides={homeSlides}
        eyebrow="Cerâmica, decorações e enxoval"
      />
    </main>
  );
}