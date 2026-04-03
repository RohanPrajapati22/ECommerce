export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}
