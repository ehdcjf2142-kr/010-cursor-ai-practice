(function () {
  "use strict";

  var THEME_KEY = "intro-page-theme";
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");
  var themeToggle = document.getElementById("themeToggle");
  var navLinks = document.querySelectorAll(".sidebar-nav__link[href^='#']");
  var sections = document.querySelectorAll("main section[id]");

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "true");
      }
    } else {
      document.documentElement.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "false");
      }
    }
  }

  var initial = getStoredTheme();
  if (initial === "dark" || initial === "light") {
    applyTheme(initial === "light" ? "light" : "dark");
  } else {
    applyTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      var next = isLight ? "dark" : "light";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  function closeNav() {
    if (!navToggle || !navList) return;
    navToggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");
  }

  function openNav() {
    if (!navToggle || !navList) return;
    navToggle.setAttribute("aria-expanded", "true");
    navList.classList.add("is-open");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        openNav();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        closeNav();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  function updateActiveNav() {
    var scrollY = window.scrollY || window.pageYOffset;
    var offset = 140;
    var current = "";

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + scrollY - offset;
      if (scrollY >= top) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        var id = href.slice(1);
        link.classList.toggle("active", id === current);
      }
    });
  }

  var scrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          updateActiveNav();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateActiveNav();

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
