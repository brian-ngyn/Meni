import { type AppType } from "next/app";
import { Abril_Fatface, Montserrat } from "next/font/google";
import Head from "next/head";

import { ClerkProvider } from "@clerk/nextjs";

import { MeniContextProvider } from "~/context/meniContext";
import "~/styles/globals.css";
import { api } from "~/utils/api";

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
        <ClerkProvider {...pageProps}>
          <MeniContextProvider>
            <Component {...pageProps} />
          </MeniContextProvider>
        </ClerkProvider>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
