"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/categoryData";

export function HeroSlider({ categories }: { categories: Category[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <section className="hero-slider-section">
      {categories.map((category, index) => (
        <Link
          href={`/produtos/${category.slug}`}
          key={category.slug}
          className={`hero-slide ${index === activeIndex ? "active" : "inactive"}`}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.72)), url(${category.heroImage})` }}
        >
          <div className="hero-slide-content">
            <span className="hero-eyebrow">{category.eyebrow}</span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
            <span className="explore-link">
              Explorar <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      ))}

      <div className="hero-dots">
        {categories.map((category, index) => (
          <button
            key={category.slug}
            className={`hero-dot ${index === activeIndex ? "active" : ""}`}
            aria-label={`Ir para ${category.title}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
