import * as RadixTooltip from "@radix-ui/react-tooltip";
import { TooltipStyle } from "@/styles";
import { twJoin } from "tailwind-merge";

export function Tooltip({
  anchor,
  content,
  side,
  defaultOpen,
  open,
}: {
  anchor: React.ReactNode;
  content: React.ReactNode;
  side: "top" | "bottom";
  defaultOpen?: boolean;
  open?: boolean;
}) {
  return (
    <RadixTooltip.Root defaultOpen={defaultOpen ?? false} open={open}>
      <RadixTooltip.Trigger asChild>{anchor}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={3}
          side={side}
          className={TooltipStyle().content()}
        >
          {content}
          <RadixTooltip.Arrow className={TooltipStyle().arrow()} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
