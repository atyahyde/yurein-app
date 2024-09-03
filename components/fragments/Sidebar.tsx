"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaToolbox, FaUser } from "react-icons/fa";

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

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <nav className="flex flex-col gap-4">
        {/* <Link href="/" className="cursor-pointer">
          <Image
            src="/img/logo.png"
            width={300}
            height={300}
            alt="Yurein logo"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px]"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link> */}
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start",
                { "bg-primary": isActive }
              )}
            >
              <div className="relative size-6">
                <div className={cn("text-primary", { "text-white": isActive })}>
                  {item.imgURL}
                </div>
              </div>
              <p
                className={cn(
                  "text-16 font-semibold text-primary max-xl:hidden -mt-1.5",
                  { "!text-white": isActive }
                )}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default Sidebar;
