document.addEventListener("click", function (event) {
    if (event.target.id === "registerLink") {
        event.preventDefault();
        loadContent("register.html");
    }
});


async function checkLinkedStatus() {
    try {
        const response = await fetch("../backend/api/isLinked.php");
        const data = await response.json();
        return data.linked === true;
    } catch (error) {
        showAlert("Error checking link status", "danger", 3000);
        return false;
    }
}

async function setLinkedButton(linkLink) {
    const button = linkLink.querySelector("button"); 
    const icon = button.querySelector("i");            

    const isLinked = await checkLinkedStatus(); 

    if (isLinked) {
        button.textContent = "De-Link";
        button.appendChild(icon); 
        icon.classList.replace("fa-arrow-right", "fa-sync");

        // Set onclick for de-link
        button.onclick = async () => {
            const confirmed = confirm("Are you sure you want to de-link your Fitbit account?");
            if (!confirmed) return;

            const res = await fetch("../backend/api/deLink.php", { method: "POST" });
            const result = await res.json();

            if (result.success) {
                showAlert("Fitbit account de-linked!", "success", 3000);
                setLinkedButton(linkLink); // Refresh button state
            } else {
                showAlert("Failed to de-link account.", "danger", 3000);
            }
        };

    } else {
        button.textContent = "Link";
        button.appendChild(icon);
        icon.classList.replace("fa-sync", "fa-arrow-right");

        // Set onclick for link
        button.onclick = () => {
            window.location.href = "../backend/api/fitbit_auth.php";
        };
    }
}

// Function to check login status and update button
async function checkLoginStatus() {
    try {
        const response = await fetch("../backend/session_status.php");
        const data = await response.json();
        return data.logged_in === true;
    } catch (error) {
        console.error("Error checking session:", error);
        return false;
    }
}

async function setLoginStatus() {
    const loginButton = document.getElementById("loginLink");
    const linkButton = document.getElementById("linkLink");

    const isLoggedIn = await checkLoginStatus(); // now this works correctly

    if (isLoggedIn) {
        loginButton.innerHTML = "Logout";
        loginButton.removeEventListener("click", loginHandler);
        loginButton.addEventListener("click", logout);
        linkButton.style.display = "inline-block";
        setLinkedButton(linkButton); // this must also be async if it awaits inside
    } else {
        loginButton.innerHTML = "Login / Register";
        loginButton.removeEventListener("click", logout);
        loginButton.addEventListener("click", loginHandler);
        linkButton.style.display = "none";
    }
}




// Handle login & registration submit
document.addEventListener("click", function (event) {
    if (event.target.id === "submitBtn") {
        event.preventDefault();
        
        let passField = document.getElementById("passField");
        let verifyField = document.getElementById("verifyField");

        if (document.getElementById("registerForm")) { 
            if (passField && verifyField) {
                verifyField.setCustomValidity("");
                verifyField.reportValidity();
                if (passField.value === verifyField.value) {
                    if(isFormValid("registerForm")){ 
                        let hasError = false;

                        $("#registerUsername, #registerEmail, #registerMobile").each(function () {
                            if ($(this).hasClass("input-error")) {
                                hasError = true;
                            }
                        });

                        if (hasError) {
                            showAlert("Fix the errors before submitting.", "danger", 3000);
                            return;
                        }
                        register();
                    }
                }
                 else {
                    verifyField.setCustomValidity("Passwords do not match.");
                    verifyField.reportValidity();
                }
            }
        } else if (document.getElementById("loginForm")) {
            if(isFormValid("loginForm")){ 
                login();
            }
            
        } 
    }
});

function isFormValid(formId){
    let form = document.getElementById(formId);
    if (form && form.checkValidity()) {
        return true;
    }
    form.reportValidity(); 
    return false;
}

// Load login page
function loginHandler(event) {
    event.preventDefault();
    loadContent("login.html");
}

// Logout function
function logout(event) {
    event.preventDefault();
    showAlert("Logging out...", "warning", 3000);
    fetch("../backend/logout.php", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showAlert(data.message, "warning", 3000);
                setLoginStatus(); // Refresh button
                loadContent("index.php");
            }
        })
        .catch(error => {
            console.error("Logout Error:", error);
            showAlert("An error occurred while logging out.", "danger", 3000);
        });
}

// Login function with showAlert
function login() {
    let form = document.getElementById("loginForm");
    let formData = new FormData(form);

    fetch("../backend/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            loadContent(data.redirect);
            showAlert(data.message, "success", 3000);
        } else {
            showAlert(data.message, "danger", 3000);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showAlert("An error occurred. Please try again.", "danger", 3000);
    });

    setLoginStatus();
}


function register() {
    let form = document.getElementById("registerForm");
    let formData = new FormData(form);

    fetch("../backend/register.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            loadContent(data.redirect);
            showAlert(data.message, "success", 3000);
        } else {
            showAlert(data.message, "danger", 3000);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showAlert("An error occurred. Please try again.", "danger", 3000);
    });

    setLoginStatus();
}

document.addEventListener("DOMContentLoaded", function () {
    setLoginStatus();
});



$(document).ready(function () {
    let typingTimer;
    let doneTypingInterval = 1000;

    function checkAvailability(field, value, fieldName) {
        $.ajax({
            url: "../backend/check_availability.php",
            type: "POST",
            data: { [field]: value },
            dataType: "json",
            success: function (response) {
                let error = $("#" + fieldName + "Error");
                let inputField = $("#" + fieldName);

                if (response.status === "taken") {
                    error.text(response.message).show();
                    inputField.addClass("input-error");
                } else {
                    error.text("").hide();
                    inputField.removeClass("input-error");
                }
            }
        });
    }

    function validateAllFields() {
        $("#registerUsername, #registerEmail, #registerMobile").each(function () {
            let fieldName = $(this).attr("id");
            let value = $(this).val().trim();

            if (value.length > 0) {
                let field = fieldName.replace("register", "").toLowerCase();
                checkAvailability(field, value, fieldName);
            }
        });
    }

    // **Handle manual input & change events**
    $(document).on("input change", "#registerUsername, #registerEmail, #registerMobile", function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(validateAllFields, doneTypingInterval);
    });

    // **Fix autofill issue with interval check**
    setInterval(() => {
        validateAllFields();  // Runs every second to check for autofilled values
    }, 1000);
});

