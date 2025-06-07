import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AdminAppsidebar from "./admin-app-sidebar";
import AdminAppNavbar from "./admin-app-navbar";
import RouteLoader from "@/utils/route-loader";
const AdminRootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main className="flex h-screen w-full overflow-hidden">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminAppsidebar />
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <AdminAppNavbar />
          <div className="flex-1 overflow-y-auto px-4">
            <RouteLoader />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default AdminRootLayout;
