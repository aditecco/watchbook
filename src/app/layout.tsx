import type { Metadata } from "next";
import { Archivo, Fira_Sans, Montserrat, Work_Sans } from "next/font/google";
import "@/styles/index.scss";
import Providers from "@/components/Providers";
import AuthWrapper from "@/components/AuthWrapper";
import NotificationMessage from "@/components/NotificationMessage/NotificationMessage";
import Modal from "@/components/Modal/Modal";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-archivo",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fira-sans",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-work-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
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
