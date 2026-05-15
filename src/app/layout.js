import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/Footer";
import ClientProvider from '../components/ClientProvider';

export const metadata = {
  title: "UniFind - University Lost & Found",
  description: "A community platform to report lost items, browse found materials, and reconnect with your belongings across campus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
    }}>
      <body className="min-h-full flex flex-col">
        <ClientProvider>
          <NavbarWrapper />
          {children}
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
