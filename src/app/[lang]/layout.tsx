import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { inter, notoBengali, serif } from "@/lib/fonts";
import "@/app/globals.css";
import { i18n, type Locale } from "@/i18n-config";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | MIS Portal - DGHS Bangladesh",
    default: "MIS Portal | DGHS Bangladesh",
  },
  description: "Official Management Information System (MIS) Portal, Directorate General of Health Services (DGHS), Bangladesh. Monitoring national digital health transformation.",
  keywords: ["MIS", "DGHS", "Health Information System", "Bangladesh", "Digital Health"],
  authors: [{ name: "MIS DGHS" }],
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import NextTopLoader from "nextjs-toploader";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoBengali.variable} ${serif.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="grain-overlay" aria-hidden="true" />

        <NextTopLoader 
          color="#3b82f6" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
