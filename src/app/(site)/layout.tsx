import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/product/CompareBar";
import { HelpCallButton } from "@/components/layout/HelpCallButton";

// Marketing / storefront chrome. CRM and admin live outside this group and
// therefore render without the navbar, footer or help button.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
      <HelpCallButton />
    </div>
  );
}
