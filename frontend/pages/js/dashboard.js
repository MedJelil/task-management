// Dark mode toggle
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

// Function to fetch top clients and intervenants data
async function fetchStatistics() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/interventions/statistics"
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { topClients: [], topIntervenants: [] }; // Return empty data on error
  }
}

// Create charts dynamically
let clientChart, intervenantChart; // Use let instead of const for re-assignment

async function initializeCharts() {
  // Fetch data from the backend
  const { topClients, topIntervenants, statusCounts } = await fetchStatistics();

  // Prepare chart data
  const clientData = {
    labels: topClients.map((client) => client.fullName),
    datasets: [
      {
        label: "Top 5 Clients",
        data: topClients.map((client) => client.interventionCount),
        backgroundColor: "rgba(74, 144, 226, 0.6)",
        borderColor: "rgba(74, 144, 226, 1)",
        borderWidth: 1,
      },
    ],
  };

  const intervenantData = {
    labels: topIntervenants.map((intervenant) => intervenant.fullName),
    datasets: [
      {
        label: "Top 5 Intervenants",
        data: topIntervenants.map(
          (intervenant) => intervenant.interventionCount
        ),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const statusData = {
    labels: statusCounts.map((item) => item.status.toUpperCase()),
    datasets: [
      {
        label: "Interventions",
        data: statusCounts.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Pending
          "rgba(75, 192, 192, 0.6)", // Completed
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Initialize charts
  clientChart = createChart(
    document.getElementById("clientChart").getContext("2d"),
    clientData
  );
  intervenantChart = createChart(
    document.getElementById("intervenantChart").getContext("2d"),
    intervenantData
  );

  // Create status chart
  statusChart = new Chart(
    document.getElementById("statusChart").getContext("2d"),
    {
      type: "doughnut",
      data: statusData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  );

  // Update colors initially
  updateChartColors();
}

// Chart creation function (unchanged)
function createChart(ctx, data) {
  return new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Update chart colors (unchanged)
function updateChartColors() {
  const isDarkMode = body.classList.contains("dark-mode");
  const textColor = isDarkMode ? "#ffffff" : "#333333";

  [clientChart, intervenantChart].forEach((chart) => {
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
  });
}

// Initialize charts on page load
initializeCharts();

// Optional: Auto-refresh charts every 5 minutes
setInterval(async () => {
  const { topClients, topIntervenants } = await fetchStatistics();

  clientChart.data.labels = topClients.map((client) => client.fullName);
  clientChart.data.datasets[0].data = topClients.map(
    (client) => client.interventionCount
  );

  intervenantChart.data.labels = topIntervenants.map(
    (intervenant) => intervenant.fullName
  );
  intervenantChart.data.datasets[0].data = topIntervenants.map(
    (intervenant) => intervenant.interventionCount
  );

  clientChart.update();
  intervenantChart.update();
}, 300000); // 300,000 ms = 5 minutes

// Theme color update (unchanged)
themeToggle.addEventListener("click", updateChartColors);
