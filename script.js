/* =========================================================
   IOIS PLATFORM
   script.js
   Indian Online Income Supporting System
   ========================================================= */

/* =========================================================
   1. IOIS CONFIGURATION
   ========================================================= */

const IOIS_CONFIG = {

    /* Supabase
       अपनी Supabase Project URL यहाँ रखें.
       Publishable/anon key ही frontend में रखें.
    */
    SUPABASE_URL: "",
    SUPABASE_ANON_KEY: "",

    /* Payment */
    UPI_ID: "8877490845@spicepay",
    UPI_NAME: "IOIS PLATFORM",

    /* Contact */
    EMAIL: "ioisplatform@gmail.com",
    WHATSAPP: "918877490845",

    /* Website */
    SITE_NAME: "IOIS PLATFORM",
    SITE_URL: window.location.origin,

    /* Default plan */
    DEFAULT_PLAN: "Tiranga Silver Card (₹10)"
};


/* =========================================================
   2. MEMBERSHIP PLANS
   ========================================================= */

const IOIS_PLANS = [

    {
        id: 1,
        name: "Alpha Starter Pass",
        card: "Tiranga Silver Card (₹10)",
        price: 10,
        direct: 7,
        l2: 0,
        features: [
            "Digital ID Pass",
            "3 CV Templates",
            "2 Cover Letters",
            "10 ChatGPT Prompts",
            "Useful Website Links"
        ]
    },

    {
        id: 2,
        name: "Nexus Pro Creator Kit",
        card: "Tiranga Gold Card (₹49)",
        price: 49,
        direct: 35,
        l2: 0,
        features: [
            "Pro Creator Badge",
            "15+ Bio-data",
            "50+ Social Posts",
            "Smartphone Website Guide"
        ]
    },

    {
        id: 3,
        name: "Apex Executive Pass",
        card: "Tiranga Platinum Card (₹99)",
        price: 99,
        direct: 70,
        l2: 0,
        features: [
            "Executive Business Pass",
            "100+ Branding Templates",
            "Logo Resources",
            "Business Card Bundle"
        ]
    },

    {
        id: 4,
        name: "Zenith VIP Creator",
        card: "Tiranga Crystal Card (₹199)",
        price: 199,
        direct: 120,
        l2: 20,
        features: [
            "VIP Creator Card",
            "Mobile Design Masterclass",
            "300+ Marketing Banners"
        ]
    },

    {
        id: 5,
        name: "Govt Exam & Student",
        card: "Govt Exam & Student Pass (₹299)",
        price: 299,
        direct: 220,
        l2: 20,
        features: [
            "Student ID Card",
            "Govt Job Alert Sheet",
            "GK & Exam Notes"
        ]
    },

    {
        id: 6,
        name: "Diamond Business Agency",
        card: "Tiranga Diamond Agency Pass (₹499)",
        price: 499,
        direct: 375,
        l2: 25,
        features: [
            "Diamond Agency Card",
            "1000+ Graphic Assets",
            "Video Assets",
            "Agency Manual"
        ]
    },

    {
        id: 7,
        name: "VIP Mastermind & AI",
        card: "VIP Mastermind Freelancing & AI Pass (₹999)",
        price: 999,
        direct: 750,
        l2: 50,
        features: [
            "VIP Elite Card",
            "ChatGPT / Canva AI Mastery",
            "Freelancing Blueprint"
        ]
    }

];


/* =========================================================
   3. GLOBAL STATE
   ========================================================= */

let selectedPlan = null;
let registrationData = null;
let ioisSupabase = null;


/* =========================================================
   4. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSupabase();

    initializeClock();

    initializeWeather();

    initializeMobileMenu();

    initializePlanSelector();

    initializeFAQ();

    restoreRegistrationData();

    updateSelectedPlanFromURL();

    console.log(
        "%cIOIS PLATFORM initialized successfully.",
        "color:#f59e0b;font-weight:bold;"
    );

});


/* =========================================================
   5. SUPABASE INITIALIZATION
   ========================================================= */

function initializeSupabase() {

    if (
        !IOIS_CONFIG.SUPABASE_URL ||
        !IOIS_CONFIG.SUPABASE_ANON_KEY
    ) {

        console.warn(
            "IOIS: Supabase credentials are not configured in script.js"
        );

        return;
    }

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.warn(
            "IOIS: Supabase library is not loaded."
        );

        return;
    }

    try {

        ioisSupabase = window.supabase.createClient(
            IOIS_CONFIG.SUPABASE_URL,
            IOIS_CONFIG.SUPABASE_ANON_KEY
        );

        console.log(
            "%cIOIS Supabase connected.",
            "color:#10b981;font-weight:bold;"
        );

    } catch (error) {

        console.error(
            "IOIS Supabase initialization failed:",
            error
        );

    }

}


/* =========================================================
   6. MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menu = document.getElementById("mobile-menu");

    if (!menu) return;

    menu.classList.add("hidden");

}


function toggleMobileMenu() {

    const menu = document.getElementById("mobile-menu");

    if (!menu) return;

    menu.classList.toggle("hidden");

}


/* Close mobile menu after clicking a link */

document.addEventListener("click", (event) => {

    const link = event.target.closest(
        "#mobile-menu a"
    );

    if (!link) return;

    const menu = document.getElementById("mobile-menu");

    if (menu) {
        menu.classList.add("hidden");
    }

});


/* =========================================================
   7. LIVE ANALOG + DIGITAL CLOCK
   ========================================================= */

function initializeClock() {

    updateIOISClock();

    setInterval(
        updateIOISClock,
        1000
    );

}


function updateIOISClock() {

    const now = new Date();

    const hours24 = now.getHours();

    const minutes = now.getMinutes();

    const seconds = now.getSeconds();

    let hours12 = hours24 % 12;

    if (hours12 === 0) {
        hours12 = 12;
    }

    const ampm =
        hours24 >= 12
            ? "PM"
            : "AM";

    const digitalClock =
        document.getElementById(
            "room-12digit-clock"
        );

    if (digitalClock) {

        digitalClock.textContent =
            `${pad(hours12)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

    }


    /* Analog clock */

    const hourHand =
        document.getElementById("wall-hour");

    const minuteHand =
        document.getElementById("wall-min");

    const secondHand =
        document.getElementById("wall-sec");


    const secondAngle =
        seconds * 6;

    const minuteAngle =
        minutes * 6 +
        seconds * 0.1;

    const hourAngle =
        (hours24 % 12) * 30 +
        minutes * 0.5;


    if (hourHand) {

        hourHand.style.transform =
            `translateX(-50%) rotate(${hourAngle}deg)`;

    }


    if (minuteHand) {

        minuteHand.style.transform =
            `translateX(-50%) rotate(${minuteAngle}deg)`;

    }


    if (secondHand) {

        secondHand.style.transform =
            `translateX(-50%) rotate(${secondAngle}deg)`;

    }


    /* Date */

    const dateElement =
        document.getElementById("iois-date");

    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                "hi-IN",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }

}


function pad(number) {

    return String(number).padStart(
        2,
        "0"
    );

}


/* =========================================================
   8. WEATHER
   ========================================================= */

async function initializeWeather() {

    const tempElement =
        document.getElementById(
            "weather-temp-display"
        );

    const statusElement =
        document.getElementById(
            "weather-status-display"
        );

    const locationElement =
        document.getElementById(
            "weather-location-display"
        );

    const extraElement =
        document.getElementById(
            "weather-extra-display"
        );

    const locationLabel =
        document.getElementById(
            "weather-location-label"
        );


    if (!tempElement) return;


    try {

        if (
            !navigator.geolocation
        ) {

            throw new Error(
                "Geolocation unavailable"
            );

        }


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;


                try {

                    const weather =
                        await fetchWeather(
                            lat,
                            lon
                        );

                    if (!weather) {

                        throw new Error(
                            "Weather unavailable"
                        );

                    }


                    const temperature =
                        weather.current.temperature_2m;

                    const humidity =
                        weather.current.relative_humidity_2m;

                    const wind =
                        weather.current.wind_speed_10m;

                    const weatherCode =
                        weather.current.weather_code;


                    tempElement.textContent =
                        `${Math.round(temperature)}°C`;


                    statusElement.textContent =
                        getWeatherText(
                            weatherCode
                        );


                    extraElement.textContent =
                        `Humidity ${humidity}% · Wind ${Math.round(wind)} km/h`;


                    const location =
                        await reverseGeocode(
                            lat,
                            lon
                        );


                    if (location) {

                        locationElement.textContent =
                            location;

                        locationLabel.textContent =
                            location;

                    } else {

                        locationElement.textContent =
                            `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

                    }

                } catch (error) {

                    console.error(
                        "Weather error:",
                        error
                    );

                    showWeatherFallback();

                }

            },

            () => {

                showWeatherFallback();

            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }

        );

    } catch (error) {

        showWeatherFallback();

    }

}


async function fetchWeather(
    latitude,
    longitude
) {

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${encodeURIComponent(latitude)}` +
        `&longitude=${encodeURIComponent(longitude)}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&timezone=auto`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Weather API failed"
        );

    }

    return await response.json();

}


async function reverseGeocode(
    latitude,
    longitude
) {

    try {

        const url =
            `https://nominatim.openstreetmap.org/reverse` +
            `?format=jsonv2` +
            `lat=${encodeURIComponent(latitude)}` +
            `&lon=${encodeURIComponent(longitude)}`;

        const response =
            await fetch(url, {
                headers: {
                    "Accept":
                        "application/json"
                }
            });

        if (!response.ok) {
            return null;
        }

        const data =
            await response.json();

        const address =
            data.address || {};

        return (
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state ||
            "Current Location"
        );

    } catch (error) {

        return null;

    }

}


function showWeatherFallback() {

    const temp =
        document.getElementById(
            "weather-temp-display"
        );

    const status =
        document.getElementById(
            "weather-status-display"
        );

    const location =
        document.getElementById(
            "weather-location-display"
        );

    const extra =
        document.getElementById(
            "weather-extra-display"
        );


    if (temp) {
        temp.textContent = "--°C";
    }

    if (status) {
        status.textContent =
            "☀️ मौसम जानकारी उपलब्ध नहीं";
    }

    if (location) {
        location.textContent =
            "Location permission required";
    }

    if (extra) {
        extra.textContent =
            "Humidity --% · Wind -- km/h";
    }

}


function getWeatherText(code) {

    const weatherMap = {

        0: "☀️ साफ मौसम",

        1: "🌤️ मुख्यतः साफ",

        2: "⛅ आंशिक बादल",

        3: "☁️ बादल",

        45: "🌫️ कोहरा",

        48: "🌫️ घना कोहरा",

        51: "🌦️ हल्की बूंदाबांदी",

        53: "🌦️ बूंदाबांदी",

        55: "🌧️ तेज बूंदाबांदी",

        61: "🌧️ हल्की बारिश",

        63: "🌧️ बारिश",

        65: "🌧️ तेज बारिश",

        71: "❄️ हल्की बर्फबारी",

        73: "❄️ बर्फबारी",

        75: "❄️ तेज बर्फबारी",

        80: "🌦️ बारिश की बौछार",

        81: "🌧️ बारिश की बौछार",

        82: "🌧️ तेज बौछार",

        95: "⛈️ गरज के साथ बारिश",

        96: "⛈️ ओलावृष्टि",

        99: "⛈️ तेज ओलावृष्टि"

    };

    return (
        weatherMap[code] ||
        "🌤️ मौसम जानकारी"
    );

}


/* =========================================================
   9. PLAN SELECTOR
   ========================================================= */

function initializePlanSelector() {

    const select =
        document.getElementById(
            "reg-card-tier"
        );

    if (!select) return;

    select.addEventListener(
        "change",
        () => {

            selectedPlan =
                findPlanByCard(
                    select.value
                );

        }
    );

}


function findPlanByCard(card) {

    return IOIS_PLANS.find(
        plan =>
            plan.card === card
    ) || null;

}


function findPlanByPrice(price) {

    return IOIS_PLANS.find(
        plan =>
            Number(plan.price) ===
            Number(price)
    ) || null;

}


/* =========================================================
   10. REGISTRATION FLOW
   ========================================================= */

function openRegistrationFlow() {

    selectedPlan =
        IOIS_PLANS[0];

    openRegistrationModal();

}


function openRegistrationFlowWithTier(
    tier
) {

    selectedPlan =
        findPlanByCard(tier);


    if (!selectedPlan) {

        console.warn(
            "IOIS: Plan not found:",
            tier
        );

        selectedPlan =
            IOIS_PLANS[0];

    }


    openRegistrationModal();

}


function openRegistrationModal() {

    const modal =
        document.getElementById(
            "registration-modal"
        );


    if (!modal) {

        /*
          अगर HTML में registration modal
          wrapper का ID अलग है तो common
          modal खोजने की कोशिश करें.
        */

        const alternatives =
            document.querySelectorAll(
                "[id*='registration'], [id*='register']"
            );

        if (
            alternatives.length > 0
        ) {

            alternatives[0]
                .classList
                .remove("hidden");

            return;

        }


        alert(
            "Registration form उपलब्ध नहीं है।"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    syncRegistrationPlan();

}


function syncRegistrationPlan() {

    const select =
        document.getElementById(
            "reg-card-tier"
        );

    if (!select) return;


    if (selectedPlan) {

        select.value =
            selectedPlan.card;

    }

}


function closeModals() {

    const modals =
        document.querySelectorAll(
            ".modal, [id*='modal']"
        );


    modals.forEach(
        modal => {

            if (
                modal.classList.contains(
                    "fixed"
                )
            ) {

                modal.classList.add(
                    "hidden"
                );

            }

        }
    );


    const registrationModal =
        document.getElementById(
            "registration-modal"
        );

    if (registrationModal) {

        registrationModal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   11. LOGIN MODAL
   ========================================================= */

function openLoginModal() {

    const modal =
        document.getElementById(
            "login-modal"
        );

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

        return;

    }


    /* fallback */

    const loginEmail =
        prompt(
            "अपना registered email/mobile दर्ज करें:"
        );


    if (!loginEmail) return;


    const password =
        prompt(
            "Password दर्ज करें:"
        );


    if (!password) return;


    loginUser(
        loginEmail,
        password
    );

}


async function loginUser(
    identifier,
    password
) {

    if (!ioisSupabase) {

        showToast(
            "Supabase अभी configured नहीं है।",
            "error"
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await ioisSupabase.auth.signInWithPassword({
                email: identifier,
                password: password
            });


        if (error) {

            throw error;

        }


        showToast(
            "Login सफल हुआ!",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            1000
        );


        return data;

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        showToast(
            error.message ||
            "Login failed.",
            "error"
        );

    }

}


/* =========================================================
   12. REGISTRATION SUBMIT
   ========================================================= */

async function handleDetailsSubmit(
    event
) {

    event.preventDefault();


    const name =
        getValue("reg-name");

    const phone =
        getValue("reg-phone");

    const tier =
        getValue("reg-card-tier");


    if (!name) {

        showToast(
            "कृपया अपना नाम दर्ज करें।",
            "error"
        );

        return;

    }


    if (!/^[6-9]\d{9}$/.test(phone)) {

        showToast(
            "कृपया सही 10-digit WhatsApp number दर्ज करें।",
            "error"
        );

        return;

    }


    selectedPlan =
        findPlanByCard(tier);


    if (!selectedPlan) {

        showToast(
            "Membership plan select करें।",
            "error"
        );

        return;

    }


    registrationData = {

        name: name,

        phone: phone,

        plan_id:
            selectedPlan.id,

        plan_name:
            selectedPlan.name,

        plan_card:
            selectedPlan.card,

        amount:
            selectedPlan.price,

        created_at:
            new Date().toISOString()

    };


    saveRegistrationData();


    /*
      अगला payment step
    */

    openPaymentStep();

}


/* =========================================================
   13. PAYMENT STEP
   ========================================================= */

function openPaymentStep() {

    if (!registrationData) return;


    closeRegistrationOnly();


    const existingPaymentModal =
        document.getElementById(
            "payment-modal"
        );


    if (existingPaymentModal) {

        existingPaymentModal
            .classList
            .remove("hidden");

        fillPaymentModal();

        return;

    }


    createPaymentModal();

}


function closeRegistrationOnly() {

    const modal =
        document.getElementById(
            "registration-modal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


function fillPaymentModal() {

    const amount =
        document.getElementById(
            "payment-amount"
        );

    const plan =
        document.getElementById(
            "payment-plan"
        );


    if (amount) {

        amount.textContent =
            `₹${registrationData.amount}`;

    }


    if (plan) {

        plan.textContent =
            registrationData.plan_name;

    }

}


/* =========================================================
   14. CREATE PAYMENT MODAL
   ========================================================= */

function createPaymentModal() {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.id =
        "payment-modal";


    wrapper.className =
        "fixed inset-0 z-[9999] hidden " +
        "bg-black/80 backdrop-blur-sm " +
        "flex items-center justify-center p-4";


    wrapper.innerHTML = `

        <div class="
            bg-[#111c38]
            border border-amber-500/50
            rounded-2xl
            max-w-md
            w-full
            p-6
            shadow-2xl
            relative
        ">

            <button
                type="button"
                onclick="closePaymentModal()"
                class="
                    absolute
                    top-3
                    right-4
                    text-gray-400
                    hover:text-white
                    text-xl
                "
            >
                &times;
            </button>

            <div class="text-center">

                <div class="
                    mx-auto
                    w-14
                    h-14
                    rounded-2xl
                    bg-amber-400
                    text-gray-950
                    flex
                    items-center
                    justify-center
                    text-xl
                ">
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                </div>

                <h3 class="
                    text-xl
                    font-black
                    text-amber-400
                    mt-4
                ">
                    Payment
                </h3>

                <p
                    id="payment-plan"
                    class="
                        text-gray-300
                        text-sm
                        mt-2
                    "
                >
                    Membership Plan
                </p>

                <div
                    id="payment-amount"
                    class="
                        text-4xl
                        font-black
                        text-amber-400
                        my-4
                    "
                >
                    ₹10
                </div>

            </div>

            <div class="
                bg-[#080d1e]
                border
                border-gray-700
                rounded-xl
                p-4
                text-center
            ">

                <div class="
                    text-xs
                    text-gray-400
                    mb-2
                ">
                    UPI ID
                </div>

                <div class="
                    text-lg
                    font-black
                    text-teal-400
                    break-all
                ">
                    ${IOIS_CONFIG.UPI_ID}
                </div>

                <button
                    type="button"
                    onclick="copyUPI()"
                    class="
                        mt-3
                        px-4
                        py-2
                        bg-teal-400
                        text-gray-950
                        rounded-lg
                        text-xs
                        font-black
                    "
                >
                    <i class="fa-solid fa-copy mr-1"></i>
                    Copy UPI ID
                </button>

            </div>

            <button
                type="button"
                onclick="openUPIPayment()"
                class="
                    w-full
                    mt-4
                    py-3
                    bg-gradient-to-r
                    from-amber-400
                    to-teal-400
                    text-gray-950
                    rounded-xl
                    font-black
                    text-xs
                "
            >
                <i class="fa-solid fa-mobile-screen-button mr-1"></i>
                Pay via UPI App
            </button>

            <button
                type="button"
                onclick="paymentSubmitted()"
                class="
                    w-full
                    mt-2
                    py-3
                    border
                    border-amber-400
                    text-amber-400
                    rounded-xl
                    font-black
                    text-xs
                "
            >
                मैंने Payment कर दिया है
            </button>

            <p class="
                text-[10px]
                text-gray-500
                text-center
                mt-4
            ">
                Payment verification के बाद
                membership activate की जाएगी।
            </p>

        </div>
    `;


    document.body.appendChild(
        wrapper
    );


    wrapper.classList.remove(
        "hidden"
    );

    fillPaymentModal();

}


function closePaymentModal() {

    const modal =
        document.getElementById(
            "payment-modal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   15. UPI PAYMENT
   ========================================================= */

function openUPIPayment() {

    if (!registrationData) {

        showToast(
            "Registration information नहीं मिली।",
            "error"
        );

        return;

    }


    const amount =
        registrationData.amount;


    const transactionNote =
        `IOIS ${registrationData.plan_name}`;


    const upiURL =
        "upi://pay" +
        "?pa=" +
        encodeURIComponent(
            IOIS_CONFIG.UPI_ID
        ) +
        "&pn=" +
        encodeURIComponent(
            IOIS_CONFIG.UPI_NAME
        ) +
        "&am=" +
        encodeURIComponent(
            amount
        ) +
        "&cu=INR" +
        "&tn=" +
        encodeURIComponent(
            transactionNote
        );


    window.location.href =
        upiURL;

}


async function copyUPI() {

    try {

        await navigator.clipboard.writeText(
            IOIS_CONFIG.UPI_ID
        );

        showToast(
            "UPI ID copied!",
            "success"
        );

    } catch (error) {

        prompt(
            "UPI ID copy करें:",
            IOIS_CONFIG.UPI_ID
        );

    }

}


/* =========================================================
   16. PAYMENT SUBMITTED
   ========================================================= */

async function paymentSubmitted() {

    if (!registrationData) {

        showToast(
            "Registration data नहीं मिला।",
            "error"
        );

        return;

    }


    await savePaymentRequest(
        registrationData
    );


    const message =
        `IOIS Payment Request%0A%0A` +
        `Name: ${encodeURIComponent(registrationData.name)}%0A` +
        `WhatsApp: ${encodeURIComponent(registrationData.phone)}%0A` +
        `Plan: ${encodeURIComponent(registrationData.plan_name)}%0A` +
        `Amount: ₹${registrationData.amount}`;


    const whatsappURL =
        `https://wa.me/${IOIS_CONFIG.WHATSAPP}` +
        `?text=${message}`;


    showToast(
        "Payment request save हो गया।",
        "success"
    );


    setTimeout(
        () => {

            window.open(
                whatsappURL,
                "_blank"
            );

        },
        700
    );

}


/* =========================================================
   17. SAVE REGISTRATION
   ========================================================= */

function saveRegistrationData() {

    try {

        localStorage.setItem(
            "iois_registration",
            JSON.stringify(
                registrationData
            )
        );

    } catch (error) {

        console.warn(
            "Could not save registration:",
            error
        );

    }

}


function restoreRegistrationData() {

    try {

        const saved =
            localStorage.getItem(
                "iois_registration"
            );


        if (!saved) return;


        registrationData =
            JSON.parse(saved);


        if (
            registrationData &&
            registrationData.amount
        ) {

            selectedPlan =
                findPlanByPrice(
                    registrationData.amount
                );

        }

    } catch (error) {

        console.warn(
            "Registration restore failed:",
            error
        );

    }

}


/* =========================================================
   18. SUPABASE REGISTRATION SAVE
   ========================================================= */

async function savePaymentRequest(
    data
) {

    if (!ioisSupabase) {

        console.warn(
            "Supabase unavailable. Payment request kept locally."
        );

        return null;

    }


    try {

        /*
          Expected table:
          registrations

          Recommended columns:
          id
          full_name
          whatsapp
          plan_id
          plan_name
          amount
          status
          created_at
        */


        const {
            data: inserted,
            error
        } =
            await ioisSupabase
                .from("registrations")
                .insert([

                    {
                        full_name:
                            data.name,

                        whatsapp:
                            data.phone,

                        plan_id:
                            data.plan_id,

                        plan_name:
                            data.plan_name,

                        amount:
                            data.amount,

                        status:
                            "payment_submitted"

                    }

                ])
                .select();


        if (error) {

            console.error(
                "Supabase registration error:",
                error
            );

            return null;

        }


        return inserted;

    } catch (error) {

        console.error(
            "Supabase save error:",
            error
        );

        return null;

    }

}


/* =========================================================
   19. FAQ
   ========================================================= */

function initializeFAQ() {

    const buttons =
        document.querySelectorAll(
            "[data-faq]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.getAttribute(
                            "data-faq"
                        );

                    const content =
                        document.getElementById(
                            targetId
                        );

                    if (!content) return;


                    content.classList.toggle(
                        "open"
                    );

                }
            );

        }
    );

}


/* =========================================================
   20. SCROLL TO PLANS
   ========================================================= */

function scrollToPlans() {

    const candidates = [

        document.getElementById(
            "plans"
        ),

        document.getElementById(
            "membership"
        ),

        document.querySelector(
            "[data-plans]"
        )

    ];


    const target =
        candidates.find(
            element =>
                element
        );


    if (target) {

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;

    }


    const heading =
        Array.from(
            document.querySelectorAll(
                "h1,h2,h3"
            )
        ).find(
            element =>
                element.textContent
                    .toLowerCase()
                    .includes(
                        "master plans"
                    )
        );


    if (heading) {

        heading.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   21. URL PLAN SELECTION
   ========================================================= */

function updateSelectedPlanFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const price =
        params.get("plan");


    if (!price) return;


    const plan =
        findPlanByPrice(price);


    if (!plan) return;


    selectedPlan =
        plan;


    const select =
        document.getElementById(
            "reg-card-tier"
        );


    if (select) {

        select.value =
            plan.card;

    }

}


/* =========================================================
   22. UTILITY - GET VALUE
   ========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) return "";


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   23. TOAST SYSTEM
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    let container =
        document.getElementById(
            "iois-toast-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "iois-toast-container";

        container.className =
            "fixed top-5 right-5 z-[10000] space-y-2 max-w-sm";

        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    const icon =
        type === "success"
            ? "fa-circle-check"
            : type === "error"
                ? "fa-circle-exclamation"
                : "fa-circle-info";


    const iconColor =
        type === "success"
            ? "text-green-400"
            : type === "error"
                ? "text-red-400"
                : "text-amber-400";


    toast.className =
        "bg-[#111c38] border border-gray-700 " +
        "text-white rounded-xl px-4 py-3 " +
        "shadow-2xl text-xs font-semibold " +
        "flex items-start gap-3";


    toast.innerHTML = `

        <i class="
            fa-solid
            ${icon}
            ${iconColor}
            mt-0.5
        "></i>

        <span></span>

        <button
            type="button"
            class="
                text-gray-500
                hover:text-white
                ml-2
            "
        >
            &times;
        </button>

    `;


    toast.querySelector(
        "span"
    ).textContent =
        message;


    toast.querySelector(
        "button"
    ).addEventListener(
        "click",
        () => toast.remove()
    );


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(20px)";

            toast.style.transition =
                "all .3s ease";


            setTimeout(
                () => toast.remove(),
                300
            );

        },
        4000
    );

}


/* =========================================================
   24. COPY TEXT UTILITY
   ========================================================= */

async function copyText(
    text
) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        showToast(
            "Copied successfully!",
            "success"
        );

    } catch (error) {

        prompt(
            "Copy this text:",
            text
        );

    }

}


/* =========================================================
   25. REFERRAL LINK
   ========================================================= */

function generateReferralLink(
    referralCode
) {

    const base =
        window.location.origin +
        window.location.pathname;


    const url =
        `${base}?ref=${encodeURIComponent(
            referralCode
        )}`;


    return url;

}


function copyReferralLink(
    referralCode
) {

    const link =
        generateReferralLink(
            referralCode
        );


    copyText(link);

}


/* =========================================================
   26. REFERRAL CODE FROM URL
   ========================================================= */

function getReferralCode() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("ref") ||
        ""
    );

}


/* =========================================================
   27. CLOSE MODAL ON BACKDROP
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const target =
            event.target;


        if (
            target.classList.contains(
                "modal-backdrop"
            )
        ) {

            closeModals();

        }

    }
);


/* =========================================================
   28. ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModals();

            closePaymentModal();

        }

    }
);


/* =========================================================
   29. EXTERNAL LINK SAFETY
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                "a[target='_blank']"
            );


        if (!link) return;


        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    }
);


/* =========================================================
   30. PWA / ONLINE STATUS
   ========================================================= */

window.addEventListener(
    "online",
    () => {

        showToast(
            "Internet connection restored.",
            "success"
        );

    }
);


window.addEventListener(
    "offline",
    () => {

        showToast(
            "Internet connection unavailable.",
            "error"
        );

    }
);


/* =========================================================
   31. ERROR HANDLING
   ========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "IOIS Frontend Error:",
            event.error ||
            event.message
        );

    }
);


/* =========================================================
   32. PUBLIC IOIS API
   ========================================================= */

window.IOIS = {

    config:
        IOIS_CONFIG,

    plans:
        IOIS_PLANS,

    openRegistration:
        openRegistrationFlow,

    openRegistrationWithTier:
        openRegistrationFlowWithTier,

    openLogin:
        openLoginModal,

    closeModals:
        closeModals,

    scrollToPlans:
        scrollToPlans,

    copyUPI:
        copyUPI,

    generateReferralLink:
        generateReferralLink,

    getReferralCode:
        getReferralCode,

    showToast:
        showToast

};


/* =========================================================
   END OF IOIS script.js
   ========================================================= */
