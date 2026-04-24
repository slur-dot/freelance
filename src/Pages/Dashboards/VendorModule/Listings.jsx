import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ArrowUpDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../../../services/productService";
import { auth } from "../../../firebaseConfig";
import { validateMultipleImages } from "../../../utils/imageUtils";
import { sanitizeInput } from "../../../utils/sanitize";

// Reusable Button
function RCButton({ children, variant = "default", size = "md", className = "", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
      : variant === "ghost"
        ? "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50"
        : "bg-green-700 text-white hover:bg-green-800";

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
      : "px-4 py-2 rounded-md text-sm font-medium";

  return (
    <button className={`${base} ${sizeCls} ${className}`} {...props}>
      {children}
    </button>
  );
}

function RCInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full ${className}`}
      {...props}
    />
  );
}

function RCCard({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

function RCTable({ children }) {
  return <table className="min-w-full text-sm text-left divide-y divide-gray-200">{children}</table>;
}
function RCTableHeader({ children }) {
  return <thead className="bg-gray-50">{children}</thead>;
}
function RCTableBody({ children }) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}
function RCTableRow({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}
function RCTableHead({ children, className = "" }) {
  return (
    <th
      className={`px-4 md:px-6 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs md:text-sm ${className}`}
    >
      {children}
    </th>
  );
}
function RCTableCell({ children, className = "" }) {
  return <td className={`px-4 md:px-6 py-4 whitespace-nowrap text-sm ${className}`}>{children}</td>;
}

export default function Listings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", currency: "GNF" });
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadProducts = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      // Fetch all products for seller
      const fetchedProducts = await ProductService.getSellerProducts(user.uid);
      setProducts(fetchedProducts);
    } catch (e) {
      console.error("Error loading products:", e);
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleStatus = async (listingId, nextStatus) => {
    try {
      await ProductService.updateProduct(listingId, { status: nextStatus });
      setProducts(prev => prev.map(p => p.id === listingId ? { ...p, status: nextStatus } : p));
    } catch (e) {
      setError(e.message);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm(t('vendor_dashboard.listings.delete_confirm'))) return;
    try {
      await ProductService.deleteProduct(listingId);
      setProducts(prev => prev.filter(p => p.id !== listingId));
    } catch (e) {
      setError(e.message);
      alert("Failed to delete product");
    }
  };

  const handleCreate = async (e) => {
    e?.preventDefault();
    try {
      if (!user) return;
      
      // Basic sanitization
      const cleanTitle = sanitizeInput(newProduct.title);
      const cleanDesc = sanitizeInput(newProduct.description);
      
      if (!cleanTitle || !cleanDesc) {
        alert("Title and description cannot contain invalid characters");
        return;
      }

      await ProductService.createProduct({
        sellerId: user.uid,
        title: cleanTitle,
        description: cleanDesc,
        price: Number(newProduct.price),
        currency: newProduct.currency,
        status: 'Active', // Default to active or pending
        // Images would be uploaded to Firebase Storage here
        // images: images.map(file => URL.createObjectURL(file)) // Placeholder
      });

      setShowCreate(false);
      setNewProduct({ title: "", description: "", price: "", currency: "GNF" });
      setImages([]);
      loadProducts();
    } catch (e) {
      setError(e.message);
      alert("Failed to create product");
    }
  };

  const handleImageSelection = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const result = await validateMultipleImages(files, { maxCount: 5, maxSizeMB: 2 });
    
    if (!result.valid) {
      alert(result.errors.join('\n'));
      e.target.value = ''; // clearer
      setImages([]);
      return;
    }
    
    setImages(result.validFiles);
  };

  // Client side pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{t('vendor_dashboard.listings.title')}</h1>
        <RCButton className="w-full sm:w-auto" onClick={() => setShowCreate(true)}>{t('vendor_dashboard.listings.add_btn')}</RCButton>
      </div>

      <RCCard className="p-4 md:p-6">
        {/* Search - Placeholder for now as client filtering logic is duplicated */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput placeholder={t('vendor_dashboard.listings.search_placeholder')} onChange={() => { }} disabled />
        </div>

        {/* Table (desktop/tablet) */}
        <div className="hidden sm:block overflow-x-auto">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead>{t('vendor_dashboard.listings.table.sno')}</RCTableHead>
                <RCTableHead>
                  <div className="flex items-center gap-1">
                    {t('vendor_dashboard.listings.table.name')} <ArrowUpDown className="h-4 w-4" />
                  </div>
                </RCTableHead>
                <RCTableHead>
                  <div className="flex items-center gap-1">
                    {t('vendor_dashboard.listings.table.desc')} <ArrowUpDown className="h-4 w-4" />
                  </div>
                </RCTableHead>
                <RCTableHead>
                  <div className="flex items-center gap-1">
                    {t('vendor_dashboard.listings.table.price')} <ArrowUpDown className="h-4 w-4" />
                  </div>
                </RCTableHead>
                <RCTableHead>{t('vendor_dashboard.listings.table.status')}</RCTableHead>
                <RCTableHead>{t('vendor_dashboard.listings.table.actions')}</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {paginatedProducts.map((p, index) => (
                <RCTableRow key={p.id}>
                  <RCTableCell>{(currentPage - 1) * itemsPerPage + index + 1}</RCTableCell>
                  <RCTableCell className="font-medium">{p.title || p.name}</RCTableCell>
                  <RCTableCell>{p.description || '-'}</RCTableCell>
                  <RCTableCell>{p.price ? `${p.price} GNF` : '-'}</RCTableCell>
                  <RCTableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {p.status ? t(`vendor_dashboard.listings.status.${p.status.toLowerCase()}`, p.status) : t('vendor_dashboard.listings.pending')}
                    </span>
                  </RCTableCell>
                  <RCTableCell>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <RCButton
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(p.id)}
                        title={t('vendor_dashboard.modals.serial_numbers.delete')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </RCButton>

                      {p.status !== "Active" ? (
                        <RCButton
                          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                          onClick={() => toggleStatus(p.id, "Active")}
                        >
                          {t('vendor_dashboard.listings.activate')}
                        </RCButton>
                      ) : (
                        <RCButton
                          className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                          onClick={() => toggleStatus(p.id, "Inactive")}
                        >
                          {t('vendor_dashboard.listings.deactivate')}
                        </RCButton>
                      )}
                    </div>
                  </RCTableCell>

                </RCTableRow>
              ))}
              {paginatedProducts.length === 0 && (
                <RCTableRow>
                  <RCTableCell className="text-center" colSpan={6}>{t('vendor_dashboard.listings.no_products')}</RCTableCell>
                </RCTableRow>
              )}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Mobile Card Layout */}
        <div className="grid gap-4 sm:hidden">
          {paginatedProducts.map((p, index) => (
            <div key={p.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{(currentPage - 1) * itemsPerPage + index + 1}. {p.title || p.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {p.status ? t(`vendor_dashboard.listings.status.${p.status.toLowerCase()}`, p.status) : t('vendor_dashboard.listings.pending')}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{p.description || '-'}</p>
              <p className="font-medium mb-3">{p.price ? `${p.price} GNF` : '-'}</p>
              <div className="flex flex-col gap-2">
                <RCButton
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(p.id)}
                  title={t('vendor_dashboard.modals.serial_numbers.delete')}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </RCButton>

                {p.status !== "Active" ? (
                  <RCButton
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => toggleStatus(p.id, "Active")}
                  >
                    {t('vendor_dashboard.listings.activate')}
                  </RCButton>
                ) : (
                  <RCButton
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => toggleStatus(p.id, "Inactive")}
                  >
                    {t('vendor_dashboard.listings.deactivate')}
                  </RCButton>
                )}
              </div>

            </div>
          ))}
          {paginatedProducts.length === 0 && <p className="text-center text-gray-500">{t('vendor_dashboard.listings.no_products')}</p>}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 gap-3 border-t border-gray-300">
          <RCButton variant="outline" className="w-full sm:w-auto" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>{t('vendor_dashboard.listings.pagination.previous')}</RCButton>
          <span className="text-sm text-gray-500">{t('vendor_dashboard.listings.pagination.page_of', { current: currentPage, total: totalPages || 1 })}</span>
          <RCButton variant="outline" className="w-full sm:w-auto" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>{t('vendor_dashboard.listings.pagination.next')}</RCButton>
        </div>
      </RCCard>

      {/* Create Listing Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{t('vendor_dashboard.listings.create_modal.title')}</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project/Listing Title</label>
                <input className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t('vendor_dashboard.listings.create_modal.product_title')} value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t('vendor_dashboard.listings.create_modal.desc')} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={t('vendor_dashboard.listings.create_modal.price')} value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                    value={newProduct.currency} 
                    onChange={e => setNewProduct({ ...newProduct, currency: e.target.value })}
                  >
                    <option value="GNF">GNF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/png,image/webp" 
                  onChange={handleImageSelection}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
                />
                <p className="text-xs text-gray-500 flex flex-col gap-1">
                  <span>• Maximum 5 images</span>
                  <span>• Max file size: 2MB per image</span>
                  <span>• Supported: JPG, PNG, WEBP</span>
                </p>
                {images.length > 0 && (
                  <div className="mt-3 bg-white p-2 border border-green-200 rounded text-sm text-green-700">
                    <span className="font-semibold">{images.length} image(s)</span> ready to upload
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <RCButton variant="outline" type="button" onClick={() => setShowCreate(false)}>{t('vendor_dashboard.listings.create_modal.cancel')}</RCButton>
                <RCButton type="submit">{t('vendor_dashboard.listings.create_modal.create')}</RCButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
