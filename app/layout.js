import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next Watch",
  description: "Personal movie recommender and categorization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased dark">
        {children}
      </body>
    </html>
  );
}
