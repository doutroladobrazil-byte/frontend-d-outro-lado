import { Navbar } from "@/components/Navbar";
import { PricingCalculator } from "@/components/PricingCalculator";

export default function SimuladorPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Pricing engine</span>
            <h1>Simulador de preço exportação</h1>
          </div>
          <p>Base para custo + frete + imposto + margem + desconto atacadista.</p>
        </div>
        <PricingCalculator />
      </section>
    </main>
  );
}
