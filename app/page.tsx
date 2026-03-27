"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  eyebrow: string;
};

type CategoryCard = {
  id: number;
  title: string;
  description: string;
  href: string;
  image: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Moda, estilo e acessórios",
    title: "Curadoria sofisticada de peças brasileiras",
    subtitle: "Couro, crochê, acessórios e design com presença premium.",
    description:
      "Uma seleção elegante de produtos brasileiros pensados para clientes que valorizam autenticidade, refinamento e estética atemporal.",
    href: "/produtos/moda-estilo-e-acessorios",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    eyebrow: "Casa e decoração",
    title: "Peças que transformam o ambiente com discrição e elegância",
    subtitle: "Cerâmica autoral, decoração refinada e visual minimalista.",
    description:
      "Produtos para ambientes sofisticados, com materiais naturais, presença leve e leitura contemporânea.",
    href: "/produtos/casa-e-decoracao",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  },
];

const categoryCards: CategoryCard[] = [
  {
    id: 1,
    title: "Moda, Estilo e Acessórios",
    description:
      "Bolsas de crochê, bolsas de couro, óculos, carteiras, nécessaires e calçados com linguagem elegante e contemporânea.",
    href: "/produtos/moda-estilo-e-acessorios",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    title: "Casa e Decoração",
    description:
      "Cerâmica decorativa, pratos, xícaras, travessas, enxoval e objetos que valorizam a composição de ambientes sofisticados.",
    href: "/produtos/casa-e-decoracao",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80",
  },
];

const featuredHighlights = [
  {
    title: "Experiência premium",
    text: "Layout elegante, leitura limpa e navegação refinada em todas as telas.",
  },
  {
    title: "Seleção brasileira",
    text: "Produtos com identidade visual sofisticada e apelo internacional.",
  },
  {
    title: "Jornada fluida",
    text: "Pesquisa, bag e login pensados para conversão com aparência premium.",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const currentSlide = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  function goToPreviousSlide() {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }

  function goToNextSlide() {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  }

  return (
    <main className="container-premium section-spacing">
      <section className="home-hero card-premium">
        <div className="home-hero__media">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`home-hero__image-layer ${
                index === activeSlide ? "is-active" : ""
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden={index !== activeSlide}
            />
          ))}

          <div className="home-hero__overlay" />

          <div className="home-hero__controls">
            <button
              type="button"
              className="home-hero__control-button"
              onClick={goToPreviousSlide}
              aria-label="Slide anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              className="home-hero__control-button"
              onClick={goToNextSlide}
              aria-label="Próximo slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="home-hero__content">
            <p className="home-hero__eyebrow">{currentSlide.eyebrow}</p>

            <h1 className="home-hero__title">D&apos;OUTRO LADO</h1>

            <h2 className="home-hero__headline">{currentSlide.title}</h2>

            <p className="home-hero__subtitle">{currentSlide.subtitle}</p>

            <p className="home-hero__description">{currentSlide.description}</p>

            <div className="home-hero__actions">
              <Link href={currentSlide.href} className="home-hero__primary-button">
                EXPLORAR
              </Link>

              <Link href="/search" className="home-hero__secondary-button">
                BUSCAR PRODUTOS
              </Link>
            </div>

            <div className="home-hero__dots" aria-label="Indicadores do slider">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`home-hero__dot ${index === activeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__intro">
          <p className="home-section__eyebrow">Categorias principais</p>
          <h2 className="home-section__title">Seleções com leitura premium</h2>
          <p className="home-section__text">
            Os sliders e blocos abaixo devem induzir o clique com elegância,
            levando o cliente diretamente para as categorias centrais do projeto.
          </p>
        </div>

        <div className="home-categories">
          {categoryCards.map((card) => (
            <Link key={card.id} href={card.href} className="home-category-card">
              <div
                className="home-category-card__image"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="home-category-card__overlay" />
              <div className="home-category-card__content">
                <p className="home-category-card__eyebrow">Explorar categoria</p>
                <h3 className="home-category-card__title">{card.title}</h3>
                <p className="home-category-card__description">{card.description}</p>
                <span className="home-category-card__cta">VER COLEÇÃO</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-brand-block card-premium">
          <div className="home-brand-block__left">
            <p className="home-section__eyebrow">Curadoria brasileira premium</p>
            <h2 className="home-brand-block__title">D&apos;OUTRO LADO</h2>
            <p className="home-brand-block__text">
              Produtos brasileiros sofisticados, apresentados com uma experiência
              elegante, internacional e responsiva. O objetivo é unir estética,
              desejo e clareza de navegação em uma vitrine refinada.
            </p>
          </div>

          <div className="home-brand-block__right">
            {featuredHighlights.map((item) => (
              <article key={item.title} className="home-highlight-card">
                <h3 className="home-highlight-card__title">{item.title}</h3>
                <p className="home-highlight-card__text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-hero {
          overflow: hidden;
          padding: 0;
        }

        .home-hero__media {
          position: relative;
          min-height: calc(100vh - 140px);
          border-radius: 28px;
          overflow: hidden;
        }

        .home-hero__image-layer {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.03);
          opacity: 0;
          transition:
            opacity 0.9s ease,
            transform 5.8s ease;
        }

        .home-hero__image-layer.is-active {
          opacity: 1;
          transform: scale(1);
        }

        .home-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(8, 8, 8, 0.12) 0%,
            rgba(8, 8, 8, 0.22) 30%,
            rgba(8, 8, 8, 0.42) 100%
          );
        }

        .home-hero__controls {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 3;
          display: flex;
          gap: 10px;
        }

        .home-hero__control-button {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .home-hero__control-button:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.42);
        }

        .home-hero__content {
          position: relative;
          z-index: 2;
          min-height: calc(100vh - 140px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 56px;
          color: white;
        }

        .home-hero__eyebrow {
          margin: 0;
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          opacity: 0.92;
        }

        .home-hero__title {
          margin: 18px 0 0;
          font-family:
            "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino,
            Georgia, serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 400;
          letter-spacing: 0.16em;
          line-height: 0.95;
        }

        .home-hero__headline {
          margin: 22px 0 0;
          max-width: 780px;
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          font-weight: 400;
          line-height: 1.18;
        }

        .home-hero__subtitle {
          margin: 16px 0 0;
          max-width: 680px;
          font-size: 1rem;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.9);
        }

        .home-hero__description {
          margin: 14px 0 0;
          max-width: 720px;
          font-size: 0.95rem;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.78);
        }

        .home-hero__actions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .home-hero__primary-button,
        .home-hero__secondary-button {
          min-width: 196px;
          padding: 14px 22px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-align: center;
          transition:
            transform 0.22s ease,
            opacity 0.22s ease,
            background 0.22s ease,
            border-color 0.22s ease;
        }

        .home-hero__primary-button {
          background: rgba(255, 255, 255, 0.95);
          color: #101010;
          border: 1px solid rgba(255, 255, 255, 0.95);
        }

        .home-hero__secondary-button {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(10px);
        }

        .home-hero__primary-button:hover,
        .home-hero__secondary-button:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .home-hero__dots {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .home-hero__dot {
          width: 42px;
          height: 4px;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.28);
          cursor: pointer;
          transition:
            background 0.22s ease,
            transform 0.22s ease;
        }

        .home-hero__dot.is-active {
          background: rgba(255, 255, 255, 0.92);
        }

        .home-section {
          padding-top: 34px;
        }

        .home-section__intro {
          max-width: 760px;
          margin-bottom: 24px;
        }

        .home-section__eyebrow {
          margin: 0;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #6b6b6b;
        }

        .home-section__title {
          margin: 14px 0 0;
          font-family:
            "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino,
            Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #181818;
        }

        .home-section__text {
          margin: 16px 0 0;
          font-size: 15px;
          line-height: 1.9;
          color: #5f5f5f;
        }

        .home-categories {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .home-category-card {
          position: relative;
          min-height: 520px;
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(23, 23, 23, 0.08);
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.04);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .home-category-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.07);
        }

        .home-category-card__image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          transition: transform 0.8s ease;
        }

        .home-category-card:hover .home-category-card__image {
          transform: scale(1.07);
        }

        .home-category-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 15, 15, 0.06) 0%,
            rgba(15, 15, 15, 0.2) 35%,
            rgba(15, 15, 15, 0.58) 100%
          );
        }

        .home-category-card__content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px;
          color: white;
        }

        .home-category-card__eyebrow {
          margin: 0;
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          opacity: 0.9;
        }

        .home-category-card__title {
          margin: 14px 0 0;
          font-size: 1.7rem;
          font-weight: 500;
          line-height: 1.2;
        }

        .home-category-card__description {
          margin: 12px 0 0;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.88);
          max-width: 520px;
        }

        .home-category-card__cta {
          display: inline-flex;
          margin-top: 22px;
          width: fit-content;
          padding-bottom: 4px;
          font-size: 12px;
          letter-spacing: 0.24em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.65);
        }

        .home-brand-block {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 24px;
          padding: 34px;
        }

        .home-brand-block__title {
          margin: 16px 0 0;
          font-family:
            "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino,
            Georgia, serif;
          font-size: clamp(2.2rem, 4vw, 4rem);
          font-weight: 400;
          letter-spacing: 0.12em;
          color: #171717;
        }

        .home-brand-block__text {
          margin: 20px 0 0;
          max-width: 620px;
          font-size: 15px;
          line-height: 1.95;
          color: #5f5f5f;
        }

        .home-brand-block__right {
          display: grid;
          gap: 14px;
        }

        .home-highlight-card {
          border: 1px solid rgba(23, 23, 23, 0.08);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.72);
          padding: 20px;
        }

        .home-highlight-card__title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #171717;
        }

        .home-highlight-card__text {
          margin: 10px 0 0;
          font-size: 14px;
          line-height: 1.8;
          color: #616161;
        }

        @media (max-width: 1024px) {
          .home-brand-block {
            grid-template-columns: 1fr;
          }

          .home-categories {
            grid-template-columns: 1fr;
          }

          .home-category-card {
            min-height: 460px;
          }
        }

        @media (max-width: 768px) {
          .home-hero__media,
          .home-hero__content {
            min-height: calc(100vh - 120px);
          }

          .home-hero__content {
            padding: 24px;
          }

          .home-hero__controls {
            top: 16px;
            right: 16px;
          }

          .home-hero__headline {
            font-size: 1.55rem;
          }

          .home-hero__subtitle,
          .home-hero__description {
            font-size: 14px;
            line-height: 1.8;
          }

          .home-hero__actions {
            flex-direction: column;
            align-items: stretch;
          }

          .home-hero__primary-button,
          .home-hero__secondary-button {
            width: 100%;
            min-width: 0;
          }

          .home-category-card {
            min-height: 400px;
          }

          .home-category-card__content {
            padding: 22px;
          }

          .home-brand-block {
            padding: 24px;
          }
        }
      `}</style>
    </main>
  );
}