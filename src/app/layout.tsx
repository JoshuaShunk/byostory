import "@/styles/global.css";

import type { Metadata } from "next";

import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import ClientLayout from "@/components/clientLayout";

import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Build Your Own Story",
  description: "Use LLM to generate your own build your own story.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <ClientLayout>
              <MarginWidthWrapper>
                <PageWrapper>
                  {children}
                  <SpeedInsights />
                  <Analytics />
                </PageWrapper>
              </MarginWidthWrapper>
            </ClientLayout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
