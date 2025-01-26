export interface Seller {
  name: string;
  phone: string;
  email: string;
  rating: number;
  company: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  location: string;
  seller: Seller;
}