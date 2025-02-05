document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/view/user/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, firstName, lastName, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Signup successful! Please login.");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Signup failed!");
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("Server error. Please try again later.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/view/user/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("user", JSON.stringify(data));
                    window.location.href = "chat.html";
                } else {
                    alert(data.message || "Login failed!");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("Server error. Please try again later.");
            }
        });
    }
});