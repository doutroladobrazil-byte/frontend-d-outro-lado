export type InvoiceIssueInput = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerDocument?: string | null;
  totalBRL: number;
  shippingBRL: number;
  region: string;
  items: Array<{
    productName?: string | null;
    quantity: number;
    unitPriceBRL: number;
  }>;
};

export type InvoiceResult = {
  provider: "enotas" | "internal_pending";
  status: "not_configured" | "queued" | "issued" | "error";
  invoiceId: string | null;
  invoiceNumber: string | null;
  pdfUrl: string | null;
  xmlUrl: string | null;
  message: string | null;
  raw?: unknown;
};

function isENotasConfigured() {
  return Boolean(process.env.ENOTAS_API_KEY && process.env.ENOTAS_COMPANY_ID);
}

function getENotasBaseUrl() {
  return process.env.ENOTAS_BASE_URL || "https://api.enotasgw.com.br/v1";
}

function sanitizeDocument(value?: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits || null;
}

export async function issueInvoiceForPaidOrder(input: InvoiceIssueInput): Promise<InvoiceResult> {
  if (!isENotasConfigured()) {
    return {
      provider: "internal_pending",
      status: "not_configured",
      invoiceId: null,
      invoiceNumber: null,
      pdfUrl: null,
      xmlUrl: null,
      message: "Integração fiscal ainda não configurada no ambiente.",
    };
  }

  const apiKey = process.env.ENOTAS_API_KEY!;
  const companyId = process.env.ENOTAS_COMPANY_ID!;
  const cpfCnpj = sanitizeDocument(input.customerDocument);

  const payload = {
    idExterno: input.orderId,
    ambienteEmissao: process.env.ENOTAS_ENVIRONMENT === "production" ? "Producao" : "Homologacao",
    cliente: {
      nome: input.customerName,
      email: input.customerEmail,
      cpfCnpj,
    },
    valorTotal: Number(input.totalBRL.toFixed(2)),
    observacoes: `Pedido ${input.orderId} - frete ${input.shippingBRL.toFixed(2)} BRL - região ${input.region}`,
    itens: input.items.map((item) => ({
      descricao: item.productName || "Produto D'OUTRO LADO",
      quantidade: Number(item.quantity),
      valorUnitario: Number(item.unitPriceBRL.toFixed(2)),
    })),
  };

  try {
    const response = await fetch(`${getENotasBaseUrl()}/empresas/${companyId}/nfes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        provider: "enotas",
        status: "error",
        invoiceId: null,
        invoiceNumber: null,
        pdfUrl: null,
        xmlUrl: null,
        message: data?.message || data?.mensagem || "Falha ao enviar nota para eNotas.",
        raw: data,
      };
    }

    return {
      provider: "enotas",
      status: "queued",
      invoiceId: data?.id ?? data?.nfeId ?? null,
      invoiceNumber: data?.numero ?? null,
      pdfUrl: data?.urlPdf ?? null,
      xmlUrl: data?.urlXml ?? null,
      message: data?.mensagem ?? "Nota enviada para processamento fiscal.",
      raw: data,
    };
  } catch (error: any) {
    return {
      provider: "enotas",
      status: "error",
      invoiceId: null,
      invoiceNumber: null,
      pdfUrl: null,
      xmlUrl: null,
      message: error?.message ?? "Falha inesperada ao emitir nota fiscal.",
    };
  }
}
