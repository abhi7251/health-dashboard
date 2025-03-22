function loadContent(page) {
    console.log("I am called");
    if(page == "index.html") {
        document.getElementById("content").innerHTML = "<p>Loading...</p>";
        fetch('index.html')
    .then(response => response.text())
    .then(html => {
        // Create a new DOM parser
        const parser = new DOMParser();
        // Parse the fetched HTML string
        const doc = parser.parseFromString(html, 'text/html');
        // Extract the desired content
        const content = doc.getElementById('content');
        if (content) {
            // Insert the extracted content into the current page
            document.getElementById('content').innerHTML = content.innerHTML;
        } else {
            console.error('Content not found in the fetched page.');
        }
    })
    .catch(error => {
        console.error('Error fetching the page:', error);
    });

        return;
    }

    document.getElementById("content").innerHTML = "<p>Loading...</p>";
    fetch(page)
    .then(response => response.text())
    .then(data => {
        document.getElementById("content").innerHTML = data;
    })
    .catch(error => {
        document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
        console.error("Error:", error);
    });
}

var elements = document.getElementsByClassName('homeLink');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', function() {
        event.preventDefault();
        loadContent('index.html');
    });
}



document.getElementById('aboutLink').addEventListener('click', function(event) {
    event.preventDefault();
    loadContent('about.html');
});

document.getElementById('activityLink').addEventListener('click', function(event) {
    event.preventDefault();
    loadContent('dashboard.html');
});

document.addEventListener("click", function (event) {
    if (event.target.id === "registerLink") {
        event.preventDefault();
        loadContent('register.html');
    }
});


document.addEventListener("mousedown", function (event) {
    let togglePass = event.target.closest("#togglePass");
    if (togglePass) {
        let passwordField = document.getElementById("passField");
        let icon = togglePass.querySelector("i");

        if (passwordField) {
            passwordField.type = "text";  // Show password
            if (icon) icon.classList.replace("bi-eye", "bi-eye-slash"); // Change to eye-slash
        }
    }
});

document.addEventListener("mouseup", function (event) {
    let togglePass = event.target.closest("#togglePass");
    if (togglePass) {
        let passwordField = document.getElementById("passField");
        let icon = togglePass.querySelector("i");

        if (passwordField) {
            passwordField.type = "password";  // Hide password
            if (icon) icon.classList.replace("bi-eye-slash", "bi-eye"); // Change back to eye
        }
    }
});

// Optional: Also hide password if mouse leaves the button
document.addEventListener("mouseleave", function (event) {
    let togglePass = event.target.closest("#togglePass");
    if (togglePass) {
        let passwordField = document.getElementById("passField");
        let icon = togglePass.querySelector("i");

        if (passwordField) {
            passwordField.type = "password";  // Hide password
            if (icon) icon.classList.replace("bi-eye-slash", "bi-eye"); // Reset icon
        }
    }
});


document.getElementById('loginLink').addEventListener('click', function(event) {
    event.preventDefault();
    loadContent('login.html');
});

