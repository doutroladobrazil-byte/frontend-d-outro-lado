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
import MenuDrawer from "@/components/MenuDrawer";

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

type SliderProps = {
  title: string;
  slides: Slide[];
};

function DualSlider({ title, slides }: SliderProps) {
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

      <div className="relative block overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d]">
        <div className="relative min-h-[520px]">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                current === index
                  ? "translate-x-0 opacity-100"
                  : index < current
                    ? "-translate-x-8 opacity-0"
                    : "translate-x-8 opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />
            </div>
          ))}

          <div className="relative z-10 flex min-h-[520px] items-end">
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

              <Link
                href={activeSlide.href}
                className="mt-4 block max-w-xl text-sm leading-7 text-white/80 transition hover:text-white sm:text-base"
              >
                {activeSlide.description}
              </Link>

              <Link
                href={activeSlide.href}
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition hover:bg-white hover:text-black"
              >
                Explorar
                <span className="text-base">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-10 lg:pb-12 lg:pt-16">
          <div className="text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-[#cdb899] sm:text-[11px]">
              Brasil sofisticado para o mundo
            </p>

            <h1
              className="mx-auto max-w-6xl text-4xl font-light leading-[0.88] text-white sm:text-6xl lg:text-[108px]"
              style={{ fontFamily: "serif" }}
            >
              D&apos;OUTRO LADO
            </h1>
          </div>

          <header className="mt-8 rounded-full border border-white/10 bg-white/[0.03] px-3 py-3 backdrop-blur-md sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Abrir menu"
                  className="rounded-full border border-white/10 p-3 transition hover:border-white/30 hover:bg-white/5"
                >
                  <Menu size={20} />
                </button>

                <Link
                  href="/"
                  className="hidden rounded-full border border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-white/75 transition hover:border-white/30 hover:bg-white/5 md:inline-flex"
                >
                  Home
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button className="rounded-full border border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-white/30 hover:bg-white/5">
                  EN
                </button>

                <button className="hidden rounded-full border border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-white/30 hover:bg-white/5 sm:inline-flex">
                  Europe
                </button>

                <button className="rounded-full border border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-white/30 hover:bg-white/5">
                  EUR
                </button>

                <button
                  aria-label="Pesquisar"
                  className="rounded-full border border-transparent p-3 transition hover:border-white/20 hover:bg-white/5"
                >
                  <Search size={18} />
                </button>

                <Link
                  href="/login"
                  aria-label="Login"
                  className="rounded-full border border-transparent p-3 transition hover:border-white/20 hover:bg-white/5"
                >
                  <User size={18} />
                </Link>

                <Link
                  href="/bag"
                  aria-label="Sacola"
                  className="rounded-full border border-transparent p-3 transition hover:border-white/20 hover:bg-white/5"
                >
                  <ShoppingBag size={18} />
                </Link>
              </div>
            </div>
          </header>
        </div>
      </section>

      <section className="px-4 pb-12 pt-10 sm:px-6 lg:px-10">
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

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div
              className="min-h-[360px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
            <div className="flex items-center">
              <div className="p-8 sm:p-10 lg:p-14">
                <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
                  Presentes personalizados
                </p>

                <h2
                  className="text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "serif" }}
                >
                  Kits elegantes criados para ocasiões especiais
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Desenvolvemos composições exclusivas para presentes sofisticados,
                  unindo estética refinada, curadoria brasileira e apresentação
                  premium para surpreender com personalidade.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contato"
                    className="rounded-full border border-white/20 px-6 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition hover:bg-white hover:text-black"
                  >
                    Solicitar presente personalizado
                  </Link>

                  <Link
                    href="/sobre"
                    className="rounded-full border border-white/10 px-6 py-3 text-[11px] uppercase tracking-[0.32em] text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
                  >
                    Saber mais
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
}