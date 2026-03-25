const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "Business request failed");
  return payload.data as T;
}

export type BusinessAccountPayload = {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  userType: "wholesale" | "importer";
  region: string;
  taxId?: string;
  notes?: string;
};

export type BusinessAccount = {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  userType: "wholesale" | "importer";
  region: string;
  taxId?: string | null;
  minimumWholesaleUnits: number;
  wholesaleDiscountPercent: number;
  approvalStatus: "pending" | "approved" | "rejected";
  notes?: string | null;
};

export const businessApi = {
  apply(body: BusinessAccountPayload) {
    return request<{ id: number; approvalStatus: string; message: string }>("/business/apply", { method: "POST", body: JSON.stringify(body) });
  },
  login(email: string, password: string) {
    return request<BusinessAccount>("/business/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },
  listAccounts() {
    return request<BusinessAccount[]>("/business/accounts");
  },
  updateAccount(id: number, body: Partial<Pick<BusinessAccount, "approvalStatus" | "minimumWholesaleUnits" | "wholesaleDiscountPercent" | "notes">>) {
    return request<BusinessAccount>(`/business/accounts/${id}`, { method: "PUT", body: JSON.stringify(body) });
  }
};
