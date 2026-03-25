import { ArrowUpRight, ShieldCheck, Smartphone, Store } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductGrid } from "@/components/ProductGrid";
import { PricingPreview } from "@/components/PricingPreview";
import { TradeAccessPanels } from "@/components/TradeAccessPanels";
import { getAllCategories } from "@/data/categoryData";
import { getStoreProductsServer } from "@/lib/storeServer";

const pillars = [
  {
    icon: Store,
    title: "Compra simples e premium",
    text: "Fluxo direto para cliente final, com seleção editorial, bag inteligente e checkout preparado para ativação do Stripe online."
  },
  {
    icon: ShieldCheck,
    title: "Base operacional forte",
    text: "Painel admin, aprovação manual de contas B2B, pricing automático e backend pronto para webhook, estoque e rotinas de produção."
  },
  {
    icon: Smartphone,
    title: "Responsivo de verdade",
    text: "Interface desenhada para Android, iPhone, Windows, notebooks e desktops sem ficar desproporcional em telas menores."
  }
];

export default async function Home() {
  const categories = getAllCategories();
  const featuredResponse = await getStoreProductsServer("Europe", { featured: true });

  return (
    <main className="page-shell">
      <Navbar />

      <section className="intro-section">
        <div>
          <span className="section-eyebrow">Brasil sofisticado para o mundo</span>
          <h1>D&apos;OUTRO LADO entra na V9 com base premium, operação enxuta e estrutura pronta para produção.</h1>
        </div>
        <p>
          O varejo continua simples para o cliente, mas o projeto agora organiza melhor a camada comercial: catálogo internacional,
          experiência B2B, cálculo inteligente de preço e preparação real para deploy, Stripe e rotina operacional.
        </p>
      </section>

      <HeroSlider categories={categories} />

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Featured selection</span>
            <h2>Curadoria visual forte, linguagem internacional e uma base comercial pensada para vender com clareza.</h2>
          </div>
          <Link href="/checkout" className="section-link">Ir para checkout <ArrowUpRight size={16} /></Link>
        </div>
        <ProductGrid products={featuredResponse.products} />
      </section>

      <section className="content-section">
        <div className="pillars-grid">
          {pillars.map(({ icon: Icon, title, text }) => (
            <article key={title} className="pillar-card">
              <span className="pillar-icon"><Icon size={18} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <PricingPreview />
      <TradeAccessPanels />

      <section className="content-section highlight-band">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Operational backbone</span>
            <h2>Versão 9 focada em responsividade real, preparo para deploy e integração de pagamento no momento certo.</h2>
          </div>
          <p>
            O projeto mantém o visual premium, mas agora deixa mais explícito o que já está operacional e o que será ativado no ambiente online.
          </p>
        </div>
      </section>
    </main>
  );
}
