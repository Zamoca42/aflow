"use client";

import { AppBreadcrumb } from "@/component/header/app-breadcumb";
import { usePathname } from "next/navigation";

interface AppDocsProps {
  children: React.ReactNode;
}

export function AppDocs({ children }: AppDocsProps) {
  const pathname = usePathname();
  const breadcrumbItems = pathname
    .split("/")
    .filter(Boolean)
    .map((path) => path.charAt(0).toUpperCase() + path.slice(1));

  return (
    <div className="main-container">
      <header className="header-container">
        <div className="component-menu">
          <AppBreadcrumb items={breadcrumbItems} />
        </div>
      </header>
      <div className="content-container">{children}</div>
    </div>
  );
}
