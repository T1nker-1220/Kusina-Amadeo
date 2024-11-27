"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiShoppingBag, FiUsers, FiSettings, FiMenu, FiChevronLeft, FiLogOut } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/admin" },
    { icon: FiShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: FiUsers, label: "Customers", href: "/admin/customers" },
    { icon: FiMenu, label: "Products", href: "/admin/products" },
    { icon: FiSettings, label: "Settings", href: "/admin/settings" },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }
    },
    collapsed: {
      width: "5rem",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className={cn(
        "relative bg-gradient-to-b from-[#1F1B1A] to-[#2D2826]",
        "border-r border-[#2D2826] min-h-screen py-6",
        "flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "items-center" : "items-stretch px-6"
      )}
    >
      <div className="mb-8">
        <h1 className={cn(
          "font-display tracking-wide text-white/90 font-semibold transition-all duration-300",
          "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent",
          "drop-shadow-sm hover:drop-shadow-md",
          isCollapsed ? "text-sm" : "text-2xl text-center"
        )}>
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <motion.li
              key={item.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:shadow-md",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#2D2826] to-[#3D3835] text-white font-medium shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-[#2D2826]"
                )}
              >
                <item.icon className={cn("flex-shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className={cn(
            "flex items-center space-x-2 w-full px-4 py-3 rounded-lg transition-colors",
            "text-red-400 hover:bg-red-900/20"
          )}
        >
          <FiLogOut className={cn("flex-shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {!isMobile && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors",
              "text-white/70 hover:text-white hover:bg-[#2D2826]"
            )}
          >
            <FiChevronLeft
              className={cn(
                "flex-shrink-0 transition-transform duration-300",
                isCollapsed ? "rotate-180" : ""
              )}
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}
