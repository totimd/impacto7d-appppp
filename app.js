/* =========================
FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBlyaOCE98J5SzLGZe9MlhgGGwJ20os7JI",
  authDomain: "impacto7d.firebaseapp.com",
  projectId: "impacto7d",
  storageBucket: "impacto7d.firebasestorage.app",
  messagingSenderId: "340419773751",
  appId: "1:340419773751:web:53453a4b9ddbedeeff46b2",
  measurementId: "G-39R93N2Q6B"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

/* =========================
CATEGORÍAS
========================= */

const CATS = {

  perfil: [
    "¿Tiene foto de perfil profesional?",
    "¿La bio explica claramente qué hace el negocio?",
    "¿Tiene enlace activo?",
    "¿Tiene categoría de negocio activada?"
  ],

  contenido: [
    "¿Las fotos y videos se ven profesionales?",
    "¿Hay coherencia visual?",
    "¿El contenido comunica valor?",
    "¿Tiene reels activos?"
  ],

  frecuencia: [
    "¿Publica más de 3 veces por semana?",
    "¿Usa llamadas a la acción?",
    "¿Usa hashtags correctamente?"
  ],

  pauta: [
    "¿Tiene anuncios activos?",
    "¿Sus anuncios se ven profesionales?",
    "¿Genera interacción?"
  ]

};

let answers = {};
let impactChart = null;

/* =========================
CREAR PREGUNTAS
========================= */

function buildCriteria(cat, containerId) {

  const el = document.getElementById(containerId);

  if (!el) return;

  el.innerHTML = "";

  CATS[cat].forEach((label, i) => {

    const key = `${cat}_${i}`;

    answers[key] = null;

    const row = document.createElement("div");

    row.className = "criteria-row";

    row.innerHTML = `

      <span class="criteria-label">
        ${label}
      </span>

      <div class="radio-group">

        <button
          type="button"
          class="radio-btn"
          id="${key}_si"
        >
          Sí
        </button>

        <button
          type="button"
          class="radio-btn"
          id="${key}_no"
        >
          No
        </button>

      </div>

    `;

    el.appendChild(row);

    document
      .getElementById(`${key}_si`)
      .addEventListener("click", () => {
        setAnswer(key, "si");
      });

    document
      .getElementById(`${key}_no`)
      .addEventListener("click", () => {
        setAnswer(key, "no");
      });

  });

}

/* =========================
RESPUESTAS
========================= */

function setAnswer(key, val) {

  answers[key] = val;

  const si = document.getElementById(`${key}_si`);
  const no = document.getElementById(`${key}_no`);

  if (si) {

    si.className =
      val === "si"
        ? "radio-btn sel-si"
        : "radio-btn";

  }

  if (no) {

    no.className =
      val === "no"
        ? "radio-btn sel-no"
        : "radio-btn";

  }

  updateScore();

}

/* =========================
UPDATE SCORE
========================= */

function updateScore() {

  const vals = Object.values(answers);

  const total = vals.length;

  const siCount =
    vals.filter(v => v === "si").length;

  const scoreNum =
    document.getElementById("score-num");

  if (scoreNum) {

    scoreNum.textContent =
      `${siCount} / ${total}`;

  }

  const percent =
    total > 0
      ? (siCount / total) * 100
      : 0;

  const bar =
    document.getElementById("score-bar");

  if (bar) {

    bar.style.width = `${percent}%`;

    if (siCount <= 5) {

      bar.style.background = "#A32D2D";

    }

    else if (siCount <= 10) {

      bar.style.background = "#BA7517";

    }

    else {

      bar.style.background = "#1D9E75";

    }

  }

  updateLevel(siCount);
  generateDiagnosis(siCount);
  generateChart();

}

/* =========================
NIVEL
========================= */

function updateLevel(score) {

  const box =
    document.getElementById("level-box");

  if (!box) return;

  let level = "";

  if (score <= 5) {

    level = "NEGOCIO INVISIBLE";

  }

  else if (score <= 10) {

    level = "NEGOCIO EN CRECIMIENTO";

  }

  else {

    level = "NEGOCIO PREMIUM";

  }

  box.innerHTML = `

    <strong>
      Nivel actual:
    </strong>

    ${level}

  `;

}

/* =========================
DIAGNÓSTICO
========================= */

function generateDiagnosis(score) {

  const box =
    document.getElementById("smart-report");

  if (!box) return;

  let text = "";

  if (score <= 5) {

    text = `
      El negocio actualmente tiene una presencia digital débil.
      Hay problemas de percepción visual, estructura y estrategia.
      IMPACTO 7D puede reconstruir completamente la presencia digital.
    `;

  }

  else if (score <= 10) {

    text = `
      El negocio ya tiene una base funcional,
      pero necesita optimización estratégica,
      contenido de mayor impacto
      y mejor posicionamiento digital.
    `;

  }

  else {

    text = `
      El negocio proyecta una presencia sólida.
      El siguiente paso es escalar autoridad,
      diferenciación y posicionamiento premium.
    `;

  }

  box.innerHTML = `

    <strong>
      Diagnóstico inteligente
    </strong>

    <br><br>

    ${text}

  `;

}

/* =========================
GRÁFICA
========================= */

function generateChart() {

  const canvas =
    document.getElementById("impactChart");

  if (!canvas) return;

  const perfil =
    Object.entries(answers)
      .filter(([k, v]) =>
        k.includes("perfil") && v === "si"
      ).length;

  const contenido =
    Object.entries(answers)
      .filter(([k, v]) =>
        k.includes("contenido") && v === "si"
      ).length;

  const frecuencia =
    Object.entries(answers)
      .filter(([k, v]) =>
        k.includes("frecuencia") && v === "si"
      ).length;

  const pauta =
    Object.entries(answers)
      .filter(([k, v]) =>
        k.includes("pauta") && v === "si"
      ).length;

  const data = {

    labels: [
      "Perfil",
      "Contenido",
      "Frecuencia",
      "Pauta"
    ],

    datasets: [{

      data: [
        perfil,
        contenido,
        frecuencia,
        pauta
      ],

      backgroundColor: [
        "#7B5CFF",
        "#22C58B",
        "#FFB547",
        "#FF5C5C"
      ],

      borderRadius: 12

    }]

  };

  if (impactChart) {

    impactChart.destroy();

  }

  impactChart = new Chart(canvas, {

    type: "bar",

    data,

    options: {

      responsive: true,

      plugins: {

        legend: {
          display: false
        }

      },

      scales: {

        y: {
          beginAtZero: true,
          max: 4
        }

      }

    }

  });

}

/* =========================
DOWNLOAD PDF REPORT
========================= */

async function downloadReport() {

  const score =
    Object.values(answers)
      .filter(v => v === "si").length;

  document.getElementById("r-negocio").innerText =
    document.getElementById("f-nombre").value || "-";

  document.getElementById("r-cat").innerText =
    document.getElementById("f-cat").value || "-";

  document.getElementById("r-ig").innerText =
    document.getElementById("f-ig").value || "-";

  document.getElementById("r-score").innerText =
    `${score}/14`;

  document.getElementById("r-level").innerText =
    document.getElementById("level-box").innerText;

  document.getElementById("r-smart").innerText =
    document.getElementById("smart-report").innerText;
let improvementText = "";

if (score <= 5) {

  improvementText = `
• Reestructuración completa del perfil y branding digital.

• Optimización visual para generar confianza y autoridad.

• Estrategia de contenido enfocada en atraer clientes reales.

• Creación de piezas visuales premium y reels de alto impacto.

• Implementación de estrategia de posicionamiento digital local.

• Desarrollo de campañas para aumentar alcance e interacción.
  `;

}

else if (score <= 10) {

  improvementText = `
• Optimización estratégica del contenido actual.

• Mejora de conversión y percepción profesional.

• Escalamiento de autoridad digital mediante contenido premium.

• Estrategia avanzada de captación de clientes.

• Fortalecimiento visual y diferenciación frente a la competencia.

• Optimización de campañas y estructura de redes sociales.
  `;

}

else {

  improvementText = `
• Escalamiento de posicionamiento premium.

• Automatización y optimización de captación digital.

• Estrategias avanzadas de autoridad y expansión de marca.

• Producción de contenido de alto impacto para dominar el mercado.

• Optimización de conversión y fidelización de clientes.

• Expansión estratégica de presencia digital.
  `;

}

document.getElementById("r-improvement").innerText =
  improvementText;
  /* =========
  INSERTAR GRÁFICA
  ========= */

  const chartCanvas =
    document.getElementById("impactChart");

  const chartImage =
    document.getElementById("chart-image");

  chartImage.src =
    chartCanvas.toDataURL("image/png");

  const report =
    document.getElementById("download-report");

  report.style.display = "block";

  await new Promise(resolve =>
    setTimeout(resolve, 800)
  );

  const canvas =
    await html2canvas(report, {

      scale: 2,
      useCORS: true,
      backgroundColor: "#111111"

    });

  const imgData =
    canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;

  /* =========================
  FORMATO 1080x1350
  ========================= */

  const pdfWidth = canvas.width;
const pdfHeight = canvas.height;

const pdf = new jsPDF({
  orientation: "portrait",
  unit: "px",
  format: [pdfWidth, pdfHeight]
});

pdf.addImage(
  imgData,
  "PNG",
  0,
  0,
  pdfWidth,
  pdfHeight
);

  const businessName =
    document.getElementById("f-nombre").value || "cliente";

  pdf.save(`diagnostico-${businessName}.pdf`);

  showToast("PDF descargado correctamente");

}

/* =========================
GUARDAR FIREBASE
========================= */

async function saveAuditoria() {

  const nombre =
    document.getElementById("f-nombre").value.trim();

  if (!nombre) {

    showToast("Ingresa el nombre del negocio");

    return;

  }

  const score =
    Object.values(answers)
      .filter(v => v === "si").length;

  const data = {

    nombre,

    categoria:
      document.getElementById("f-cat").value,

    instagram:
      document.getElementById("f-ig").value,

    notas:
      document.getElementById("f-notas").value,

    cierre:
      document.getElementById("f-cierre").value,

    score,

    respuestas: answers,

    fecha:
      firebase.firestore.FieldValue.serverTimestamp()

  };

  try {

    await db
      .collection("clientes")
      .add(data);

    showToast("Cliente guardado correctamente");

    renderHistory();

  }

  catch (error) {

    console.error(error);

    showToast("Error al guardar");

  }

}

/* =========================
HISTORIAL CRM
========================= */

async function renderHistory() {

  const list =
    document.getElementById("history-list");

  if (!list) return;

  list.innerHTML =
    "Cargando clientes...";

  try {

    const snapshot =
      await db
        .collection("clientes")
        .orderBy("fecha", "desc")
        .get();

    document.getElementById("hist-count")
      .textContent = snapshot.size;

    if (snapshot.empty) {

      list.innerHTML = `
        <div class="history-empty">
          No hay clientes guardados
        </div>
      `;

      return;

    }

    list.innerHTML = "";

    snapshot.forEach(doc => {

      const a = doc.data();

      const div =
        document.createElement("div");

      div.className = "hist-card";

      div.innerHTML = `

        <div class="hist-name">
          ${a.nombre || ""}
        </div>

        <div class="hist-date">
          ${a.categoria || ""}
        </div>

        <div class="hist-body">

          <strong>
            Score:
          </strong>

          ${a.score || 0}/14

          <br><br>

          <strong>
            Instagram:
          </strong>

          ${a.instagram || "-"}

        </div>

      `;

      list.appendChild(div);

    });

  }

  catch (error) {

    console.error(error);

    list.innerHTML =
      "Error cargando historial";

  }

}

/* =========================
RESET
========================= */

function resetForm() {

  document.getElementById("f-nombre").value = "";
  document.getElementById("f-cat").value = "";
  document.getElementById("f-ig").value = "";
  document.getElementById("f-notas").value = "";
  document.getElementById("f-cierre").value = "";

  Object.keys(answers).forEach(key => {

    answers[key] = null;

    const si =
      document.getElementById(`${key}_si`);

    const no =
      document.getElementById(`${key}_no`);

    if (si) {

      si.className = "radio-btn";

    }

    if (no) {

      no.className = "radio-btn";

    }

  });

  updateScore();

}

/* =========================
UI
========================= */

function showPage(page) {

  const form =
    document.getElementById("page-form");

  const history =
    document.getElementById("page-history");

  if (form) {

    form.style.display =
      page === "form"
        ? "block"
        : "none";

  }

  if (history) {

    history.style.display =
      page === "history"
        ? "block"
        : "none";

  }

  if (page === "history") {

    renderHistory();

  }

}

function showToast(msg) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = msg;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}

/* =========================
INIT
========================= */

window.onload = () => {

  buildCriteria("perfil", "criteria-perfil");
  buildCriteria("contenido", "criteria-contenido");
  buildCriteria("frecuencia", "criteria-frecuencia");
  buildCriteria("pauta", "criteria-pauta");

  updateScore();

  renderHistory();

};