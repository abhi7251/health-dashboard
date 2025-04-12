function setActiveLinkById(linkId) {
    $(".nav-item a").removeClass("active"); // Remove 'active' from all links
    $("#" + linkId).addClass("active"); // Add 'active' to the selected link
}

// Handle home links
var elements = document.getElementsByClassName("homeLink");
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function (event) {
        event.preventDefault();
        loadContent("index.php");
    });
}

// Handle other navigation links
document.getElementById("aboutLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("about.html", function () { 
    });
});

document.getElementById("activityLink").addEventListener("click", async function (event) {
    event.preventDefault();
    loadContent("dashboard.html", async function () {
        createCharts();
        if (await checkLoginStatus() && await checkLinkedStatus()) {
            await loadData();
            await fetchHistoryData();
        }
    });
});


