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
    ".section__head, .card, .bottle, .about__copy, .about__card, .visit__block, " +
    ".event, .quote, .faq details, .gift__copy, .gift__card-art, " +
    ".newsletter__copy, .newsletter__form, .map-card, .delivery-tile"
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

  // Newsletter signup — purely client-side for now.
  // Replace the body of the success branch with a real fetch() to your
  // mailing-list provider (Mailchimp, Buttondown, ConvertKit, etc.).
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const msg = document.getElementById("newsletter-msg");

  if (form && input && msg) {
    const setMessage = (text, type) => {
      msg.textContent = text;
      msg.classList.remove("is-error", "is-success");
      if (type) msg.classList.add(`is-${type}`);
    };

    const isValidEmail = (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();

      if (!value || !isValidEmail(value)) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
        setMessage("Please enter a valid email address.", "error");
        return;
      }

      input.removeAttribute("aria-invalid");
      setMessage(
        "Thanks! Check your inbox for a confirmation email.",
        "success"
      );
      form.reset();
    });

    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        input.removeAttribute("aria-invalid");
        setMessage("", null);
      }
    });
  }
})();
