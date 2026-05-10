import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  deleteDoc, 
  doc,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import type { Product } from '@/types/product';

const ITEMS_PER_PAGE = 10;

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [brandList, setBrandList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    brand: '',
    category: 'Áo',
    price: '',
    sizeRange: '',
    material: '',
    condition: '',
    image: '',
    images: [],
    status: 'Hàng mới'
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'products'), orderBy('id', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      const now = Date.now();
      const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docId = docSnap.id;
        
        // Auto-cleanup logic: If sold more than 2 weeks ago, delete it
        if (data.status === 'Đã bán' && data.soldAt) {
          const soldTime = data.soldAt.toMillis ? data.soldAt.toMillis() : data.soldAt;
          if (now - soldTime > TWO_WEEKS_MS) {
            deleteDoc(doc(db!, 'products', docId));
            return;
          }
        }

        // Auto-downgrade logic: If "Hàng mới" for more than 7 days, change to "Còn hàng"
        if (data.status === 'Hàng mới' && data.createdAt) {
          const createdTime = data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt;
          const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
          if (now - createdTime > SEVEN_DAYS_MS) {
            updateDoc(doc(db!, 'products', docId), { status: 'Còn hàng' });
          }
        }

        productsData.push({ ...data, id: docId } as unknown as Product);
      });
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'brands'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const brands: string[] = [];
      querySnapshot.forEach((doc) => {
        brands.push(doc.data().name);
      });
      setBrandList(brands);
    });
    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      brand: '',
      category: 'Áo',
      price: '',
      sizeRange: '',
      material: '',
      condition: '',
      image: '',
      images: [],
      status: 'Hàng mới'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentId(product.id.toString());
    setFormData({
      ...product,
      images: product.images || [product.image] // Ensure images array exists
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [...(formData.images || [])];
    const CLOUD_NAME = 'dgttbkecc';
    const UPLOAD_PRESET = 'tiem2hand';

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formDataUpload,
          }
        );

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }

      setFormData(prev => ({ 
        ...prev, 
        images: uploadedUrls,
        image: prev.image || uploadedUrls[0]
      }));
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert("Lỗi khi tải ảnh lên Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    const removedUrl = newImages.splice(index, 1)[0];
    
    // If we removed the main image, pick a new one or clear it
    let newMainImage = formData.image;
    if (formData.image === removedUrl) {
      newMainImage = newImages.length > 0 ? newImages[0] : '';
    }

    setFormData(prev => ({ 
      ...prev, 
      images: newImages,
      image: newMainImage
    }));
  };

  const setMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    // Ensure the main image is set if there are images
    const finalData = { ...formData };
    if (!finalData.image && finalData.images && finalData.images.length > 0) {
      finalData.image = finalData.images[0];
    }

    // Update soldAt if status changed to 'Đã bán'
    if (finalData.status === 'Đã bán' && (!isEditing || products.find(p => p.id.toString() === currentId)?.status !== 'Đã bán')) {
      finalData.soldAt = serverTimestamp();
    } else if (finalData.status !== 'Đã bán') {
      finalData.soldAt = null; // Clear if changed back
    }

    setLoading(true);
    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'products', currentId), {
          ...finalData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...finalData,
          createdAt: serverTimestamp(),
          id: Date.now()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!db) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteDoc(doc(db, 'products', id.toString()));
      } catch (error) {
        console.error("Error removing document: ", error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || (product.brand?.toLowerCase() || '') === filterBrand;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterBrand, filterStatus]);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Quản lý Sản phẩm</h1>
          <p className="text-sm text-stone-500">Đăng tải và quản lý kho hàng Cái Tiệm 2HAND.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-navy/10"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Dashboard Controls */}
      <div className="bg-white p-6 shadow-sm border border-stone-200 flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select
            className="px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy flex-1 md:w-48 text-stone-600"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="all">Tất cả thương hiệu</option>
            {brandList.map(brand => (
              <option key={brand} value={brand.toLowerCase()}>{brand}</option>
            ))}
          </select>
          <select
            className="px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy flex-1 md:w-48 text-stone-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả tình trạng</option>
            <option value="Hàng mới">Hàng mới</option>
            <option value="Còn hàng">Còn hàng</option>
            <option value="Đã bán">Đã bán</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-stone-200 shadow-sm overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase tracking-widest text-stone-500">
                <th className="p-5 font-bold">Hình ảnh</th>
                <th className="p-5 font-bold">Sản phẩm</th>
                <th className="p-5 font-bold text-center">Trạng thái</th>
                <th className="p-5 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-5">
                    <div className="w-16 h-20 bg-stone-100 overflow-hidden shadow-sm border border-stone-200 relative group">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-1 right-1 bg-navy/80 text-white text-[8px] px-1 rounded">
                          +{product.images.length - 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-serif text-navy text-lg leading-tight mb-1">{product.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{product.brand}</span>
                      <span className="w-1 h-1 bg-stone-300 rounded-full" />
                      <span className="text-sm font-bold text-navy">{product.price}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm ${
                      product.status === 'Đã bán' ? 'bg-red-50 text-red-600' : 
                      product.status === 'Hàng mới' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2 text-stone-400 hover:text-navy transition-colors">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">
              Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} sản phẩm
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 border border-stone-200 flex items-center justify-center text-stone-400 hover:border-navy hover:text-navy transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 border text-[11px] font-bold tracking-widest transition-all duration-300 rounded-sm ${
                    currentPage === page
                      ? 'bg-navy text-white border-navy'
                      : 'border-stone-200 text-stone-400 hover:border-navy hover:text-navy'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 border border-stone-200 flex items-center justify-center text-stone-400 hover:border-navy hover:text-navy transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-sm"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm">
            <div className="sticky top-0 bg-white border-b border-stone-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-serif text-navy">
                {isEditing ? 'Chỉnh sửa Sản phẩm' : 'Đăng Sản phẩm Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-navy transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left: Images */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-4">Hình ảnh (Tối đa 15 ảnh)</label>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {formData.images?.map((url, index) => (
                        <div key={index} className={`relative aspect-[3/4] border-2 group ${formData.image === url ? 'border-navy shadow-lg' : 'border-stone-100'}`}>
                          <img src={url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => setMainImage(url)}
                              className="bg-white text-navy text-[8px] font-bold uppercase px-2 py-1 rounded-sm"
                            >
                              Làm ảnh bìa
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-600 text-white p-1 rounded-full"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                          {formData.image === url && (
                            <div className="absolute top-1 left-1 bg-navy text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-sm">Bìa</div>
                          )}
                        </div>
                      ))}
                      
                      {(formData.images?.length || 0) < 15 && (
                        <label className="aspect-[3/4] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-stone-50 transition-colors">
                          <PhotoIcon className="w-8 h-8 text-stone-300" />
                          <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Thêm ảnh</span>
                          <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                      )}
                    </div>
                    {uploading && (
                      <div className="flex items-center gap-2 text-navy mb-4 animate-pulse">
                        <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Đang tải ảnh lên...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Info */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Tên sản phẩm</label>
                      <input
                        type="text" required
                        placeholder="Ví dụ: Sơ Mi Polo Ralph Lauren Linen"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Thương hiệu</label>
                      <select
                        required
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      >
                        <option value="">Chọn thương hiệu</option>
                        {brandList.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Giá bán</label>
                      <input
                        type="text" required
                        placeholder="Ví dụ: 1.490.000đ"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-3">Chọn Size</label>
                      <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL', '2XL', 'Free size'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const currentSizes = formData.sizeRange ? formData.sizeRange.split(', ') : [];
                              const newSizes = currentSizes.includes(size)
                                ? currentSizes.filter(s => s !== size)
                                : [...currentSizes, size];
                              setFormData({ ...formData, sizeRange: newSizes.join(', ') });
                            }}
                            className={`px-4 py-2 text-xs font-bold border transition-all ${
                              formData.sizeRange?.split(', ').includes(size)
                                ? 'bg-navy text-white border-navy'
                                : 'bg-white text-stone-400 border-stone-200 hover:border-navy'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                        <input
                          type="text"
                          placeholder="Size khác..."
                          className="px-4 py-2 bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-navy transition-colors w-32"
                          value={formData.sizeRange?.split(', ').filter(s => !['S', 'M', 'L', 'XL', '2XL', 'Free size'].includes(s)).join(', ') || ''}
                          onChange={e => {
                            const standardSizes = formData.sizeRange?.split(', ').filter(s => ['S', 'M', 'L', 'XL', '2XL', 'Free size'].includes(s)) || [];
                            const customSize = e.target.value;
                            setFormData({ ...formData, sizeRange: [...standardSizes, customSize].filter(Boolean).join(', ') });
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Chất liệu</label>
                      <input
                        type="text" required
                        placeholder="Ví dụ: Linen"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.material}
                        onChange={e => setFormData({ ...formData, material: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Độ mới (Cond)</label>
                      <input
                        type="text" required
                        placeholder="Ví dụ: 9.7/10"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.condition}
                        onChange={e => setFormData({ ...formData, condition: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Trạng thái</label>
                      <select
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="Hàng mới">Hàng mới</option>
                        <option value="Còn hàng">Còn hàng</option>
                        <option value="Đã bán">Đã bán</option>
                      </select>
                    </div>

                    <div className="col-span-2 grid grid-cols-3 gap-4 border-t border-stone-100 pt-6">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-2 text-center">Vai (cm)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-3 bg-stone-50 border border-stone-200 text-center text-sm focus:border-navy outline-none"
                          value={formData.measurements?.shoulder || ''}
                          onChange={e => setFormData({ ...formData, measurements: { ...formData.measurements!, shoulder: Number(e.target.value) } })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-2 text-center">Ngực (cm)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-3 bg-stone-50 border border-stone-200 text-center text-sm focus:border-navy outline-none"
                          value={formData.measurements?.chest || ''}
                          onChange={e => setFormData({ ...formData, measurements: { ...formData.measurements!, chest: Number(e.target.value) } })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-2 text-center">Dài (cm)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-3 bg-stone-50 border border-stone-200 text-center text-sm focus:border-navy outline-none"
                          value={formData.measurements?.length || ''}
                          onChange={e => setFormData({ ...formData, measurements: { ...formData.measurements!, length: Number(e.target.value) } })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-navy transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="bg-navy text-white px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-900 transition-all disabled:bg-stone-300 shadow-xl shadow-navy/20"
                    >
                      {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Đăng sản phẩm')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
