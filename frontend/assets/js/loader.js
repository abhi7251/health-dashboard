loadGLBModel("watch", "assets/img/watch.glb", 1);

function loadContent(page, callback = null) {
    const contentDiv = document.getElementById("content");
    const footer = document.getElementById("footer");

    // Show loader
    contentDiv.innerHTML = '<div class="loader"></div>';
    footer.style.visibility = "hidden";

    // Collapse the navbar
    let navbar = document.getElementById("navcol-1");
    let bsCollapse = new bootstrap.Collapse(navbar, {
        toggle: false
    });
    bsCollapse.hide();
    
    // Start a timer
    const startTime = Date.now();


    fetch(page)
        .then(response => response.text())
        .then(data => {
            const elapsed = Date.now() - startTime;
            const delay = Math.max(250 - elapsed, 0); 
            console.log("Elapsed time:", elapsed, "ms, Delay:", delay, "ms");
            setTimeout(() => {
                if (page === "index.php") {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, "text/html");
                    const content = doc.getElementById("content");
                    contentDiv.innerHTML = content.innerHTML;
                    loadGLBModel("watch", "assets/img/watch.glb", 1);
                    setActiveLinkById("homeLink");
                } else {
                    if (page === "about.html") { 
                        setActiveLinkById("aboutLink");
                    } else if (page === "dashboard.html") { 
                        setActiveLinkById("activityLink");
                    }
                    contentDiv.innerHTML = data;
                }

                

                // Callback and footer
                if (callback) callback();
                footer.style.visibility = "visible";
            }, delay);
        })
        .catch(error => {
            console.error("Error:", error);
        });
        
}

document.addEventListener("DOMContentLoaded", function () { 
    // Remove the #_=_ fragment from the URL
    if (window.location.hash === "#_=_") {
        history.replaceState(null, null, window.location.href.split("#")[0]);
    }
});
