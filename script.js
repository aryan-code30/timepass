(() => {
  "use strict";

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
    ".section__head, .bottle, .about__copy, .about__card, .visit__block, " +
    ".event, .quote, .faq details, .rewards__card, .rewards__tiers, " +
    ".newsletter__copy, .newsletter__form, .map-card, .delivery-tile, " +
    ".filter-pill"
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

  // ---------------------------------------------------------------------------
  // Shop browser — Shop dropdown nav + filter pills + product grid.
  //
  // Product catalog is hard-coded here for now. To replace with a real
  // inventory feed, swap the PRODUCTS constant with a fetch() call to your
  // backend / CSV / Google Sheet — the rest of the rendering and filter
  // logic does not need to change.
  // ---------------------------------------------------------------------------
  const CATEGORIES = {
    snacks:   { label: "Snacks & Candy",      tone: "cocoa"   },
    frozen:   { label: "Frozen",              tone: "ice"     },
    pantry:   { label: "Pantry & Groceries",  tone: "wheat"   },
    drinks:   { label: "Drinks & Mixers",     tone: "citrus"  },
    wine:     { label: "Wine",                tone: "wine",   ageRestricted: true },
    spirits:  { label: "Spirits",             tone: "amber",  ageRestricted: true },
    beer:     { label: "Craft Beer",          tone: "hops",   ageRestricted: true },
    cocktail: { label: "Cocktail Aisle",      tone: "ruby",   ageRestricted: true },
  };

  const PRODUCTS = [
    // Snacks & Candy
    { cat: "snacks", name: "Hershey's Milk Chocolate", size: "1.55 oz", price: "$2.49", desc: "The classic. We stock the king-size too." },
    { cat: "snacks", name: "Reese's Peanut Butter Cups", size: "2-pack", price: "$2.49", desc: "Cold from the cooler is the right answer." },
    { cat: "snacks", name: "Doritos Nacho Cheese", size: "9.25 oz", price: "$4.99", desc: "Family bag. No judgment." },
    { cat: "snacks", name: "Lay's Classic Chips", size: "8 oz", price: "$3.99", desc: "Salt, oil, potato. Perfect." },
    { cat: "snacks", name: "Slim Jim Original", size: "0.97 oz", price: "$1.99", desc: "Snap into it." },
    { cat: "snacks", name: "Sour Patch Kids", size: "8 oz", price: "$3.49", desc: "Sour, sweet, gone." },
    { cat: "snacks", name: "Trail Mix", size: "6 oz", price: "$5.99", desc: "Nuts, raisins, M&Ms — the honest kind." },

    // Frozen
    { cat: "frozen", name: "DiGiorno Rising Crust Pepperoni", size: "28 oz", price: "$7.99", desc: "20 minutes from oven to couch." },
    { cat: "frozen", name: "Tombstone Original Cheese", size: "20 oz", price: "$4.99", desc: "Weeknight workhorse." },
    { cat: "frozen", name: "Ben & Jerry's Chunky Monkey", size: "pint", price: "$5.99", desc: "Bananas, walnuts, fudge. No notes." },
    { cat: "frozen", name: "Häagen-Dazs Vanilla", size: "14 oz", price: "$5.49", desc: "The vanilla against which all vanillas are judged." },
    { cat: "frozen", name: "Hot Pockets Pepperoni", size: "2-pack", price: "$3.99", desc: "Caution: filling is molten." },
    { cat: "frozen", name: "Eggo Homestyle Waffles", size: "10-ct", price: "$4.49", desc: "Toaster-ready breakfast." },
    { cat: "frozen", name: "Stouffer's Lasagna", size: "10.5 oz", price: "$5.99", desc: "Single-serve, oven-ready." },

    // Pantry & Groceries
    { cat: "pantry", name: "White Sandwich Bread", size: "20 oz loaf", price: "$3.49", desc: "Fresh delivery twice a week." },
    { cat: "pantry", name: "Whole Milk", size: "1 gallon", price: "$4.99", desc: "From a regional dairy." },
    { cat: "pantry", name: "Large Eggs, Grade A", size: "dozen", price: "$5.49", desc: "Cage-free when we can get them." },
    { cat: "pantry", name: "Barilla Spaghetti", size: "1 lb", price: "$1.99", desc: "Dinner in 9 minutes." },
    { cat: "pantry", name: "Cheerios", size: "12 oz", price: "$5.99", desc: "The bowl, not the diet." },
    { cat: "pantry", name: "Peanut Butter (Smooth)", size: "16 oz", price: "$4.99", desc: "Skippy or Jif, your call." },
    { cat: "pantry", name: "Heinz Ketchup", size: "20 oz", price: "$3.49", desc: "Squeeze bottle. Always." },

    // Drinks & Mixers
    { cat: "drinks", name: "Coca-Cola", size: "2 liter", price: "$2.99", desc: "Classic. Cold. Carbonated." },
    { cat: "drinks", name: "LaCroix Sparkling Water", size: "8-pack cans", price: "$5.99", desc: "Pamplemousse rules. Don't @ us." },
    { cat: "drinks", name: "Red Bull", size: "12 oz can", price: "$3.49", desc: "For the 3pm wall." },
    { cat: "drinks", name: "Tropicana Orange Juice", size: "52 oz", price: "$4.99", desc: "No pulp, lots of pulp — we stock both." },
    { cat: "drinks", name: "Starbucks Iced Coffee", size: "11 oz", price: "$3.49", desc: "Bottled, ready-to-pour." },
    { cat: "drinks", name: "Gatorade Cool Blue", size: "32 oz", price: "$2.99", desc: "Hydration on a hot day." },
    { cat: "drinks", name: "Fever-Tree Indian Tonic", size: "4-pack", price: "$5.99", desc: "Worth the upgrade. Trust." },

    // Wine
    { cat: "wine", name: "Sonoma Coast Pinot Noir", size: "750 ml", price: "$28", desc: "Cherry, silk, a whisper of oak." },
    { cat: "wine", name: "Argentinian Malbec", size: "750 ml", price: "$14", desc: "Tuesday-night red, all upside." },
    { cat: "wine", name: "Sancerre Sauvignon Blanc", size: "750 ml", price: "$24", desc: "Grass, lime, a long mineral finish." },
    { cat: "wine", name: "Provence Rosé", size: "750 ml", price: "$18", desc: "Pale pink. Beach in a bottle." },
    { cat: "wine", name: "Veuve Clicquot Brut", size: "750 ml", price: "$59", desc: "Yellow label. Always a yes." },
    { cat: "wine", name: "Prosecco Extra Dry", size: "750 ml", price: "$14", desc: "Mimosa engine. Brunch fuel." },

    // Spirits
    { cat: "spirits", name: "Buffalo Trace Bourbon", size: "750 ml", price: "$32", desc: "Caramel, oak, long finish." },
    { cat: "spirits", name: "Don Julio Blanco Tequila", size: "750 ml", price: "$48", desc: "Citrus, agave, no harsh edges." },
    { cat: "spirits", name: "Hendrick's Gin", size: "750 ml", price: "$34", desc: "Cucumber and rose. Made for tonic." },
    { cat: "spirits", name: "Tito's Handmade Vodka", size: "750 ml", price: "$24", desc: "Soft, neutral, mixes with anything." },
    { cat: "spirits", name: "Mount Gay Eclipse Rum", size: "750 ml", price: "$26", desc: "Barbados gold. Daiquiri-ready." },
    { cat: "spirits", name: "Lagavulin 16", size: "750 ml", price: "$89", desc: "Smoke, peat, brine. A treat." },

    // Craft Beer
    { cat: "beer", name: "Goose Island IPA", size: "6-pack cans", price: "$13", desc: "Chicago classic, citrus-forward." },
    { cat: "beer", name: "Lagunitas Hazy Wonder", size: "6-pack cans", price: "$13", desc: "Juicy, soft, easy." },
    { cat: "beer", name: "Allagash White", size: "6-pack bottles", price: "$11", desc: "Belgian wit. Coriander and orange peel." },
    { cat: "beer", name: "Modelo Especial", size: "12-pack cans", price: "$18", desc: "Crisp pilsner. Wins backyard." },
    { cat: "beer", name: "Two Brothers Domaine DuPage", size: "4-pack cans", price: "$10", desc: "Local French country ale." },
    { cat: "beer", name: "Founders Breakfast Stout", size: "4-pack cans", price: "$15", desc: "Coffee, chocolate, oats. Cold-night beer." },

    // Cocktail Aisle
    { cat: "cocktail", name: "Fever-Tree Tonic Water", size: "4-pack", price: "$5.99", desc: "The standard. Worth the upgrade." },
    { cat: "cocktail", name: "Angostura Aromatic Bitters", size: "4 oz", price: "$11", desc: "Old Fashioned non-negotiable." },
    { cat: "cocktail", name: "Maraschino Cherries", size: "10 oz jar", price: "$4.99", desc: "Bright red and proud of it." },
    { cat: "cocktail", name: "Fresh Lime", size: "each", price: "$0.79", desc: "Squeeze it yourself. Worth it." },
    { cat: "cocktail", name: "Coupe Glass Set", size: "set of 4", price: "$24", desc: "Stemmed, classic, dishwasher-safe." },
    { cat: "cocktail", name: "Bag of Ice", size: "5 lb", price: "$3.99", desc: "Kept rock-solid in the back freezer." },
  ];

  const productGrid = document.getElementById("product-grid");
  const shopStatus = document.getElementById("shop-status");
  const filterButtons = document.querySelectorAll(".filter-pill[data-cat]");
  let activeCategory = "all";

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
    );

  const productHTML = (p) => {
    const cat = CATEGORIES[p.cat];
    const tone = cat ? cat.tone : "default";
    const ageRestricted = cat && cat.ageRestricted;
    const initials = p.name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return `
      <article class="product" data-cat="${escapeHtml(p.cat)}">
        <div class="product__art product__art--${escapeHtml(tone)}" aria-hidden="true">
          <span class="product__mono">${escapeHtml(initials)}</span>
          ${ageRestricted ? '<span class="product__age">21+</span>' : ""}
        </div>
        <div class="product__body">
          <p class="product__cat">${escapeHtml(cat ? cat.label : p.cat)}</p>
          <h3 class="product__name">${escapeHtml(p.name)}</h3>
          <p class="product__desc">${escapeHtml(p.desc)}</p>
          <div class="product__meta">
            <span class="product__price">${escapeHtml(p.price)}</span>
            <span class="product__dot">·</span>
            <span class="product__size">${escapeHtml(p.size)}</span>
          </div>
        </div>
      </article>
    `;
  };

  const renderProducts = () => {
    if (!productGrid) return;
    productGrid.innerHTML = PRODUCTS.map(productHTML).join("");
  };

  const updateCounts = () => {
    const counts = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      counts[p.cat] = (counts[p.cat] || 0) + 1;
    });
    document.querySelectorAll(".filter-pill__count").forEach((el) => {
      const key = el.dataset.countFor;
      el.textContent = counts[key] || 0;
    });
  };

  const applyFilter = (cat) => {
    activeCategory = cat;
    if (!productGrid) return;
    const all = productGrid.querySelectorAll(".product");
    let visible = 0;
    all.forEach((el) => {
      const match = cat === "all" || el.dataset.cat === cat;
      el.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.cat === cat;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (shopStatus) {
      if (cat === "all") {
        shopStatus.textContent = `Showing all ${visible} items.`;
      } else {
        const label = CATEGORIES[cat] ? CATEGORIES[cat].label : cat;
        shopStatus.textContent = `Showing ${visible} item${visible === 1 ? "" : "s"} in ${label}.`;
      }
    }
  };

  if (productGrid) {
    renderProducts();
    updateCounts();
    applyFilter("all");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.cat));
    });
  }

  // ---------------------------------------------------------------------------
  // Shop dropdown mega-menu
  // ---------------------------------------------------------------------------
  const shopTrigger = document.getElementById("shop-trigger");
  const shopMenu = document.getElementById("shop-menu");
  const shopMenuLinks = shopMenu ? shopMenu.querySelectorAll("a[data-cat]") : [];

  const closeShopMenu = ({ refocus = false } = {}) => {
    if (!shopTrigger || !shopMenu) return;
    shopTrigger.setAttribute("aria-expanded", "false");
    shopMenu.classList.remove("is-open");
    setTimeout(() => {
      if (shopTrigger.getAttribute("aria-expanded") === "false") {
        shopMenu.hidden = true;
      }
    }, 180);
    if (refocus) shopTrigger.focus();
  };

  const openShopMenu = () => {
    if (!shopTrigger || !shopMenu) return;
    shopMenu.hidden = false;
    requestAnimationFrame(() => shopMenu.classList.add("is-open"));
    shopTrigger.setAttribute("aria-expanded", "true");
  };

  shopTrigger?.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = shopTrigger.getAttribute("aria-expanded") === "true";
    if (isOpen) closeShopMenu();
    else openShopMenu();
  });

  document.addEventListener("click", (e) => {
    if (!shopMenu || shopMenu.hidden) return;
    if (e.target.closest("#shop-menu") || e.target.closest("#shop-trigger")) return;
    closeShopMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shopMenu && !shopMenu.hidden) {
      closeShopMenu({ refocus: true });
    }
  });

  shopMenuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const cat = link.dataset.cat;
      closeShopMenu();
      if (productGrid && cat) {
        // Defer the filter slightly so smooth-scroll lands on the new layout.
        setTimeout(() => applyFilter(cat), 80);
      }
    });
  });
})();
