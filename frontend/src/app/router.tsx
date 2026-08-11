import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminAuditPage } from '../pages/admin/AdminAuditPage/AdminAuditPage';
import { AdminOrganizationPage } from '../pages/admin/AdminOrganizationPage/AdminOrganizationPage';
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage/AdminOverviewPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage/AdminUsersPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage/AdminLoginPage';
import { UserLoginPage } from '../pages/auth/UserLoginPage/UserLoginPage';
import { UserCollaborationPage } from '../pages/user/UserCollaborationPage/UserCollaborationPage';
import { UserOverviewPage } from '../pages/user/UserOverviewPage/UserOverviewPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/overview" element={<AdminOverviewPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/organization" element={<AdminOrganizationPage />} />
      <Route path="/admin/audit" element={<AdminAuditPage />} />
      <Route path="/user/overview" element={<UserOverviewPage />} />
      <Route path="/user/collaboration" element={<UserCollaborationPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
