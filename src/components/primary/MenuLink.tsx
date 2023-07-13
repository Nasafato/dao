import { MenuStyle, background, border } from "@/styles";
import Link from "next/link";
import type { LinkWithChildren } from "@/types";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { useLocale } from "@/components/IntlProvider";

const menuStyle = MenuStyle();

export function MenuLink({ link }: { link: LinkWithChildren }) {
  const pathname = usePathname();
  const locale = useLocale();
  return (
    <Menu as="div" className="relative">
      <Menu.Button className={menuStyle.button()}>
        <div className="flex items-center text gap-x-1">
          {link.name}
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </Menu.Button>
      <Menu.Items className={menuStyle.items()}>
        <ul>
          {link.children.map((c) => {
            const isActive = pathname?.includes(c.href);
            return (
              <Menu.Item
                key={c.href}
                href={`/${locale}/${c.href}`}
                as={Link}
                className={twJoin(
                  menuStyle.item(),
                  isActive && menuStyle.activeItem()
                )}
              >
                {c.name}
              </Menu.Item>
            );
          })}
        </ul>
      </Menu.Items>
    </Menu>
  );
}
