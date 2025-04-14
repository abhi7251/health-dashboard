function showAlert(message, type = "success", timeout = 1000) {
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
            setTimeout(() => alertBox.remove(), timeout); // Ensure complete removal
        }
    }, timeout);
}


function togglePasswordVisibility(isVisible, icon) {
    if (icon) {
        let passwordField = document.getElementById("passField");
        if (passwordField) {
            passwordField.type = isVisible ? "text" : "password";
            icon.classList.toggle("fa-eye", isVisible);
            icon.classList.toggle("fa-eye-slash", !isVisible);
        }
    }
}

// Show password on press (mouse or touch)
["mousedown", "touchstart"].forEach(eventType => {
    document.addEventListener(eventType, function (event) {
        const button = event.target.closest("#toggleBtn");
        if (button) {
            const icon = button.querySelector("#togglePass");
            togglePasswordVisibility(true, icon);
        }
    });
});


["mouseup", "touchend"].forEach(eventType => {
    document.addEventListener(eventType, function (event) {
        const button = event.target.closest("#toggleBtn");
        if (button) {
            const icon = button.querySelector("#togglePass");
            togglePasswordVisibility(false, icon);
        }
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

document.addEventListener('keydown', async function(event) {
    if (event.altKey) {
      switch (event.key.toLowerCase()) {
        case 'r':
          event.preventDefault();
          syncData();
          break;
        case 'l':
          event.preventDefault();
          if (await checkLoginStatus()) {
            logout(event);
          } 
          else {
            loadContent("login.html");
          }
          break;
        case 'g':
            event.preventDefault();
            loadContent("register.html");
            break;

        case 'a':
            event.preventDefault();
            loadDashBoard();
            break;

        case 'h':
            event.preventDefault();
            loadContent("index.php");
            break;

        case 'b':
            event.preventDefault();
            loadContent("about.html");
            break;

      }
    }
  });
  