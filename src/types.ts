export type ProductCategory = "Alat Tulis" | "Dekorasi" | "Perawatan";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "FAILED" | "EXPIRED" | "CANCELLED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  badge?: string;
  description: string;
  keywords: string[];
  imageUrl: string;
  imageAlt: string;
  photographer: string;
  photoPage: string;
  featured?: boolean;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  totalAmount?: number;
  redirectUrl?: string | null;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
}
