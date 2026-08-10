// =========================================================
// IOIS - LOGIN
// =========================================================

document.addEventListener("DOMContentLoaded", async function () {

    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const button = document.getElementById("loginButton");
    const message = document.getElementById("message");
    const toggle = document.getElementById("togglePassword");

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
    }

    function loading(value) {
        button.disabled = value;
        button.textContent = value
            ? "Login हो रहा है..."
            : "Login";
    }

    toggle.addEventListener("click", function () {
        password.type =
            password.type === "password"
                ? "text"
                : "password";
    });

    // If already logged in, don't show login unnecessarily.
    try {

        const result = await window.IOIS_AUTH.getUser();

        if (result.user) {
            window.location.href = "dashboard.html";
            return;
        }

    } catch (error) {
        console.warn("Existing session check failed:", error);
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const emailValue = email.value.trim().toLowerCase();
        const passwordValue = password.value;

        if (!emailValue || !passwordValue) {
            showMessage(
                "Email और password दोनों दर्ज करें।",
                "error"
            );
            return;
        }

        loading(true);

        try {

            const result = await window.IOIS_AUTH.signIn(
                emailValue,
                passwordValue
            );

            if (!result.success) {
                showMessage(result.message, "error");
                loading(false);
                return;
            }

            showMessage(
                "Login successful! Dashboard खोला जा रहा है...",
                "success"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {

            console.error("IOIS Login Error:", error);

            showMessage(
                "Login के दौरान unexpected error आया।",
                "error"
            );

            loading(false);
        }
    });
});
