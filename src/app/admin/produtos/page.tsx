"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccessGate from "@/components/auth/AccessGate";

type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  priceBRL: number;
  wholesalePriceBRL?: number | null;
  wholesaleMinQty?: number | null;
  stock: number;
  weightRange: string;
  image: string;
  tag: string;
  description: string;
  featured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type ProductFormState = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  priceBRL: string;
  wholesalePriceBRL: string;
  wholesaleMinQty: string;
  stock: string;
  weightRange: string;
  image: string;
  tag: string;
  description: string;
  featured: boolean;
  active: boolean;
};

const API_BASE = "/api/admin/products";

const EMPTY_FORM: ProductFormState = {
  name: "",
  slug: "",
  category: "",
  categorySlug: "",
  priceBRL: "",
  wholesalePriceBRL: "",
  wholesaleMinQty: "",
  stock: "",
  weightRange: "1kg-3kg",
  image: "",
  tag: "",
  description: "",
  featured: false,
  active: true,
};

const WEIGHT_OPTIONS = [
  "100g-1kg",
  "1kg-3kg",
  "3kg-5kg",
  "5kg-10kg",
  "10kg-15kg",
  "15kg-20kg",
];

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function AdminProductsContent() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Falha ao comunicar com a API.");
    }

    return (data?.data ?? data) as T;
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await requestJson<AdminProduct[]>(API_BASE);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const summary = useMemo(() => {
    return {
      total: products.length,
      active: products.filter((item) => item.active).length,
      featured: products.filter((item) => item.featured).length,
      lowStock: products.filter((item) => item.stock <= 3).length,
    };
  }, [products]);

  function updateField<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function fillFormFromProduct(product: AdminProduct) {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      categorySlug: product.categorySlug,
      priceBRL: String(product.priceBRL),
      wholesalePriceBRL:
        typeof product.wholesalePriceBRL === "number"
          ? String(product.wholesalePriceBRL)
          : "",
      wholesaleMinQty:
        typeof product.wholesaleMinQty === "number"
          ? String(product.wholesaleMinQty)
          : "",
      stock: String(product.stock),
      weightRange: product.weightRange,
      image: product.image,
      tag: product.tag,
      description: product.description,
      featured: product.featured,
      active: product.active,
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingProductId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        categorySlug: form.categorySlug,
        priceBRL: Number(form.priceBRL),
        wholesalePriceBRL:
          form.wholesalePriceBRL.trim() === ""
            ? null
            : Number(form.wholesalePriceBRL),
        wholesaleMinQty:
          form.wholesaleMinQty.trim() === ""
            ? null
            : Number(form.wholesaleMinQty),
        stock: Number(form.stock),
        weightRange: form.weightRange,
        image: form.image,
        tag: form.tag,
        description: form.description,
        featured: form.featured,
        active: form.active,
      };

      if (editingProductId) {
        await requestJson(`${API_BASE}/${editingProductId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setMessage("Produto atualizado com sucesso.");
      } else {
        await requestJson(API_BASE, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Produto criado com sucesso.");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o produto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      await requestJson(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (editingProductId === id) {
        resetForm();
      }

      setMessage("Produto removido com sucesso.");
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover o produto.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div className="summary-card">
            <span className="section-eyebrow">Administração</span>
            <h1 style={{ marginTop: 10 }}>Gestão de produtos</h1>
            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              Esta área concentra a operação do catálogo: criação, edição,
              preço, estoque, atacado, faixa de peso e visibilidade.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div className="summary-card">
              <strong>Total</strong>
              <div style={{ marginTop: 8 }}>{summary.total}</div>
            </div>
            <div className="summary-card">
              <strong>Ativos</strong>
              <div style={{ marginTop: 8 }}>{summary.active}</div>
            </div>
            <div className="summary-card">
              <strong>Destaques</strong>
              <div style={{ marginTop: 8 }}>{summary.featured}</div>
            </div>
            <div className="summary-card">
              <strong>Baixo estoque</strong>
              <div style={{ marginTop: 8 }}>{summary.lowStock}</div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(360px, 0.95fr) minmax(0, 1.35fr)",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div className="summary-card">
              <h2>{editingProductId ? "Editar produto" : "Novo produto"}</h2>

              <form onSubmit={handleSubmit} className="grid gap-4" style={{ marginTop: 18 }}>
                <input
                  className="panel-input"
                  placeholder="Nome"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="Categoria"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="Slug da categoria"
                  value={form.categorySlug}
                  onChange={(e) => updateField("categorySlug", e.target.value)}
                />

                <input
                  className="panel-input"
                  type="number"
                  step="0.01"
                  placeholder="Preço varejo em BRL"
                  value={form.priceBRL}
                  onChange={(e) => updateField("priceBRL", e.target.value)}
                />

                <input
                  className="panel-input"
                  type="number"
                  step="0.01"
                  placeholder="Preço atacado em BRL"
                  value={form.wholesalePriceBRL}
                  onChange={(e) => updateField("wholesalePriceBRL", e.target.value)}
                />

                <input
                  className="panel-input"
                  type="number"
                  placeholder="Quantidade mínima atacado"
                  value={form.wholesaleMinQty}
                  onChange={(e) => updateField("wholesaleMinQty", e.target.value)}
                />

                <input
                  className="panel-input"
                  type="number"
                  placeholder="Estoque"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                />

                <select
                  className="panel-input"
                  value={form.weightRange}
                  onChange={(e) => updateField("weightRange", e.target.value)}
                >
                  {WEIGHT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <input
                  className="panel-input"
                  placeholder="URL da imagem"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="Tag"
                  value={form.tag}
                  onChange={(e) => updateField("tag", e.target.value)}
                />

                <textarea
                  className="panel-input"
                  placeholder="Descrição"
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />

                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => updateField("featured", e.target.checked)}
                  />
                  Produto em destaque
                </label>

                <label
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => updateField("active", e.target.checked)}
                  />
                  Produto ativo
                </label>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="submit" className="primary-button" disabled={saving}>
                    {saving
                      ? "Salvando..."
                      : editingProductId
                        ? "Atualizar produto"
                        : "Criar produto"}
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetForm}
                  >
                    Limpar formulário
                  </button>
                </div>
              </form>

              {message ? (
                <div
                  style={{
                    marginTop: 16,
                    border: "1px solid rgba(189,157,106,0.28)",
                    background: "rgba(189,157,106,0.08)",
                    color: "rgba(255,245,228,0.88)",
                    padding: 14,
                    borderRadius: 16,
                  }}
                >
                  {message}
                </div>
              ) : null}

              {error ? (
                <div
                  style={{
                    marginTop: 16,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.9)",
                    padding: 14,
                    borderRadius: 16,
                  }}
                >
                  {error}
                </div>
              ) : null}
            </div>

            <div className="summary-card">
              <h2>Catálogo cadastrado</h2>

              {loading ? (
                <div style={{ marginTop: 18 }}>Carregando produtos...</div>
              ) : (
                <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
                  {products.map((product) => (
                    <article
                      key={product.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "100px 1fr",
                        gap: 16,
                        padding: 14,
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        <div>
                          <strong style={{ fontSize: 20 }}>{product.name}</strong>
                          <div
                            style={{
                              marginTop: 6,
                              color: "rgba(255,255,255,0.68)",
                              fontSize: 14,
                            }}
                          >
                            {product.category} · {product.slug}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                            color: "rgba(255,255,255,0.82)",
                            fontSize: 14,
                          }}
                        >
                          <span>Varejo: {formatBRL(product.priceBRL)}</span>
                          <span>
                            Atacado:{" "}
                            {typeof product.wholesalePriceBRL === "number"
                              ? formatBRL(product.wholesalePriceBRL)
                              : "—"}
                          </span>
                          <span>Min: {product.wholesaleMinQty ?? "—"}</span>
                          <span>Estoque: {product.stock}</span>
                          <span>Peso: {product.weightRange}</span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            color: "rgba(255,255,255,0.68)",
                            fontSize: 13,
                          }}
                        >
                          <span>{product.active ? "Ativo" : "Inativo"}</span>
                          <span>{product.featured ? "Destaque" : "Comum"}</span>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "6px 10px",
                              border:
                                product.stock === 0
                                  ? "1px solid rgba(248,113,113,0.22)"
                                  : product.stock <= 3
                                    ? "1px solid rgba(250,204,21,0.22)"
                                    : "1px solid rgba(34,197,94,0.22)",
                              background:
                                product.stock === 0
                                  ? "rgba(248,113,113,0.10)"
                                  : product.stock <= 3
                                    ? "rgba(250,204,21,0.10)"
                                    : "rgba(34,197,94,0.10)",
                              color:
                                product.stock === 0
                                  ? "#fecaca"
                                  : product.stock <= 3
                                    ? "#fde68a"
                                    : "#bbf7d0",
                            }}
                          >
                            {product.stock === 0
                              ? "Sem estoque"
                              : product.stock <= 3
                                ? "Estoque baixo"
                                : "Estoque OK"}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="primary-button"
                            onClick={() => fillFormFromProduct(product)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? "Removendo..." : "Remover"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <Link href="/admin" className="secondary-button button-link">
                  Voltar ao painel
                </Link>

                <Link href="/" className="secondary-button button-link">
                  Ver home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminProductsPage() {
  return (
    <AccessGate requireAuth requireAdmin>
      <AdminProductsContent />
    </AccessGate>
  );
}