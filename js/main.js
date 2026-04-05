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

(function () {
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
})();
