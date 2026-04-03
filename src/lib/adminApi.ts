export type AdminSession = {
  id: string;
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
  active?: boolean;
  weightRange?: string;
  wholesalePriceBRL?: number | null;
  wholesaleMinQty?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  region: string;
  status: "pending" | "paid" | "preparing" | "shipped" | "cancelled";
  totalBRL: number;
  shippingBRL?: number;
  createdAt?: string | null;
  items: {
    id: string;
    productId: number | null;
    productName?: string | null;
    quantity: number;
    unitPriceBRL: number;
  }[];
};

export type ProductPayload = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  priceBRL: number;
  stock: number;
  image?: string;
  tag: string;
  description: string;
  featured: boolean;
  active?: boolean;
  weightRange?: string;
  wholesalePriceBRL?: number | null;
  wholesaleMinQty?: number | null;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
  message?: string;
  issues?: unknown;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        payload?.message ||
        "Erro ao processar a requisição administrativa."
    );
  }

  if (payload?.data === undefined) {
    throw new Error("Resposta administrativa inválida.");
  }

  return payload.data;
}

async function getAdminSession(): Promise<AdminSession> {
  const response = await fetch("/api/admin/users", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<any[]> | null;

  if (!response.ok) {
    throw new Error(payload?.error || "Sessão administrativa inválida.");
  }

  return {
    id: "supabase-admin",
    email: "admin@sessao.local",
    role: "admin",
    authenticated: true,
  };
}

export const adminApi = {
  login() {
    throw new Error(
      "O login administrativo agora usa a autenticação principal do Supabase na tela /login."
    );
  },

  getSession() {
    return getAdminSession();
  },

  async logout() {
    const mod = await import("@/lib/auth");
    await mod.signOutUser();
    return { success: true };
  },

  listProducts() {
    return request<AdminProduct[]>("/api/admin/products");
  },

  createProduct(body: ProductPayload, _uploadFile?: File | null) {
    return request<AdminProduct>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateProduct(id: number, body: Partial<ProductPayload>, _uploadFile?: File | null) {
    return request<AdminProduct>(`/api/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  deleteProduct(id: number) {
    return request<AdminProduct>(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  listOrders() {
    return request<AdminOrder[]>("/api/admin/orders");
  },

  updateOrder(id: string, status: AdminOrder["status"]) {
    return request<AdminOrder>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  deleteOrder(id: string) {
    return request<AdminOrder>(`/api/admin/orders/${id}`, {
      method: "DELETE",
    });
  },

  retryInvoice(id: string) {
    return request<AdminOrder>(`/api/admin/orders/${id}/invoice`, {
      method: "POST",
    });
  },
};