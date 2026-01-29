import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import CountrySelectorModal from "@/components/layout/CountrySelectorModal";
import { CookieConsent } from "@/components/CookieConsent";
import { headers } from "next/headers";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const detectedCountry = headersList.get('x-detected-country') || 'FR';
    const detectedCity = headersList.get('x-detected-city') || '';

    return (
        <>
            <Header />
            <CountrySelectorModal detectedCountry={detectedCountry} />
            <CookieConsent />
            <main className="flex-1 px-4">{children}</main>
            <Footer detectedCountry={detectedCountry} detectedCity={detectedCity} />
            <StickyMobileCTA />
        </>
    );
}
