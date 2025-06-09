export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  location: string;
  harvestDate: string;
  organic: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  location: string;
  harvestDate: string;
  organic: boolean;
  image: string;
} 