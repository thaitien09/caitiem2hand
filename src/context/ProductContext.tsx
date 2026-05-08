import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import type { Product } from '@/types/product';

interface ProductContextType {
  products: Product[];
  brands: string[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  brands: ['Tất cả'],
  loading: true,
  getProductById: () => undefined,
  refreshProducts: async () => {},
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>(['Tất cả']);
  const [loading, setLoading] = useState(true);

  // Fetch cả products + brands trong 1 lần, dùng getDocs thay vì onSnapshot
  const fetchData = useCallback(async () => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      // Fetch products + brands song song (Promise.all)
      const [productsSnap, brandsSnap] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('id', 'desc'))),
        getDocs(query(collection(db, 'brands'), orderBy('name', 'asc'))),
      ]);

      const productData: Product[] = [];
      productsSnap.forEach((doc) => {
        productData.push({ ...doc.data(), id: doc.id } as unknown as Product);
      });
      setProducts(productData);

      const brandList: string[] = ['Tất cả'];
      brandsSnap.forEach((doc) => {
        brandList.push(doc.data().name);
      });
      setBrands(brandList);
    } catch (error) {
      console.error('ProductContext fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id.toString() === id);
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, brands, loading, getProductById, refreshProducts: fetchData }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for easy access
export const useProducts = () => useContext(ProductContext);
