/* =========================================================
   IOIS PLATFORM — HOME PAGE CONTROLLER
   
   Handles:
   • Membership plan rendering
   • Weather widget
   • Clock widget
   • Mobile menu toggle
   • Navigation functions
   
   Registration flow: Uses register.html → auth.js → Supabase
   DEPRECATED: Old localStorage registration removed
========================================================= */

// Utility functions
const $ = (id) => document.getElementById(id);

function money(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
}

function showToast(message, type = "info") {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast show " + type;
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => (toast.className = "toast"), 3500);
}

// Render membership plans from config.js
function renderPlans() {
    const grid = $("plans-grid");
    const select = $("reg-plan");
    const payout = $("payout-grid");

    if (!grid) return;

    if (!window.IOIS_CONFIG || !window.IOIS_CONFIG.plans) {
        console.error("IOIS_CONFIG.plans not found");
        return;
    }

    const plans = window.IOIS_CONFIG.plans;

    grid.innerHTML = plans
        .map(
            (p, i) => `
        <article class="plan-card ${p.color === "purple" ? "featured" : ""}">
            <span class="plan-no">PLAN ${String(i + 1).padStart(2, "0")} ${i === 6 ? "• VIP" : ""}</span>
            <h3>${p.display}</h3>
            <div class="plan-price">${money(p.price)}</div>
            <ul>${p.features.map((x) => `<li>✓ ${x}</li>`).join("")}</ul>
            <div class="payout">Direct Payout Example: ${money(p.payout)}</div>
            <button class="btn-primary full" onclick="openRegistrationFlowWithTier('${p.id}')">Join ${money(p.price)}</button>
        </article>`
        )
        .join("");

    if (select) {
        select.innerHTML = plans.map((p, i) => `<option value="${p.id}">${i + 1}. ${p.name} — ${money(p.price)}</option>`).join("");
    }

    if (payout) {
        payout.innerHTML = plans.map((p) => `<div class="payout-card"><small>${p.name}</small><b>${money(p.price)}</b><strong>${money(p.payout)}</strong></div>`).join("");
    }
}

// Render example referral scenarios
function renderExamples() {
    const examples = [
        ["उदाहरण 1 — ₹10 Starter", "सुनील ने राहुल को जोड़ा। राहुल ने ₹10 दिए, तो applicable direct payout example ₹7 है।"],
        ["उदाहरण 2 — ₹10 Referral", "अमित ने रमेश को kit share की। Eligible referral के अनुसार ₹7 payout example है।"],
        ["उदाहरण 3 — ₹49 Basic", "विक्रम ने करण को refer किया। ₹49 plan पर ₹35 payout example है।"],
        ["उदाहरण 4 — ₹99 Plus", "मनोज ने पूजा को kit दी। ₹99 plan पर ₹70 example payout है।"],
        ["उदाहरण 5 — ₹199 Premium", "रोहित ने आशीष को जोड़ा। ₹199 plan का example payout ₹120 है।"],
        ["उदाहरण 6 — ₹299 Pro", "सुनील ने अमन को Student Pass दिया। ₹299 plan पर ₹220 direct payout example है।"],
        ["उदाहरण 7 — ₹499 Business", "अमित ने संजय को Agency Pass share किया। ₹499 plan पर ₹375 direct payout example है।"],
        ["उदाहरण 8 — ₹999 Enterprise", "विक्रम ने आकाश को Mastermind Pass दिया। ₹999 plan पर ₹750 payout example है।"]
    ];

    const box = $("examples-list");
    if (!box) return;

    box.innerHTML = examples.map((e, i) => `<details><summary>${e[0]}</summary><p>${e[1]}</p></details>`).join("");
}

// Update clock
function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ap = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;

    const digitalClock = $("digital-clock");
    if (digitalClock) {
        digitalClock.textContent = `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ap}`;
    }

    const clockDate = $("clock-date");
    if (clockDate) {
        clockDate.textContent = now.toLocaleDateString("hi-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    const hourHand = $("clock-hour");
    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${(h % 12) * 30 + m * 0.5}deg)`;

    const minHand = $("clock-min");
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${m * 6 + s * 0.1}deg)`;

    const secHand = $("clock-sec");
    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;
}

// Load weather from Open-Meteo API
async function loadWeather() {
    const temp = $("weather-temp");
    const status = $("weather-status");
    const loc = $("weather-location");
    const extra = $("weather-extra");
    const label = $("weather-location-label");

    if (!navigator.geolocation) {
        fallbackWeather();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
                );
                const data = await response.json();
                const current = data.current;

                if (temp) temp.textContent = `${Math.round(current.temperature_2m)}°C`;

                const weatherMap = {
                    0: "☀️ साफ मौसम",
                    1: "🌤️ हल्के बादल",
                    2: "⛅ आंशिक बादल",
                    3: "☁️ बादल",
                    45: "🌫️ कोहरा",
                    51: "🌦️ हल्की बारिश"
                };

                if (status) status.textContent = weatherMap[current.weather_code] || "🌤️ मौसम";
                if (loc) loc.textContent = `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;
                if (label) label.textContent = "GPS Live Weather";
                if (extra)
                    extra.textContent = `Humidity ${current.relative_humidity_2m}% · Wind ${Math.round(current.wind_speed_10m)} km/h`;
            } catch (error) {
                console.error("Weather load error:", error);
                fallbackWeather();
            }
        },
        fallbackWeather,
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

// Fallback weather display
function fallbackWeather() {
    if ($("weather-temp")) $("weather-temp").textContent = "--°C";
    if ($("weather-status")) $("weather-status").textContent = "📍 Location permission दें";
    if ($("weather-location")) $("weather-location").textContent = "Weather के लिए GPS permission आवश्यक है";
    if ($("weather-extra")) $("weather-extra").textContent = "Live weather unavailable";
    if ($("weather-location-label")) $("weather-location-label").textContent = "GPS Permission";
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = $("mobile-menu");
    if (menu) menu.classList.toggle("open");
}

// Scroll to plans section
function scrollToPlans() {
    const plans = $("plans");
    if (plans) plans.scrollIntoView({ behavior: "smooth" });
}

// Open YouTube video
function openVideo() {
    window.open("https://www.youtube.com/watch?v=0gYd3mIxksc", "_blank", "noopener");
}

// Navigation functions - redirect to registration/login
function openRegistrationFlow() {
    openRegistrationFlowWithTier("starter");
}

function openRegistrationFlowWithTier(tier) {
    const safeTier = encodeURIComponent(tier || "starter");
    window.location.href = `register.html?plan=${safeTier}`;
}

function openLoginModal() {
    window.location.href = "login.html";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    renderPlans();
    renderExamples();
    updateClock();
    setInterval(updateClock, 1000);
    loadWeather();
});

// Export functions to window
window.openRegistrationFlow = openRegistrationFlow;
window.openRegistrationFlowWithTier = openRegistrationFlowWithTier;
window.openLoginModal = openLoginModal;
window.scrollToPlans = scrollToPlans;
window.openVideo = openVideo;
window.toggleMobileMenu = toggleMobileMenu;
