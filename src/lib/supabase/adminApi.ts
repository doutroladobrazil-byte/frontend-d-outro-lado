export type AdminSession = {
  id: number;
  email: string;
  role: "admin";
  authenticated: boolean;
};

export type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  priceBRL: number;
  stock: number;
  image: string;
  tag: string;
  description: string;
  categorySlug: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  region: string;
  status: "pending" | "paid" | "preparing" | "shipped" | "cancelled";
  totalBRL: number;
  createdAt: string;
  items: { id: number; productId: number | null; productName?: string; quantity: number; unitPriceBRL: number }[];
};

export type ProductPayload = {
  name: string;
  slug: string;
  category: string;
  priceBRL: number;
  stock: number;
  image?: string;
  tag: string;
  description: string;
  categorySlug: string;
  featured: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Erro ao processar a requisição");
  }

  return payload.data as T;
}

function toFormData(body: ProductPayload, imageFile?: File | null) {
  const form = new FormData();
  form.append("name", body.name);
  form.append("slug", body.slug);
  form.append("category", body.category);
  form.append("categorySlug", body.categorySlug);
  form.append("priceBRL", String(body.priceBRL));
  form.append("stock", String(body.stock));
  if (body.image) form.append("image", body.image);
  form.append("tag", body.tag);
  form.append("description", body.description);
  form.append("featured", String(body.featured));
  if (imageFile) form.append("imageFile", imageFile);
  return form;
}

export const adminApi = {
  login(email: string, password: string) {
    return request<AdminSession>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },
  getSession() {
    return request<AdminSession>("/auth/session", { method: "GET" });
  },
  logout() {
    return request<{ success: boolean }>("/auth/logout", { method: "POST" });
  },
  listProducts() {
    return request<AdminProduct[]>("/products");
  },
  createProduct(body: ProductPayload, imageFile?: File | null) {
    return request<AdminProduct>("/products", { method: "POST", body: toFormData(body, imageFile) });
  },
  updateProduct(id: number, body: Partial<ProductPayload>, imageFile?: File | null) {
    const merged: ProductPayload = {
      name: body.name ?? "",
      slug: body.slug ?? "",
      category: body.category ?? "",
      categorySlug: body.categorySlug ?? "",
      priceBRL: body.priceBRL ?? 0,
      stock: body.stock ?? 0,
      image: body.image,
      tag: body.tag ?? "",
      description: body.description ?? "",
      featured: body.featured ?? false
    };
    return request<AdminProduct>(`/products/${id}`, { method: "PUT", body: toFormData(merged, imageFile) });
  },
  deleteProduct(id: number) {
    return request<AdminProduct>(`/products/${id}`, { method: "DELETE" });
  },
  listOrders() {
    return request<AdminOrder[]>("/orders", { method: "GET" });
  },
  updateOrder(id: string, status: AdminOrder["status"]) {
    return request<AdminOrder>(`/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
  },
  deleteOrder(id: string) {
    return request<AdminOrder>(`/orders/${id}`, { method: "DELETE" });
  }
};
