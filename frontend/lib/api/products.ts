import { apiFetch } from './client';
import type { Item } from '@/lib/types';

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  condition: string;
  isAvailable: boolean;
  seller: {
    id: number;
    fistName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  productImages: string[];
  primaryImage: string | null;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  quantity?: number;
  condition?: string;
  categoryId?: number;
  isAvailable?: boolean;
}

/** Map a backend ProductResponse to the frontend Item shape */
export function toFrontendItem(product: ProductResponse): Item {
  return {
    id: product.id,
    title: product.title,
    condition: product.condition ?? 'Unknown',
    price: Number(product.price),
    image:
      product.primaryImage ??
      product.productImages?.[0] ??
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    category: product.categoryName ?? 'Other',
  };
}

export async function getProducts(page = 0, size = 20): Promise<PagedResponse<ProductResponse>> {
  return apiFetch<PagedResponse<ProductResponse>>(
    `/api/products/public/all?page=${page}&size=${size}`,
    { skipAuth: true },
  );
}

export async function searchProducts(query: string, page = 0, size = 20): Promise<PagedResponse<ProductResponse>> {
  const params = new URLSearchParams({ query, page: String(page), size: String(size) });
  return apiFetch<PagedResponse<ProductResponse>>(
    `/api/products/public/search?${params}`,
    { skipAuth: true },
  );
}

export async function createProduct(data: CreateProductRequest): Promise<ProductResponse> {
  return apiFetch<ProductResponse>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadProductImage(productId: number, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('image', file);
  return apiFetch<unknown>(`/api/products/${productId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export async function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>('/api/category/public/all', { skipAuth: true });
}
