import { type AppType } from "next/app";
import { Abril_Fatface, Montserrat } from "next/font/google";
import Head from "next/head";
import { GoogleAnalytics } from "nextjs-google-analytics";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

import { MeniContextProvider } from "~/context/meniContext";
import "~/styles/globals.css";
import { api } from "~/utils/api";

import Feedback from "~/components/feedback";

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abril",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  //weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-mont",
  display: "swap",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title className="text-bold">Meni</title>
      </Head>
      <main
        className={`min-h-screen bg-backdrop text-white ${abrilFatface.variable} font-serif ${montserrat.variable} font-sans`}
      >
        <GoogleAnalytics trackPageViews />
        <ClerkProvider {...pageProps}>
          <MeniContextProvider>
            <Component {...pageProps} />
            <Analytics />
            <Feedback />
          </MeniContextProvider>
        </ClerkProvider>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
