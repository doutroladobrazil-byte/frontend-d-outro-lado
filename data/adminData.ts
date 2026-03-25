export type AdminMetric = {
  label: string;
  value: string;
  delta: string;
  detail: string;
};

export type AdminOrder = {
  id: string;
  customer: string;
  region: string;
  status: "Pago" | "Em separação" | "Enviado" | "Aguardando";
  total: string;
  items: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  stock: number;
  baseBRL: string;
  exposure: string;
};

export type AdminActivity = {
  title: string;
  description: string;
  time: string;
};

export const adminMetrics: AdminMetric[] = [
  {
    label: "Receita estimada",
    value: "R$ 184.320",
    delta: "+18,4%",
    detail: "comparado aos últimos 30 dias"
  },
  {
    label: "Pedidos confirmados",
    value: "126",
    delta: "+12 pedidos",
    detail: "com ticket médio premium"
  },
  {
    label: "Conversão internacional",
    value: "3,8%",
    delta: "+0,7 pp",
    detail: "sessões com moeda local ativa"
  },
  {
    label: "Estoque crítico",
    value: "5 itens",
    delta: "atenção",
    detail: "produtos com baixa cobertura"
  }
];

export const adminOrders: AdminOrder[] = [
  {
    id: "DL-24031",
    customer: "Sophie Martin",
    region: "França · EUR",
    status: "Pago",
    total: "€ 428",
    items: 3
  },
  {
    id: "DL-24032",
    customer: "Luca Steiner",
    region: "Suíça · CHF",
    status: "Em separação",
    total: "CHF 612",
    items: 4
  },
  {
    id: "DL-24033",
    customer: "Emma Rossi",
    region: "Itália · EUR",
    status: "Enviado",
    total: "€ 295",
    items: 2
  },
  {
    id: "DL-24034",
    customer: "Noah Becker",
    region: "Alemanha · EUR",
    status: "Aguardando",
    total: "€ 188",
    items: 1
  }
];

export const adminProducts: AdminProduct[] = [
  {
    id: "SKU-101",
    name: "Bolsa de Crochê Preta",
    category: "Moda, Couro e Acessórios",
    stock: 18,
    baseBRL: "R$ 489",
    exposure: "Hero + categoria"
  },
  {
    id: "SKU-102",
    name: "Carteira de Couro Marrom",
    category: "Moda, Couro e Acessórios",
    stock: 32,
    baseBRL: "R$ 329",
    exposure: "Busca + destaques"
  },
  {
    id: "SKU-201",
    name: "Vaso Cerâmico Escultural",
    category: "Cerâmica, Decoração e Casa",
    stock: 9,
    baseBRL: "R$ 429",
    exposure: "Categoria"
  },
  {
    id: "SKU-202",
    name: "Travessa Cerâmica Natural",
    category: "Cerâmica, Decoração e Casa",
    stock: 11,
    baseBRL: "R$ 319",
    exposure: "Editorial"
  }
];

export const adminActivities: AdminActivity[] = [
  {
    title: "Moeda regional atualizada automaticamente",
    description: "Sessões da Alemanha, França e Itália já exibem EUR com precificação derivada do valor base em BRL.",
    time: "há 12 min"
  },
  {
    title: "Novo pedido com frete premium",
    description: "Pedido DL-24032 entrou com basket de couro e ticket acima da média projetada.",
    time: "há 28 min"
  },
  {
    title: "Produto com estoque crítico",
    description: "Vaso Cerâmico Escultural está abaixo do limite ideal para campanha internacional.",
    time: "há 1h"
  }
];

export const adminRegions = [
  {
    market: "Zona do Euro",
    currency: "EUR",
    taxMode: "Taxas e frete embutidos",
    shippingWindow: "6–10 dias"
  },
  {
    market: "Suíça",
    currency: "CHF",
    taxMode: "Margem premium ajustada",
    shippingWindow: "5–8 dias"
  },
  {
    market: "Reino Unido",
    currency: "GBP",
    taxMode: "Conversão regional ativa",
    shippingWindow: "6–9 dias"
  }
];
