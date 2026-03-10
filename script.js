/*********************************
 * PAGE NAVIGATION
 *********************************/
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  if (pageId === "instructorPage") loadInstructorData();
}

document.addEventListener("DOMContentLoaded", () => {
  showPage("homePage");
});


/*********************************
 * INSTRUCTOR LOGIN
 *********************************/
function instructorLogin() {
  const user = document.getElementById("instructorUser").value.trim();
  const pass = document.getElementById("instructorPass").value.trim();
  const error = document.getElementById("loginError");

  if (user === "admin" && pass === "admin") {
    error.style.display = "none";
    showPage("instructorPage");
  } else {
    error.style.display = "block";
  }
}


/*********************************
 * JOB REQUIREMENTS
 *********************************/
const jobRequirements = {
  "Frontend Developer": {
    "HTML/CSS": 3,
    "JavaScript": 3,
    "Communication": 2
  },
  "Backend Developer": {
    "Java": 3,
    "Python": 2,
    "Communication": 2
  },
  "Cloud Engineer": {
    "Python": 2,
    "Cloud Basics": 3,
    "Communication": 2
  },
  "Data Analyst": {
    "Python": 3,
    "Communication": 2
  }
};


/*********************************
 * HELPFUL SUGGESTIONS
 *********************************/
const detailedSuggestions = {
  "JavaScript": [
    "Build small projects like to-do lists or calculators.",
    "Practice DOM manipulation and event handling.",
    "Avoid frameworks until core concepts are strong."
  ],
  "HTML/CSS": [
    "Recreate website layouts from scratch.",
    "Practice Flexbox and Grid with responsiveness.",
    "Inspect real websites and clone sections."
  ],
  "Python": [
    "Solve basic logic and data structure problems.",
    "Write small automation or file-handling scripts.",
    "Practice clean, modular code."
  ],
  "Java": [
    "Strengthen OOP concepts like inheritance.",
    "Build console-based mini projects.",
    "Understand collections and exceptions."
  ],
  "Cloud Basics": [
    "Learn IaaS, PaaS, SaaS concepts.",
    "Deploy a basic app or static site.",
    "Understand compute, storage, and regions."
  ],
  "Communication": [
    "Practice explaining technical topics clearly.",
    "Participate in discussions and presentations.",
    "Record and review your speaking."
  ]
};


/*********************************
 * STUDENT FORM SUBMISSION
 *********************************/
const form = document.getElementById("skillForm");
const result = document.getElementById("result");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const role = document.getElementById("jobRole").value;
    if (!name || !role) return;

    let skills = {};
    document.querySelectorAll(".skill").forEach(el => {
      skills[el.dataset.skill] = parseInt(el.value);
    });

    let gaps = [];
    let total = 0;
    let max = 0;

    for (let skill in jobRequirements[role]) {
      const required = jobRequirements[role][skill];
      const current = skills[skill] || 0;

      total += current;
      max += required;

      if (current < required) {
        gaps.push({
          skill,
          tips: detailedSuggestions[skill] || []
        });
      }
    }

    const record = {
      name,
      desiredRole: role,
      skills,
      gapAnalysis: gaps,
      score: Math.round((total / max) * 100),
      date: new Date().toLocaleString()
    };

    
var xhrSave = new XMLHttpRequest();
xhrSave.open("POST","api/saveRecord.jsp",false);
xhrSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhrSave.send("json="+encodeURIComponent(JSON.stringify(record)));


    result.innerHTML = renderReport(record);
  });
}


/*********************************
 * INSTRUCTOR DASHBOARD (CLEAN VIEW)
 *********************************/
function loadInstructorData() {
  const table = document.getElementById("recordsTable");
  if (!table) return;

  
let data=[];
var xhrLoad = new XMLHttpRequest();
xhrLoad.open("GET","api/getRecords.jsp",false);
xhrLoad.send();
if(xhrLoad.status===200 && xhrLoad.responseText){
 data = JSON.parse(xhrLoad.responseText);
}

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `
      <tr>
        <td class="text-center text-muted">
          No student records available
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((r, i) => {
    const level =
      r.score < 40 ? "Beginner" :
      r.score < 70 ? "Intermediate" :
      "Advanced";

    table.innerHTML += `
      <tr>
        <td>
          <div
            class="d-flex justify-content-between align-items-center"
            style="cursor:pointer;"
            onclick="toggleDetails(${i})"
          >
            <div>
              <strong>${r.name}</strong><br>
              <small class="text-muted">${level} (${r.score}%)</small>
            </div>
            <span class="text-muted">▼</span>
          </div>

          <div id="details-${i}" style="display:none;" class="mt-3">
            ${renderReport(r, true)}
          </div>
        </td>
      </tr>
    `;
  });
}

function toggleDetails(id) {
  const el = document.getElementById(`details-${id}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
}


/*********************************
 * SHARED REPORT RENDERING
 *********************************/
function renderReport(record) {
  const graphs = Object.keys(jobRequirements[record.desiredRole])
    .map(skill => {
      const current = record.skills[skill] || 0;
      const required = jobRequirements[record.desiredRole][skill];
      return createSkillGraph(skill, current, required);
    }).join("");

  const gaps =
    record.gapAnalysis.length === 0
      ? `<div class="alert alert-success">
           Meets or exceeds all required skill levels.
         </div>`
      : record.gapAnalysis.map(g => `
          <div class="mb-3">
            <strong>${g.skill}</strong>
            <ul>${g.tips.map(t => `<li>${t}</li>`).join("")}</ul>
          </div>
        `).join("");

  return `
    <div class="card p-4 mb-3">
      <h5>${record.desiredRole}</h5>
      <p class="text-muted">${record.date}</p>

      <h6>Suggestions</h6>
      ${gaps}

      <hr class="my-4">
      <h6>Skill Comparison</h6>
      ${graphs}
    </div>
  `;
}

function createSkillGraph(skill, current, required) {
  return `
    <div class="mb-3">
      <strong>${skill}</strong>
      <div class="progress mb-2" style="height:10px;">
        <div class="progress-bar bg-success" style="width:${(current / 3) * 100}%"></div>
      </div>
      <div class="progress" style="height:10px;">
        <div class="progress-bar bg-primary" style="width:${(required / 3) * 100}%"></div>
      </div>
    </div>
  `;
}


/*********************************
 * CLEAR RECORDS
 *********************************/
function clearRecords() {
  
var xhrClear=new XMLHttpRequest();
xhrClear.open("GET","api/clearRecords.jsp",false);
xhrClear.send();

  loadInstructorData();
}
