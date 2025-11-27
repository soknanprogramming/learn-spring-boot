export type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    description: string;
}

export type ProductForm = {
  name: string;
  description: string;
  price: number | "";
  quantity: number | "";
};
