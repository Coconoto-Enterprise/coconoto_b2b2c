import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getVendorProducts,
  getVendorOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getVendorProfile,
  uploadProductImage
} from '../../services/vendorService';
import type { VendorProduct, VendorOrder, VendorProductInput, Vendor } from '../../types/vendor';
import { PRODUCT_CATEGORIES, UNITS } from '../../types/vendor';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import {
  Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter
} from '@/components/ui/sidebar-lite';
import { Sheet, SheetHeader, SheetClose, SheetTitle } from '@/components/ui/sheet';
import {
  Package, ShoppingBag, User, Store, Plus, Pencil, Trash2, LogOut, Menu,
  UploadCloud, Loader2, X
} from 'lucide-react';

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { session, logout } = useMarketplaceAuth();
  const { toast } = useToast();
  const vendorId = session?.role === 'vendor' ? session.id : localStorage.getItem('vendorId');
  const vendorName =
    session?.role === 'vendor' ? session.name : localStorage.getItem('vendorBusinessName') || 'Vendor';

  useEffect(() => {
    if (!vendorId) {
      navigate('/vendor-login');
      return;
    }
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, navigate]);

  const loadDashboardData = async () => {
    if (!vendorId) return;
    setIsLoading(true);
    const [productsData, ordersData, vendorData] = await Promise.all([
      getVendorProducts(vendorId),
      getVendorOrders(vendorId),
      getVendorProfile(vendorId)
    ]);
    setProducts(productsData);
    setOrders(ordersData);
    setVendor(vendorData);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/vendor-login');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!vendorId || !confirm('Are you sure you want to delete this product?')) return;
    const success = await deleteProduct(productId, vendorId);
    if (success) {
      setProducts(products.filter((p) => p.id !== productId));
      toast({ title: 'Product deleted', variant: 'success' });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: VendorOrder['status']) => {
    if (!vendorId) return;
    const success = await updateOrderStatus(orderId, vendorId, status);
    if (success) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast({ title: `Order marked as ${status}`, variant: 'success' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { key: 'products' as const, label: 'Products', icon: Package },
    { key: 'orders' as const, label: 'Orders', icon: ShoppingBag },
    { key: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{vendorName}</p>
              <p className="text-xs text-muted-foreground">Vendor Dashboard</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map(({ key, label, icon: Icon }) => (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton isActive={activeTab === key} onClick={() => setActiveTab(key)}>
                  <Icon className="h-4 w-4" />
                  {label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link to="/marketplace">View Marketplace</Link>
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-semibold">{vendorName}</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile navigation sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetClose onClose={() => setMobileOpen(false)} />
        </SheetHeader>
        <div className="mt-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <SidebarMenuButton
              key={key}
              isActive={activeTab === key}
              onClick={() => {
                setActiveTab(key);
                setMobileOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </SidebarMenuButton>
          ))}
        </div>
      </Sheet>

      <main className="md:ml-64 p-4 sm:p-8">
        <div className="mx-auto max-w-6xl">
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onAddProduct={() => setShowAddProductModal(true)}
              onEditProduct={setEditingProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
          )}
          {activeTab === 'profile' && vendor && <ProfileTab vendor={vendor} />}
        </div>
      </main>

      {(showAddProductModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          vendorId={vendorId!}
          onClose={() => {
            setShowAddProductModal(false);
            setEditingProduct(null);
          }}
          onSave={loadDashboardData}
        />
      )}
    </div>
  );
}

// Products Tab
function ProductsTab({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: {
  products: VendorProduct[];
  onAddProduct: () => void;
  onEditProduct: (product: VendorProduct) => void;
  onDeleteProduct: (productId: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Products</h2>
          <p className="text-sm text-muted-foreground">Manage the items you list on the marketplace.</p>
        </div>
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">You haven't added any products yet.</p>
            <Button onClick={onAddProduct}>
              <Plus className="h-4 w-4" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                    <span className="text-4xl">🥥</span>
                  </div>
                )}
                <Badge
                  variant={product.is_active ? 'success' : 'secondary'}
                  className="absolute right-2 top-2"
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardContent className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-foreground">{product.product_name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-lg font-bold text-primary">
                    ₦{product.price}/{product.unit}
                  </span>
                  <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEditProduct(product)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => onDeleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Orders Tab
function OrdersTab({
  orders,
  onUpdateStatus
}: {
  orders: VendorOrder[];
  onUpdateStatus: (orderId: string, status: VendorOrder['status']) => void;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <p className="text-sm text-muted-foreground">Track and update incoming customer orders.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{order.customer_name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-foreground">{order.product?.product_name || 'N/A'}</TableCell>
                  <TableCell className="text-foreground">{order.quantity}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ₦{(order.total_price ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as VendorOrder['status'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

// Profile Tab
function ProfileTab({ vendor }: { vendor: Vendor }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">Your storefront details.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{vendor.business_name}</CardTitle>
          <CardDescription>
            {vendor.is_verified ? 'Verified seller' : 'Verification pending'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileRow label="Business Name" value={vendor.business_name} />
          <ProfileRow label="Contact Name" value={vendor.contact_name} />
          <ProfileRow label="Email" value={vendor.email} />
          {vendor.phone && <ProfileRow label="Phone" value={vendor.phone} />}
          {vendor.address && <ProfileRow label="Address" value={vendor.address} />}
          {vendor.description && <ProfileRow label="Description" value={vendor.description} />}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
            <Badge variant={vendor.is_verified ? 'success' : 'outline'} className="mt-1">
              {vendor.is_verified ? 'Verified' : 'Pending Verification'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg text-foreground">{value}</p>
    </div>
  );
}

// Product Modal
function ProductModal({
  product,
  vendorId,
  onClose,
  onSave
}: {
  product: VendorProduct | null;
  vendorId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<VendorProductInput>({
    product_name: product?.product_name || '',
    description: product?.description || '',
    category: product?.category || PRODUCT_CATEGORIES[0],
    price: product?.price || 0,
    unit: product?.unit || UNITS[0],
    stock_quantity: product?.stock_quantity || 0,
    image_url: product?.image_url || '',
    is_active: product?.is_active ?? true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetImage = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return false;
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP, or AVIF)');
      return false;
    }
    setSelectedImage(file);
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetImage(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) validateAndSetImage(files[0]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let imageUrl = formData.image_url;

    if (selectedImage) {
      setIsUploading(true);
      const uploadResult = await uploadProductImage(vendorId, selectedImage);
      setIsUploading(false);
      if (!uploadResult.success) {
        setError(uploadResult.error || 'Failed to upload image');
        setIsLoading(false);
        return;
      }
      imageUrl = uploadResult.imageUrl || '';
    }

    const productData = { ...formData, image_url: imageUrl };
    let success = false;

    if (product) {
      success = await updateProduct(product.id, vendorId, productData);
    } else {
      const result = await createProduct(vendorId, productData);
      success = result.success;
      if (!success) setError(result.error || 'Failed to create product');
    }

    setIsLoading(false);
    if (success) {
      onSave();
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogHeader>
        <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogDescription>
          {product ? 'Update the details of this product.' : 'List a new product on the marketplace.'}
        </DialogDescription>
        <DialogClose />
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="product-name">Product Name *</Label>
          <Input
            id="product-name"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-category">Category *</Label>
          <Select
            id="product-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-description">Description *</Label>
          <Textarea
            id="product-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-price">Price *</Label>
            <Input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product-unit">Unit *</Label>
            <Select
              id="product-unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock Quantity *</Label>
          <Input
            id="product-stock"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Product Image</Label>
          {!imagePreview ? (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-input bg-muted/40 hover:border-primary/50'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                onChange={handleImageChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="image-upload"
              />
              <UploadCloud className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="mt-2 text-sm font-medium text-foreground">
                {isDragging ? 'Drop image here' : 'Drag & drop your image here'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">or</p>
              <label
                htmlFor="image-upload"
                className="mt-2 inline-block cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Browse Files
              </label>
              <p className="mt-2 text-xs text-muted-foreground">JPEG, PNG, WEBP, AVIF (Max 5MB)</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-lg border-2 border-border">
                <img src={imagePreview} alt="Preview" className="h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg transition-colors hover:bg-destructive/90"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{selectedImage ? selectedImage.name : 'Current image'}</span>
                <label htmlFor="image-upload-change" className="cursor-pointer font-medium text-primary hover:text-primary/80">
                  Change Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload-change"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          <Label htmlFor="is_active" className="cursor-pointer">Active (visible in marketplace)</Label>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isUploading ? 'Uploading Image...' : isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
