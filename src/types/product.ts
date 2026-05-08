export interface Measurements {
  shoulder?: number;
  chest?: number;
  length?: number;
}

export interface Product {
  id: number;
  image: string;
  images?: string[];
  title: string;
  brand?: string;
  category: string;
  material?: string;
  condition?: string;
  sizeRange?: string;
  measurements?: Measurements;
  details?: string[];
  price?: string;
  status: 'Hàng mới' | 'Còn hàng' | 'Đã bán';
  isSoldOut?: boolean;
  soldAt?: any;
}
