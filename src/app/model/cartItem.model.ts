import { Product } from "./product.model";

export interface CartItem {
    CartId?: number | null;
    ProductId: number;
    Quantity: number;
  }