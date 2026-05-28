import "./globals.css";

export const metadata = {
  title: "Symptom AI Classifier",
  description: "TMS4043 Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}