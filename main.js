import "./style.css";
import Chart from "chart.js/auto";

// Éléments DOM
const uploadZone = document.getElementById("uploadZone");
const dashboard = document.getElementById("dashboard");
const loadBtn = document.getElementById("loadBtn");
const pasteInput = document.getElementById("pasteInput");
const dropZone = document.getElementById("dropZone");

if (!uploadZone || !dashboard || !loadBtn || !pasteInput || !dropZone) {
  console.error("Un élément manque dans le DOM");
}

// Données mock pour 3 préparateurs
const mockPreparateurs = [
  {
    nom: "Lucas Martin",
    avatar: "LM",
    objectif: 49,
    production: [52, 58, 60, 55, 61], // Lun-Ven
  },
  {
    nom: "Sophie Bernard",
    avatar: "SB",
    objectif: 49,
    production: [48, 52, 55, 59, 63],
  },
  {
    nom: "Marc Dubois",
    avatar: "MD",
    objectif: 49,
    production: [51, 49, 53, 50, 58],
  },
];

// Simulation : quand on clique sur "Charger"
loadBtn.addEventListener("click", () => {
  // Cacher l'upload, montrer le dashboard
  uploadZone.style.display = "none";
  dashboard.style.display = "block";

  // Prendre un préparateur aléatoire
  const randomIndex = Math.floor(Math.random() * mockPreparateurs.length);
  const prepa = mockPreparateurs[randomIndex];

  // Mettre à jour le dashboard
  updateDashboard(prepa);
});

// Option : gérer le collage plus tard
pasteInput.addEventListener("paste", (e) => {
  // Plus tard : parser le clipboard
  console.log("Paste event - à implémenter");
});

// Drag & drop (plus tard)
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  // Plus tard : gérer le fichier
  console.log("Drop event - à implémenter");
});

// Fonction pour mettre à jour le dashboard
function updateDashboard(prepa) {
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven"];
  const valeurs = prepa.production;

  // Calculs
  const moyenne = (valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(1);
  const max = Math.max(...valeurs);
  const min = Math.min(...valeurs);
  const perf = ((parseFloat(moyenne) / prepa.objectif) * 100).toFixed(0);

  // Mettre à jour les textes
  const profileName = document.querySelector(".profile-name");
  if (profileName) profileName.textContent = prepa.nom;
  
  const avatar = document.querySelector(".avatar");
  if (avatar) avatar.textContent = prepa.avatar;
  
  const perfValue = document.getElementById("perfValue");
  if (perfValue) perfValue.textContent = perf + "%";
  
  const moyValue = document.getElementById("moyValue");
  if (moyValue) moyValue.textContent = moyenne;
  
  const maxValue = document.getElementById("maxValue");
  if (maxValue) maxValue.textContent = max.toString();
  
  const minValue = document.getElementById("minValue");
  if (minValue) minValue.textContent = min.toString();
  
  const objectiveBadge = document.querySelector(".objective-badge strong");
  if (objectiveBadge) objectiveBadge.textContent = prepa.objectif.toString();

  // Mettre à jour la grille des jours
  const weekGrid = document.getElementById("weekGrid");
  if (weekGrid) {
    weekGrid.innerHTML = jours
      .map((jour, i) => `<div class="day">${jour} ${valeurs[i]}</div>`)
      .join("");
  }

  // Créer/mettre à jour le graphique
  updateChart(jours, valeurs, prepa.objectif);
}

// Gestion du graphique
let chart = null;

function updateChart(labels, data, objectif) {
  const ctx = document.getElementById("productionChart");
  if (!ctx) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Production",
          data: data,
          borderColor: "#78BE20",
          backgroundColor: "rgba(120, 190, 32, 0.1)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#78BE20",
          pointBorderColor: "white",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: "Objectif",
          data: Array(data.length).fill(objectif),
          borderColor: "#333",
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const perf = ((value / objectif) * 100).toFixed(0);
              return [`Production: ${value}`, `Performance: ${perf}%`];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 40,
          grid: { color: "#f0f0f0" },
        },
      },
    },
  });
}