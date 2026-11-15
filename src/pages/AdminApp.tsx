import AdminDashboard from "@/admin/App";
import adminGlobal from "@/admin/styles/admin-global.css?inline";
import adminLogin from "@/admin/styles/login.css?inline";
import adminTables from "@/admin/styles/tables.css?inline";
import adminModals from "@/admin/styles/modals.css?inline";
import adminPartners from "@/admin/styles/partners.css?inline";
import adminResponsive from "@/admin/styles/responsive.css?inline";
import { useEffect } from "react";

const adminCss = [adminGlobal, adminLogin, adminTables, adminModals, adminPartners, adminResponsive].join("\n");

export default function AdminApp() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-admin-styles", "");
    style.textContent = adminCss;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);
  return <AdminDashboard />;
}
