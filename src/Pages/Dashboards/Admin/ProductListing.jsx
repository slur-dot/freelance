import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

// Reusable Button
function RCButton({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  let base = "";

  if (variant === "outline") {
    base =
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50";
  } else if (variant === "default") {
    base =
      "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50";
  } else if (variant === "custom") {
    base = ""; // allow full customization
  }

  const sizeCls =
    size === "icon"
      ? "p-2 h-8 w-8 flex items-center justify-center rounded-md"
      : "px-3 md:px-4 py-2 rounded-md text-sm font-medium";

  return (
    <button className={`${base} ${sizeCls} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Input
function RCInput({ className = "", ...props }) {
  return (
    <input
      className={`pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 text-sm w-full ${className}`}
      {...props}
    />
  );
}

// Card
function RCCard({ children, className = "" }) {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
  );
}

// Table
function RCTable({ children }) {
  return (
    <table className="hidden sm:table min-w-full text-xs sm:text-sm text-left divide-y divide-gray-200">
      {children}
    </table>
  );
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
      className={`px-3 sm:px-6 py-3 font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}
function RCTableCell({ children, className = "" }) {
  return (
    <td className={`px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

export default function ProductListing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllProducts(null, 100);
      setProducts(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin_dashboard.listings.product.actions.delete_confirm'))) {
      return;
    }

    try {
      setLoading(true);
      await AdminService.removeProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error deleting product:", e);
      setError(t('admin_dashboard.listings.product.errors.delete_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      setLoading(true);
      // Only send the fields that need to be updated
      const updateData = {
        listed: true,
        updatedAt: new Date()
      };

      await AdminService.updateProduct(id, updateData);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updateData } : p)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error activating product:", e);
      setError(t('admin_dashboard.listings.product.errors.activate_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      setLoading(true);
      // Only send the fields that need to be updated
      const updateData = {
        listed: false,
        updatedAt: new Date()
      };

      await AdminService.updateProduct(id, updateData);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updateData } : p)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error deactivating product:", e);
      setError(t('admin_dashboard.listings.product.errors.deactivate_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewProduct = () => {
    navigate("/admin/dashboard/product-form");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Heading with button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          {t('admin_dashboard.listings.product.title')}
        </h1>
        <RCButton
          variant="custom"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={handleAddNewProduct}
        >
          {t('admin_dashboard.listings.product.add_button')}
        </RCButton>
      </div>

      <RCCard className="p-3 sm:p-4 md:p-6">
        {/* Search */}
        <div className="relative mb-4">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          {loading && <div className="mb-3 text-gray-500 text-sm">Loading...</div>}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <RCInput placeholder={t('admin_dashboard.listings.product.search_placeholder')} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto hidden sm:block">
          <RCTable>
            <RCTableHeader>
              <RCTableRow>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.s_no')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.name')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.description')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.price')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.status')}</RCTableHead>
                <RCTableHead>{t('admin_dashboard.listings.product.table.headers.actions')}</RCTableHead>
              </RCTableRow>
            </RCTableHeader>
            <RCTableBody>
              {products.map((product, index) => (
                <RCTableRow key={product.id}>
                  <RCTableCell>{index + 1}</RCTableCell>
                  <RCTableCell className="font-medium">{product.name}</RCTableCell>
                  <RCTableCell>{product.description}</RCTableCell>
                  <RCTableCell>{product.price}</RCTableCell>
                  <RCTableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${product.listed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${product.listed
                          ? "bg-green-500"
                          : "bg-red-500"
                          }`}
                      />
                      {product.listed ? t('admin_dashboard.listings.product.status.active') : t('admin_dashboard.listings.product.status.inactive')}
                    </span>
                  </RCTableCell>
                  <RCTableCell>
                    <div className="flex items-center gap-2">
                      <RCButton
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </RCButton>
                      {product.listed ? (
                        <RCButton
                          variant="custom"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDeactivate(product.id)}
                          disabled={loading}
                        >
                          {t('admin_dashboard.listings.product.actions.deactivate')}
                        </RCButton>
                      ) : (
                        <RCButton
                          variant="custom"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleActivate(product.id)}
                          disabled={loading}
                        >
                          {t('admin_dashboard.listings.product.actions.activate')}
                        </RCButton>
                      )}
                    </div>
                  </RCTableCell>
                </RCTableRow>
              ))}
            </RCTableBody>
          </RCTable>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="border rounded-md p-3 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-sm mb-1">
                {index + 1}. {product.name}
              </h2>
              <p className="text-xs text-gray-500 mb-1">{product.description}</p>
              <p className="text-xs text-gray-500 mb-1">{t('admin_dashboard.listings.product.mobile.price')} {product.price}</p>
              <p
                className={`text-xs font-medium mb-2 ${product.listed ? "text-green-600" : "text-red-600"
                  }`}
              >
                {t('admin_dashboard.listings.product.mobile.status')} {product.listed ? t('admin_dashboard.listings.product.status.active') : t('admin_dashboard.listings.product.status.inactive')}
              </p>
              <div className="flex items-center gap-2">
                <RCButton
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:bg-red-50"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </RCButton>
                {product.listed ? (
                  <RCButton
                    variant="custom"
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeactivate(product.id)}
                    disabled={loading}
                  >
                    {t('admin_dashboard.listings.product.actions.deactivate')}
                  </RCButton>
                ) : (
                  <RCButton
                    variant="custom"
                    className="bg-green-500 text-white hover:bg-green-600"
                    onClick={() => handleActivate(product.id)}
                    disabled={loading}
                  >
                    {t('admin_dashboard.listings.product.actions.activate')}
                  </RCButton>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 border-t border-gray-300 pt-4">
          <RCButton variant="outline">{t('admin_dashboard.pagination.previous')}</RCButton>
          <span className="text-xs sm:text-sm text-gray-500">
            {t('admin_dashboard.pagination.page_info', { current: 1, total: 10 })}
          </span>
          <RCButton>{t('admin_dashboard.pagination.next')}</RCButton>
        </div>
      </RCCard>
    </div>
  );
}
