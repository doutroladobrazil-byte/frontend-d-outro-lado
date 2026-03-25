"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
};

const fashionSlides: Slide[] = [
  {
    title: "BOLSAS E ACESSÓRIOS",
    subtitle: "Moda, vestuário e acessórios",
    description:
      "Curadoria premium com bolsas de crochê, couro, carteiras, óculos e acessórios com estética elegante e internacional.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "COURO E PRESENÇA",
    subtitle: "Textura, sofisticação e valor percebido",
    description:
      "Seleção refinada de peças com forte apelo visual e leitura premium para o mercado internacional.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "SAPATOS E ESTILO",
    subtitle: "Silhueta elegante e comercial",
    description:
      "Peças pensadas para transmitir elegância contemporânea e uma identidade brasileira sofisticada.",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "ÓCULOS E DETALHES",
    subtitle: "Acessórios com assinatura visual",
    description:
      "Uma composição de acessórios desejáveis para clientes que buscam acabamento, neutralidade e presença.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "CROCHÊ E IDENTIDADE",
    subtitle: "Artesanal com leitura premium",
    description:
      "O artesanal brasileiro reinterpretado em linguagem sofisticada para exportação.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "CURADORIA DE MODA",
    subtitle: "Versatilidade e desejo",
    description:
      "Moda e acessórios com força editorial para elevar a percepção da marca e do catálogo.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
];

const homeSlides: Slide[] = [
  {
    title: "CERÂMICA AUTORAL",
    subtitle: "Cerâmica, decorações e enxoval",
    description:
      "Peças para casa com visual minimalista, sofisticado e forte apelo decorativo.",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "DECORAÇÃO COM ATMOSFERA",
    subtitle: "Casa brasileira contemporânea",
    description:
      "Objetos e composições que unem elegância, autenticidade e presença visual premium.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "ENXOVAL REFINADO",
    subtitle: "Conforto com sofisticação",
    description:
      "Itens pensados para elevar a experiência da casa com estética limpa e desejável.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "FORMAS E TEXTURAS",
    subtitle: "Curadoria de interior",
    description:
      "Cerâmica, travessas, xícaras e objetos para um catálogo premium e internacional.",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "MESA E PRESENÇA",
    subtitle: "Objetos com valor visual",
    description:
      "Peças que ajudam a construir ambientes sofisticados e memoráveis.",
    image:
      "https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "CASA E ELEGÂNCIA",
    subtitle: "Decoração com linguagem premium",
    description:
      "Uma leitura contemporânea e comercial para o segmento casa, decoração e enxoval.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    href: "/produtos/casa-e-decoracao",
  },
];

function DualSlider({
  title,
  slides,
}: {
  title: string;
  slides: Slide[];
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[current];

  return (
    <section className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
          {title}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Slide anterior"
            className="rounded-full border border-white/15 p-2 text-white/80 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo slide"
            className="rounded-full border border-white/15 p-2 text-white/80 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Link
        href={activeSlide.href}
        className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d]"
      >
        <div className="relative min-h-[500px]">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                current === index
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-[1.03] opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/40" />
            </div>
          ))}

          <div className="relative z-10 flex min-h-[500px] items-end">
            <div className="w-full p-6 sm:p-8 lg:p-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#d6c2a1]">
                {activeSlide.subtitle}
              </p>

              <h2
                className="max-w-[90%] text-3xl font-light leading-[0.95] text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "serif" }}
              >
                {activeSlide.title}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {activeSlide.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition group-hover:bg-white group-hover:text-black">
                Explorar
                <span className="text-base">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slides.map((slide, index) => (
          <button
            key={`card-${slide.title}-${index}`}
            type="button"
            onClick={() => setCurrent(index)}
            className={`overflow-hidden rounded-[22px] border text-left transition ${
              current === index
                ? "border-white/40 bg-white/8"
                : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
            }`}
          >
            <div
              className="h-24 w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            <div className="p-3">
              <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#cdb899]">
                {slide.subtitle}
              </p>
              <p className="line-clamp-2 text-sm text-white/88">{slide.title}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
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
              EN
            </button>

            <button className="hidden rounded-full border border-white/10 px-6 py-3 text-sm transition hover:border-white/30 hover:bg-white/5 sm:block">
              Europe
            </button>

            <button className="rounded-full border border-white/10 px-4 py-3 text-sm transition hover:border-white/30 hover:bg-white/5">
              EUR
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

      <section className="px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-6 text-[12px] uppercase tracking-[0.38em] text-[#ccb691]">
            Brasil sofisticado para o mundo
          </p>

          <h1
            className="mx-auto max-w-6xl text-5xl font-light leading-[0.9] text-white sm:text-7xl lg:text-[112px]"
            style={{ fontFamily: "serif" }}
          >
            D&apos;OUTRO LADO
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
            Curadoria internacional de produtos brasileiros sofisticados, com
            linguagem premium, estética refinada e experiência pensada para um
            público exigente.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <DualSlider
            title="Moda, vestuário e acessórios"
            slides={fashionSlides}
          />

          <DualSlider
            title="Cerâmica, decorações e enxoval"
            slides={homeSlides}
          />
        </div>
      </section>
    </main>
  );
}