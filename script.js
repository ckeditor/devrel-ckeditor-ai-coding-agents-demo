// Small bits of plain-DOM behavior for the landing page.
// No frameworks, no build step.

(function () {
  "use strict";

  // Keep the footer copyright year current.
  var yearHolder = document.querySelector(".site-footer .muted:last-child");
  if (yearHolder) {
    yearHolder.textContent =
      "© " + new Date().getFullYear() + " Trailhead. All rights reserved.";
  }

  // Smooth-scroll fallback for in-page anchor links (for browsers without
  // CSS scroll-behavior).
  var supportsSmoothScroll =
    "scrollBehavior" in document.documentElement.style;

  if (!supportsSmoothScroll) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href").slice(1);
        var target = id ? document.getElementById(id) : null;
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }
})();
