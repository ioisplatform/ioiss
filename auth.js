// =========================================================
// IOIS - AUTHENTICATION MANAGER
// =========================================================

(function () {
    "use strict";

    function client() {
        if (!window.IOIS_SUPABASE) {
            throw new Error("Supabase is not initialized.");
        }

        return window.IOIS_SUPABASE;
    }

    function friendlyError(error) {
        if (!error) {
            return "कुछ गलत हो गया। कृपया फिर कोशिश करें।";
        }

        const message = String(error.message || error);

        const lower = message.toLowerCase();

        if (lower.includes("invalid login credentials")) {
            return "Email या password सही नहीं है।";
        }

        if (lower.includes("email not confirmed")) {
            return "पहले अपना email verify करें।";
        }

        if (lower.includes("user already registered")) {
            return "इस email से account पहले से मौजूद है।";
        }

        if (lower.includes("password")) {
            return "Password मजबूत रखें और दोबारा प्रयास करें।";
        }

        if (lower.includes("network")) {
            return "Internet connection check करें।";
        }

        return message;
    }

    async function getUser() {
        const { data, error } = await client().auth.getUser();

        if (error) {
            return {
                user: null,
                error
            };
        }

        return {
            user: data.user,
            error: null
        };
    }

    async function getSession() {
        const { data, error } = await client().auth.getSession();

        return {
            session: data ? data.session : null,
            error
        };
    }

    async function signUp({
        fullName,
        mobile,
        email,
        password
    }) {
        const normalizedEmail = email.trim().toLowerCase();

        const { data, error } = await client().auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: {
                    full_name: fullName.trim(),
                    mobile: mobile.trim()
                }
            }
        });

        if (error) {
            return {
                success: false,
                user: null,
                session: null,
                message: friendlyError(error),
                error
            };
        }

        return {
            success: true,
            user: data.user,
            session: data.session,
            message: data.session
                ? "Registration successful."
                : "Registration successful. कृपया email verification पूरा करें।",
            error: null
        };
    }

    async function signIn(email, password) {
        const normalizedEmail = email.trim().toLowerCase();

        const { data, error } = await client().auth.signInWithPassword({
            email: normalizedEmail,
            password
        });

        if (error) {
            return {
                success: false,
                user: null,
                session: null,
                message: friendlyError(error),
                error
            };
        }

        return {
            success: true,
            user: data.user,
            session: data.session,
            message: "Login successful.",
            error: null
        };
    }

    async function signOut() {
        const { error } = await client().auth.signOut();

        return {
            success: !error,
            error,
            message: error
                ? friendlyError(error)
                : "Logout successful."
        };
    }

    async function getProfile(userId) {
        const { data, error } = await client()
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        return {
            profile: data,
            error
        };
    }

    async function updateProfile(userId, values) {
        const payload = {
            ...values,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await client()
            .from("profiles")
            .update(payload)
            .eq("id", userId)
            .select()
            .single();

        return {
            profile: data,
            error,
            success: !error
        };
    }

    window.IOIS_AUTH = {
        getUser,
        getSession,
        signUp,
        signIn,
        signOut,
        getProfile,
        updateProfile,
        friendlyError
    };
})();
