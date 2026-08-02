function appLinkAttrs(link) {
  if (link.startsWith("http") || link.startsWith("apps/")) {
    return ' target="_blank" rel="noopener noreferrer"';
  }
  return "";
}

function setTextIfChanged(el, next) {
  if (el && el.textContent !== next) {
    el.textContent = next;
  }
}

const CATEGORY_META = {
  Video: { icon: "🎬", order: 1 },
  Audio: { icon: "🎵", order: 2 },
  "Image & PDF": { icon: "🖼️", order: 3 },
  Calculators: { icon: "🔢", order: 4 },
  Converters: { icon: "🔄", order: 5 },
  Utilities: { icon: "🛠️", order: 6 },
  Other: { icon: "📱", order: 7 },
};

function getCategory(app) {
  const text = `${app.title} ${app.description}`.toLowerCase();
  if (/video|mp4|mov|gif|boomerang|housie/.test(text)) return "Video";
  if (/audio|mp3|m4a|aac|amr|wav|music|voice|sound/.test(text)) return "Audio";
  if (/image|pdf|photo|jpg|png|background|resize/.test(text))
    return "Image & PDF";
  if (/calculator|interest|bmi|byaj|sip|emi|gst|age|date/.test(text))
    return "Calculators";
  if (/convert|converter/.test(text)) return "Converters";
  if (/translator|text|scanner|uninstall|compress/.test(text))
    return "Utilities";
  return "Other";
}

function parseIosApps(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll(".app-card")).map((card) => {
    const icon = card.querySelector(".app-icon")?.getAttribute("src") || "";
    const titleLink = card.querySelector("h2 a");
    const titleHeading = card.querySelector("h2");
    const title = (
      titleLink?.textContent ||
      titleHeading?.textContent ||
      ""
    ).trim();
    const href = titleLink?.getAttribute("href") || "";
    const description = card.querySelector("p")?.textContent.trim() || "";
    const appStoreUrl =
      card.querySelector('a[href*="apps.apple.com"]')?.getAttribute("href") ||
      "";
    const productLink = href.startsWith("../apps/")
      ? href.replace("../", "")
      : "";

    return {
      title,
      description,
      icon,
      link: productLink || appStoreUrl,
      platform: "ios",
    };
  });
}

function platformLabel(platform) {
  return platform === "ios" ? "iOS & Mac" : "Android";
}

function renderAppCard(app) {
  return `
    <div class="app" data-category="${getCategory(app)}" data-platform="${app.platform}" data-title="${app.title.toLowerCase()}">
      <span class="platform-tag ${app.platform}">${platformLabel(app.platform)}</span>
      <img src="${app.icon}" alt="${app.title} Icon" loading="lazy" />
      <h2>${app.title}</h2>
      <p>${app.description}</p>
      <a href="${app.link}"${appLinkAttrs(app.link)}>Download</a>
    </div>
  `;
}

function renderFeaturedCard(app) {
  return `
    <a href="${app.link}" class="featured-app"${appLinkAttrs(app.link)}>
      <img src="${app.icon}" alt="${app.title} Icon" loading="lazy" />
      <div class="featured-app-info">
        <span class="platform-tag ${app.platform}">${platformLabel(app.platform)}</span>
        <h3>${app.title}</h3>
        <p>${app.description}</p>
        <span>View product →</span>
      </div>
    </a>
  `;
}

function updateCounts(androidCount, iosCount) {
  const total = androidCount + iosCount;

  document.title = `Modern Mobile Tools - ${total} Apps for Android, iOS & Mac`;

  setTextIfChanged(
    document.getElementById("android-count"),
    String(androidCount),
  );
  setTextIfChanged(document.getElementById("ios-count"), String(iosCount));
  setTextIfChanged(document.querySelector(".count-badge"), `${total} Apps`);
  setTextIfChanged(
    document.getElementById("about-android-count"),
    `${androidCount}+`,
  );
  setTextIfChanged(document.getElementById("about-ios-count"), `${iosCount}+`);
}

function renderCategories(apps) {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;

  const counts = {};
  apps.forEach((app) => {
    const cat = getCategory(app);
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort(
    (a, b) =>
      (CATEGORY_META[a[0]]?.order || 99) - (CATEGORY_META[b[0]]?.order || 99),
  );

  grid.innerHTML = sorted
    .map(
      ([name, count]) => `
      <button class="category-card" data-category="${name}" type="button">
        <div class="cat-icon">${CATEGORY_META[name]?.icon || "📱"}</div>
        <h3>${name}</h3>
        <p>${count} app${count !== 1 ? "s" : ""}</p>
      </button>
    `,
    )
    .join("");
}

function renderPlatformPills() {
  const container = document.getElementById("platform-pills");
  if (!container) return;

  container.innerHTML = `
    <button class="filter-pill active" data-platform="all" type="button">All Platforms</button>
    <button class="filter-pill" data-platform="android" type="button">Android</button>
    <button class="filter-pill" data-platform="ios" type="button">iOS &amp; Mac</button>
  `;
}

function renderFilterPills(categories) {
  const container = document.getElementById("filter-pills");
  if (!container) return;

  container.innerHTML = `
    <button class="filter-pill active" data-filter="all" type="button">All Categories</button>
    ${categories
      .map(
        ([name]) =>
          `<button class="filter-pill" data-filter="${name}" type="button">${name}</button>`,
      )
      .join("")}
  `;
}

function filterApps(query, category, platform) {
  const cards = document.querySelectorAll("#apps-grid .app");
  const noResults = document.getElementById("no-results");
  let visible = 0;

  cards.forEach((card) => {
    const title = card.dataset.title || "";
    const cat = card.dataset.category || "";
    const appPlatform = card.dataset.platform || "";
    const matchesSearch = !query || title.includes(query.toLowerCase());
    const matchesCategory = category === "all" || cat === category;
    const matchesPlatform = platform === "all" || appPlatform === platform;

    if (matchesSearch && matchesCategory && matchesPlatform) {
      card.classList.remove("hidden");
      visible++;
    } else {
      card.classList.add("hidden");
    }
  });

  if (noResults) {
    noResults.hidden = visible > 0;
  }
}

function setActiveCategoryFilter(category) {
  document.querySelectorAll("#filter-pills .filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === category);
  });
  document.querySelectorAll(".category-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.category === category);
  });
}

function setActivePlatformFilter(platform) {
  document.querySelectorAll("#platform-pills .filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.platform === platform);
  });
}

function initCatalogFilters(apps) {
  const counts = {};
  apps.forEach((app) => {
    const cat = getCategory(app);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort(
    (a, b) =>
      (CATEGORY_META[a[0]]?.order || 99) - (CATEGORY_META[b[0]]?.order || 99),
  );

  renderCategories(apps);
  renderPlatformPills();
  renderFilterPills(sorted);

  let activeCategory = "all";
  let activePlatform = "all";
  let searchQuery = "";

  function applyFilters() {
    filterApps(searchQuery, activeCategory, activePlatform);
  }

  document.getElementById("platform-pills")?.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    activePlatform = pill.dataset.platform;
    setActivePlatformFilter(activePlatform);
    applyFilters();
  });

  document.getElementById("filter-pills")?.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    activeCategory = pill.dataset.filter;
    setActiveCategoryFilter(activeCategory);
    applyFilters();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("categories-grid")?.addEventListener("click", (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;
    activeCategory = card.dataset.category;
    setActiveCategoryFilter(activeCategory);
    applyFilters();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("app-search")?.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    applyFilters();
  });
}

function initHeader() {
  const header = document.getElementById("site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  });

  navToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initHeader();

  const appsGrid = document.getElementById("apps-grid");
  if (!appsGrid) return;

  Promise.all([
    fetch("data/apps.json").then((response) => response.json()),
    fetch("ios/index.html")
      .then((response) => response.text())
      .then(parseIosApps),
  ])
    .then(([androidApps, iosApps]) => {
      const android = androidApps.map((app) => ({
        ...app,
        platform: "android",
      }));
      const allApps = [...android, ...iosApps];

      updateCounts(android.length, iosApps.length);

      const featured = allApps.filter((app) => app.link.startsWith("apps/"));
      const featuredGrid = document.getElementById("featured-grid");
      if (featuredGrid) {
        featuredGrid.innerHTML = featured.map(renderFeaturedCard).join("");
      }

      appsGrid.innerHTML = allApps.map(renderAppCard).join("");
      initCatalogFilters(allApps);
    })
    .catch((error) => {
      console.error("Error loading apps:", error);
    });
});

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");

  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else if (currentTheme === "light") {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const newTheme = prefersDark ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }
}

(function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  let clickCount = 0;
  let clickTimer = null;
  const mainTitle = document.getElementById("mainTitle");

  if (mainTitle) {
    mainTitle.addEventListener("click", function () {
      clickCount++;

      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      clickTimer = setTimeout(function () {
        clickCount = 0;
      }, 500);

      if (clickCount === 5) {
        clickCount = 0;
        clearTimeout(clickTimer);
        const passcode = prompt("Enter passcode:");
        if (passcode === "9550670491") {
          window.location.href = "apps-list.html";
        } else if (passcode !== null) {
          alert("Incorrect passcode");
        }
      }
    });
  }
});
