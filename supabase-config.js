/* =========================================================
   IOIS PLATFORM
   SUPABASE CONFIGURATION
   FINAL PRODUCTION CLIENT
   =========================================================

   IOIS:
   Indian Online Income Supporting System

   IMPORTANT SECURITY RULES:
   ---------------------------------------------------------
   1. This file uses ONLY the public/publishable Supabase key.
   2. NEVER put a Supabase service-role/secret key here.
   3. NEVER put the Telegram Bot Token here.
   4. RLS + database authorization remain the real security.
   5. This is the SINGLE frontend Supabase client for IOIS.
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. IOIS SUPABASE PROJECT
       ===================================================== */

    const SUPABASE_URL =
        "https://hrvwzviprlnpkhrgzdrc.supabase.co";


    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_tXoFuC0rz0JeDOQvmpjz7w_ZAJhKOVF";


    /* =====================================================
       2. IOIS PLATFORM INFORMATION
       ===================================================== */

    const IOIS_PLATFORM_CONFIG = {

        platformName:
            "IOIS PLATFORM",

        fullName:
            "Indian Online Income Supporting System",

        tagline:
            "बदलते भारत की शान",

        whatsapp:
            "+918877490845",

        email:
            "ioisplatform@gmail.com",

        paymentUPI:
            "8877490845@spicepay",

        paymentName:
            "Vikas Kumar",

        registrationPage:
            "register.html",

        loginPage:
            "login.html",

        dashboardPage:
            "dashboard.html",

        adminPage:
            "admin.html",

        paymentPage:
            "payment.html",

        idCardPage:
            "idcard.html",

        certificatePage:
            "certificate.html"

    };


    /* =====================================================
       3. SUPABASE CDN CHECK
       ===================================================== */

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.error(
            "IOIS ERROR: Supabase JavaScript library is not loaded."
        );

        window.IOIS_SUPABASE_ERROR =
            "Supabase JavaScript library is not loaded.";

        return;

    }


    /* =====================================================
       4. CREATE SINGLE SUPABASE CLIENT
       ===================================================== */

    let client = null;


    try {

        client =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY,
                {
                    auth: {

                        persistSession:
                            true,

                        autoRefreshToken:
                            true,

                        detectSessionInUrl:
                            true,

                        storage:
                            window.localStorage,

                        storageKey:
                            "iois-supabase-auth"

                    },

                    global: {

                        headers: {

                            "x-application-name":
                                "IOIS-PLATFORM"

                        }

                    }

                }
            );


    } catch (error) {

        console.error(
            "IOIS Supabase client initialization failed:",
            error
        );

        window.IOIS_SUPABASE_ERROR =
            error.message ||
            "Supabase initialization failed.";

        return;

    }


    /* =====================================================
       5. GLOBAL CLIENT
       ===================================================== */

    /*
     * Main IOIS client.
     */
    window.ioisSupabase =
        client;


    /*
     * Compatibility name used by some older
     * IOIS scripts.
     */
    window.supabaseClient =
        client;


    /*
     * Compatibility object used by old config.js.
     */
    window.IOIS_CONFIG = {

        SUPABASE_URL:
            SUPABASE_URL,

        SUPABASE_PUBLISHABLE_KEY:
            SUPABASE_PUBLISHABLE_KEY,

        SUPABASE_ANON_KEY:
            SUPABASE_PUBLISHABLE_KEY,

        platformName:
            IOIS_PLATFORM_CONFIG.platformName,

        fullName:
            IOIS_PLATFORM_CONFIG.fullName,

        tagline:
            IOIS_PLATFORM_CONFIG.tagline,

        whatsapp:
            IOIS_PLATFORM_CONFIG.whatsapp,

        email:
            IOIS_PLATFORM_CONFIG.email,

        paymentUPI:
            IOIS_PLATFORM_CONFIG.paymentUPI,

        paymentName:
            IOIS_PLATFORM_CONFIG.paymentName,

        registrationPage:
            IOIS_PLATFORM_CONFIG.registrationPage,

        loginPage:
            IOIS_PLATFORM_CONFIG.loginPage,

        dashboardPage:
            IOIS_PLATFORM_CONFIG.dashboardPage,

        adminPage:
            IOIS_PLATFORM_CONFIG.adminPage,

        paymentPage:
            IOIS_PLATFORM_CONFIG.paymentPage,

        idCardPage:
            IOIS_PLATFORM_CONFIG.idCardPage,

        certificatePage:
            IOIS_PLATFORM_CONFIG.certificatePage

    };


    /*
     * Compatibility constants.
     */
    window.IOIS_SUPABASE_URL =
        SUPABASE_URL;

    window.IOIS_SUPABASE_ANON_KEY =
        SUPABASE_PUBLISHABLE_KEY;


    window.IOIS_SUPABASE_PUBLISHABLE_KEY =
        SUPABASE_PUBLISHABLE_KEY;


    /* =====================================================
       6. CONFIGURATION STATUS
       ===================================================== */

    window.ioisSupabaseConfigured =
        function () {

            return Boolean(
                window.ioisSupabase &&
                SUPABASE_URL &&
                SUPABASE_PUBLISHABLE_KEY
            );

        };


    /* =====================================================
       7. CURRENT SESSION
       ===================================================== */

    window.ioisGetSession =
        async function () {

            if (!window.ioisSupabase) {

                return {

                    session:
                        null,

                    error:
                        new Error(
                            "Supabase client unavailable."
                        )

                };

            }


            try {

                const {
                    data,
                    error
                } =
                    await window.ioisSupabase
                        .auth
                        .getSession();


                return {

                    session:
                        data?.session ||
                        null,

                    error:
                        error ||
                        null

                };


            } catch (error) {

                return {

                    session:
                        null,

                    error:
                        error

                };

            }

        };


    /* =====================================================
       8. CURRENT USER
       ===================================================== */

    window.ioisGetUser =
        async function () {

            if (!window.ioisSupabase) {

                return {

                    user:
                        null,

                    error:
                        new Error(
                            "Supabase client unavailable."
                        )

                };

            }


            try {

                const {
                    data,
                    error
                } =
                    await window.ioisSupabase
                        .auth
                        .getUser();


                return {

                    user:
                        data?.user ||
                        null,

                    error:
                        error ||
                        null

                };


            } catch (error) {

                return {

                    user:
                        null,

                    error:
                        error

                };

            }

        };


    /* =====================================================
       9. LOGOUT
       ===================================================== */

    window.ioisLogout =
        async function () {

            if (!window.ioisSupabase) {

                return {

                    success:
                        false,

                    error:
                        new Error(
                            "Supabase client unavailable."
                        )

                };

            }


            try {

                const {
                    error
                } =
                    await window.ioisSupabase
                        .auth
                        .signOut();


                if (error) {

                    return {

                        success:
                            false,

                        error:
                            error

                    };

                }


                return {

                    success:
                        true,

                    error:
                        null

                };


            } catch (error) {

                return {

                    success:
                        false,

                    error:
                        error

                };

            }

        };


    /* =====================================================
       10. AUTH STATE HELPER
       ===================================================== */

    window.ioisOnAuthStateChange =
        function (callback) {

            if (
                !window.ioisSupabase ||
                !window.ioisSupabase.auth
            ) {

                return null;

            }


            return window.ioisSupabase
                .auth
                .onAuthStateChange(
                    callback
                );

        };


    /* =====================================================
       11. GLOBAL IOIS CONFIG
       ===================================================== */

    window.IOIS_PLATFORM_CONFIG =
        Object.freeze(
            IOIS_PLATFORM_CONFIG
        );


    /* =====================================================
       12. SECURITY INFORMATION
       ===================================================== */

    /*
     * These values are intentionally NOT present:
     *
     * - service_role key
     * - secret key
     * - Telegram bot token
     * - private API credentials
     *
     * Telegram notifications will be handled later
     * through a secure Supabase Edge Function.
     */


    /* =====================================================
       13. READY EVENT
       ===================================================== */

    window.IOIS_SUPABASE_READY =
        true;


    document.dispatchEvent(
        new CustomEvent(
            "iois-supabase-ready",
            {
                detail: {
                    client:
                        window.ioisSupabase
                }
            }
        )
    );


    document.dispatchEvent(
        new Event(
            "iois-ready"
        )
    );


    /* =====================================================
       14. DEVELOPMENT STATUS
       ===================================================== */

    console.log(
        "IOIS Supabase client initialized successfully."
    );


})();
