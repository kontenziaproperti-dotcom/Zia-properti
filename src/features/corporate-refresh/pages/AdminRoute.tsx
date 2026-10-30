import React, { Suspense, lazy } from 'react';
import { AuthProvider } from '../../../context/AuthContext';

const AdminDashboard = lazy(() =>
  import('../../../pages/AdminDashboard').then((module) => ({ default: module.AdminDashboard }))
);

interface AdminRouteProps {
  onNavigatePublic: (route: string) => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ onNavigatePublic }) => (
  <AuthProvider>
    <Suspense fallback={<div className="se-route-loading" role="status">Memuat panel administrasi...</div>}>
      <AdminDashboard onNavigatePublic={onNavigatePublic} />
    </Suspense>
  </AuthProvider>
);

export default AdminRoute;
