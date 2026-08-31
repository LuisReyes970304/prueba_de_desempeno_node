// ---------------------------------------------------------------
// RiwiMediCare Plus — basic mockup frontend to manually test the API.
// Vanilla JS, no build step, no framework: just enough to exercise
// every resource (auth, clinics, warehouses, medications, inventory
// and supply requests) from a browser.
// ---------------------------------------------------------------

const state = {
  token: sessionStorage.getItem("token") || null,
  user: JSON.parse(sessionStorage.getItem("user") || "null"),
};

const els = {
  authView: document.getElementById("auth-view"),
  dashboardView: document.getElementById("dashboard-view"),
  sessionInfo: document.getElementById("session-info"),
  sessionName: document.getElementById("session-name"),
  sessionRole: document.getElementById("session-role"),
  authMessage: document.getElementById("auth-message"),
  dashboardMessage: document.getElementById("dashboard-message"),
};

// ---------------------------------------------------------------
// Generic API helper
// ---------------------------------------------------------------
async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const response = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `message ${type}`;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 4000);
}

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------
function applySession() {
  const loggedIn = Boolean(state.token && state.user);

  els.authView.classList.toggle("hidden", loggedIn);
  els.dashboardView.classList.toggle("hidden", !loggedIn);
  els.sessionInfo.classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    els.sessionName.textContent = state.user.name;
    els.sessionRole.textContent = state.user.role;
    loadTab(getActiveTab());
  }
}

function setSession(token, user) {
  state.token = token;
  state.user = user;
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
  applySession();
}

function clearSession() {
  state.token = null;
  state.user = null;
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  applySession();
}

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const { token, user } = await apiFetch("/auth/login", {
      method: "POST",
      body: {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      },
    });
    setSession(token, user);
  } catch (error) {
    showMessage(els.authMessage, error.message, "error");
  }
});

document.getElementById("register-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/user/create_user", {
      method: "POST",
      body: {
        name: document.getElementById("register-name").value,
        email: document.getElementById("register-email").value,
        password: document.getElementById("register-password").value,
        role: document.getElementById("register-role").value,
      },
    });
    showMessage(els.authMessage, "Account created. You can log in now.", "success");
    event.target.reset();
  } catch (error) {
    showMessage(els.authMessage, error.message, "error");
  }
});

document.getElementById("logout-btn").addEventListener("click", clearSession);

// ---------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------
function getActiveTab() {
  return document.querySelector(".tab-btn.active")?.dataset.tab || "clinics";
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("hidden");
    loadTab(btn.dataset.tab);
  });
});

document.querySelectorAll("[data-reload]").forEach((btn) => {
  btn.addEventListener("click", () => loadTab(btn.dataset.reload));
});

function loadTab(tab) {
  const loaders = {
    clinics: loadClinics,
    warehouses: loadWarehouses,
    medications: loadMedications,
    inventory: loadInventory,
    requests: loadRequests,
  };
  loaders[tab]?.().catch((error) => showMessage(els.dashboardMessage, error.message, "error"));
}

// ---------------------------------------------------------------
// Clinics
// ---------------------------------------------------------------
async function loadClinics() {
  const clinics = await apiFetch("/clinic");
  const tbody = document.querySelector("#clinics-table tbody");
  tbody.innerHTML = clinics.map((clinic) => `
    <tr>
      <td>${clinic.id}</td>
      <td>${clinic.name}</td>
      <td>${clinic.nit}</td>
      <td>${clinic.address}</td>
      <td>${clinic.responsibleName}</td>
      <td>${clinic.phone}</td>
      <td><button class="btn btn-danger" data-delete-clinic="${clinic.id}">Delete</button></td>
    </tr>
  `).join("") || `<tr><td colspan="7">No clinics yet.</td></tr>`;

  tbody.querySelectorAll("[data-delete-clinic]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await apiFetch(`/clinic/${btn.dataset.deleteClinic}`, { method: "DELETE" });
        showMessage(els.dashboardMessage, "Clinic deleted.", "success");
        loadClinics();
      } catch (error) {
        showMessage(els.dashboardMessage, error.message, "error");
      }
    });
  });
}

document.getElementById("clinic-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/clinic", {
      method: "POST",
      body: {
        name: document.getElementById("clinic-name").value,
        nit: Number(document.getElementById("clinic-nit").value),
        address: document.getElementById("clinic-address").value,
        phone: Number(document.getElementById("clinic-phone").value),
        responsibleName: document.getElementById("clinic-responsible").value,
      },
    });
    event.target.reset();
    showMessage(els.dashboardMessage, "Clinic created.", "success");
    loadClinics();
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

// ---------------------------------------------------------------
// Warehouses
// ---------------------------------------------------------------
async function loadWarehouses() {
  const warehouses = await apiFetch("/warehouse");
  const tbody = document.querySelector("#warehouses-table tbody");
  tbody.innerHTML = warehouses.map((wh) => `
    <tr>
      <td>${wh.id}</td>
      <td>${wh.name}</td>
      <td>${wh.location}</td>
      <td>${wh.phone}</td>
      <td><button class="btn btn-danger" data-delete-warehouse="${wh.id}">Delete</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No warehouses yet.</td></tr>`;

  tbody.querySelectorAll("[data-delete-warehouse]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await apiFetch(`/warehouse/${btn.dataset.deleteWarehouse}`, { method: "DELETE" });
        showMessage(els.dashboardMessage, "Warehouse deleted.", "success");
        loadWarehouses();
      } catch (error) {
        showMessage(els.dashboardMessage, error.message, "error");
      }
    });
  });
}

document.getElementById("warehouse-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/warehouse", {
      method: "POST",
      body: {
        name: document.getElementById("warehouse-name").value,
        location: document.getElementById("warehouse-location").value,
        phone: Number(document.getElementById("warehouse-phone").value),
      },
    });
    event.target.reset();
    showMessage(els.dashboardMessage, "Warehouse created.", "success");
    loadWarehouses();
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

// ---------------------------------------------------------------
// Medications
// ---------------------------------------------------------------
async function loadMedications() {
  const medications = await apiFetch("/medication");
  const tbody = document.querySelector("#medications-table tbody");
  tbody.innerHTML = medications.map((med) => `
    <tr>
      <td>${med.id}</td>
      <td>${med.name}</td>
      <td>${med.description}</td>
      <td>${med.unit}</td>
      <td><button class="btn btn-danger" data-delete-medication="${med.id}">Delete</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No medications yet.</td></tr>`;

  tbody.querySelectorAll("[data-delete-medication]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await apiFetch(`/medication/${btn.dataset.deleteMedication}`, { method: "DELETE" });
        showMessage(els.dashboardMessage, "Medication deleted.", "success");
        loadMedications();
      } catch (error) {
        showMessage(els.dashboardMessage, error.message, "error");
      }
    });
  });
}

document.getElementById("medication-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/medication", {
      method: "POST",
      body: {
        name: document.getElementById("medication-name").value,
        description: document.getElementById("medication-description").value,
        unit: document.getElementById("medication-unit").value,
      },
    });
    event.target.reset();
    showMessage(els.dashboardMessage, "Medication created.", "success");
    loadMedications();
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

// ---------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------
async function loadInventory() {
  const entries = await apiFetch("/inventory");
  const tbody = document.querySelector("#inventory-table tbody");
  tbody.innerHTML = entries.map((entry) => `
    <tr>
      <td>${entry.id}</td>
      <td>${entry.name}</td>
      <td>${entry.warehouse.name} (#${entry.warehouse.id})</td>
      <td>${entry.quantity}</td>
      <td><button class="btn btn-danger" data-delete-inventory="${entry.id}">Delete</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5">No inventory entries yet.</td></tr>`;

  tbody.querySelectorAll("[data-delete-inventory]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await apiFetch(`/inventory/${btn.dataset.deleteInventory}`, { method: "DELETE" });
        showMessage(els.dashboardMessage, "Inventory entry deleted.", "success");
        loadInventory();
      } catch (error) {
        showMessage(els.dashboardMessage, error.message, "error");
      }
    });
  });
}

document.getElementById("inventory-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/inventory", {
      method: "POST",
      body: {
        warehouseId: Number(document.getElementById("inventory-warehouseId").value),
        medicationId: Number(document.getElementById("inventory-medicationId").value),
        quantity: Number(document.getElementById("inventory-quantity").value),
      },
    });
    event.target.reset();
    showMessage(els.dashboardMessage, "Inventory entry created.", "success");
    loadInventory();
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

// ---------------------------------------------------------------
// Supply requests
// ---------------------------------------------------------------
const REQUEST_STATUSES = ["pending", "approved", "rejected", "delivered", "cancelled"];

function renderRequestsTable(requests) {
  const tbody = document.querySelector("#requests-table tbody");
  tbody.innerHTML = requests.map((req) => `
    <tr>
      <td>${req.id}</td>
      <td>${req.name}</td>
      <td>${req.clinic.name} (#${req.clinic.id})</td>
      <td>${req.warehouse.name} (#${req.warehouse.id})</td>
      <td>${req.quantity}</td>
      <td><span class="status-pill status-${req.status}">${req.status}</span></td>
      <td>${req.requestedBy.name}</td>
      <td>
        <div class="row-actions">
          <select class="status-select" data-status-for="${req.id}">
            ${REQUEST_STATUSES.map((s) => `<option value="${s}" ${s === req.status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
          <button class="btn btn-small btn-secondary" data-update-status="${req.id}">Save</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="8">No supply requests yet.</td></tr>`;

  tbody.querySelectorAll("[data-update-status]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.updateStatus;
      const select = tbody.querySelector(`[data-status-for="${id}"]`);
      try {
        await apiFetch(`/requests/${id}/status`, {
          method: "PATCH",
          body: { status: select.value },
        });
        showMessage(els.dashboardMessage, "Request status updated.", "success");
        loadRequests();
      } catch (error) {
        showMessage(els.dashboardMessage, error.message, "error");
      }
    });
  });
}

async function loadRequests() {
  const requests = await apiFetch("/requests");
  renderRequestsTable(requests);
}

document.getElementById("load-history-btn").addEventListener("click", async () => {
  try {
    const requests = await apiFetch("/requests/history");
    renderRequestsTable(requests);
    showMessage(els.dashboardMessage, "Showing full history (includes deleted).", "success");
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

document.getElementById("request-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiFetch("/requests", {
      method: "POST",
      body: {
        clinicId: Number(document.getElementById("request-clinicId").value),
        medicationId: Number(document.getElementById("request-medicationId").value),
        warehouseId: Number(document.getElementById("request-warehouseId").value),
        quantity: Number(document.getElementById("request-quantity").value),
      },
    });
    event.target.reset();
    showMessage(els.dashboardMessage, "Supply request created.", "success");
    loadRequests();
  } catch (error) {
    showMessage(els.dashboardMessage, error.message, "error");
  }
});

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------
applySession();
