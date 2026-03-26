import { Outlet } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../components/ui/Toast';

export default function CustomerLayout() {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-page)' }}>
          <TopBar />
          <main className="flex-1 w-full mx-auto pb-20">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}
