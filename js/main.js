function appLinkAttrs(link) {
  if (link.startsWith("http") || link.startsWith("apps/")) {
    return ' target="_blank" rel="noopener noreferrer"';
  }
  return "";
}

// Load apps from JSON and render grid
document.addEventListener("DOMContentLoaded", function () {
  const iosStat = document.querySelector(
    'a.stat-card.stat-link[href="ios/"] .stat-number',
  );
  if (iosStat) {
    fetch("ios/index.html")
      .then((response) => response.text())
      .then((html) => {
        const count = (html.match(/class="app-card"/g) || []).length;
        if (count > 0) {
          iosStat.textContent = String(count);
        }
      })
      .catch(() => {});
  }

  const appsGrid = document.getElementById("apps-grid");
  if (appsGrid) {
    fetch("data/apps.json")
      .then((response) => response.json())
      .then((apps) => {
        const androidHeroStat = document.querySelector(
          ".hero .stats-container .stat-number",
        );
        const androidSectionBadge = document.querySelector("main .count-badge");

        const count = apps.length;
        document.title = document.title.replace(/\d+(?= Apps)/, String(count));

        if (androidHeroStat) {
          androidHeroStat.textContent = String(count);
        }

        if (androidSectionBadge) {
          androidSectionBadge.textContent = `${count} Apps`;
        }

        appsGrid.innerHTML = apps
          .map(
            (app) => `
          <div class="app">
            <img src="${app.icon}" alt="${app.title} Icon" />
            <h2>${app.title}</h2>
            <p>${app.description}</p>
            <a href="${app.link}"${appLinkAttrs(app.link)}>Download</a>
          </div>
        `,
          )
          .join("");
      })
      .catch((error) => {
        console.error("Error loading apps:", error);
      });
  }
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
