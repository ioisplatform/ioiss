// =========================================================
// IOIS - SINGLE SUPABASE CLIENT
// =========================================================

(function () {
    "use strict";

    if (!window.supabase) {
        console.error("Supabase library was not loaded.");
        return;
    }

    if (!window.IOIS_CONFIG) {
        console.error("IOIS_CONFIG was not loaded.");
        return;
    }

    const { SUPABASE_URL, SUPABASE_KEY } = window.IOIS_CONFIG;

    if (
        !SUPABASE_URL ||
        !SUPABASE_KEY ||
        SUPABASE_URL.includes("YOUR_") ||
        SUPABASE_KEY.includes("YOUR_")
    ) {
        console.error("Please configure Supabase URL and public key in config.js.");
        return;
    }

    window.IOIS_SUPABASE = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );
})();
