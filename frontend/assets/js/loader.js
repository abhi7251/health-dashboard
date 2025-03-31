loadGLBModel("watch", "assets/img/watch.glb", 1);
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
                document.getElementById("content").innerHTML = content.innerHTML;
                loadGLBModel("watch", "assets/img/watch.glb", 1);
                setActiveLinkById("homeLink");
            } else {
                if (page === "about.html") { 
                    setActiveLinkById("aboutLink");
                } else if (page === "dashboard.html") { 
                    setActiveLinkById("activityLink");
                }
                document.getElementById("content").innerHTML = data;
            }

            // Collapse the navbar after clicking a link
            let navbar = document.getElementById("navcol-1");
            let bsCollapse = new bootstrap.Collapse(navbar, {
                toggle: false
            });
            bsCollapse.hide();
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
            console.error("Error:", error);
        });
}



function setActiveLinkById(linkId) {
    $(".nav-item a").removeClass("active"); // Remove 'active' from all links
    $("#" + linkId).addClass("active"); // Add 'active' to the selected link
}

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
    $(document).on("keypress", function (event) {
        if (event.which === 13) { // Check if Enter key is pressed
            let button = $("#submitBtn");
            if (button.length) { // Ensure button exists
                button.click();
            }
        }
    });
});
