"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaToolbox, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export const sidebarLinks = [
  {
    imgURL: <FaHome />,
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    imgURL: <FaToolbox />,
    route: "/products",
    label: "Produk",
  },
  {
    imgURL: <FaUser />,
    route: "/customers",
    label: "Pelanggan",
  },
];

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <GiHamburgerMenu className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-none bg-white"
          aria-describedby={undefined}
        >
          <SheetTitle>Menu</SheetTitle>
          <Link
            href="/"
            className="mb-12 cursor-pointer items-center gap-2 flex px-4"
          ></Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-3 text-white">
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.route}
                        className={cn(
                          "flex gap-3 items-center p-4 md:p-3 2xl:p-4 rounded-lg",
                          { "bg-primary": isActive }
                        )}
                      >
                        <div
                          className={cn("text-primary", {
                            "text-white": isActive,
                          })}
                        >
                          {item.imgURL}
                        </div>

                        <p
                          className={cn("text-16 font-semibold text-primary", {
                            "!text-white": isActive,
                          })}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
