import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ishunea Shop",
  description: "Magazin online - filtre, cautare si design modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-40">
            <div className="backdrop-blur glass border-b border-white/20">
              <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                <a href="/" className="font-bold tracking-tight text-lg">
                  Ishunea <span className="text-[var(--accent)]">Shop</span>
                </a>
                <nav className="hidden sm:flex gap-6 text-sm">
                  <a href="#produse">Produse</a>
                  <a href="#filtre">Filtre</a>
                  <a href="#contact">Contact</a>
                </nav>
                <a href="#" className="btn">Contul meu</a>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="mt-16">
            {/* Newsletter */}
            <div className="mx-auto max-w-6xl px-6">
              <div className="rounded-2xl glass border border-white/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">Aboneaza-te la newsletter</h3>
                  <p className="text-sm opacity-70 mt-1 max-w-md">Promotii, noutati si recomandari. Fara spam.</p>
                </div>
                <form className="flex w-full sm:w-auto gap-2">
                  <input type="email" required placeholder="email@exemplu.com" className="searchbar flex-1 sm:w-80 bg-transparent focus:outline-none" />
                  <button type="submit" className="btn">Aboneaza-ma</button>
                </form>
              </div>
            </div>

            {/* Main footer content */}
            <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="col-span-2">
                <div className="font-bold text-lg">Ishunea Shop</div>
                <p className="text-sm opacity-70 mt-2">Creat cu drag. Inspirat de simplitate si claritate.</p>
                <div className="mt-4 text-xs opacity-70">CUI 12345678 • RO</div>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-2">Cumparaturi</div>
                <ul className="space-y-1 opacity-80">
                  <li><a href="#produse">Toate produsele</a></li>
                  <li><a href="#">Reduceri</a></li>
                  <li><a href="#">Noutati</a></li>
                  <li><a href="#">Cadouri</a></li>
                </ul>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-2">Ajutor</div>
                <ul className="space-y-1 opacity-80">
                  <li><a href="#">Livrare</a></li>
                  <li><a href="#">Retururi</a></li>
                  <li><a href="#">Garantii</a></li>
                  <li><a href="#">Intrebari frecvente</a></li>
                </ul>
              </div>

              <div className="text-sm">
                <div className="font-semibold mb-2">Companie</div>
                <ul className="space-y-1 opacity-80">
                  <li><a href="#">Despre noi</a></li>
                  <li><a href="#">Cariere</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>

              <div className="text-sm col-span-2 lg:col-span-1">
                <div className="font-semibold mb-2">Contact</div>
                <ul className="space-y-1 opacity-80">
                  <li><a href="mailto:hello@ishunea.shop">ishuneacatalog@gmail.com</a></li>
                  <li><a href="tel:+40123456789">+373-69-612-654</a></li>
                  <li>Chisinau, Moldova</li>
                </ul>
              </div>
            </div>

            {/* Payments / Trust */}
            <div className="mx-auto max-w-6xl px-6 pb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs opacity-70">
                <span className="badge">Visa</span>
                <span className="badge">Mastercard</span>
                <span className="badge">PayPal</span>
                <span className="badge">Apple Pay</span>
                <span className="badge">Google Pay</span>
                <span className="badge">Ramburs</span>
              </div>
            </div>

            {/* Legal bar */}
            <div className="border-t border-black/10 dark:border-white/10">
              <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-70">
                <div>© {new Date().getFullYear()} Ishunea Shop. Toate drepturile rezervate.</div>
                <div className="flex items-center gap-4">
                  <a href="#">Termeni</a>
                  <a href="#">Confidentialitate</a>
                  <a href="#">Cookies</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
