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
    loadContent("frontend/about.html", function () { 
    });
});

let first = true;
document.getElementById("activityLink").addEventListener("click", loadDashBoard);

async function loadDashBoard(event = null) {
  event?.preventDefault();

  if(await checkLoginStatus()){
    loadContent("frontend/dashboard.html", async function () {
      createCharts();
      if ( await checkLinkedStatus()) {
        $("#syncBtn").css("display", "inline-block");
        setMetric();
        updateDetailChartTitle();
        await loadData();
        await fetchHistoryData();

        if (first) {
          syncData();
          first = false;
        }
      } else {
        resetChartData();
      }
    });
  }else{
    loadContent("frontend/login.html", function () {
    });
  }
}


