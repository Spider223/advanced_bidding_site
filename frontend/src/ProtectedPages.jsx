import { Navigate, useLocation, Outlet } from "react-router-dom";

export default function ProtectedPages() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
}
