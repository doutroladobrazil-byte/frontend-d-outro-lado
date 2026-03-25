import { Navbar } from "@/components/Navbar";
import { BusinessApplicationForm } from "@/components/BusinessApplicationForm";

export default function AtacadoPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section narrow-page">
        <BusinessApplicationForm
          userType="wholesale"
          title="Solicitação de acesso para lojistas"
          description="Canal separado para compras por volume, com análise administrativa, desconto controlado e regra mínima de unidades."
        />
      </section>
    </main>
  );
}
