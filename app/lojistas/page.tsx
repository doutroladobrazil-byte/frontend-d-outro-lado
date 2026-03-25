import { Navbar } from "@/components/Navbar";
import { BusinessApplicationForm } from "@/components/BusinessApplicationForm";

export default function WholesalePage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section">
        <BusinessApplicationForm
          userType="wholesale"
          title="Cadastro de lojistas"
          description="Acesso a preço de atacado, mínimo comercial, análise de perfil e aprovação administrativa antes da liberação dos valores especiais."
        />
      </section>
    </main>
  );
}
