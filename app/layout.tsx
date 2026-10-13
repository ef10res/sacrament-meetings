import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    default: 'Sacrament Meetings Planner',
    template: '%s | Sacrament Meetings Planner',
  },
  description:
    'Plan, organize, and manage sacrament meetings, including hymns, prayers, announcements, and speakers.',
  applicationName: 'Sacrament Meetings Planner',
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (

    <html
      lang="en"
      className={`${montserrat.className} ${roboto.className} h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col"><Header />{children}<Footer /></body>
      
    </html>
  );
}
