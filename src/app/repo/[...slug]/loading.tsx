import { AppBreadcrumb } from "@/component/header/app-breadcumb";
import { Skeleton } from "@/component/ui/skeleton";

export function SkeletonTreeLoader() {
  return (
    <div className="space-y-2 pt-11 pb-4 px-4">
      <Skeleton className="h-4 w-3/4" />
      <div className="pl-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pl-4 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-3/5" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="pl-4 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="main-container">
      <header className="header-container">
        <div className="component-menu">
          <AppBreadcrumb items={[]} />
        </div>
      </header>
      <div className="content-container">
        <div className="component-content">
          <SkeletonTreeLoader />
        </div>
      </div>
    </div>
  );
}
