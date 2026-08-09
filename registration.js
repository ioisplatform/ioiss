/* =========================================================
   IOIS PLATFORM — registration.js
   FINAL REGISTRATION SYSTEM
   =========================================================
   Works with:
   - registration.html
   - Supabase Auth
   - Supabase Database
   - Membership Plans
   - Sponsor / Referral ID
   - Unique User ID
   - Payment UPI display
   - Payment screenshot
   - Payment proof
   - Registration status
   - Telegram notification through secure Edge Function
   - Token / URL generation
   - Copy User ID / Registration URL
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIG
   ========================================================= */

const IOIS_SUPABASE_URL =
    window.IOIS_SUPABASE_URL ||
    "YOUR_SUPABASE_PROJECT_URL";

const IOIS_SUPABASE_ANON_KEY =
    window.IOIS_SUPABASE_ANON_KEY ||
    "YOUR_SUPABASE_ANON_KEY";


/* =========================================================
   2. IOIS PAYMENT / CONTACT DETAILS
   ========================================================= */

const IOIS_CONFIG = {

    platformName:
        "IOIS PLATFORM",

    fullName:
        "Indian Online Income Supporting System",

    whatsapp:
        "+918877490845",

    email:
        "ioisplatform@gmail.com",

    paymentUPI:
        "8877490845@spicepay",

    paymentName:
        "Vikas Kumar",

    /* Secure Telegram Edge Function.
       NEVER put Telegram bot token here. */

    telegramFunction:
        `${IOIS_SUPABASE_URL}/functions/v1/iois-registration-notification`,

    registrationPage:
        "registration.html",

    loginPage:
        "login.html",

    dashboardPage:
        "dashboard.html",

    idCardPage:
        "idcard.html"

};


/* =========================================================
   3. SUPABASE CLIENT
   ========================================================= */

let ioisSupabase = null;


/*
   If supabase-js is already loaded in HTML,
   create the client.
*/

function initializeIOISSupabase() {

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.error(
            "IOIS: Supabase JS library is not loaded."
        );

        showRegistrationMessage(
            "Supabase system load नहीं हुआ। कृपया page refresh करें।",
            "error"
        );

        return false;
    }

    try {

        ioisSupabase =
            window.supabase.createClient(
                IOIS_SUPABASE_URL,
                IOIS_SUPABASE_ANON_KEY
            );

        return true;

    } catch (error) {

        console.error(
            "IOIS Supabase initialization error:",
            error
        );

        return false;
    }
}


/* =========================================================
   4. DOM HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function getValue(id) {

    const element = getElement(id);

    if (!element) {
        return "";
    }

    return element.value.trim();
}


function setValue(id, value) {

    const element = getElement(id);

    if (element) {
        element.value = value || "";
    }
}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   5. REGISTRATION MESSAGE
   ========================================================= */

function showRegistrationMessage(message, type = "info") {

    let box =
        getElement("registration-message") ||
        getElement("reg-message") ||
        getElement("form-message");

    if (!box) {

        alert(message);

        return;
    }


    box.className =
        "mt-4 p-3 rounded-xl text-sm";


    if (type === "success") {

        box.classList.add(
            "bg-green-500/10",
            "border",
            "border-green-500/40",
            "text-green-300"
        );

    } else if (type === "error") {

        box.classList.add(
            "bg-red-500/10",
            "border",
            "border-red-500/40",
            "text-red-300"
        );

    } else {

        box.classList.add(
            "bg-blue-500/10",
            "border",
            "border-blue-500/40",
            "text-blue-300"
        );
    }


    box.innerHTML = escapeHTML(message);

    box.classList.remove("hidden");
}


/* =========================================================
   6. LOADING STATE
   ========================================================= */

function setRegistrationLoading(isLoading) {

    const buttons = document.querySelectorAll(
        "#reg-form button[type='submit'], " +
        "#registration-form button[type='submit'], " +
        "#register-btn, " +
        "#registration-submit"
    );


    buttons.forEach(button => {

        if (isLoading) {

            button.dataset.originalText =
                button.innerHTML;

            button.disabled = true;

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin mr-2"></i>' +
                "Processing...";

        } else {

            button.disabled = false;

            if (button.dataset.originalText) {

                button.innerHTML =
                    button.dataset.originalText;
            }
        }

    });
}


/* =========================================================
   7. VALIDATION
   ========================================================= */

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function validatePhone(phone) {

    return /^[6-9]\d{9}$/.test(phone);
}


function validatePassword(password) {

    return (
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /\d/.test(password)
    );
}


function validateUPI(upi) {

    if (!upi) {
        return false;
    }

    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/
        .test(upi);
}


/* =========================================================
   8. GET SELECTED PLAN
   ========================================================= */

function getSelectedPlan() {

    const select =
        getElement("reg-card-tier") ||
        getElement("membership-plan") ||
        getElement("reg-plan") ||
        getElement("plan");

    if (!select) {
        return null;
    }


    const option =
        select.options[
            select.selectedIndex
        ];


    if (!option) {
        return null;
    }


    const text =
        option.textContent.trim();


    const value =
        option.value.trim();


    const amountMatch =
        (text + " " + value)
            .match(/₹\s*([\d,]+)/);


    const amount =
        amountMatch
            ? Number(
                amountMatch[1]
                    .replace(/,/g, "")
            )
            : 10;


    return {

        name:
            text || value,

        code:
            value,

        amount:
            amount

    };
}


/* =========================================================
   9. PLAN DATA FALLBACK
   ========================================================= */

const IOIS_PLANS = {

    10: {
        name: "Tiranga Silver",
        code: "IOIS-SILVER-10",
        payout: 7
    },

    49: {
        name: "Tiranga Gold Pro",
        code: "IOIS-GOLD-49",
        payout: 35
    },

    99: {
        name: "Tiranga Platinum",
        code: "IOIS-PLATINUM-99",
        payout: 70
    },

    199: {
        name: "Tiranga Crystal VIP",
        code: "IOIS-CRYSTAL-199",
        payout: 120
    },

    299: {
        name: "Govt Exam Pass",
        code: "IOIS-EXAM-299",
        payout: 220
    },

    499: {
        name: "Tiranga Diamond",
        code: "IOIS-DIAMOND-499",
        payout: 375
    },

    999: {
        name:
            "VIP Mastermind Freelancing & AI Pass",
        code: "IOIS-VIP-999",
        payout: 750
    }

};


/* =========================================================
   10. UNIQUE USER ID
   ========================================================= */

function generateIOISUserID() {

    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    const timestamp =
        Date.now()
            .toString(36)
            .slice(-5)
            .toUpperCase();

    return `IOIS-${timestamp}-${random}`;
}


/* =========================================================
   11. REGISTRATION TOKEN
   ========================================================= */

function generateRegistrationToken() {

    const randomPart =
        cryptoRandomString(24);

    return `IOIS-${randomPart}`;
}


function cryptoRandomString(length) {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ" +
        "abcdefghijkmnopqrstuvwxyz" +
        "23456789";

    let result = "";


    if (
        window.crypto &&
        window.crypto.getRandomValues
    ) {

        const values =
            new Uint32Array(length);

        window.crypto.getRandomValues(values);

        for (let i = 0; i < length; i++) {

            result +=
                chars[
                    values[i] % chars.length
                ];
        }

    } else {

        for (let i = 0; i < length; i++) {

            result +=
                chars[
                    Math.floor(
                        Math.random() *
                        chars.length
                    )
                ];
        }
    }


    return result;
}


/* =========================================================
   12. REGISTRATION URL
   ========================================================= */

function generateRegistrationURL(userID) {

    const base =
        window.location.origin +
        window.location.pathname
            .replace(
                /[^/]*$/,
                ""
            );

    return (
        base +
        IOIS_CONFIG.registrationPage +
        "?ref=" +
        encodeURIComponent(userID)
    );
}


/* =========================================================
   13. GET SPONSOR DATA
   ========================================================= */

function getSponsorData() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const ref =
        params.get("ref") ||
        params.get("sponsor") ||
        params.get("sponsor_id");


    return {

        sponsorID:
            ref
                ? ref.trim()
                : "",

        sponsorName:
            ""

    };
}


/* =========================================================
   14. AUTO-FILL SPONSOR
   ========================================================= */

function loadSponsorData() {

    const sponsor =
        getSponsorData();


    if (!sponsor.sponsorID) {
        return;
    }


    const sponsorInput =
        getElement("reg-sponsor-id") ||
        getElement("sponsor-id") ||
        getElement("reg-sponsor");


    if (sponsorInput) {

        sponsorInput.value =
            sponsor.sponsorID;

        sponsorInput.readOnly = true;

        sponsorInput.classList.add(
            "opacity-80"
        );
    }
}


/* =========================================================
   15. DISPLAY IOIS PAYMENT DETAILS
   ========================================================= */

function renderIOISPaymentDetails() {

    let container =
        getElement("iois-payment-details");


    if (!container) {

        container =
            document.querySelector(
                "[data-iois-payment]"
            );
    }


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="rounded-2xl
                    border border-amber-400/30
                    bg-amber-400/5
                    p-4">

            <div class="text-amber-400
                        font-black
                        text-sm mb-3">

                <i class="fa-solid fa-indian-rupee-sign mr-1"></i>
                IOIS Payment Details

            </div>


            <div class="space-y-2 text-xs">

                <div>
                    <span class="text-gray-400">
                        Payment Name:
                    </span>

                    <strong class="text-white">
                        ${escapeHTML(IOIS_CONFIG.paymentName)}
                    </strong>
                </div>


                <div>
                    <span class="text-gray-400">
                        UPI ID:
                    </span>

                    <strong class="text-amber-300">
                        ${escapeHTML(IOIS_CONFIG.paymentUPI)}
                    </strong>

                    <button
                        type="button"
                        onclick="copyIOISText('${IOIS_CONFIG.paymentUPI}')"
                        class="ml-2 px-2 py-1
                               bg-amber-400
                               text-gray-950
                               rounded
                               font-bold">

                        Copy

                    </button>

                </div>


                <div class="text-gray-400 pt-2">

                    Selected plan का payment
                    करने के बाद payment screenshot
                    upload करें।

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   16. COPY FUNCTION
   ========================================================= */

async function copyIOISText(text) {

    try {

        await navigator.clipboard.writeText(text);

        showRegistrationMessage(
            "Copied successfully.",
            "success"
        );

    } catch {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        showRegistrationMessage(
            "Copied successfully.",
            "success"
        );
    }
}


/* =========================================================
   17. READ FORM DATA
   ========================================================= */

function collectRegistrationData() {

    const selectedPlan =
        getSelectedPlan();


    const sponsor =
        getSponsorData();


    const name =
        getValue("reg-name") ||
        getValue("full-name") ||
        getValue("name");


    const email =
        getValue("reg-email") ||
        getValue("email");


    const phone =
        getValue("reg-phone") ||
        getValue("phone") ||
        getValue("whatsapp");


    const password =
        getValue("reg-password") ||
        getValue("password");


    const address =
        getValue("reg-address") ||
        getValue("address");


    const sponsorName =
        getValue("reg-sponsor-name") ||
        getValue("sponsor-name") ||
        sponsor.sponsorName;


    const sponsorID =
        getValue("reg-sponsor-id") ||
        getValue("sponsor-id") ||
        sponsor.sponsorID;


    const withdrawalUPI =
        getValue("reg-withdrawal-upi") ||
        getValue("withdrawal-upi") ||
        getValue("user-upi");


    const paymentProof =
        getElement("payment-screenshot") ||
        getElement("reg-payment-screenshot");


    const identityProof =
        getElement("payment-address-proof") ||
        getElement("reg-payment-proof");


    return {

        selectedPlan,

        name,

        email,

        phone,

        password,

        address,

        sponsorName,

        sponsorID,

        withdrawalUPI,

        paymentProof,

        identityProof

    };
}


/* =========================================================
   18. VALIDATE REGISTRATION DATA
   ========================================================= */

function validateRegistrationData(data) {

    if (!data.selectedPlan) {

        return {
            valid: false,
            message:
                "कृपया Membership Plan चुनें।"
        };
    }


    if (!data.name || data.name.length < 2) {

        return {
            valid: false,
            message:
                "कृपया अपना सही Full Name दर्ज करें।"
        };
    }


    if (!validateEmail(data.email)) {

        return {
            valid: false,
            message:
                "कृपया valid Email Address दर्ज करें।"
        };
    }


    if (!validatePhone(data.phone)) {

        return {
            valid: false,
            message:
                "कृपया valid 10-digit WhatsApp Number दर्ज करें।"
        };
    }


    if (!validatePassword(data.password)) {

        return {
            valid: false,
            message:
                "Password कम से कम 8 characters का होना चाहिए और उसमें letters तथा number होने चाहिए।"
        };
    }


    if (!data.address || data.address.length < 5) {

        return {
            valid: false,
            message:
                "कृपया Full Address दर्ज करें।"
        };
    }


    if (!data.withdrawalUPI) {

        return {
            valid: false,
            message:
                "कृपया Withdrawal UPI ID / receiving details दर्ज करें।"
        };
    }


    if (
        data.withdrawalUPI.includes("@") &&
        !validateUPI(data.withdrawalUPI)
    ) {

        return {
            valid: false,
            message:
                "Withdrawal UPI ID सही format में दर्ज करें।"
        };
    }


    return {
        valid: true
    };
}


/* =========================================================
   19. UPLOAD FILE
   ========================================================= */

async function uploadRegistrationFile(
    file,
    userID,
    type
) {

    if (!file) {
        return null;
    }


    if (!ioisSupabase) {
        throw new Error(
            "Supabase not initialized."
        );
    }


    const maxSize =
        8 * 1024 * 1024;


    if (file.size > maxSize) {

        throw new Error(
            "File size 8MB से कम होना चाहिए।"
        );
    }


    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "केवल JPG, PNG, WEBP या PDF files allowed हैं।"
        );
    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const filePath =
        `${userID}/${type}-${Date.now()}.${extension}`;


    const {
        data,
        error
    } =
        await ioisSupabase.storage
            .from("registration-proofs")
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (error) {

        console.error(
            "File upload error:",
            error
        );

        throw error;
    }


    return data.path;
}


/* =========================================================
   20. CREATE AUTH USER
   ========================================================= */

async function createIOISAuthUser(
    email,
    password
) {

    const {
        data,
        error
    } =
        await ioisSupabase.auth.signUp({

            email,
            password,

            options: {

                emailRedirectTo:
                    window.location.origin +
                    "/login.html"

            }

        });


    if (error) {

        throw error;
    }


    return data;
}


/* =========================================================
   21. GET AUTH USER
   ========================================================= */

async function getCurrentAuthUser() {

    const {
        data,
        error
    } =
        await ioisSupabase.auth.getUser();


    if (error) {
        return null;
    }


    return data.user || null;
}


/* =========================================================
   22. CREATE PROFILE
   ========================================================= */

async function createIOISProfile(
    authUser,
    registrationData,
    userID,
    token
) {

    const plan =
        registrationData.selectedPlan;


    const planFallback =
        IOIS_PLANS[
            plan.amount
        ] || {};


    const profilePayload = {

        id:
            authUser.id,

        user_id:
            userID,

        email:
            registrationData.email,

        full_name:
            registrationData.name,

        whatsapp:
            registrationData.phone,

        address:
            registrationData.address,

        sponsor_id:
            registrationData.sponsorID ||
            null,

        sponsor_name:
            registrationData.sponsorName ||
            null,

        membership_plan:
            plan.name,

        plan_code:
            planFallback.code ||
            plan.code ||
            null,

        membership_amount:
            plan.amount,

        registration_token:
            token,

        withdrawal_upi:
            registrationData.withdrawalUPI,

        status:
            "pending",

        payment_status:
            "pending",

        created_at:
            new Date().toISOString()

    };


    const {
        data,
        error
    } =
        await ioisSupabase
            .from("profiles")
            .insert(profilePayload)
            .select()
            .single();


    if (error) {

        console.error(
            "Profile creation error:",
            error
        );

        throw error;
    }


    return data;
}


/* =========================================================
   23. CREATE REGISTRATION RECORD
   ========================================================= */

async function createRegistrationRecord(
    authUser,
    registrationData,
    userID,
    token,
    paymentScreenshotPath,
    paymentProofPath
) {

    const plan =
        registrationData.selectedPlan;


    const payout =
        IOIS_PLANS[
            plan.amount
        ]?.payout || 0;


    const payload = {

        user_id:
            authUser.id,

        iois_user_id:
            userID,

        registration_token:
            token,

        plan_name:
            plan.name,

        plan_amount:
            plan.amount,

        direct_payout:
            payout,

        sponsor_id:
            registrationData.sponsorID ||
            null,

        sponsor_name:
            registrationData.sponsorName ||
            null,

        payment_upi:
            IOIS_CONFIG.paymentUPI,

        withdrawal_upi:
            registrationData.withdrawalUPI,

        payment_screenshot:
            paymentScreenshotPath,

        payment_address_proof:
            paymentProofPath,

        status:
            "pending",

        payment_status:
            "pending",

        created_at:
            new Date().toISOString()

    };


    const {
        data,
        error
    } =
        await ioisSupabase
            .from("registrations")
            .insert(payload)
            .select()
            .single();


    if (error) {

        console.error(
            "Registration record error:",
            error
        );

        throw error;
    }


    return data;
}


/* =========================================================
   24. GENERATE USER URL
   ========================================================= */

async function createUserURLRecord(
    authUser,
    userID,
    token
) {

    const registrationURL =
        generateRegistrationURL(
            userID
        );


    /*
       If your database has a referral_links
       table this will store it.

       If table does not exist, registration
       itself will continue.
    */

    try {

        const {
            error
        } =
            await ioisSupabase
                .from("referral_links")
                .insert({

                    user_id:
                        authUser.id,

                    user_code:
                        userID,

                    token:
                        token,

                    url:
                        registrationURL,

                    created_at:
                        new Date().toISOString()

                });


        if (error) {

            console.warn(
                "Referral link table warning:",
                error
            );
        }

    } catch (error) {

        console.warn(
            "Referral URL storage skipped:",
            error
        );
    }


    return registrationURL;
}


/* =========================================================
   25. TELEGRAM NOTIFICATION
   ========================================================= */

async function sendIOISTelegramNotification(
    registrationData,
    userID,
    token,
    registrationURL
) {

    /*
       IMPORTANT:

       Telegram BOT TOKEN is NOT stored here.

       Secure Supabase Edge Function receives
       registration event and sends Telegram message.
    */


    try {

        const plan =
            registrationData.selectedPlan;


        const payout =
            IOIS_PLANS[
                plan.amount
            ]?.payout || 0;


        const payload = {

            event:
                "new_registration",

            platform:
                IOIS_CONFIG.platformName,

            userID,

            token,

            registrationURL,

            name:
                registrationData.name,

            email:
                registrationData.email,

            whatsapp:
                registrationData.phone,

            address:
                registrationData.address,

            sponsorID:
                registrationData.sponsorID,

            sponsorName:
                registrationData.sponsorName,

            plan:
                plan.name,

            amount:
                plan.amount,

            directPayout:
                payout,

            paymentUPI:
                IOIS_CONFIG.paymentUPI,

            withdrawalUPI:
                registrationData.withdrawalUPI,

            createdAt:
                new Date().toISOString()

        };


        const response =
            await fetch(
                IOIS_CONFIG.telegramFunction,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        if (!response.ok) {

            console.warn(
                "Telegram notification failed:",
                response.status
            );

            return false;
        }


        return true;

    } catch (error) {

        console.warn(
            "Telegram notification error:",
            error
        );

        return false;
    }
}


/* =========================================================
   26. SAVE REGISTRATION SUMMARY LOCALLY
   ========================================================= */

function saveRegistrationSummary(
    data
) {

    try {

        localStorage.setItem(

            "iois_last_registration",

            JSON.stringify({

                userID:
                    data.userID,

                token:
                    data.token,

                name:
                    data.name,

                plan:
                    data.plan,

                amount:
                    data.amount,

                registrationURL:
                    data.registrationURL,

                createdAt:
                    new Date().toISOString()

            })

        );

    } catch (error) {

        console.warn(
            "Local registration summary unavailable.",
            error
        );
    }
}


/* =========================================================
   27. SHOW SUCCESS SCREEN
   ========================================================= */

function showRegistrationSuccess(
    result
) {

    const container =
        getElement("registration-success") ||
        getElement("success-screen");


    if (!container) {

        showRegistrationMessage(
            `Registration submitted successfully. Your IOIS User ID is ${result.userID}`,
            "success"
        );

        return;
    }


    container.innerHTML = `

        <div class="rounded-3xl
                    border border-green-400/40
                    bg-green-400/10
                    p-6 text-center">

            <div class="mx-auto
                        w-16 h-16
                        rounded-2xl
                        bg-green-400
                        text-gray-950
                        flex items-center
                        justify-center
                        text-2xl">

                <i class="fa-solid fa-check"></i>

            </div>


            <h3 class="text-2xl
                       font-black
                       text-green-300
                       mt-4">

                Registration Submitted

            </h3>


            <p class="text-gray-300
                      text-sm mt-2">

                आपका registration successfully
                submit हो गया है।

            </p>


            <div class="mt-5
                        rounded-2xl
                        bg-black/40
                        p-4 text-left">

                <div class="text-xs text-gray-400">
                    Your Unique IOIS User ID
                </div>

                <div class="flex gap-2 mt-1">

                    <input
                        id="generated-user-id"
                        readonly
                        value="${escapeHTML(result.userID)}"
                        class="flex-1 bg-black/50
                               border border-gray-700
                               rounded-lg
                               p-2 text-amber-400
                               font-bold text-xs">

                    <button
                        type="button"
                        onclick="copyIOISText(document.getElementById('generated-user-id').value)"
                        class="px-3 py-2
                               bg-amber-400
                               text-gray-950
                               rounded-lg
                               font-bold text-xs">

                        Copy

                    </button>

                </div>


                <div class="text-xs text-gray-400 mt-4">
                    Registration Token
                </div>

                <div class="flex gap-2 mt-1">

                    <input
                        id="generated-token"
                        readonly
                        value="${escapeHTML(result.token)}"
                        class="flex-1 bg-black/50
                               border border-gray-700
                               rounded-lg
                               p-2 text-teal-300
                               font-bold text-xs">

                    <button
                        type="button"
                        onclick="copyIOISText(document.getElementById('generated-token').value)"
                        class="px-3 py-2
                               bg-teal-400
                               text-gray-950
                               rounded-lg
                               font-bold text-xs">

                        Copy

                    </button>

                </div>


                <div class="text-xs text-gray-400 mt-4">
                    Your Referral URL
                </div>

                <div class="flex gap-2 mt-1">

                    <input
                        id="generated-registration-url"
                        readonly
                        value="${escapeHTML(result.registrationURL)}"
                        class="flex-1 bg-black/50
                               border border-gray-700
                               rounded-lg
                               p-2 text-white
                               text-[10px]">

                    <button
                        type="button"
                        onclick="copyIOISText(document.getElementById('generated-registration-url').value)"
                        class="px-3 py-2
                               bg-purple-400
                               text-gray-950
                               rounded-lg
                               font-bold text-xs">

                        Copy

                    </button>

                </div>

            </div>


            <div class="mt-5
                        flex flex-col
                        sm:flex-row
                        gap-3">

                <a
                    href="${IOIS_CONFIG.dashboardPage}"
                    class="flex-1 py-3
                           bg-amber-400
                           text-gray-950
                           rounded-xl
                           font-black
                           text-xs">

                    Dashboard

                </a>


                <a
                    href="${IOIS_CONFIG.idCardPage}"
                    class="flex-1 py-3
                           bg-teal-400
                           text-gray-950
                           rounded-xl
                           font-black
                           text-xs">

                    Digital ID Card

                </a>

            </div>

        </div>

    `;


    container.classList.remove(
        "hidden"
    );
}


/* =========================================================
   28. MAIN REGISTRATION FUNCTION
   ========================================================= */

async function submitIOISRegistration(
    event
) {

    if (event) {
        event.preventDefault();
    }


    if (!ioisSupabase) {

        const initialized =
            initializeIOISSupabase();

        if (!initialized) {
            return;
        }
    }


    const registrationData =
        collectRegistrationData();


    const validation =
        validateRegistrationData(
            registrationData
        );


    if (!validation.valid) {

        showRegistrationMessage(
            validation.message,
            "error"
        );

        return;
    }


    setRegistrationLoading(true);


    let authUser =
        null;

    let userID =
        generateIOISUserID();

    let token =
        generateRegistrationToken();

    let paymentScreenshotPath =
        null;

    let paymentProofPath =
        null;


    try {

        showRegistrationMessage(
            "Registration process शुरू हो रहा है...",
            "info"
        );


        /* -------------------------------------------------
           CREATE AUTH ACCOUNT
           ------------------------------------------------- */

        const authResult =
            await createIOISAuthUser(

                registrationData.email,

                registrationData.password

            );


        authUser =
            authResult.user;


        /*
           Email confirmation enabled होने पर
           user object available हो सकता है लेकिन
           session तुरंत available नहीं होगी.
        */


        if (!authUser) {

            throw new Error(
                "Authentication account create नहीं हो पाया।"
            );
        }


        showRegistrationMessage(
            "Account created. Profile save किया जा रहा है...",
            "info"
        );


        /* -------------------------------------------------
           FILE UPLOADS
           ------------------------------------------------- */

        if (
            registrationData.paymentProof &&
            registrationData.paymentProof.files &&
            registrationData.paymentProof.files[0]
        ) {

            paymentScreenshotPath =
                await uploadRegistrationFile(

                    registrationData
                        .paymentProof
                        .files[0],

                    userID,

                    "payment-screenshot"

                );
        }


        if (
            registrationData.identityProof &&
            registrationData.identityProof.files &&
            registrationData.identityProof.files[0]
        ) {

            paymentProofPath =
                await uploadRegistrationFile(

                    registrationData
                        .identityProof
                        .files[0],

                    userID,

                    "payment-address-proof"

                );
        }


        /* -------------------------------------------------
           PROFILE
           ------------------------------------------------- */

        await createIOISProfile(

            authUser,

            registrationData,

            userID,

            token

        );


        /* -------------------------------------------------
           REGISTRATION RECORD
           ------------------------------------------------- */

        await createRegistrationRecord(

            authUser,

            registrationData,

            userID,

            token,

            paymentScreenshotPath,

            paymentProofPath

        );


        /* -------------------------------------------------
           REFERRAL URL
           ------------------------------------------------- */

        const registrationURL =
            await createUserURLRecord(

                authUser,

                userID,

                token

            );


        /* -------------------------------------------------
           TELEGRAM ADMIN NOTIFICATION
           ------------------------------------------------- */

        await sendIOISTelegramNotification(

            registrationData,

            userID,

            token,

            registrationURL

        );


        /* -------------------------------------------------
           SAVE LOCAL SUMMARY
           ------------------------------------------------- */

        const result = {

            userID,

            token,

            registrationURL,

            name:
                registrationData.name,

            plan:
                registrationData
                    .selectedPlan
                    .name,

            amount:
                registrationData
                    .selectedPlan
                    .amount

        };


        saveRegistrationSummary(
            result
        );


        /* -------------------------------------------------
           SUCCESS
           ------------------------------------------------- */

        showRegistrationMessage(
            "IOIS Registration successfully submit हो गया।",
            "success"
        );


        showRegistrationSuccess(
            result
        );


        /*
           Form को hide करने की जरूरत हो तो:
        */

        const form =
            getElement("reg-form") ||
            getElement("registration-form");


        if (form) {

            form.classList.add(
                "hidden"
            );
        }


    } catch (error) {

        console.error(
            "IOIS registration failed:",
            error
        );


        let message =
            error?.message ||
            "Registration failed.";


        if (
            message
                .toLowerCase()
                .includes(
                    "user already registered"
                )
        ) {

            message =
                "इस Email से account पहले से registered है। Login या Forgot Password का उपयोग करें।";
        }


        showRegistrationMessage(
            message,
            "error"
        );

    } finally {

        setRegistrationLoading(
            false
        );
    }
}


/* =========================================================
   29. FORM SUBMIT LISTENER
   ========================================================= */

function attachRegistrationForm() {

    const form =
        getElement("reg-form") ||
        getElement("registration-form");


    if (!form) {

        console.warn(
            "IOIS registration form not found."
        );

        return;
    }


    form.addEventListener(
        "submit",
        submitIOISRegistration
    );
}


/* =========================================================
   30. PLAN PRESELECTION
   ========================================================= */

function selectPlanFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const plan =
        params.get("plan") ||
        params.get("tier");


    if (!plan) {
        return;
    }


    const select =
        getElement("reg-card-tier") ||
        getElement("membership-plan") ||
        getElement("reg-plan");


    if (!select) {
        return;
    }


    for (
        let i = 0;
        i < select.options.length;
        i++
    ) {

        const option =
            select.options[i];


        if (
            option.value
                .toLowerCase()
                .includes(
                    plan.toLowerCase()
                ) ||
            option.textContent
                .toLowerCase()
                .includes(
                    plan.toLowerCase()
                )
        ) {

            select.selectedIndex =
                i;

            break;
        }
    }
}


/* =========================================================
   31. PAYMENT UPI COPY BUTTONS
   ========================================================= */

function attachUPICopyButtons() {

    document
        .querySelectorAll(
            "[data-copy-upi]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    copyIOISText(
                        IOIS_CONFIG.paymentUPI
                    );

                }
            );

        });
}


/* =========================================================
   32. PREVENT DOUBLE SUBMISSION
   ========================================================= */

let ioisRegistrationSubmitting =
    false;


const originalSubmit =
    submitIOISRegistration;


/*
   Guard wrapper.
*/

async function safeIOISRegistrationSubmit(
    event
) {

    if (
        ioisRegistrationSubmitting
    ) {

        return;
    }


    ioisRegistrationSubmitting =
        true;


    try {

        await originalSubmit(
            event
        );

    } finally {

        ioisRegistrationSubmitting =
            false;
    }
}


/* =========================================================
   33. PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeIOISSupabase();

        loadSponsorData();

        selectPlanFromURL();

        renderIOISPaymentDetails();

        attachRegistrationForm();

        attachUPICopyButtons();

    }
);


/* =========================================================
   34. GLOBAL FUNCTIONS
   ========================================================= */

window.submitIOISRegistration =
    submitIOISRegistration;

window.safeIOISRegistrationSubmit =
    safeIOISRegistrationSubmit;

window.copyIOISText =
    copyIOISText;

window.generateIOISUserID =
    generateIOISUserID;

window.generateRegistrationToken =
    generateRegistrationToken;

window.generateRegistrationURL =
    generateRegistrationURL;

window.renderIOISPaymentDetails =
    renderIOISPaymentDetails;


/* =========================================================
   35. DEBUG INFORMATION
   ========================================================= */

console.log(
    "%cIOIS Registration System Loaded",
    "color:#f59e0b;font-weight:bold;font-size:14px"
);

console.log(
    "IOIS Payment UPI:",
    IOIS_CONFIG.paymentUPI
);

console.log(
    "IOIS Support:",
    IOIS_CONFIG.whatsapp,
    IOIS_CONFIG.email
);
