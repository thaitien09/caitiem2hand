import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  addDoc, 
  updateDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Brand {
  id: string;
  name: string;
  logo?: string;
  createdAt?: any;
}

const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'brands'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const brandsData: Brand[] = [];
      querySnapshot.forEach((docSnap) => {
        brandsData.push({ ...docSnap.data(), id: docSnap.id } as Brand);
      });
      setBrands(brandsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setIsEditing(true);
    setCurrentId(brand.id);
    setFormData({ name: brand.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    try {
      if (isEditing && currentId) {
        await updateDoc(doc(db, 'brands', currentId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'brands'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Lỗi khi lưu thương hiệu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await deleteDoc(doc(db, 'brands', id));
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Lỗi khi xóa thương hiệu");
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-serif text-navy mb-2">Quản lý Thương hiệu</h1>
          <p className="text-sm text-stone-500">Quản lý danh sách các thương hiệu sản phẩm (Chỉ cần nhập tên).</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-stone-900 transition-all duration-500 shadow-xl shadow-navy/10"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm thương hiệu mới
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white p-6 md:p-10 shadow-sm border border-stone-100 rounded-sm hover:border-navy transition-all group relative">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-serif text-navy tracking-wide group-hover:scale-105 transition-transform duration-500">{brand.name}</h3>
                <div className="w-8 h-[1px] bg-stone-200 mt-4 group-hover:w-16 group-hover:bg-navy transition-all duration-500" />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(brand)}
                  className="p-2 text-stone-400 hover:text-navy transition-colors"
                >
                  <PencilSquareIcon className="w-5 h-5 lg:w-4 lg:h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(brand.id)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                >
                  <TrashIcon className="w-5 h-5 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-lg text-stone-300 uppercase tracking-widest text-[10px]">
              Trống. Nhấn "Thêm mới" để bắt đầu.
            </div>
          )}
        </div>
      )}

      {/* Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 rounded-sm">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h2 className="text-lg font-serif text-navy">
                {isEditing ? 'Sửa Tên Thương hiệu' : 'Thêm Thương hiệu Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-navy transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">Tên hãng</label>
                <input
                  type="text" required
                  placeholder="Ví dụ: Ralph Lauren"
                  autoFocus
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-navy transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-navy transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-navy text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-900 transition-all"
                >
                  {isEditing ? 'Lưu thay đổi' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
