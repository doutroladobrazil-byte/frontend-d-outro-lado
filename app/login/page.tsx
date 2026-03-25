import { Navbar } from "@/components/Navbar";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function LoginPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section auth-section">
        <div className="auth-card">
          <span className="section-eyebrow">Área administrativa</span>
          <h1>Login real do administrador</h1>
          <p>Entre para gerenciar catálogo, pedidos e a operação premium da D&apos;OUTRO LADO.</p>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
