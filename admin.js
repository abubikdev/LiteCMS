let data = {};
let currentSection = null;

// LOAD
async function loadData() {
  const res = await fetch("example.json");
  data = await res.json();

  // MIGRATE OLD STRUCTURE (important)
  migrateData();

  currentSection = Object.keys(data)[0] || null;

  buildNav();
  renderEditor();
}

// AUTO-MIGRATE (string → typed)
function migrateData() {
  Object.keys(data).forEach(sectionKey => {
    const section = data[sectionKey];

    Object.keys(section).forEach(key => {
      const val = section[key];

      // skip already typed or objects like projects
      if (typeof val === "object" && val !== null && val.type) return;
      if (typeof val === "object") return;

      // convert
      data[sectionKey][key] = {
        type: "text",
        value: val
      };
    });
  });
}

// NAV
function buildNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";

  Object.keys(data).forEach(key => {
    const item = document.createElement("div");
    item.className = "nav-item";
    item.innerText = key;

    if (key === currentSection) item.classList.add("active");

    item.onclick = () => {
      currentSection = key;
      buildNav();
      renderEditor();
    };

    nav.appendChild(item);
  });
}

// EDITOR
function renderEditor() {
  const editor = document.getElementById("editor");
  editor.innerHTML = "";

  if (!currentSection) return;

  const section = data[currentSection];

  Object.keys(section).forEach(key => {
    const field = section[key];

    // skip project list (keep your existing logic if needed)
    if (currentSection === "list") return;

    if (!field.type) return;

    const wrapper = document.createElement("div");
    wrapper.className = "card";

    // label
    const label = document.createElement("div");
    label.className = "card-header";
    label.innerText = key;

    // type selector
    const typeSelect = document.createElement("select");
    typeSelect.innerHTML = `
      <option value="text">Text</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
    `;
    typeSelect.value = field.type;

    typeSelect.onchange = (e) => {
      field.type = e.target.value;

      // reset value when switching types
      if (field.type === "number") field.value = 0;
      if (field.type === "boolean") field.value = false;
      if (field.type === "text") field.value = "";

      renderEditor();
    };

    wrapper.appendChild(label);
    wrapper.appendChild(typeSelect);

    // INPUT BASED ON TYPE
    let input;

    if (field.type === "text") {
      input = document.createElement("input");
      input.value = field.value;

      input.oninput = (e) => {
        field.value = e.target.value;
      };
    }

    if (field.type === "number") {
      input = document.createElement("input");
      input.type = "number";
      input.value = field.value;

      input.oninput = (e) => {
        field.value = Number(e.target.value);
      };
    }

    if (field.type === "boolean") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = field.value;

      input.onchange = (e) => {
        field.value = e.target.checked;
      };
    }

    wrapper.appendChild(input);
    editor.appendChild(wrapper);
  });
}

// ADD FIELD (WITH TYPE)
function addField() {
  const key = prompt("Field name:");
  if (!key) return;

  const type = prompt("Type (text, number, boolean):", "text");
  if (!type) return;

  data[currentSection][key] = {
    type: type,
    value:
      type === "number" ? 0 :
      type === "boolean" ? false :
      ""
  };

  renderEditor();
}

// ADD SECTION
function addSection() {
  const name = prompt("Section name:");
  if (!name) return;

  if (data[name]) {
    alert("Exists");
    return;
  }

  data[name] = {};
  currentSection = name;

  buildNav();
  renderEditor();
}

// DOWNLOAD
function downloadJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "data.json";
  a.click();

  URL.revokeObjectURL(url);
}

loadData();