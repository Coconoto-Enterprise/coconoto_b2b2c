import type {
  Vendor,
  VendorSignupData,
  VendorLoginData,
  VendorProduct,
  VendorProductInput,
  VendorOrder,
  VendorOrderInput
} from '../types/vendor';

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return { response, result };
}

export const vendorSignup = async (data: VendorSignupData): Promise<{ success: boolean; vendor?: Vendor; error?: string }> => {
  try {
    const { result } = await postJson('/api/auth', { action: 'vendor-signup', ...data });
    return result;
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create vendor account' };
  }
};

export const vendorLogin = async (credentials: VendorLoginData): Promise<{ success: boolean; vendor?: Vendor; error?: string }> => {
  try {
    const { result } = await postJson('/api/auth', { action: 'vendor-login', ...credentials });
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login' };
  }
};

export const getVendorDashboard = async (): Promise<{ vendor: Vendor; products: VendorProduct[]; orders: VendorOrder[] } | null> => {
  try {
    const response = await fetch('/api/marketplace?action=vendor-dashboard', { credentials: 'include' });
    const result = await response.json();
    if (!response.ok || !result.success) return null;
    return { vendor: result.vendor, products: result.products || [], orders: result.orders || [] };
  } catch (error) {
    console.error('Error fetching vendor dashboard:', error);
    return null;
  }
};

export const getVendorProfile = async (_vendorId?: string): Promise<Vendor | null> => (await getVendorDashboard())?.vendor || null;
export const getVendorProducts = async (_vendorId?: string): Promise<VendorProduct[]> => (await getVendorDashboard())?.products || [];
export const getVendorOrders = async (_vendorId?: string): Promise<VendorOrder[]> => (await getVendorDashboard())?.orders || [];

export const getAllMarketplaceProducts = async (): Promise<VendorProduct[]> => {
  try {
    const response = await fetch('/api/marketplace?action=products');
    const result = await response.json();
    return response.ok && result.success ? result.products : [];
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<VendorProduct | null> => {
  const products = await getAllMarketplaceProducts();
  return products.find((product) => product.id === productId) || null;
};

export const createProduct = async (_vendorId: string, productData: VendorProductInput): Promise<{ success: boolean; product?: VendorProduct; error?: string }> => {
  try {
    const { response, result } = await postJson('/api/marketplace', { action: 'vendor-product-save', product: productData });
    return response.ok ? result : { success: false, error: result.error || 'Failed to create product' };
  } catch {
    return { success: false, error: 'Failed to create product' };
  }
};

export const updateProduct = async (productId: string, _vendorId: string, updates: Partial<VendorProductInput>): Promise<boolean> => {
  try {
    const { response } = await postJson('/api/marketplace', { action: 'vendor-product-save', productId, product: updates });
    return response.ok;
  } catch {
    return false;
  }
};

export const deleteProduct = async (productId: string, _vendorId: string): Promise<boolean> => {
  try {
    const { response } = await postJson('/api/marketplace', { action: 'vendor-product-delete', productId });
    return response.ok;
  } catch {
    return false;
  }
};

// Guest ordering is intentionally disabled. Buyers sign in so the order is securely linked to their session.
export const createOrder = async (_vendorId: string, _orderData: VendorOrderInput): Promise<{ success: boolean; order?: VendorOrder; error?: string }> => ({
  success: false,
  error: 'Please sign in as a buyer to place an order',
});

export const updateOrderStatus = async (orderId: string, _vendorId: string, status: VendorOrder['status']): Promise<boolean> => {
  try {
    const { response } = await postJson('/api/marketplace', { action: 'vendor-order-status', orderId, status });
    return response.ok;
  } catch {
    return false;
  }
};

export const updateVendorProfile = async (): Promise<boolean> => false;

export const uploadProductImage = async (_vendorId: string, imageFile: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await fetch('/api/upload-product-image', { method: 'POST', credentials: 'include', body: formData });
    return await response.json();
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};
