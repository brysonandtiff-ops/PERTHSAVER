import { motion } from "framer-motion";

const paymentMethods = [
  {
    name: "Credit & Debit Cards",
    methods: ["Visa", "Mastercard", "American Express"],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
  },
  {
    name: "Australian Banks",
    methods: ["Commonwealth Bank", "NAB", "ANZ", "Westpac"],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.5 1L2 6v2h19V6L11.5 1zM5 10v7H3v3h18v-3h-2v-7h-3v7h-3v-7H9v7H6v-7H5z"/>
      </svg>
    ),
  },
  {
    name: "Digital Wallets",
    methods: ["Apple Pay", "Google Pay", "PayPal"],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    name: "Cryptocurrency",
    methods: ["Bitcoin", "Ethereum", "USDC"],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
      </svg>
    ),
  },
];

export function PaymentOptions() {
  return (
    <div className="mt-8 sm:mt-12">
      <h3 className="text-center text-sm sm:text-base font-semibold text-white/80 mb-4 sm:mb-6">
        All Payment Methods Accepted
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {paymentMethods.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-2 text-purple-400">
              {category.icon}
            </div>
            <h4 className="text-white text-xs sm:text-sm font-medium text-center mb-2">
              {category.name}
            </h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {category.methods.map((method) => (
                <span 
                  key={method}
                  className="text-[10px] sm:text-xs text-white/60 bg-white/5 px-1.5 py-0.5 rounded"
                  data-testid={`payment-method-${method.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {method}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-white/40 mt-4">
        Secure payments powered by Stripe, PayPal & Coinbase Commerce
      </p>
    </div>
  );
}

export function PaymentMethodIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      <div className="flex items-center gap-1 text-white/50">
        <svg className="w-8 h-5" viewBox="0 0 38 24" data-testid="icon-visa">
          <rect width="38" height="24" rx="3" fill="#1434CB"/>
          <path d="M16 17H14L15.5 7H17.5L16 17ZM13 7L11 14L10.5 12C9.5 9 7 8 7 8L9 17H11.5L15.5 7H13ZM27 17L29 7H27L25.5 14L23 7H20.5L24 17H27ZM30 7L28 17H30L32 7H30Z" fill="white"/>
        </svg>
        <svg className="w-8 h-5" viewBox="0 0 38 24" data-testid="icon-mastercard">
          <rect width="38" height="24" rx="3" fill="#EB001B"/>
          <circle cx="15" cy="12" r="7" fill="#EB001B"/>
          <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
          <path d="M19 6.5C20.5 7.5 21.5 9 22 10.5C22 12 21.5 13.5 20.5 15C21.5 16.5 22 18 22 18H16C16 18 16.5 16.5 17.5 15C16.5 13.5 16 12 16 10.5C16.5 9 17.5 7.5 19 6.5Z" fill="#FF5F00"/>
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" data-testid="icon-paypal">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.82.82 0 0 1 .81-.72h6.583c2.165 0 3.743.47 4.689 1.396.892.876 1.225 2.155.988 3.798-.02.148-.042.3-.065.456-.458 2.94-2.02 4.7-4.64 5.218l-.12.024h-.042a.77.77 0 0 0-.76.628l-.84 5.32a.64.64 0 0 1-.632.537H7.076v-.04z"/>
          <path d="M19.095 7.228c-.03.21-.063.428-.1.654-.72 4.65-3.19 6.26-6.347 6.26h-1.608a.78.78 0 0 0-.77.67l-.824 5.23-.234 1.483a.41.41 0 0 0 .405.473h2.84a.684.684 0 0 0 .676-.58l.028-.147.537-3.39.035-.186a.683.683 0 0 1 .675-.577h.424c2.754 0 4.91-1.118 5.54-4.352.264-1.354.127-2.484-.57-3.28a2.793 2.793 0 0 0-.708-.558v.3z"/>
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" data-testid="icon-applepay">
          <path d="M17.72 8.2c-.1.08-1.83 1.05-1.83 3.21 0 2.5 2.19 3.38 2.25 3.4-.01.06-.35 1.2-1.15 2.36-.7.99-1.43 1.98-2.58 1.98s-1.41-.66-2.71-.66c-1.26 0-1.71.68-2.77.68s-1.75-.91-2.56-2.02C5.3 15.68 4.5 13.5 4.5 11.42c0-3.33 2.16-5.1 4.3-5.1 1.13 0 2.08.74 2.79.74.68 0 1.74-.79 3.04-.79.49 0 2.26.04 3.43 1.71l-.34.22zM14.18 4.46c.51-.61.88-1.46.88-2.31 0-.12-.01-.24-.03-.34-.84.03-1.84.56-2.44 1.26-.46.53-.91 1.38-.91 2.25 0 .13.02.27.03.31.05.01.14.02.22.02.76 0 1.69-.51 2.25-1.19z"/>
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" data-testid="icon-googlepay">
          <path d="M12.05 10.72v2.84h4.08c-.17 1.04-.64 1.92-1.35 2.49l2.18 1.69c1.27-1.17 2-2.9 2-4.94 0-.48-.04-.94-.12-1.38h-6.79v-.7z"/>
          <path d="M12.05 19.13c2.43 0 4.48-.8 5.97-2.18l-2.18-1.69c-.81.54-1.84.87-3.79.87-2.11 0-3.9-1.42-4.54-3.33H5.2v1.74c1.48 2.93 4.5 4.59 6.85 4.59z"/>
          <path d="M7.51 12.8c-.16-.48-.25-.99-.25-1.52s.09-1.04.25-1.52V8.02H5.2c-.56 1.11-.87 2.36-.87 3.68s.31 2.57.87 3.68l2.31-1.58z"/>
          <path d="M12.05 7.37c1.22 0 2.32.42 3.18 1.24l2.37-2.37c-1.44-1.34-3.32-2.16-5.55-2.16-2.35 0-5.37 1.66-6.85 4.59l2.31 1.74c.64-1.91 2.43-3.04 4.54-3.04z"/>
        </svg>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" data-testid="icon-bitcoin">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
        </svg>
      </div>
    </div>
  );
}
