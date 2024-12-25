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
import { Fragment } from "react";

export function AppBreadcrumb({ items }: { items: string[] }) {
  return (
    <>
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLastItem = index === items.length - 1;
            return (
              <Fragment key={index}>
                <BreadcrumbItem className={isLastItem ? "" : "hidden md:block"}>
                  {isLastItem ? <BreadcrumbPage>{item}</BreadcrumbPage> : item}
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
