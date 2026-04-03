"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, ImagePlus, LogOut, Package, Save, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { adminApi, type AdminOrder, type AdminProduct, type AdminSession, type ProductPayload } from "@/lib/adminApi";

const emptyProductForm: ProductPayload = {
  name: "",
  slug: "",
  category: "Moda, Couro e Acessórios",
  priceBRL: 0,
  stock: 0,
  image: "",
  tag: "Premium",
  description: "",
  categorySlug: "moda-estilo-e-acessorios",
  featured: false
};

export function AdminDashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [form, setForm] = useState<ProductPayload>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [currentSession, currentProducts, currentOrders] = await Promise.all([
          adminApi.getSession(),
          adminApi.listProducts(),
          adminApi.listOrders()
        ]);

        setSession(currentSession);
        setProducts(currentProducts);
        setOrders(currentOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar painel");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.totalBRL, 0);
    const pending = orders.filter((order) => order.status === "pending").length;
    const stock = products.reduce((sum, product) => sum + product.stock, 0);

    return [
      { label: "Produtos ativos", value: String(products.length), support: "Persistidos em SQLite" },
      { label: "Pedidos", value: String(orders.length), support: `${pending} aguardando ação` },
      { label: "Estoque total", value: String(stock), support: "Soma de todos os SKUs" },
      { label: "Receita BRL", value: `R$ ${revenue.toFixed(2)}`, support: "Base administrativa" }
    ];
  }, [orders, products]);

  function resetForm() {
    setForm(emptyProductForm);
    setEditingProductId(null);
    setUploadFile(null);
  }

  async function handleLogout() {
    try {
      await adminApi.logout();
    } finally {
      router.push("/login");
    }
  }

  async function handleSaveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingProductId) {
        const updated = await adminApi.updateProduct(editingProductId, form, uploadFile);
        setProducts((current) => current.map((product) => product.id === updated.id ? updated : product));
      } else {
        const created = await adminApi.createProduct(form, uploadFile);
        setProducts((current) => [created, ...current]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o produto");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      await adminApi.deleteProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      if (editingProductId === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir o produto");
    }
  }

  async function handleOrderStatus(id: string, status: AdminOrder["status"]) {
    try {
      const updated = await adminApi.updateOrder(id, status);
      setOrders((current) => current.map((order) => order.id === id ? updated : order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o pedido");
    }
  }

  async function handleDeleteOrder(id: string) {
    try {
      await adminApi.deleteOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir o pedido");
    }
  }

  if (loading) {
    return <main className="page-shell"><Navbar /><section className="content-section"><div className="admin-loading-card">Carregando painel administrativo...</div></section></main>;
  }

  return (
    <main className="page-shell admin-page-shell">
      <Navbar />
      <section className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <section className="admin-hero-card">
            <div>
              <span className="section-eyebrow">Versão 4</span>
              <h2>Banco real, upload de imagens e autenticação persistente.</h2>
              <p>Sessão ativa: {session?.email}. Agora o painel usa SQLite, cookies HTTP-only e upload de imagens do catálogo.</p>
            </div>
            <div className="admin-hero-actions">
              <button className="secondary-button admin-inline-button" onClick={handleLogout}><LogOut size={16} /> Sair</button>
            </div>
          </section>

          {error ? <div className="admin-alert">{error}</div> : null}

          <section className="admin-metrics-grid">
            {metrics.map((metric) => <AdminMetricCard key={metric.label} metric={metric} />)}
          </section>

          <section className="admin-grid-two" id="catalogo">
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="section-eyebrow">Cadastro de produto</span>
                  <h3>{editingProductId ? "Editar produto" : "Novo produto"}</h3>
                </div>
                <Package size={18} />
              </div>

              <form className="admin-form" onSubmit={handleSaveProduct}>
                <input className="input-field admin-input" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input-field admin-input" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <input className="input-field admin-input" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className="input-field admin-input" placeholder="Slug da categoria" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} />
                <input className="input-field admin-input" placeholder="Imagem URL (opcional)" value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <label className="admin-upload-field">
                  <span><ImagePlus size={16} /> Upload de imagem</span>
                  <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
                  <small>{uploadFile ? uploadFile.name : "Nenhum arquivo selecionado"}</small>
                </label>
                <input className="input-field admin-input" placeholder="Tag" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
                <input className="input-field admin-input" type="number" placeholder="Preço BRL" value={form.priceBRL} onChange={(e) => setForm({ ...form, priceBRL: Number(e.target.value) })} />
                <input className="input-field admin-input" type="number" placeholder="Estoque" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                <textarea className="input-field admin-input admin-textarea" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Destacar na vitrine</label>
                <div className="admin-form-actions">
                  <button className="primary-button" type="submit" disabled={saving}><Save size={16} /> {saving ? "Salvando..." : editingProductId ? "Atualizar produto" : "Criar produto"}</button>
                  <button className="secondary-button" type="button" onClick={resetForm}>Limpar</button>
                </div>
              </form>
            </article>

            <article className="admin-panel admin-table-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="section-eyebrow">Produtos</span>
                  <h3>CRUD do catálogo</h3>
                </div>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>R$ {product.priceBRL.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button className="icon-button" onClick={() => { setEditingProductId(product.id); setForm({
                              name: product.name,
                              slug: product.slug,
                              category: product.category,
                              categorySlug: product.categorySlug,
                              priceBRL: product.priceBRL,
                              stock: product.stock,
                              image: product.image,
                              tag: product.tag,
                              description: product.description,
                              featured: product.featured
                            }); setUploadFile(null); }} aria-label="Editar produto"><Edit3 size={16} /></button>
                            <button className="icon-button" onClick={() => handleDeleteProduct(product.id)} aria-label="Excluir produto"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section className="admin-panel admin-table-panel" id="pedidos">
            <div className="admin-panel-head">
              <div>
                <span className="section-eyebrow">Pedidos</span>
                <h3>Atualização de status e exclusão</h3>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Pedido</th><th>Cliente</th><th>Região</th><th>Total</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.region}</td>
                      <td>R$ {order.totalBRL.toFixed(2)}</td>
                      <td>
                        <select className="admin-select" value={order.status} onChange={(e) => handleOrderStatus(order.id, e.target.value as AdminOrder["status"])}>
                          <option value="pending">pending</option>
                          <option value="paid">paid</option>
                          <option value="preparing">preparing</option>
                          <option value="shipped">shipped</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="icon-button" onClick={() => handleDeleteOrder(order.id)} aria-label="Excluir pedido"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
