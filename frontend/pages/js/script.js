const themeToggle = document.getElementById("toggle");
const body = document.body;

// Function to apply the theme
function applyTheme(isDark) {
  if (isDark) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}

// Check localStorage for saved theme preference
const isDarkMode = localStorage.getItem("darkMode") === "enabled";
applyTheme(isDarkMode);

// Toggle theme and save preference
themeToggle.addEventListener("click", () => {
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  applyTheme(isDark);
});
