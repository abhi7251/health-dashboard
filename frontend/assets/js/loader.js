loadGLBModel("watch", "assets/img/watch.glb", 1);

function loadContent(page, callback=null) {
    document.getElementById("content").innerHTML = '<div class="loader"></div>';
    //hide footer
    document.getElementById("footer").style.visibility = "hidden";
 
    fetch(page)
        .then(response => response.text())
        .then(data => {
            if (page === "index.php") {
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
            if (callback) {
                callback();
            }
            document.getElementById("footer").style.visibility = "visible";
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
            console.error("Error:", error);
        });
}


