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

let first = true;

document.getElementById("activityLink").addEventListener("click", async function (event) {
    event.preventDefault();

    loadContent("dashboard.html", async function () {
        createCharts();

        const syncBtnDesktop = document.getElementById("syncBtnDesktop");
        const syncBtnMobileWrapper = document.getElementById("syncBtnMobileWrapper");


        const showSyncButtons = await checkLoginStatus() && await checkLinkedStatus();

        toggleVisibility(syncBtnDesktop, showSyncButtons, "d-md-inline-block", "d-md-none");
        toggleVisibility(syncBtnMobileWrapper, showSyncButtons, "d-block", "d-none");

        if (showSyncButtons) {
            if (first) {
                syncData();
                first = false;
            }
            await loadData();
            await fetchHistoryData();
        }
    });
});

function toggleVisibility(element, show, showClass, hideClass) {
    if (!element) return;
    element.classList.toggle(showClass, show);
    element.classList.toggle(hideClass, !show);
}






