export type Product = {
  id: string;
  name: string;
  slug: string;
  priceBRL: number;
  image: string;
  tag: string;
  description: string;
  categorySlug: string;
};

export type Category = {
  title: string;
  slug: string;
  eyebrow: string;
  description: string;
  heroImage: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    title: "Moda, Couro e Acessórios",
    slug: "moda-estilo-e-acessorios",
    eyebrow: "Curadoria premium",
    description:
      "Bolsas de crochê, bolsas de couro, coturnos femininos, sapatos sociais, óculos de sol, carteiras e nécessaires em uma seleção neutra, elegante e sem marcas aparentes.",
    heroImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    products: [
      {
        id: "p1",
        name: "Bolsa de Crochê Preta",
        slug: "bolsa-de-croche-preta",
        priceBRL: 489,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
        tag: "Crochê",
        description: "Peça artesanal com estética minimalista e estrutura leve.",
        categorySlug: "moda-estilo-e-acessorios"
      },
      {
        id: "p2",
        name: "Carteira de Couro Marrom",
        slug: "carteira-de-couro-marrom",
        priceBRL: 329,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
        tag: "Couro",
        description: "Carteira compacta com acabamento sofisticado e couro de toque macio.",
        categorySlug: "moda-estilo-e-acessorios"
      },
      {
        id: "p3",
        name: "Sapato Social Preto",
        slug: "sapato-social-preto",
        priceBRL: 749,
        image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80",
        tag: "Sapatos",
        description: "Silhueta limpa, elegante e versátil para composição premium.",
        categorySlug: "moda-estilo-e-acessorios"
      }
    ]
  },
  {
    title: "Cerâmica, Decoração e Casa",
    slug: "ceramica-decoracao-e-casa",
    eyebrow: "Casa minimalista",
    description:
      "Peças de decoração em cerâmica, pratos, xícaras, travessas e itens de enxoval com visual moderno, natural e refinado.",
    heroImage:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
    products: [
      {
        id: "p4",
        name: "Vaso Cerâmico Escultural",
        slug: "vaso-ceramico-escultural",
        priceBRL: 429,
        image: "https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=1200&q=80",
        tag: "Cerâmica",
        description: "Peça decorativa com forma orgânica e presença sofisticada.",
        categorySlug: "ceramica-decoracao-e-casa"
      },
      {
        id: "p5",
        name: "Conjunto de Xícaras Off-White",
        slug: "conjunto-de-xicaras-off-white",
        priceBRL: 279,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
        tag: "Mesa",
        description: "Conjunto atemporal para uma mesa contemporânea e acolhedora.",
        categorySlug: "ceramica-decoracao-e-casa"
      },
      {
        id: "p6",
        name: "Travessa Cerâmica Natural",
        slug: "travessa-ceramica-natural",
        priceBRL: 319,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        tag: "Decoração",
        description: "Travessa versátil de estética minimalista para servir e decorar.",
        categorySlug: "ceramica-decoracao-e-casa"
      }
    ]
  }
];

export function getAllCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getAllProducts() {
  return categories.flatMap((category) => category.products);
}

export function getProductBySlug(slug: string) {
  return getAllProducts().find((product) => product.slug === slug);
}
