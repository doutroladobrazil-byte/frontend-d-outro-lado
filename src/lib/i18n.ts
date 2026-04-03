export type Locale = "pt" | "en" | "fr" | "de" | "it" | "es";

export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES"
};

export const messages = {
  pt: {
    homeEyebrow: "Brasil sofisticado para o mundo",
    homeTitle: "Curadoria premium de produtos brasileiros com linguagem internacional.",
    homeText: "Compra simples, navegação elegante, categorias editoriais e experiência pensada para mercados de alto poder aquisitivo.",
    featured: "Seleção em destaque",
    bag: "Bag",
    checkout: "Finalizar compra",
    summary: "Resumo",
    emptyBag: "Sua bag está vazia.",
    orderConfirmed: "Pedido confirmado",
    continueShopping: "Continuar comprando"
  },
  en: {
    homeEyebrow: "Refined Brazil for the world",
    homeTitle: "Premium curation of Brazilian products with an international language.",
    homeText: "Simple buying flow, elegant navigation, editorial categories and a premium experience designed for high-value markets.",
    featured: "Featured selection",
    bag: "Bag",
    checkout: "Checkout",
    summary: "Summary",
    emptyBag: "Your bag is empty.",
    orderConfirmed: "Order confirmed",
    continueShopping: "Continue shopping"
  },
  fr: {
    homeEyebrow: "Le Brésil raffiné pour le monde",
    homeTitle: "Une sélection premium de produits brésiliens avec une expression internationale.",
    homeText: "Parcours d'achat fluide, navigation élégante et catégories éditoriales pensées pour des marchés exigeants.",
    featured: "Sélection en vedette",
    bag: "Sac",
    checkout: "Paiement",
    summary: "Résumé",
    emptyBag: "Votre sac est vide.",
    orderConfirmed: "Commande confirmée",
    continueShopping: "Continuer"
  },
  de: {
    homeEyebrow: "Elegantes Brasilien für die Welt",
    homeTitle: "Premium-Kuration brasilianischer Produkte mit internationaler Handschrift.",
    homeText: "Einfacher Kaufprozess, elegante Navigation und editoriale Kategorien für anspruchsvolle Märkte.",
    featured: "Ausgewählte Produkte",
    bag: "Bag",
    checkout: "Checkout",
    summary: "Zusammenfassung",
    emptyBag: "Ihre Bag ist leer.",
    orderConfirmed: "Bestellung bestätigt",
    continueShopping: "Weiter einkaufen"
  },
  it: {
    homeEyebrow: "Brasile raffinato per il mondo",
    homeTitle: "Curatela premium di prodotti brasiliani con linguaggio internazionale.",
    homeText: "Acquisto semplice, navigazione elegante e categorie editoriali per mercati ad alto valore.",
    featured: "Selezione in evidenza",
    bag: "Bag",
    checkout: "Checkout",
    summary: "Riepilogo",
    emptyBag: "La tua bag è vuota.",
    orderConfirmed: "Ordine confermato",
    continueShopping: "Continua"
  },
  es: {
    homeEyebrow: "Brasil sofisticado para el mundo",
    homeTitle: "Curaduría premium de productos brasileños con lenguaje internacional.",
    homeText: "Compra simple, navegación elegante y categorías editoriales pensadas para mercados exigentes.",
    featured: "Selección destacada",
    bag: "Bag",
    checkout: "Checkout",
    summary: "Resumen",
    emptyBag: "Tu bag está vacía.",
    orderConfirmed: "Pedido confirmado",
    continueShopping: "Seguir comprando"
  }
} as const;

export function getMessage(locale: Locale) {
  return messages[locale] ?? messages.en;
}
