'use client';

import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/providers/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import PageTransition from "@/components/transitions/PageTransition";
import { ThemeProvider } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';
import './globals.css';

// Inter for body text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Playfair Display for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={cn(
        inter.variable, 
        playfair.variable,
        "scroll-smooth dark"
      )}
      suppressHydrationWarning
    >
      <body className={cn(
        "min-h-screen font-sans antialiased",
        "bg-background text-foreground",
        "selection:bg-brand-800 selection:text-brand-50",
        inter.variable
      )}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {/* Background gradient effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-background via-background/80 to-brand-900/30" />
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.04]" />
            <div className="relative">
              <AuthProvider>
                <CartProvider>
                  <ToastProvider />
                  <Navbar />
                  <main className="flex-1">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <Footer />
                </CartProvider>
              </AuthProvider>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
