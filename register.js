// =========================================================
// IOIS - REGISTRATION
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const button = document.getElementById("registerButton");

    const fullName = document.getElementById("fullName");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
    }

    function validMobile(value) {
        return /^[6-9]\d{9}$/.test(value);
    }

    function validPassword(value) {
        return value.length >= 8;
    }

    function setLoading(loading) {
        button.disabled = loading;
        button.textContent = loading
            ? "Account बनाया जा रहा है..."
            : "Create IOIS Account";
    }

    function togglePassword(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(buttonId);

        toggle.addEventListener("click", function () {
            input.type =
                input.type === "password"
                    ? "text"
                    : "password";
        });
    }

    togglePassword("password", "togglePassword");
    togglePassword("confirmPassword", "toggleConfirmPassword");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        showMessage("", "");

        const nameValue = fullName.value.trim();
        const mobileValue = mobile.value.trim();
        const emailValue = email.value.trim().toLowerCase();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        if (nameValue.length < 2) {
            showMessage("कृपया अपना सही नाम दर्ज करें।", "error");
            return;
        }

        if (!validMobile(mobileValue)) {
            showMessage(
                "कृपया सही 10 digit Indian mobile number दर्ज करें।",
                "error"
            );
            return;
        }

        if (!emailValue.includes("@")) {
            showMessage(
                "कृपया सही email address दर्ज करें।",
                "error"
            );
            return;
        }

        if (!validPassword(passwordValue)) {
            showMessage(
                "Password कम से कम 8 characters का होना चाहिए।",
                "error"
            );
            return;
        }

        if (passwordValue !== confirmValue) {
            showMessage(
                "दोनों passwords समान होने चाहिए।",
                "error"
            );
            return;
        }

        if (!terms.checked) {
            showMessage(
                "Registration जारी रखने के लिए confirmation स्वीकार करें।",
                "error"
            );
            return;
        }

        setLoading(true);

        try {

            const result = await window.IOIS_AUTH.signUp({
                fullName: nameValue,
                mobile: mobileValue,
                email: emailValue,
                password: passwordValue
            });

            if (!result.success) {
                showMessage(result.message, "error");
                setLoading(false);
                return;
            }

            if (result.session) {

                showMessage(
                    "Registration successful! आपका dashboard खोला जा रहा है...",
                    "success"
                );

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1200);

            } else {

                showMessage(
                    "Registration successful! आपके email पर verification link भेजा गया है। Email verify करने के बाद Login करें।",
                    "success"
                );

                form.reset();
                setLoading(false);
            }

        } catch (error) {

            console.error("IOIS Registration Error:", error);

            showMessage(
                "Registration के दौरान unexpected error आया। कृपया दोबारा कोशिश करें।",
                "error"
            );

            setLoading(false);
        }
    });
});
