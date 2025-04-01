

// Handle home links
var elements = document.getElementsByClassName("homeLink");
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function (event) {
        event.preventDefault();
        loadContent("index.html");
    });
}

// Handle other navigation links
document.getElementById("aboutLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("about.html", function () {
        loadGLBModel("man", "assets/img/heart.glb", 1.5);
    });
});

document.getElementById("activityLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("dashboard.html");
});


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
