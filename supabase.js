/* =========================================================
   IOIS PLATFORM
   SUPABASE.JS
   FINAL SUPABASE LOADER
   ========================================================= */

(function () {

    "use strict";

    /*
     * Prevent this loader from creating multiple
     * Supabase clients.
     */

    if (window.IOIS_SUPABASE_LOADER_STARTED) {
        return;
    }

    window.IOIS_SUPABASE_LOADER_STARTED = true;


    /*
     * Supabase CDN
     */

    const SUPABASE_CDN =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


    /*
     * Load Supabase library only when it is
     * not already available.
     */

    function loadSupabaseLibrary() {

        return new Promise(function (resolve, reject) {

            if (
                window.supabase &&
                typeof window.supabase.createClient === "function"
            ) {

                resolve();

                return;
            }


            const existingScript =
                document.querySelector(
                    'script[src*="@supabase/supabase-js"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    function () {
                        resolve();
                    },
                    { once: true }
                );


                existingScript.addEventListener(
                    "error",
                    function () {
                        reject(
                            new Error(
                                "Supabase library failed to load."
                            )
                        );
                    },
                    { once: true }
                );

                return;
            }


            const script =
                document.createElement("script");


            script.src =
                SUPABASE_CDN;

            script.async =
                true;


            script.onload =
                function () {

                    if (
                        window.supabase &&
                        typeof window.supabase.createClient ===
                        "function"
                    ) {

                        resolve();

                    } else {

                        reject(
                            new Error(
                                "Supabase library loaded but createClient is unavailable."
                            )
                        );

                    }

                };


            script.onerror =
                function () {

                    reject(
                        new Error(
                            "Unable to load Supabase JavaScript library."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        });

    }


    /*
     * Initialize the single IOIS Supabase client.
     */

    async function initializeIOISSupabase() {

        try {

            await loadSupabaseLibrary();


            /*
             * supabase-config.js must provide
             * window.ioisSupabase.
             */

            if (
                window.ioisSupabase &&
                typeof window.ioisSupabase.auth ===
                "object"
            ) {

                window.supabaseClient =
                    window.ioisSupabase;


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


                return window.ioisSupabase;
            }


            /*
             * Compatibility fallback.
             *
             * This is used only if an older IOIS page
             * loads supabase.js before supabase-config.js.
             */

            const config =
                window.IOIS_CONFIG;


            if (
                !config ||
                !config.SUPABASE_URL ||
                !(
                    config.SUPABASE_PUBLISHABLE_KEY ||
                    config.SUPABASE_ANON_KEY
                )
            ) {

                throw new Error(
                    "IOIS Supabase configuration is unavailable."
                );

            }


            const key =
                config.SUPABASE_PUBLISHABLE_KEY ||
                config.SUPABASE_ANON_KEY;


            /*
             * Create client only if one does not
             * already exist.
             */

            if (
                !window.ioisSupabase
            ) {

                window.ioisSupabase =
                    window.supabase.createClient(
                        config.SUPABASE_URL,
                        key,
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

            }


            /*
             * Compatibility references.
             */

            window.supabaseClient =
                window.ioisSupabase;


            window.IOIS_SUPABASE_READY =
                true;


            /*
             * Tell the rest of IOIS that Supabase
             * is ready.
             */

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


            console.log(
                "IOIS Supabase initialized successfully."
            );


            return window.ioisSupabase;


        } catch (error) {

            window.IOIS_SUPABASE_READY =
                false;

            window.IOIS_SUPABASE_ERROR =
                error;


            console.error(
                "IOIS Supabase initialization error:",
                error
            );


            document.dispatchEvent(
                new CustomEvent(
                    "iois-supabase-error",
                    {
                        detail: {
                            error:
                                error
                        }
                    }
                )
            );


            return null;

        }

    }


    /*
     * Public initialization function.
     */

    window.initializeIOISSupabase =
        initializeIOISSupabase;


    /*
     * Start initialization.
     */

    initializeIOISSupabase();


})();
