import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/index.scss";
import Providers from "@/components/Providers";
import AuthWrapper from "@/components/AuthWrapper";
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage";
import Modal from "@/components/Modal/Modal";

// Self-hosted (latin subset from Google Fonts, SIL OFL) so builds never hit the network.
const archivo = localFont({
  src: [
    { path: "./fonts/archivo-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/archivo-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-archivo",
});

const firaSans = localFont({
  src: "./fonts/fira-sans-400.woff2",
  weight: "400",
  variable: "--font-fira-sans",
});

const workSans = localFont({
  src: "./fonts/work-sans-500.woff2",
  weight: "500",
  variable: "--font-work-sans",
});

const montserrat = localFont({
  src: "./fonts/montserrat-400.woff2",
  weight: "400",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "WatchBook",
  description: "Your personal movie and TV show collection",
};

// Add Material Icons link to head
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${firaSans.variable} ${workSans.variable} ${montserrat.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={firaSans.className}>
        <Providers>
          <AuthWrapper>{children}</AuthWrapper>
          <NotificationMessage />
          <Modal />
        </Providers>
      </body>
    </html>
  );
}
