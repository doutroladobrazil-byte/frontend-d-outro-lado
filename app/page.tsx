"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  supporting: string;
  image: string;
  primaryHref: string;
  secondaryHref: string;
};

const slides: Slide[] = [
  {
    id: 1,
    eyebrow: "MODA, ESTILO E ACESSÓRIOS",
    title: "D’OUTRO LADO",
    description: "Curadoria sofisticada de peças brasileiras",
    supporting:
      "Couro, crochê, acessórios e design com presença premium para clientes que valorizam autenticidade, refinamento e estética atemporal.",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    primaryHref: "/produtos/moda-estilo-e-acessorios",
    secondaryHref: "/produtos/moda-estilo-e-acessorios",
  },
  {
    id: 2,
    eyebrow: "CASA, DECORAÇÃO E CERÂMICA",
    title: "DESIGN BRASILEIRO",
    description: "Peças autorais com identidade elegante",
    supporting:
      "Uma seleção visualmente forte para ambientes sofisticados, com estética minimalista, calor artesanal e acabamento premium.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    primaryHref: "/produtos/casa-decoracao-e-ceramica",
    secondaryHref: "/produtos/casa-decoracao-e-ceramica",
  },
  {
    id: 3,
    eyebrow: "ENXOVAL E TEXTURAS",
    title: "TEXTURAS DO BRASIL",
    description: "Conforto, neutralidade e presença refinada",
    supporting:
      "Tecidos, composição e sensibilidade visual em uma experiência premium pensada para mercados internacionais exigentes.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    primaryHref: "/produtos/enxoval-e-texturas",
    secondaryHref: "/produtos/enxoval-e-texturas",
  },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  function goPrev() {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  function goNext() {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }

  return (
    <main className="home-page">
      <section className="hero-slider">
        <div
          className="hero-slider-background"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
        />

        <div className="hero-slider-overlay" />

        <div className="hero-slider-content">
          <p className="hero-eyebrow">{activeSlide.eyebrow}</p>

          <h1 className="hero-brand">{activeSlide.title}</h1>

          <h2 className="hero-headline">{activeSlide.description}</h2>

          <p className="hero-supporting">{activeSlide.supporting}</p>

          <div className="hero-actions">
            <Link href={activeSlide.primaryHref} className="hero-link-primary">
              EXPLORAR
            </Link>

            <Link href={activeSlide.secondaryHref} className="hero-link-secondary">
              BUSCAR PRODUTOS
            </Link>
          </div>

          <div className="hero-indicators">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-indicator ${index === activeIndex ? "hero-indicator-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hero-controls">
          <button type="button" onClick={goPrev} className="hero-control-button" aria-label="Slide anterior">
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={goNext} className="hero-control-button" aria-label="Próximo slide">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="home-section-dark">
        <div className="home-section-inner">
          <div className="section-heading-block">
            <p className="section-kicker">CURADORIA PREMIUM</p>
            <h3 className="section-title">Uma experiência mais próxima do luxo contemporâneo</h3>
            <p className="section-text">
              D&apos;OUTRO LADO apresenta produtos brasileiros com estética refinada,
              linguagem internacional e uma experiência visual premium.
            </p>
          </div>

          <div className="home-feature-grid">
            <Link href="/produtos/moda-estilo-e-acessorios" className="feature-card">
              <span className="feature-card-kicker">Categoria</span>
              <strong className="feature-card-title">Moda, estilo e acessórios</strong>
              <span className="feature-card-text">
                Couro, crochê, sapatos, óculos, carteiras e acessórios com presença sofisticada.
              </span>
            </Link>

            <Link href="/produtos/casa-decoracao-e-ceramica" className="feature-card">
              <span className="feature-card-kicker">Categoria</span>
              <strong className="feature-card-title">Casa, decoração e cerâmica</strong>
              <span className="feature-card-text">
                Peças com design limpo, textura artesanal e estética contemporânea.
              </span>
            </Link>

            <Link href="/atacado" className="feature-card">
              <span className="feature-card-kicker">Especial</span>
              <strong className="feature-card-title">Atacado e importadores</strong>
              <span className="feature-card-text">
                Área dedicada a lojistas e compradores que desejam condições especiais.
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}