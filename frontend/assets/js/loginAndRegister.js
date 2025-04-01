document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

document.addEventListener("click", function (event) {
    if (event.target.id === "registerLink") {
        event.preventDefault();
        loadContent("register.html");
    }
});


// Function to check login status and update button
function checkLoginStatus() {
    fetch("../backend/session_status.php")
        .then(response => response.json())
        .then(data => {
            const loginButton = document.getElementById("loginLink");
            if (data.logged_in) {
                loginButton.innerHTML = "Logout";
                loginButton.removeEventListener("click", loginHandler);
                loginButton.addEventListener("click", logout);
            } else {
                loginButton.innerHTML = "Login";
                loginButton.removeEventListener("click", logout);
                loginButton.addEventListener("click", loginHandler);
            }
        })
        .catch(error => console.error("Error checking session:", error));
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
                if (passField.value === verifyField.value) {
                    if(isFormValid("registerForm")){ 
                        let hasError = false;

                        $("#registerUsername, #registerEmail, #registerMobile").each(function () {
                            if ($(this).hasClass("input-error")) {
                                hasError = true;
                                return false; 
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

    fetch("../backend/logout.php", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showAlert(data.message, "warning", 3000);
                checkLoginStatus(); // Refresh button
                loadContent(data.redirect); // Redirect
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

    checkLoginStatus();
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

    checkLoginStatus();
}


$(document).ready(function () {
    let typingTimer; 
    let doneTypingInterval = 500;

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

    // Use event delegation for delayed binding
    $(document).on("input", "#registerUsername, #registerEmail, #registerMobile", function () {
        let fieldName = $(this).attr("id");
        let value = $(this).val().trim();
        let error = $("#" + fieldName + "Error");
        let inputField = $("#" + fieldName);

        let field = fieldName.replace("register", "").toLowerCase(); 
        clearTimeout(typingTimer);
        

        if (value.length > 0) {
            typingTimer = setTimeout(() => {
                checkAvailability(field, value, fieldName);
            }, doneTypingInterval);
        } else {
            error.text("").hide();
            inputField.removeClass("input-error");
        }
    });
});
