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
    ".event, .quote, .faq details, .rewards__card, .rewards__tiers, " +
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

  // ---------------------------------------------------------------------------
  // Corner Pantry Rewards — client-side prototype.
  //
  // Card data is persisted in localStorage. This is intentional so customers
  // can try the experience without us standing up a backend. For production:
  //   1. Replace localStorage with calls to your loyalty backend (Square
  //      Loyalty, Toast Loyalty, Loverse, or a custom API).
  //   2. Have the POS / delivery webhooks credit points server-side keyed by
  //      phone number. The card displayed here would just be a thin client
  //      reading the authoritative balance.
  // ---------------------------------------------------------------------------
  const REWARDS_KEY = "cp-rewards-card";
  const WELCOME_BONUS = 50;
  const TIERS = [
    { points: 100, label: "$5 off" },
    { points: 250, label: "Free pint glass" },
    { points: 500, label: "$25 store credit" },
    { points: 1000, label: "$60 credit + bottle of the month" },
  ];

  const signupEl = document.getElementById("rewards-signup");
  const balanceEl = document.getElementById("rewards-balance");
  const rewardsForm = document.getElementById("rewards-form");
  const rewardsMsg = document.getElementById("rewards-msg");
  const rewardsPointsEl = document.getElementById("rewards-points");
  const rewardsMemberNameEl = document.getElementById("rewards-member-name");
  const rewardsToNextAmountEl = document.getElementById("rewards-tonext-amount");
  const rewardsToNextRewardEl = document.getElementById("rewards-tonext-reward");
  const rewardsProgressEl = document.getElementById("rewards-progress");
  const rewardsRefreshBtn = document.getElementById("rewards-refresh");
  const rewardsSignoutBtn = document.getElementById("rewards-signout");
  const tiersList = document.getElementById("tiers-list");

  const loadCard = () => {
    try {
      const raw = localStorage.getItem(REWARDS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saveCard = (data) => {
    try {
      localStorage.setItem(REWARDS_KEY, JSON.stringify(data));
    } catch {}
  };

  const clearCard = () => {
    try {
      localStorage.removeItem(REWARDS_KEY);
    } catch {}
  };

  const renderTiers = (points) => {
    if (!tiersList) return;
    tiersList.querySelectorAll("li").forEach((li) => {
      const need = Number(li.dataset.points);
      li.classList.toggle("is-unlocked", points >= need);
      li.classList.remove("is-next");
    });
    const nextLi = Array.from(tiersList.querySelectorAll("li"))
      .find((li) => Number(li.dataset.points) > points);
    if (nextLi) nextLi.classList.add("is-next");
  };

  const renderCard = () => {
    if (!signupEl || !balanceEl) return;
    const card = loadCard();
    if (!card) {
      signupEl.hidden = false;
      balanceEl.hidden = true;
      renderTiers(0);
      return;
    }
    signupEl.hidden = true;
    balanceEl.hidden = false;
    const points = Math.max(0, Math.floor(card.points || 0));
    rewardsPointsEl.textContent = points.toLocaleString("en-US");
    rewardsMemberNameEl.textContent = (card.name || "Friend").split(" ")[0];

    const nextTier = TIERS.find((t) => t.points > points) || TIERS[TIERS.length - 1];
    const reached = points >= nextTier.points;
    const remaining = Math.max(0, nextTier.points - points);

    if (reached) {
      rewardsToNextAmountEl.textContent = "0";
      rewardsToNextRewardEl.textContent = "every reward unlocked!";
    } else {
      rewardsToNextAmountEl.textContent = remaining.toLocaleString("en-US");
      rewardsToNextRewardEl.textContent = nextTier.label;
    }

    const prevTier = [...TIERS].reverse().find((t) => t.points <= points);
    const fromBase = prevTier ? prevTier.points : 0;
    const span = Math.max(1, nextTier.points - fromBase);
    rewardsProgressEl.max = span;
    rewardsProgressEl.value = Math.min(span, points - fromBase);

    renderTiers(points);
  };

  const setRewardsMessage = (text, type) => {
    if (!rewardsMsg) return;
    rewardsMsg.textContent = text;
    rewardsMsg.classList.remove("is-error", "is-success");
    if (type) rewardsMsg.classList.add(`is-${type}`);
  };

  const normalizePhone = (raw) => raw.replace(/[^\d]/g, "");

  rewardsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(rewardsForm);
    const name = String(fd.get("name") || "").trim();
    const phone = normalizePhone(String(fd.get("phone") || ""));

    if (!name) {
      setRewardsMessage("Please enter your name.", "error");
      return;
    }
    if (phone.length < 10) {
      setRewardsMessage("Please enter a valid phone number.", "error");
      return;
    }

    saveCard({
      name,
      phone,
      points: WELCOME_BONUS,
      joinedAt: Date.now(),
    });
    setRewardsMessage("", null);
    rewardsForm.reset();
    renderCard();
  });

  rewardsRefreshBtn?.addEventListener("click", () => {
    // In production, fetch the authoritative balance from your loyalty
    // backend here. For the prototype, we just re-render localStorage.
    renderCard();
  });

  rewardsSignoutBtn?.addEventListener("click", () => {
    const ok = window.confirm("Sign out of your Rewards card on this device?");
    if (!ok) return;
    clearCard();
    renderCard();
  });

  renderCard();
})();
