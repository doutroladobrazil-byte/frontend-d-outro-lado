
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllCategories, getCategoryBySlug } from "@/data/categoryData";
import { getStoreProductsServer } from "@/lib/storeServer";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const response = await getStoreProductsServer("Europe", { categorySlug: slug });

  return (
    <main className="page-shell">
      <Navbar />
      <section className="category-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.72)), url(${category.heroImage})` }}>
        <div className="category-hero-copy">
          <span className="section-eyebrow">{category.eyebrow}</span>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>
      </section>
      <section className="content-section">
        <ProductGrid products={response.products} />
      </section>
    </main>
  );
}
