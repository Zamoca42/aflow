"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/component/ui/breadcrumb";
import { SidebarTrigger } from "@/component/ui/sidebar";
import { Separator } from "@/component/ui/separator";
import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";

export function RepoHeader() {
  const pathname = usePathname();
  const breadcrumbItems = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.slice(1).map((path) => ({
      title: path.charAt(0).toUpperCase() + path.slice(1),
    }));
  }, [pathname]);

  return (
    <>
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLastItem = index === breadcrumbItems.length - 1;
            return (
              <Fragment key={index}>
                <BreadcrumbItem className={isLastItem ? "" : "hidden md:block"}>
                  {isLastItem ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    item.title
                  )}
                </BreadcrumbItem>
                {!isLastItem && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
