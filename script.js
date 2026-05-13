(() => {
  "use strict";

  const STORAGE_KEY = "cp-age-verified";

  const ageGate = document.getElementById("age-gate");
  const ageYes = document.getElementById("age-yes");
  const ageNo = document.getElementById("age-no");

  const showGate = () => {
    if (!ageGate) return;
    ageGate.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const hideGate = () => {
    if (!ageGate) return;
    ageGate.classList.add("is-leaving");
    document.body.style.overflow = "";
    setTimeout(() => {
      ageGate.hidden = true;
      ageGate.classList.remove("is-leaving");
    }, 380);
  };

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "yes") {
      ageGate.hidden = true;
    } else {
      showGate();
    }
  } catch {
    showGate();
  }

  ageYes?.addEventListener("click", () => {
    try { sessionStorage.setItem(STORAGE_KEY, "yes"); } catch {}
    hideGate();
  });

  ageNo?.addEventListener("click", () => {
    window.location.href = "https://www.responsibility.org/";
  });

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("primary-nav");

  navToggle?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      }
    });
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const revealTargets = document.querySelectorAll(
    ".section__head, .card, .bottle, .about__copy, .about__card, .visit__block"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
