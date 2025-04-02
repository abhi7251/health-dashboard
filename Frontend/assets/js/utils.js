function showAlert(message, type = "success", timeout = 3000) {
    let messageDiv = document.getElementById("alertMessage");

    messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Auto-hide after timeout
    setTimeout(() => {
        let alertBox = document.querySelector("#alertMessage .alert");
        if (alertBox) {
            alertBox.classList.remove("show"); // Bootstrap fade effect
            alertBox.classList.add("fade"); 
            setTimeout(() => alertBox.remove(), 500); // Ensure complete removal
        }
    }, timeout);
}

// Hide password again on mouseup
document.addEventListener("mouseup", function (event) {
    let togglePass = event.target.closest("#togglePass");
    if (togglePass) {
        let passwordField = document.getElementById("passField");
        if (passwordField) {
            passwordField.type = "password"; // Hide password
        }
    }
});


// Toggle password visibility on mousedown
document.addEventListener("mousedown", function (event) {
    let togglePass = event.target.closest("#togglePass");
    if (togglePass) {
        let passwordField = document.getElementById("passField");
        if (passwordField) {
            passwordField.type = "text"; // Show password
        }
    }
});


// Mobile Support
document.addEventListener("touchstart", function (event) {
    if (event.target.closest("#togglePass")) {
        togglePasswordVisibility(true);
    }
});

document.addEventListener("touchend", function (event) {
    if (event.target.closest("#togglePass")) {
        togglePasswordVisibility(false);
    }
});


$(document).ready(function () {
    $(document).on("keydown", function (event) {
        if (event.key === "Enter") { // Modern way to check for Enter key
            let button = $("#submitBtn");
            if (button.length) {
                button.click();
            }
        }
    });
});