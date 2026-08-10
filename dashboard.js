/* =========================================================
   IOIS PLATFORM
   MEMBER DASHBOARD
   dashboard.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       GLOBAL STATE
       ===================================================== */

    let currentUser = null;
    let currentProfile = null;
    let currentMembership = null;

    let dashboardInitialized = false;


    /* =====================================================
       DOM HELPERS
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function setText(id, value) {

        const element = $(id);

        if (element) {
            element.textContent =
                value === null ||
                value === undefined ||
                value === ""
                    ? "—"
                    : value;
        }

    }


    function setValue(id, value) {

        const element = $(id);

        if (element) {
            element.value =
                value === null ||
                value === undefined
                    ? ""
                    : value;
        }

    }


    function show(id) {

        const element = $(id);

        if (element) {
            element.classList.remove("hidden");
        }

    }


    function hide(id) {

        const element = $(id);

        if (element) {
            element.classList.add("hidden");
        }

    }


    function notify(message, type = "info") {

        if (typeof window.showToast === "function") {

            window.showToast(
                message,
                type
            );

            return;
        }


        if (type === "error") {
            alert("❌ " + message);
        }

        else if (type === "success") {
            alert("✅ " + message);
        }

        else {
            alert(message);
        }

    }


    /* =====================================================
       AUTH CHECK
       ===================================================== */

    async function requireLogin() {

        if (!window.ioisSupabase) {

            notify(
                "Supabase connection उपलब्ध नहीं है।",
                "error"
            );

            return false;
        }


        const result =
            await window.ioisGetSession();


        if (
            result.error ||
            !result.session ||
            !result.session.user
        ) {

            window.location.href =
                "login.html?redirect=dashboard.html";

            return false;
        }


        currentUser =
            result.session.user;


        return true;

    }


    /* =====================================================
       LOAD PROFILE
       ===================================================== */

    async function loadProfile() {

        if (!currentUser) {
            return;
        }


        try {

            const {
                data,
                error
            } = await window.ioisSupabase
                .from("profiles")
                .select("*")
                .eq("id", currentUser.id)
                .maybeSingle();


            if (error) {

                console.error(
                    "IOIS profile error:",
                    error
                );

                return;
            }


            currentProfile = data;


            if (!currentProfile) {

                console.warn(
                    "IOIS: Profile not found."
                );

                return;
            }


            renderProfile(
                currentProfile
            );


            await loadMembership(
                currentProfile
            );


        } catch (error) {

            console.error(
                "IOIS profile loading error:",
                error
            );

        }

    }


    /* =====================================================
       RENDER PROFILE
       ===================================================== */

    function renderProfile(profile) {

        setText(
            "dashboard-name",
            profile.full_name ||
            profile.name ||
            "IOIS Member"
        );


        setText(
            "profile-name",
            profile.full_name ||
            profile.name
        );


        setText(
            "profile-email",
            profile.email ||
            currentUser?.email
        );


        setText(
            "profile-phone",
            profile.whatsapp_number ||
            profile.phone ||
            profile.mobile
        );


        setText(
            "profile-address",
            profile.address ||
            profile.full_address
        );


        setText(
            "profile-sponsor-name",
            profile.sponsor_name
        );


        setText(
            "profile-sponsor-id",
            profile.sponsor_id
        );


        setText(
            "profile-user-id",
            profile.user_id ||
            profile.unique_user_id ||
            "Generating..."
        );


        setText(
            "profile-status",
            profile.status ||
            "Active"
        );


        setValue(
            "edit-full-name",
            profile.full_name ||
            profile.name
        );


        setValue(
            "edit-phone",
            profile.whatsapp_number ||
            profile.phone
        );


        setValue(
            "edit-address",
            profile.address ||
            profile.full_address
        );


        const photo =
            profile.profile_photo_url ||
            profile.avatar_url ||
            profile.photo_url;


        if (photo) {

            const image =
                $("profile-photo");

            if (image) {
                image.src = photo;
            }


            const preview =
                $("profile-photo-preview");

            if (preview) {
                preview.src = photo;
            }

        }

    }


    /* =====================================================
       LOAD MEMBERSHIP
       ===================================================== */

    async function loadMembership(profile) {

        try {

            let query =
                window.ioisSupabase
                    .from("memberships")
                    .select("*");


            if (profile.id) {

                query =
                    query.eq(
                        "user_id",
                        profile.id
                    );

            }

            else {

                return;
            }


            const {
                data,
                error
            } = await query
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(1)
                .maybeSingle();


            if (error) {

                console.warn(
                    "Membership query:",
                    error
                );

                return;
            }


            currentMembership =
                data;


            if (currentMembership) {

                renderMembership(
                    currentMembership
                );

            }

        } catch (error) {

            console.error(
                "Membership loading error:",
                error
            );

        }

    }


    /* =====================================================
       RENDER MEMBERSHIP
       ===================================================== */

    function renderMembership(
        membership
    ) {

        setText(
            "membership-plan",
            membership.plan_name ||
            membership.plan ||
            membership.membership_name
        );


        setText(
            "membership-amount",
            membership.amount
                ? "₹" + membership.amount
                : "—"
        );


        setText(
            "membership-status",
            membership.status ||
            "Pending"
        );


        setText(
            "membership-date",
            formatDate(
                membership.created_at
            )
        );


        setText(
            "membership-payment-status",
            membership.payment_status ||
            "Pending"
        );


        setText(
            "membership-payment-id",
            membership.payment_id ||
            membership.transaction_id
        );

    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(
        value
    ) {

        if (!value) {
            return "—";
        }


        try {

            return new Date(value)
                .toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        } catch {

            return value;
        }

    }


    /* =====================================================
       REFERRAL DATA
       ===================================================== */

    async function loadReferralStats() {

        if (!currentUser) {
            return;
        }


        try {

            const {
                data,
                error
            } = await window.ioisSupabase
                .from("referrals")
                .select("*")
                .eq(
                    "referrer_id",
                    currentUser.id
                );


            if (error) {

                console.warn(
                    "Referral stats:",
                    error
                );

                return;
            }


            const referrals =
                Array.isArray(data)
                    ? data
                    : [];


            const total =
                referrals.length;


            const approved =
                referrals.filter(
                    item =>
                        String(
                            item.status || ""
                        ).toLowerCase()
                        === "approved"
                ).length;


            const pending =
                referrals.filter(
                    item =>
                        String(
                            item.status || ""
                        ).toLowerCase()
                        === "pending"
                ).length;


            const earnings =
                referrals.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.commission_amount ||
                            item.payout_amount ||
                            0
                        ),
                    0
                );


            setText(
                "referral-total",
                total
            );


            setText(
                "referral-approved",
                approved
            );


            setText(
                "referral-pending",
                pending
            );


            setText(
                "referral-earnings",
                "₹" +
                earnings.toFixed(2)
            );


            renderReferralTable(
                referrals
            );


        } catch (error) {

            console.error(
                "Referral loading error:",
                error
            );

        }

    }


    /* =====================================================
       REFERRAL TABLE
       ===================================================== */

    function renderReferralTable(
        referrals
    ) {

        const table =
            $("referral-table-body");


        if (!table) {
            return;
        }


        table.innerHTML = "";


        if (!referrals.length) {

            table.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center
                               text-gray-500
                               py-6">
                        अभी कोई referral record नहीं है।
                    </td>
                </tr>
            `;

            return;
        }


        referrals.forEach(
            referral => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td class="px-3 py-3">
                        ${
                            escapeHTML(
                                referral.member_name ||
                                referral.referred_name ||
                                "Member"
                            )
                        }
                    </td>

                    <td class="px-3 py-3">
                        ₹${
                            Number(
                                referral.amount || 0
                            ).toFixed(2)
                        }
                    </td>

                    <td class="px-3 py-3">
                        ₹${
                            Number(
                                referral.commission_amount ||
                                referral.payout_amount ||
                                0
                            ).toFixed(2)
                        }
                    </td>

                    <td class="px-3 py-3">
                        ${
                            escapeHTML(
                                referral.status ||
                                "Pending"
                            )
                        }
                    </td>

                    <td class="px-3 py-3">
                        ${
                            formatDate(
                                referral.created_at
                            )
                        }
                    </td>
                `;


                table.appendChild(row);

            }
        );

    }


    /* =====================================================
       UPDATE PROFILE
       ===================================================== */

    async function updateProfile(
        event
    ) {

        if (event) {
            event.preventDefault();
        }


        if (!currentUser) {
            notify(
                "कृपया पहले login करें।",
                "error"
            );

            return;
        }


        const fullName =
            $("edit-full-name")?.value
                ?.trim();


        const phone =
            $("edit-phone")?.value
                ?.trim();


        const address =
            $("edit-address")?.value
                ?.trim();


        if (!fullName) {

            notify(
                "पूरा नाम दर्ज करें।",
                "error"
            );

            return;
        }


        try {

            const {
                error
            } = await window.ioisSupabase
                .from("profiles")
                .update({

                    full_name:
                        fullName,

                    whatsapp_number:
                        phone,

                    address:
                        address,

                    updated_at:
                        new Date().toISOString()

                })
                .eq(
                    "id",
                    currentUser.id
                );


            if (error) {
                throw error;
            }


            notify(
                "Profile successfully update हो गई।",
                "success"
            );


            await loadProfile();


        } catch (error) {

            console.error(
                "Profile update:",
                error
            );


            notify(
                error.message ||
                "Profile update नहीं हो सकी।",
                "error"
            );

        }

    }


    /* =====================================================
       UNIQUE USER ID
       ===================================================== */

    async function copyUniqueUserId() {

        const id =
            currentProfile?.user_id ||
            currentProfile?.unique_user_id;


        if (!id) {

            notify(
                "Unique User ID उपलब्ध नहीं है।",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                id
            );


            notify(
                "Unique User ID copy हो गई।",
                "success"
            );

        } catch {

            notify(
                "ID: " + id
            );

        }

    }


    /* =====================================================
       COPY REFERRAL LINK
       ===================================================== */

    async function copyReferralLink() {

        const id =
            currentProfile?.user_id ||
            currentProfile?.unique_user_id;


        if (!id) {

            notify(
                "Referral ID उपलब्ध नहीं है।",
                "error"
            );

            return;
        }


        const url =
            window.location.origin +
            "/register.html?ref=" +
            encodeURIComponent(id);


        try {

            await navigator.clipboard.writeText(
                url
            );


            notify(
                "Referral link copy हो गया।",
                "success"
            );

        } catch {

            prompt(
                "Referral link:",
                url
            );

        }

    }


    /* =====================================================
       PASSWORD RESET
       ===================================================== */

    async function sendPasswordReset() {

        const email =
            currentProfile?.email ||
            currentUser?.email;


        if (!email) {

            notify(
                "Email उपलब्ध नहीं है।",
                "error"
            );

            return;
        }


        try {

            const {
                error
            } = await window.ioisSupabase
                .auth
                .resetPasswordForEmail(
                    email,
                    {
                        redirectTo:
                            window.location.origin +
                            "/reset-password.html"
                    }
                );


            if (error) {
                throw error;
            }


            notify(
                "Password recovery link email पर भेज दिया गया है।",
                "success"
            );


        } catch (error) {

            notify(
                error.message ||
                "Password reset request failed.",
                "error"
            );

        }

    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    async function logout() {

        const result =
            await window.ioisLogout();


        if (!result.success) {

            notify(
                result.error?.message ||
                "Logout failed.",
                "error"
            );

            return;
        }


        window.location.href =
            "login.html";

    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =====================================================
       INIT
       ===================================================== */

    async function initDashboard() {

        if (dashboardInitialized) {
            return;
        }


        dashboardInitialized = true;


        const loggedIn =
            await requireLogin();


        if (!loggedIn) {
            return;
        }


        await loadProfile();

        await loadReferralStats();


        if (
            window.ioisSupabase &&
            window.ioisSupabase.auth
        ) {

            window.ioisSupabase.auth
                .onAuthStateChange(
                    (
                        event,
                        session
                    ) => {

                        if (
                            event ===
                            "SIGNED_OUT"
                        ) {

                            window.location.href =
                                "login.html";

                        }

                        if (
                            event ===
                            "SIGNED_IN"
                        ) {

                            currentUser =
                                session?.user ||
                                null;

                        }

                    }
                );

        }

    }


    /* =====================================================
       GLOBAL API
       ===================================================== */

    window.IOISDashboard = {

        init:
            initDashboard,

        loadProfile:
            loadProfile,

        loadReferralStats:
            loadReferralStats,

        updateProfile:
            updateProfile,

        copyUniqueUserId:
            copyUniqueUserId,

        copyReferralLink:
            copyReferralLink,

        sendPasswordReset:
            sendPasswordReset,

        logout:
            logout

    };


    /* =====================================================
       AUTO INIT
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initDashboard
        );

    }

    else {

        initDashboard();

    }

})();
