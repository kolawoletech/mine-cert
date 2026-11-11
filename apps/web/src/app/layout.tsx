import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MineCert | Equipment assurance",
  description:
    "A clearer view of equipment records, technical documents and certification workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <body>{children}</body>
    </html>
  );
}
