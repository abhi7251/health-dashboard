loadGLBModel("watch", "assets/img/watch.glb", 1);

function loadContent(page, callback=null) {
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
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
            console.error("Error:", error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
	(function () {
		if (!('requestAnimationFrame' in window)) return;

		var backgrounds = [];
		var parallaxBackgrounds = document.querySelectorAll('[data-bss-scroll-zoom]');

		for (var el of parallaxBackgrounds) {
			var bg = document.createElement('div');

			bg.style.backgroundImage = el.style.backgroundImage;
			bg.style.backgroundSize = 'cover';
			bg.style.backgroundPosition = 'center';
			bg.style.position = 'absolute';
			bg.style.height = '100%';
			bg.style.width = '100%';
			bg.style.top = 0;
			bg.style.left = 0;
			bg.style.zIndex = -100;

			el.appendChild(bg);
			backgrounds.push({ element: bg, speed: parseFloat(el.getAttribute('data-bss-scroll-zoom-speed')) || 1 });

			el.style.position = 'relative';
			el.style.background = 'transparent';
			el.style.overflow = 'hidden';
		}

		function updateParallax() {
			var scrollTop = window.pageYOffset;

			for (var bg of backgrounds) {
				var rect = bg.element.parentElement.getBoundingClientRect();
				var offset = (scrollTop - rect.top) * bg.speed;
				bg.element.style.transform = `translateY(${offset}px)`;
			}

			requestAnimationFrame(updateParallax);
		}

		requestAnimationFrame(updateParallax);
	})();
}, false);

