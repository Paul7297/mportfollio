(function () {
  "use strict";

  const header = document.querySelector("#header");
  const headerToggle = document.querySelector(".header-toggle");

  if (header && headerToggle) {
    headerToggle.addEventListener("click", function () {
      header.classList.toggle("header-show");
      headerToggle.classList.toggle("bi-list");
      headerToggle.classList.toggle("bi-x");
    });

    document.querySelectorAll("#navmenu a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (header.classList.contains("header-show")) {
          header.classList.remove("header-show");
          headerToggle.classList.add("bi-list");
          headerToggle.classList.remove("bi-x");
        }
      });
    });
  }

  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", function () {
      preloader.remove();
    });
  }

  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    function toggleScrollTop() {
      scrollTop.classList.toggle("active", window.scrollY > 100);
    }

    scrollTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop);
  }

  window.addEventListener("load", function () {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });

    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
        window.scrollTo({
          top: section.offsetTop - scrollMarginTop,
          behavior: "smooth"
        });
      }
    }
  });

  const navLinks = document.querySelectorAll(".navmenu a[href^='#']");

  function updateActiveNavLink() {
    const position = window.scrollY + 200;

    navLinks.forEach(function (link) {
      const section = document.querySelector(link.hash);
      if (!section) {
        return;
      }

      const isActive = position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight;
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("load", updateActiveNavLink);
  document.addEventListener("scroll", updateActiveNavLink);
})();
