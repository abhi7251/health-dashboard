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

function togglePasswordVisibility(isVisible, icon) {
    if(icon){
        let passwordField = document.getElementById("passField");
        if(isVisible){
            if (passwordField) {
                passwordField.type = "text"; // Show password
                icon.classList.toggle("fa-eye");
                icon.classList.toggle("fa-eye-slash");
            }
        }
        else{
            if (passwordField) {
                passwordField.type = "password"; // hide password
                icon.classList.toggle("fa-eye-slash");
                icon.classList.toggle("fa-eye");
            }
        }

    }
}

// Toggle password visibility on mousedown
["mousedown", "touchstart"].forEach(eventType => {
    document.addEventListener(eventType, function (event) {
        let icon = event.target.closest("#togglePass");
        togglePasswordVisibility(true, icon);
    });
});


// Hide password again on mouseup
["mouseup", "touchend"].forEach(eventType => {
    document.addEventListener(eventType, function (event) {
        let icon = event.target.closest("#togglePass");
        togglePasswordVisibility(false, icon);
    });
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