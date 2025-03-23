function loadContent(page) {
    document.getElementById("content").innerHTML = "<p>Loading...</p>";

    fetch(page)
        .then(response => response.text())
        .then(data => {
            if (page === "index.html") {
                // Extract only the content div
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");
                const content = doc.getElementById("content");
                document.getElementById("content").innerHTML = content ? content.innerHTML : "Error loading content.";
            } else {
                document.getElementById("content").innerHTML = data;
            }
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
            console.error("Error:", error);
        });
}

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
    loadContent("about.html");
});

document.getElementById("activityLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("dashboard.html");
});

document.addEventListener("click", function (event) {
    if (event.target.id === "registerLink") {
        event.preventDefault();
        loadContent("register.html");
    }
});

document.getElementById("loginLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("login.html");
});

// jQuery for adding "active" class on navbar items
$(document).ready(function () {
    $(".nav-item a").click(function () {
        $(".nav-item a").removeClass("active"); // Remove 'active' from all <a> tags
        $(this).addClass("active"); // Add 'active' to the clicked <a> tag
    });
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

// Password match validation on form submit
document.addEventListener("click", function (event) {
    let form = event.target.closest("#submitBtn"); // Ensure we're checking the form
    if (form) {
        let passField = document.getElementById("passField");
        let verifyField = document.getElementById("verifyField");
               

        if (passField && verifyField) {
            if (passField.value === verifyField.value) {
                verifyField.setCustomValidity("");
            } else {
                event.preventDefault(); // Stop form submission
                verifyField.setCustomValidity("Passwords do not match.");
                verifyField.reportValidity();
            }
        }
    }
});
