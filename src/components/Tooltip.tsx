import * as RadixTooltip from "@radix-ui/react-tooltip";
import { TooltipStyle } from "../styles";
import { twJoin } from "tailwind-merge";

export function Tooltip({
  anchor,
  content,
  side,
}: {
  anchor: React.ReactNode;
  content: React.ReactNode;
  side: "top" | "bottom";
}) {
  return (
    <RadixTooltip.Root>
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
