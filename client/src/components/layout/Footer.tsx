import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

const footerLinks = {
  platform: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Deal Finder", href: "/deals" },
    { name: "Groceries", href: "/groceries" },
    { name: "Utilities", href: "/utilities" },
    { name: "AI Coach", href: "/coach" },
  ],
  community: [
    { name: "Forum", href: "/community" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Referrals", href: "/referrals" },
    { name: "Rewards", href: "/rewards" },
  ],
  resources: [
    { name: "Pricing", href: "/pricing" },
    { name: "Fuel Prices", href: "/fuel" },
    { name: "Rebates", href: "/rebates" },
    { name: "For Investors", href: "/investors" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/settings" },
    { name: "Terms of Service", href: "/settings" },
  ],
};

export function Footer() {
  return (
    <footer className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-4">
            <motion.img
              src={perthSaverLogo}
              alt="Perth Saver"
              className="w-16 h-16 perth-saver-logo"
              data-testid="logo-footer-main"
            />
            <div>
              <h3 className="text-2xl font-display font-bold">
                <span className="text-white">Start saving</span>{" "}
                <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">today</span>
              </h3>
              <p className="text-white/40 text-sm">Join thousands of Perth families saving $15K-25K annually</p>
            </div>
          </div>
          <Link href="/auth">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <motion.img
                src={perthSaverLogo}
                alt="Perth Saver"
                className="w-10 h-10 perth-saver-logo"
                data-testid="logo-footer-small"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Perth</span>
                  <span className="bg-gradient-to-r from-blue-400 via-amber-400 to-blue-500 bg-clip-text text-transparent">Saver</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-white/40 font-medium">Smart Savings AI</span>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              AI-powered savings platform for Perth families.
            </p>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-white/30">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400/50" />
                <span>Perth, Western Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400/50" />
                <span>hello@perthsaver.com.au</span>
              </div>
            </div>
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} Perth Saver. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
