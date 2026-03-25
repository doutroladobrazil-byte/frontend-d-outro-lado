import { Navbar } from "@/components/Navbar";
import { BusinessApplicationForm } from "@/components/BusinessApplicationForm";

export default function ImportadorPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section narrow-page">
        <BusinessApplicationForm
          userType="importer"
          title="Canal dedicado para importadores cadastrados"
          description="Fluxo comercial orientado por mercado, cadastro fiscal, negociação por volume e aprovação manual antes de liberar condições especiais."
        />
      </section>
    </main>
  );
}
