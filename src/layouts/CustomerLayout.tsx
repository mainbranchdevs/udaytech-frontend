import { Outlet } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopBar />
      {/* Phone-frame on desktop */}
      <main className="flex-1 max-w-[480px] w-full mx-auto bg-gray-50 pb-[72px]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
