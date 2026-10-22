export type ProductImage = { url: string; public_id?: string };

export type Category = {
  _id: string;
  name: string;
  description?: string;
  is_list?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  stock: number;
  description?: string;
  images?: ProductImage[];
  category?: Category | string;
  is_active?: boolean;
  homeSections?: HomeSection[];
};

export const HOME_SECTIONS = [
  { id: "hero", label: "Hero", hint: "Big spinning product at the top (up to 5)", limit: 5 },
  { id: "collection", label: "Collection", hint: "Lobuy Collection carousel (up to 8)", limit: 8 },
  { id: "spotlight", label: "Spotlight", hint: "Spotlight grid, first = product of the week (up to 3)", limit: 3 },
  { id: "deals", label: "Top deals", hint: "Top deals row (up to 10)", limit: 10 },
  { id: "new_arrivals", label: "New arrivals", hint: "New arrivals row (up to 10)", limit: 10 },
] as const;

export type HomeSection = (typeof HOME_SECTIONS)[number]["id"];

export type User = {
  _id: string;
  email: string;
  isAdmin?: boolean;
};
