(() => {
  "use strict";
  const STORAGE_KEY = "etaWavesDemoPlayers_v1";
  const form = document.getElementById("registrationForm");
  const formNotice = document.getElementById("formNotice");
  const successPanel = document.getElementById("successPanel");
  const assignedWaveId = document.getElementById("assignedWaveId");
  const recordsPanel = document.getElementById("recordsPanel");
  const recordsBody = document.getElementById("recordsBody");
  const recordCount = document.getElementById("recordCount");

  function getPlayers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch (_) { return []; }
  }
  function savePlayers(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }
  function nextWaveId(players) {
    // Demo-only sequence. A production system must allocate IDs on a server/database.
    const highest = players.reduce((max, p) => {
      const match = /^WAV-(\d+)$/.exec(p.waveId || "");
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return "WAV-" + String(highest + 1).padStart(4, "0");
  }
  function showNotice(message) {
    formNotice.textContent = message;
    formNotice.hidden = false;
  }
  function hideNotice() {
    formNotice.hidden = true;
    formNotice.textContent = "";
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    hideNotice();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fullName = String(data.get("fullName") || "").trim();
    const institution = String(data.get("institution") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const age = Number(data.get("age"));
    if (!fullName || !institution || !phone || !Number.isFinite(age) || age < 13 || age > 100) {
      showNotice("Please check the required fields and enter a valid age.");
      return;
    }
    const players = getPlayers();
    const normalPhone = phone.replace(/\s+/g, "").toLowerCase();
    const duplicate = players.find(p =>
      p.fullName.toLowerCase() === fullName.toLowerCase() &&
      p.institution.toLowerCase() === institution.toLowerCase() &&
      p.phone.replace(/\s+/g, "").toLowerCase() === normalPhone
    );
    if (duplicate) {
      showNotice("A similar registration already exists in this browser demo (" + duplicate.waveId + "). Please contact the recruitment team if you believe this is an error.");
      return;
    }
    const player = {
      waveId: nextWaveId(players),
      fullName, age, institution,
      course: String(data.get("course") || "").trim(),
      studyYear: String(data.get("studyYear") || ""),
      phone, position: String(data.get("position") || ""),
      otherPositions: String(data.get("otherPositions") || "").trim(),
      foot: String(data.get("foot") || ""),
      experience: String(data.get("experience") || ""),
      availability: data.getAll("availability"),
      strengths: String(data.get("strengths") || "").trim(),
      status: "Interest received",
      createdAt: new Date().toISOString()
    };
    players.push(player);
    savePlayers(players);
    assignedWaveId.textContent = player.waveId;
    form.hidden = true;
    successPanel.hidden = false;
    recordsPanel.hidden = true;
    document.getElementById("register").scrollIntoView({behavior:"smooth"});
  });
  document.getElementById("registerAnother").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    successPanel.hidden = true;
    hideNotice();
    form.scrollIntoView({behavior:"smooth"});
  });
  document.getElementById("showRecords").addEventListener("click", () => {
    const isHidden = recordsPanel.hidden;
    recordsPanel.hidden = !isHidden;
    if (isHidden) renderRecords();
  });
  function renderRecords() {
    const players = getPlayers();
    recordCount.textContent = players.length + (players.length === 1 ? " record" : " records");
    recordsBody.innerHTML = players.length ? players.map(p =>
      `<tr><td>${escapeHtml(p.waveId)}</td><td>${escapeHtml(p.fullName)}</td><td>${escapeHtml(p.institution)}</td><td>${escapeHtml(p.position)}</td><td>${escapeHtml(p.status)}</td></tr>`
    ).join("") : '<tr><td colspan="5">No demo registrations saved on this device yet.</td></tr>';
  }
  document.getElementById("exportCsv").addEventListener("click", () => {
    const players = getPlayers();
    if (!players.length) { alert("There are no demo registrations to export."); return; }
    const columns = ["waveId","fullName","age","institution","course","studyYear","phone","position","otherPositions","foot","experience","availability","strengths","status","createdAt"];
    const csvCell = value => '"' + String(Array.isArray(value) ? value.join("; ") : (value ?? "")).replace(/"/g, '""') + '"';
    const csv = [columns.join(","), ...players.map(p => columns.map(c => csvCell(p[c])).join(","))].join("\r\n");
    const blob = new Blob(["\ufeff" + csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "eta-waves-demo-registrations.csv"; a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById("clearRecords").addEventListener("click", () => {
    if (!confirm("Clear all ETA Waves demo records saved in this browser? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    renderRecords();
    recordsPanel.hidden = false;
  });
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("open");
  });
  document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
  }));
})();