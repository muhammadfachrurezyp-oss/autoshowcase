const state = { category: "all", sort: "recommended" };
const grid = document.querySelector("#catalog-grid");
const status = document.querySelector("#catalog-status");
const filterButtons = [...document.querySelectorAll("[data-category]")];
const sortSelect = document.querySelector("#sort-select");
const dialog = document.querySelector("#car-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogWa = document.querySelector("#dialog-wa");
const closeButton = document.querySelector("#dialog-close");

let activeCar = null;
let dialogOriginButton = null;
let pushedDialogEntry = false;
let pointerStartedOnDialog = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function formatIDR(value) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function fallbackSiteUrl() {
  return `${location.origin}${location.pathname}`;
}

function buildWaUrl(car) {
  const digits = String(SITE_CONFIG.whatsappNumber || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) {
    console.warn("Nomor WhatsApp tidak valid atau tidak ada.");
    return "#";
  }
  const baseUrl = (SITE_CONFIG.siteUrl || fallbackSiteUrl()).replace(/[#?].*$/, "");
  let message;
  if (car) {
    const link = `${baseUrl}#car-${car.id}`;
    message = `Halo AutoShowcase, saya tertarik dengan ${car.name} seharga ${formatIDR(car.priceIDR).replace(/\u00a0/g, " ")}. Apakah tersedia untuk tes jalan? ${link}`;
  } else {
    message = "Halo AutoShowcase, saya ingin mengetahui informasi lebih lanjut tentang kendaraan yang tersedia.";
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function getVisibleCars() {
  let cars = state.category === "all"
    ? [...CARS]
    : CARS.filter((car) => car.category === state.category);

  if (state.sort === "lowest") cars.sort((a, b) => a.priceIDR - b.priceIDR);
  if (state.sort === "highest") cars.sort((a, b) => b.priceIDR - a.priceIDR);
  return cars;
}

function render() {
  const cars = getVisibleCars();
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  });
  sortSelect.value = state.sort;

  if (!cars.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>Tidak ada kendaraan yang cocok dengan filter ini.</p>
        <button class="button button-primary" type="button" data-reset-filter>Reset filter</button>
      </div>`;
  } else {
    grid.innerHTML = cars.map((car) => `
      <article class="car-card">
        <img src="${escapeHTML(car.image)}" alt="${escapeHTML(car.imageAlt)}" width="900" height="600" loading="lazy">
        <div class="card-body">
          <div class="card-category">${escapeHTML(getCategoryLabel(car.category))}</div>
          <h3>${escapeHTML(car.name)}</h3>
          <div class="price">${escapeHTML(formatIDR(car.priceIDR))}</div>
          <button class="card-button" type="button" data-id="${car.id}" aria-label="Lihat spesifikasi ${escapeHTML(car.name)}">Lihat spesifikasi</button>
        </div>
      </article>
    `).join("");
  }

  const noun = cars.length === 1 ? "mobil" : "mobil";
  status.textContent = `Menampilkan ${cars.length} ${noun}`;
  syncUrl();
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.category !== "all") params.set("kategori", state.category);
  if (state.sort !== "recommended") params.set("urut", state.sort);

  const query = params.toString();
  const nextUrl = `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
  history.replaceState({ ...history.state, category: state.category, sort: state.sort }, "", nextUrl);
}

function openCar(carId, originButton = null) {
  const car = CARS.find((item) => item.id === carId);
  if (!car) return;

  if (state.category !== "all" && car.category !== state.category) {
    state.category = "all";
    render();
  }

  activeCar = car;
  dialogOriginButton = originButton || document.querySelector(`.card-button[data-id="${car.id}"]`);
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(car.image)}" alt="${escapeHTML(car.imageAlt)}" width="900" height="600">
    <div class="dialog-body">
      <div class="card-category">${escapeHTML(getCategoryLabel(car.category))}</div>
      <h2 id="modal-title">${escapeHTML(car.name)}</h2>
      <div class="price">${escapeHTML(formatIDR(car.priceIDR))}</div>
      <p class="dialog-description">${escapeHTML(car.description)}</p>
      <table class="spec-table" aria-label="Spesifikasi ${escapeHTML(car.name)}">
        <tbody>
          ${car.specs.map((spec) => `
            <tr>
              <th scope="row">${escapeHTML(spec.label)}</th>
              <td>${escapeHTML(spec.value)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>`;
  dialogWa.href = buildWaUrl(car);

  if (!dialog.open) {
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
  }
  closeButton.focus();
}

function closeDialogWithHistory() {
  if (!dialog.open) return;
  if (pushedDialogEntry) {
    history.back();
  } else {
    history.replaceState(history.state, "", location.pathname + location.search);
    closeDialog();
  }
}

function closeDialog() {
  if (dialog.open) dialog.close();
  document.documentElement.classList.remove("modal-open");
  pushedDialogEntry = false;
  activeCar = null;

  const id = dialogOriginButton?.dataset.id;
  requestAnimationFrame(() => {
    const replacement = id ? document.querySelector(`.card-button[data-id="${id}"]`) : null;
    (replacement || dialogOriginButton)?.focus();
  });
  dialogOriginButton = null;
}

function route() {
  const hash = location.hash;
  const match = /^#car-(\d+)$/.exec(hash);
  if (match) {
    const carId = Number(match[1]);
    const car = CARS.find((item) => item.id === carId);
    if (car) {
      pushedDialogEntry = false;
      openCar(carId);
    } else {
      history.replaceState(history.state, "", location.pathname + location.search);
    }
  } else if (!dialog.open) {
    activeCar = null;
  } else if (!/^#/.test(hash) || /^#(?:katalog|tentang|kontak)$/.test(hash)) {
    closeDialogWithHistory();
  }
}

function applyUrlState() {
  const params = new URLSearchParams(location.search);
  const category = params.get("kategori");
  const sort = params.get("urut");
  state.category = Object.hasOwn(CATEGORY_LABELS, category) ? category : "all";
  state.sort = ["recommended", "lowest", "highest"].includes(sort) ? sort : "recommended";
  render();
  route();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    render();
  });
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

grid.addEventListener("click", (event) => {
  const resetButton = event.target.closest("[data-reset-filter]");
  if (resetButton) {
    state.category = "all";
    render();
    filterButtons[0].focus();
    return;
  }

  const button = event.target.closest(".card-button");
  if (!button) return;
  const carId = Number(button.dataset.id);
  dialogOriginButton = button;
  pushedDialogEntry = true;
  history.pushState({ carId }, "", `#car-${carId}`);
  openCar(carId, button);
});

closeButton.addEventListener("click", closeDialogWithHistory);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialogWithHistory();
});
dialog.addEventListener("close", () => {
  document.documentElement.classList.remove("modal-open");
});

dialog.addEventListener("pointerdown", (event) => {
  pointerStartedOnDialog = event.target === dialog;
});
dialog.addEventListener("click", (event) => {
  if (pointerStartedOnDialog && event.target === dialog) closeDialogWithHistory();
  pointerStartedOnDialog = false;
});

window.addEventListener("popstate", () => {
  if (dialog.open) {
    closeDialog();
  }
  applyUrlState();
});
window.addEventListener("hashchange", route);

[grid, dialog].forEach((container) => {
  container.addEventListener("error", (event) => {
    const image = event.target.closest("img");
    if (!image || image.dataset.fallback) return;
    image.dataset.fallback = "true";
    image.src = "images/placeholder.svg";
  }, true);
});

document.querySelector("#demo-bar").hidden = !SITE_CONFIG.showDemoNotice;
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#contact-wa").href = buildWaUrl();
document.querySelector("#contact-email").href = `mailto:${SITE_CONFIG.email}`;
document.querySelector("#contact-email").textContent = SITE_CONFIG.email;

applyUrlState();
