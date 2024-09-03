import MobileNav from "@/components/fragments/MobileNav";
import Sidebar from "@/components/fragments/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          {/* <Image src="/icons/logo.svg" alt="logo" width={30} height={30} /> */}
          <div className="pt-4 px-4">
            <MobileNav />
          </div>
        </div>
        {children}
      </div>
      {/* {children} */}
    </main>
  );
}
