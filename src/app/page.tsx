"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check, ShieldCheck, Truck, Globe2 } from "lucide-react";
import HomeProductPreview from "@/components/HomeProductPreview";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
};

type CategoryCard = {
  title: string;
  subtitle: string;
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
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "COURO E PRESENÇA",
    subtitle: "Textura, sofisticação e valor percebido",
    description:
      "Seleção refinada de peças com forte apelo visual e leitura premium para o mercado internacional.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "SAPATOS E ESTILO",
    subtitle: "Silhueta elegante e comercial",
    description:
      "Peças pensadas para transmitir elegância contemporânea e uma identidade brasileira sofisticada.",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=80",
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
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "DECORAÇÃO COM ATMOSFERA",
    subtitle: "Casa brasileira contemporânea",
    description:
      "Objetos e composições que unem elegância, autenticidade e presença visual premium.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "ENXOVAL REFINADO",
    subtitle: "Conforto com sofisticação",
    description:
      "Itens pensados para elevar a experiência da casa com estética limpa e desejável.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80",
    href: "/produtos/casa-e-decoracao",
  },
];

const featuredCategories: CategoryCard[] = [
  {
    title: "Moda & acessórios",
    subtitle: "Seleção sofisticada para presença internacional",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    href: "/produtos/moda-estilo-e-acessorios",
  },
  {
    title: "Casa & decoração",
    subtitle: "Peças com estética refinada para interiores premium",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    href: "/produtos/casa-e-decoracao",
  },
  {
    title: "Presentes especiais",
    subtitle: "Kits elegantes e curadoria para ocasiões marcantes",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    href: "/contato",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Experiência confiável",
    description: "Layout limpo, leitura premium e percepção de marca mais sólida.",
  },
  {
    icon: Truck,
    title: "Fluxo pronto para checkout",
    description: "Visual preparado para catálogo, bag, produto e jornada comercial.",
  },
  {
    icon: Globe2,
    title: "Base internacional",
    description: "Estrutura que conversa com idioma, moeda e operação global.",
  },
];

type SliderProps = {
  title: string;
  slides: Slide[];
};

function DualSlider({ title, slides }: SliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4800);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[current];

  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

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
            className="rounded-full border border-white/15 bg-white/[0.02] p-2 text-white/80 transition hover:border-[#cdb899]/45 hover:bg-white/[0.05] hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo slide"
            className="rounded-full border border-white/15 bg-white/[0.02] p-2 text-white/80 transition hover:border-[#cdb899]/45 hover:bg-white/[0.05] hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0f0f0f,#090909)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="relative min-h-[520px]">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${index}`}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                current === index
                  ? "translate-x-0 scale-100 opacity-100"
                  : index < current
                    ? "-translate-x-8 scale-[1.02] opacity-0"
                    : "translate-x-8 scale-[1.02] opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2200ms] ease-out"
                style={{ backgroundImage: `url("${slide.image}")` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.18),rgba(8,8,8,0.38))]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-[rgba(214,194,161,0.10)]" />
            </div>
          ))}

          <div className="relative z-10 flex min-h-[520px] items-end">
            <div className="w-full p-6 sm:p-8 lg:p-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#d6c2a1]">
                {activeSlide.subtitle}
              </p>

              <h2
                className="max-w-[90%] text-3xl font-light leading-[0.95] text-[#f6f1e8] sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "serif" }}
              >
                {activeSlide.title}
              </h2>

              <Link
                href={activeSlide.href}
                className="mt-4 block max-w-xl text-sm leading-7 text-white/80 transition hover:text-[#f3eee6] sm:text-base"
              >
                {activeSlide.description}
              </Link>

              <Link
                href={activeSlide.href}
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition hover:border-[#e6d8be]/40 hover:bg-[#f3eee6] hover:text-black"
              >
                Explorar
                <span className="text-base">→</span>
              </Link>

              <div className="mt-6 flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    type="button"
                    aria-label={`Ir para slide ${index + 1}`}
                    onClick={() => setCurrent(index)}
                    className={`h-2 rounded-full transition-all ${
                      current === index
                        ? "w-8 bg-[#e4d2b2]"
                        : "w-2 bg-white/35 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
            Curadoria
          </p>
          <h2
            className="mt-2 text-3xl font-light text-[#f5f0e8] sm:text-4xl"
            style={{ fontFamily: "serif" }}
          >
            Categorias em destaque
          </h2>
        </div>

        <Link
          href="/produtos"
          className="hidden text-[11px] uppercase tracking-[0.28em] text-white/65 transition hover:text-white md:inline-flex"
        >
          Ver catálogo completo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {featuredCategories.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40"
          >
            <div
              className="h-[340px] bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#d6c2a1]">
                D&apos;OUTRO LADO
              </p>
              <h3
                className="mt-2 text-2xl font-light text-[#f6f1e8]"
                style={{ fontFamily: "serif" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {item.subtitle}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/85">
                Explorar <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrustBand() {
  return (
    <section className="px-4 pb-14 sm:px-6 lg:px-10">
      <div className="store-trust-band">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="store-trust-card">
              <div className="store-trust-icon">
                <Icon size={18} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CommercialStrip() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="commercial-strip">
        <div className="commercial-strip-copy">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
            Loja real
          </p>

          <h2
            className="mt-3 text-3xl font-light leading-tight text-[#f5f0e8] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "serif" }}
          >
            Visual refinado com leitura comercial de verdade
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
            A home agora conversa melhor com um e-commerce premium: hero forte,
            categorias claras, destaque de produto, prova de valor e chamadas visuais
            mais prontas para conversão.
          </p>

          <div className="commercial-list">
            {[
              "Hero com mais percepção de valor",
              "Seção de confiança visual e credibilidade",
              "Prévia de produtos mais próxima de loja real",
              "Login premium alinhado ao restante da marca",
            ].map((item) => (
              <div key={item} className="commercial-list-item">
                <Check size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="commercial-strip-visual">
          <div className="commercial-panel tall" />
          <div className="commercial-panel-grid">
            <div className="commercial-panel small" />
            <div className="commercial-panel small accent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,194,161,0.10),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-10 lg:pb-12 lg:pt-16">
          <div className="text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-[#cdb899] sm:text-[11px]">
              Brasil sofisticado para o mundo
            </p>

            <h1
              className="mx-auto max-w-6xl text-4xl font-light leading-[0.88] text-[#f7f3ec] sm:text-6xl lg:text-[108px]"
              style={{ fontFamily: "serif" }}
            >
              D&apos;OUTRO LADO
            </h1>

            <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#cdb899]/60 to-transparent" />

            <p className="mx-auto mt-4 max-w-2xl text-xs uppercase tracking-[0.35em] text-white/55 sm:text-[11px]">
              Levando o melhor do Brasil até você
            </p>
          </div>
        </div>
      </section>

      <TrustBand />

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

      <CommercialStrip />

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div
              className="min-h-[360px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
            <div className="flex items-center bg-[linear-gradient(180deg,rgba(12,12,12,0.72),rgba(18,18,18,0.92))]">
              <div className="p-8 sm:p-10 lg:p-14">
                <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
                  Presentes personalizados
                </p>

                <h2
                  className="text-3xl font-light leading-tight text-[#f5f0e8] sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "serif" }}
                >
                  Kits elegantes criados para ocasiões especiais
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Desenvolvemos composições exclusivas para presentes
                  sofisticados, unindo estética refinada, curadoria brasileira
                  e apresentação premium para surpreender com personalidade.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contato"
                    className="rounded-full border border-white/20 bg-[#f3eee6] px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-black transition hover:bg-white"
                  >
                    Solicitar um kit
                  </Link>

                  <Link
                    href="/produtos"
                    className="rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-white transition hover:border-[#cdb899]/35 hover:bg-white/5"
                  >
                    Ver produtos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.20)] sm:p-6">
          <HomeProductPreview />
        </div>
      </section>
    </main>
  );
}
