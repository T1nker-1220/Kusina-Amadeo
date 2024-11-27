'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { toast } from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Optimize scroll listener with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/auth/login' });
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const profileLinks = session ? [
    { href: '/profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
    { href: '/orders', label: 'Orders', icon: <ShoppingBagIcon className="w-4 h-4" /> },
    ...(session.user?.role === 'admin' ? [{
      href: '/admin',
      label: 'Admin Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v11.5A2.25 2.25 0 0115.75 18H4.25A2.25 2.25 0 012 15.75V4.25zm13.5 1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-8 1.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zm4 1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V8.75z" clipRule="evenodd" />
        </svg>
      ),
      className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
    }] : []),
    { 
      onClick: handleSignOut, 
      label: 'Logout',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
        </svg>
      ),
      className: "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
    }
  ] : [
    { 
      href: '/auth/login', 
      label: 'Login',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
        </svg>
      ),
      className: "text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
    }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          "fixed w-full z-50",
          "transition-all duration-300",
          isScrolled 
            ? "bg-background/95 dark:bg-background/90 backdrop-blur-md shadow-lg border-b border-brand-200/50 dark:border-brand-800/50 py-1"
            : "bg-transparent py-2",
          isMobileMenuOpen && "bg-background dark:bg-background"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <nav className="relative flex items-center justify-between h-12">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 flex items-center"
              initial={false}
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="relative flex items-center space-x-3">
                <div className="relative w-[40px] h-[40px] sm:w-[45px] sm:h-[45px]">
                  <Image
                    src="/images/logo.png"
                    alt="Kusina Amadeo"
                    fill
                    className={cn(
                      "object-contain transition-all duration-300",
                      isScrolled ? "filter brightness-90" : "filter brightness-100"
                    )}
                    priority
                    sizes="(max-width: 640px) 40px, 45px"
                  />
                </div>
                <div className={cn(
                  "hidden sm:block font-display transition-all duration-300",
                  isScrolled ? "text-lg" : "text-xl"
                )}>
                  <h1 className="font-bold text-brand-700 dark:text-brand-300">
                    Kusina
                    <span className="text-brand-500 dark:text-brand-400"> De </span>
                    Amadeo
                  </h1>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex md:items-center md:space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative py-1.5 text-sm font-medium",
                    "text-brand-600 dark:text-brand-400",
                    "hover:text-brand-800 dark:hover:text-brand-300",
                    "transition-colors duration-200",
                    pathname === href && "text-brand-800 dark:text-brand-200",
                    "group"
                  )}
                >
                  {label}
                  {pathname === href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 dark:bg-brand-400"
                      layoutId="navbar-indicator"
                    />
                  )}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-brand-500/0 group-hover:bg-brand-500/50 dark:group-hover:bg-brand-400/50 transition-colors" />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Cart */}
              <Link
                href="/cart"
                className={cn(
                  "relative p-1.5 rounded-full",
                  "text-brand-600 dark:text-brand-400",
                  "hover:text-brand-800 dark:hover:text-brand-300",
                  "transition-colors duration-200"
                )}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>

              {/* Profile Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="relative p-1.5 rounded-full text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  <UserIcon className="w-6 h-6" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-brand-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-brand-100 dark:divide-brand-800">
                    <div className="px-1 py-1">
                      {profileLinks.slice(0, -1).map((item) => (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={cn(
                                "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                active
                                  ? "bg-brand-50 dark:bg-brand-800 text-brand-900 dark:text-brand-100"
                                  : "text-brand-700 dark:text-brand-300"
                              )}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          session ? (
                            <button
                              onClick={handleSignOut}
                              className={cn(
                                "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                active
                                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                  : "text-red-600 dark:text-red-400"
                              )}
                            >
                              {profileLinks[profileLinks.length - 1].icon}
                              {profileLinks[profileLinks.length - 1].label}
                            </button>
                          ) : (
                            <Link
                              href="/auth/login"
                              className={cn(
                                "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                active
                                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                  : "text-primary-600 dark:text-primary-400"
                              )}
                            >
                              {profileLinks[0].icon}
                              {profileLinks[0].label}
                            </Link>
                          )
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "md:hidden p-1.5 rounded-full",
                  "text-brand-600 dark:text-brand-400",
                  "hover:bg-brand-100 dark:hover:bg-brand-800",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-brand-500"
                )}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-x-0 top-[3.5rem] z-40",
              "bg-background/95 dark:bg-background/90 backdrop-blur-md",
              "border-b border-brand-200/50 dark:border-brand-800/50",
              "md:hidden"
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "block px-3 py-1.5 rounded-lg text-sm font-medium",
                    "text-brand-600 dark:text-brand-400",
                    "hover:bg-brand-100 dark:hover:bg-brand-800",
                    "transition-colors duration-200",
                    pathname === href && "bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
