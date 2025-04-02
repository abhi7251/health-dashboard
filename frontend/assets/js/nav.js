function setActiveLinkById(linkId) {
    $(".nav-item a").removeClass("active"); // Remove 'active' from all links
    $("#" + linkId).addClass("active"); // Add 'active' to the selected link
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
    loadContent("about.html", function () {
        loadGLBModel("man", "assets/img/heart.glb", 1.5, 3);
    });
});

document.getElementById("activityLink").addEventListener("click", function (event) {
    event.preventDefault();
    loadContent("dashboard.html", function(){
        createCharts();
        showDetailChart();
     
    });
});


