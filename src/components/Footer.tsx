import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { href: '/menu', label: 'Menu' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/order', label: 'Order Now' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

const Footer = () => {
  return (
    <footer className="relative mt-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 gradient-dark opacity-95" />
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 mix-blend-soft-light" style={{ backgroundSize: '100px' }} />
      
      <div className="relative">
        {/* Top Border Gradient */}
        <div className="absolute top-0 left-0 right-0 h-px gradient-accent opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Mobile Accordion Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className={cn(
                  "text-2xl md:text-3xl",
                  "font-display font-bold",
                  "bg-gradient-to-r from-brand-400 to-brand-300",
                  "bg-clip-text text-transparent"
                )}>
                  Kusina De Amadeo
                </h3>
                <p className="text-brand-300/90 leading-relaxed text-sm md:text-base">
                  Authentic Filipino cuisine served with love and tradition since 2022.
                </p>
                {/* Social Links */}
                <div className="flex gap-4 pt-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="text-brand-400 hover:text-brand-300 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Links Section */}
            <div className="space-y-6">
              <h4 className={cn(
                "text-lg font-semibold",
                "text-brand-200"
              )}>
                Quick Links
              </h4>
              <ul className="space-y-3 grid grid-cols-2 md:grid-cols-1">
                {footerLinks[0].links.map((link) => (
                  <motion.li 
                    key={link.href}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Link 
                      href={link.href} 
                      className={cn(
                        "group flex items-center gap-2",
                        "text-brand-400/90 hover:text-brand-300",
                        "transition-colors duration-200",
                        "text-sm md:text-base"
                      )}
                    >
                      <span className={cn(
                        "h-px w-4",
                        "bg-brand-600 group-hover:bg-brand-500",
                        "transition-colors duration-200"
                      )} />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <h4 className={cn(
                "text-lg font-semibold",
                "text-brand-200"
              )}>
                Contact Us
              </h4>
              <ul className="space-y-4">
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3 text-sm md:text-base"
                >
                  <MapPin className="w-5 h-5 text-brand-300 flex-shrink-0 mt-1" />
                  <span className="text-brand-400/90">
                    107 i Purok 4 Dagatan, Amadeo, Cavite
                  </span>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 text-sm md:text-base"
                >
                  <Phone className="w-5 h-5 text-brand-300 flex-shrink-0" />
                  <div className="text-brand-400/90">
                    <div>+63 960 508 8715</div>
                    <div>(046) 890-9060</div>
                  </div>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 text-sm md:text-base"
                >
                  <Mail className="w-5 h-5 text-brand-300 flex-shrink-0" />
                  <a 
                    href="mailto:marquezjohnnathanieljade@gmail.com" 
                    className="text-brand-400/90 hover:text-brand-300 transition-colors"
                  >
                    marquezjohnnathanieljade@gmail.com
                  </a>
                </motion.li>
              </ul>
            </div>

            {/* Hours Section */}
            <div className="space-y-6">
              <h4 className={cn(
                "text-lg font-semibold",
                "text-brand-200"
              )}>
                Hours
              </h4>
              <ul className="space-y-4">
                <motion.li 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3 text-sm md:text-base"
                >
                  <Clock className="w-5 h-5 text-brand-300 flex-shrink-0 mt-1" />
                  <div className="text-brand-400/90">
                    <div className="font-medium">Store Hours:</div>
                    <div>Open daily 5:00 AM - 12:00 AM</div>
                    <div className="mt-2 font-medium">Delivery Hours:</div>
                    <div>8:00 AM - 10:00 PM</div>
                  </div>
                </motion.li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-brand-800/50">
            <p className="text-center text-xs md:text-sm text-brand-400/70">
              &copy; {new Date().getFullYear()} Kusina De Amadeo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
