/* =========================================================
   IOIS PLATFORM — UNIFIED FRONTEND CONFIGURATION
   
   ✅ Single source of truth for all frontend settings
   ✅ Public configuration only (Supabase ANON key)
   ✅ Never put service_role keys or secrets here
   
   Last Updated: 2026-08-14
========================================================= */

window.IOIS_CONFIG = {
    // Brand Information
    brand: "IOIS PLATFORM",
    fullName: "Indian Online Income Supporting System",
    
    // Supabase Configuration
    SUPABASE_URL: "https://hrvwzviprlnpkhrgzdrc.supabase.co",
    SUPABASE_PUBLISHABLE_KEY: "sb_publishable_tXoFuC0rz0JeDOQvmpjz7w_ZAJhKOVF",
    
    // Contact & Payment Information (Public)
    paymentUPI: "8877490845@spicepay",
    paymentName: "Vikas Kumar",
    whatsapp: "+918877490845",
    email: "ioisplatform@gmail.com",
    
    // Page Routes
    registrationPage: "register.html",
    loginPage: "login.html",
    dashboardPage: "dashboard.html",
    
    // Membership Plans - SINGLE SOURCE OF TRUTH
    plans: [
        { id: "starter", name: "Starter", display: "Alpha Starter Pass", price: 10, payout: 7, color: "amber", features: ["Digital ID Pass", "3 CV Templates", "2 Cover Letters", "10 ChatGPT Prompts", "Useful Website Links"] },
        { id: "basic", name: "Basic", display: "Nexus Pro Creator Kit", price: 49, payout: 35, color: "amber", features: ["Pro Creator Badge", "15+ Bio-data", "50+ Social Posts", "Smartphone Website Guide"] },
        { id: "plus", name: "Plus", display: "Apex Executive Pass", price: 99, payout: 70, color: "teal", features: ["Executive Business Pass", "100+ Branding Templates", "Logos", "Business Card Bundle"] },
        { id: "premium", name: "Premium", display: "Zenith VIP Creator", price: 199, payout: 120, color: "purple", features: ["VIP Creator Card", "Mobile Design Masterclass", "300+ Marketing Banners"] },
        { id: "pro", name: "Pro", display: "Govt Exam & Student", price: 299, payout: 220, color: "green", features: ["Student ID Card", "Govt Job Alert Sheet", "GK & Exam Notes"] },
        { id: "business", name: "Business", display: "Diamond Business Agency", price: 499, payout: 375, color: "cyan", features: ["Diamond Agency Card", "1000+ Graphic Assets", "Video Assets", "Agency Manual"] },
        { id: "enterprise", name: "Enterprise", display: "VIP Mastermind & AI", price: 999, payout: 750, color: "purple", features: ["VIP Elite Card", "ChatGPT / Canva AI Mastery", "Freelancing Blueprint"] }
    ]
};

/* =========================================================
   BACKWARD COMPATIBILITY ALIASES
   
   These ensure old code referencing different variable names
   still works without modification.
========================================================= */
window.IOIS_SUPABASE_URL = window.IOIS_CONFIG.SUPABASE_URL;
window.IOIS_SUPABASE_ANON_KEY = window.IOIS_CONFIG.SUPABASE_PUBLISHABLE_KEY;
window.IOIS_SUPABASE_CONFIG_URL = window.IOIS_CONFIG.SUPABASE_URL;
window.IOIS_SUPABASE_CONFIG_ANON_KEY = window.IOIS_CONFIG.SUPABASE_PUBLISHABLE_KEY;
