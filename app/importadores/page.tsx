import { Navbar } from "@/components/Navbar";
import { BusinessApplicationForm } from "@/components/BusinessApplicationForm";

export default function ImportersPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section">
        <BusinessApplicationForm
          userType="importer"
          title="Cadastro de importadores"
          description="Canal dedicado para compradores internacionais com análise documental, condição comercial diferenciada e preparação para volume recorrente."
        />
      </section>
    </main>
  );
}
