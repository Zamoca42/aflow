import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/component/ui/tooltip";

interface AppTooltipProps {
  content: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function AppTooltip({ content, children, asChild }: AppTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
