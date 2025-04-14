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
                loadContent("index.php");
                
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
    const profileContainer = document.getElementById("profileDropdownContainer");
    const userNameEl = document.getElementById("userName");
    const userUserNameEl = document.getElementById("userUsername");
    const userEmailEl = document.getElementById("userEmail");
    const linkButton = document.getElementById("linkLink");

    const isLoggedIn = await checkLoginStatus();

    if (isLoggedIn) {
        // Hide login, show profile
        loginButton.style.display = "none";
        profileContainer.classList.remove("d-none");
        profileContainer.classList.add("d-inline-block");

        // Fetch user data (replace this with your actual endpoint)
        const res = await fetch("../backend/get_user.php");
        const user = await res.json();
        if (user.status === "success") {
            userNameEl.textContent = user.name;
            // Set first letter of name as profile initial
            const profileInitial = document.getElementById("profileInitial");
            const profileButton = document.getElementById('profileDropdown');
            if (user.name && profileInitial) {
                //retrieve last name first letter
                const lastName = user.name.split(" ").slice(-1)[0];
                profileInitial.textContent = user.name.trim().charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase();
                // Generate a random color for the profile button
                const randomColor = '#' + ((Math.random() * 0x191919) | 0).toString(16).padStart(6, '0');
                profileButton.style.backgroundColor = randomColor;
            }

            userEmailEl.textContent = user.email;
            userUserNameEl.innerHTML = `<b>Hi, </b> ${user.username}`;
        } else {
            showAlert(user.message, "danger", 3000);
            userNameEl.textContent = "User";
            userEmailEl.textContent = "email";
            userUserNameEl.textContent = "username";
        }
        linkButton.style.display = "inline-block";
        setLinkedButton(linkButton);

    } else {
        // Show login, hide profile
        loginButton.style.display = "inline-block";
        profileContainer.classList.add("d-none");
        profileContainer.classList.remove("d-inline-block");

        linkButton.style.display = "none";

        loginButton.innerHTML = "Login / Register";
        loginButton.removeEventListener("click", logout);
        loginButton.addEventListener("click", loginHandler);
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



async function logout(event) {
    event.preventDefault();
    showAlert("Logging out...", "warning", 3000);

    try {
        const isLinked = await checkLinkedStatus();
        
        // send the request to backend to clear the session
        const response = await fetch("../backend/logout.php", { method: "POST" });
        const data = await response.json();

        if (data.status === "success") {
            showAlert(data.message, "success", 3000);
            await setLoginStatus(); // Refresh button 

            if (isLinked) {
               await resetChartData();
               fitbitLogout();
            } 

            loadContent("index.php");
        }
    } catch (error) {
        console.error("Logout Error:", error);
        showAlert("An error occurred while logging out.", "danger", 3000);
    }
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
            setLoginStatus();
            //wait untill setLoginStatus finish execution
            setTimeout(() => {
                loadContent(data.redirect);
            }, 1000); // wait for 1 second before loading content
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

document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "logoutButton") {
        logout(e);
    }
});


function deleteUser(){
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    fetch("../backend/delete_user.php", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                showAlert(data.message, "success", 3000);
                setLoginStatus(); // Refresh button 
                loadContent("index.php");
            } else {
                showAlert(data.message, "danger", 3000);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            showAlert("An error occurred. Please try again.", "danger", 3000);
        });
}

