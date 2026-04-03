"use client";

import { useState } from "react";
import { WEIGHT_RANGE_LABELS, type WeightRange } from "@/lib/shipping";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  tag: string;
  image: string;
  category: string;
  categorySlug: string;
  priceBRL: number;
  wholesalePriceBRL: number | "";
  wholesaleMinQty: number | "";
  stock: number;
  weightRange: WeightRange;
  featured: boolean;
  active: boolean;
};

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel?: string;
};

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  tag: "",
  image: "",
  category: "",
  categorySlug: "",
  priceBRL: 0,
  wholesalePriceBRL: "",
  wholesaleMinQty: "",
  stock: 0,
  weightRange: "1kg-3kg",
  featured: false,
  active: true,
};

export default function ProductForm({
  initialValues,
  onSubmit,
  submitLabel = "Salvar produto",
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
    weightRange: (initialValues?.weightRange as WeightRange) ?? "1kg-3kg",
    wholesalePriceBRL:
      typeof initialValues?.wholesalePriceBRL === "number"
        ? initialValues.wholesalePriceBRL
        : "",
    wholesaleMinQty:
      typeof initialValues?.wholesaleMinQty === "number"
        ? initialValues.wholesaleMinQty
        : "",
  });

  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        className="panel-input"
        placeholder="Nome"
        value={values.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <input
        className="panel-input"
        placeholder="Slug"
        value={values.slug}
        onChange={(e) => updateField("slug", e.target.value)}
      />

      <textarea
        className="panel-input"
        placeholder="Descrição"
        value={values.description}
        onChange={(e) => updateField("description", e.target.value)}
        rows={5}
      />

      <input
        className="panel-input"
        placeholder="Tag"
        value={values.tag}
        onChange={(e) => updateField("tag", e.target.value)}
      />

      <input
        className="panel-input"
        placeholder="URL da imagem"
        value={values.image}
        onChange={(e) => updateField("image", e.target.value)}
      />

      <input
        className="panel-input"
        placeholder="Categoria"
        value={values.category}
        onChange={(e) => updateField("category", e.target.value)}
      />

      <input
        className="panel-input"
        placeholder="Slug da categoria"
        value={values.categorySlug}
        onChange={(e) => updateField("categorySlug", e.target.value)}
      />

      <input
        className="panel-input"
        type="number"
        step="0.01"
        placeholder="Preço varejo em BRL"
        value={values.priceBRL}
        onChange={(e) => updateField("priceBRL", Number(e.target.value))}
      />

      <input
        className="panel-input"
        type="number"
        step="0.01"
        placeholder="Preço atacado em BRL"
        value={values.wholesalePriceBRL}
        onChange={(e) =>
          updateField(
            "wholesalePriceBRL",
            e.target.value === "" ? "" : Number(e.target.value)
          )
        }
      />

      <input
        className="panel-input"
        type="number"
        placeholder="Quantidade mínima para atacado"
        value={values.wholesaleMinQty}
        onChange={(e) =>
          updateField(
            "wholesaleMinQty",
            e.target.value === "" ? "" : Number(e.target.value)
          )
        }
      />

      <input
        className="panel-input"
        type="number"
        placeholder="Estoque"
        value={values.stock}
        onChange={(e) => updateField("stock", Number(e.target.value))}
      />

      <select
        className="panel-input"
        value={values.weightRange}
        onChange={(e) => updateField("weightRange", e.target.value as WeightRange)}
      >
        {Object.entries(WEIGHT_RANGE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => updateField("featured", e.target.checked)}
        />
        Produto em destaque
      </label>

      <label className="flex items-center gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => updateField("active", e.target.checked)}
        />
        Produto ativo
      </label>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}