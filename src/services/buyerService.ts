import type { 
  Buyer, 
  BuyerSignupInput, 
  BuyerLoginInput, 
  BuyerUpdateInput,
  BuyerAuthResponse,
  BuyerOrder 
} from '../types/buyer';

// Buyer Signup
export async function buyerSignup(input: BuyerSignupInput): Promise<BuyerAuthResponse> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'buyer-signup', ...input }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Signup failed' 
      };
    }

    return { success: true, buyer: data.buyer };
  } catch (error) {
    console.error('Buyer signup error:', error);
    return { success: false, error: 'Signup failed' };
  }
}

// Buyer Login
export async function buyerLogin(input: BuyerLoginInput): Promise<BuyerAuthResponse> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'buyer-login', ...input }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Login failed' 
      };
    }

    return { success: true, buyer: data.buyer };
  } catch (error) {
    console.error('Buyer login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Buyer "Become a Seller" — upgrades the logged-in buyer to also sell on Coconoto.
export async function buyerBecomeSeller(input: {
  password: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  description?: string;
}): Promise<{ success: boolean; vendor?: unknown; error?: string }> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'buyer-become-seller', ...input }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to become a seller' };
    }
    return { success: true, vendor: data.vendor };
  } catch (error) {
    console.error('Become a seller error:', error);
    return { success: false, error: 'Failed to become a seller' };
  }
}

// Get Buyer Profile from the authenticated server session
export async function getBuyerProfile(_buyerId?: string): Promise<Buyer | null> {
  const dashboard = await getBuyerDashboard();
  return dashboard?.buyer || null;
}

export async function getBuyerDashboard(): Promise<{ buyer: Buyer; orders: BuyerOrder[] } | null> {
  try {
    const response = await fetch('/api/marketplace?action=buyer-dashboard', { credentials: 'include' });
    const result = await response.json();
    if (!response.ok || !result.success) return null;
    return { buyer: result.buyer as Buyer, orders: result.orders as BuyerOrder[] };
  } catch (error) {
    console.error('Get buyer dashboard error:', error);
    return null;
  }
}

// Update Buyer Profile
export async function updateBuyerProfile(
  _buyerId: string,
  updates: BuyerUpdateInput
): Promise<{ success: boolean; buyer?: Buyer; error?: string }> {
  try {
    const response = await fetch('/api/marketplace', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'buyer-profile-update', updates }),
    });
    const result = await response.json();
    return response.ok ? result : { success: false, error: result.error || 'Update failed' };
  } catch (error) {
    console.error('Update buyer profile error:', error);
    return { success: false, error: 'Update failed' };
  }
}

// Get Buyer Orders
export async function getBuyerOrders(_buyerId?: string): Promise<BuyerOrder[]> {
  const dashboard = await getBuyerDashboard();
  return dashboard?.orders || [];
}

// Create Order with the authenticated Buyer Account
export async function createOrderWithBuyer(
  _vendorId: string,
  productId: string,
  _buyerId: string,
  orderData: {
    quantity: number;
    delivery_address?: string;
    notes?: string;
  }
): Promise<{ success: boolean; order?: any; error?: string }> {
  try {
    const response = await fetch('/api/marketplace', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'buyer-order-create',
        productId,
        quantity: orderData.quantity,
        deliveryAddress: orderData.delivery_address,
        notes: orderData.notes,
      }),
    });
    const result = await response.json();
    return response.ok ? result : { success: false, error: result.error || 'Failed to create order' };
  } catch (error) {
    console.error('Create order with buyer error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
