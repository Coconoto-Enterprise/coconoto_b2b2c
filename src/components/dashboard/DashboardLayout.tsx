import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { Overview } from './Overview';
import { ProductList } from './products/ProductList';
import { CustomerList } from './customers/CustomerList';
import { MyOrders } from './orders/MyOrders';
import { Invoices } from './invoices/Invoices';
import { Payments } from './payments/Payments';
import { Settings } from './settings/Settings';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';

export function DashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1">
          <div className="p-8">
            <Routes>
              <Route index element={<Overview />} />
              {user.accountType === 'seller' && (
                <>
                  <Route path="products" element={<ProductList />} />
                  <Route path="customers" element={<CustomerList />} />
                </>
              )}
              <Route path="orders" element={<MyOrders />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <MarketplaceFooter />
    </div>
  );
}