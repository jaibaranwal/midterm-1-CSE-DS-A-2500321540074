const API = "/products";

const body = document.getElementById("productBody");
const form = document.getElementById("productForm");
const idField = document.getElementById("productId");
const nameField = document.getElementById("name");
const priceField = document.getElementById("price");
const categoryField = document.getElementById("category");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const message = document.getElementById("message");
const searchId = document.getElementById("searchId");

function show(text, isError) {
  message.textContent = text;
  message.className = "message" + (isError ? " error" : "");
}

function render(products) {
  body.innerHTML = "";
  if (!products.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty">No products found</td></tr>';
    return;
  }
  products.forEach(p => {
    const tr = document.createElement("tr");
    [p.id, p.name ?? "-", p.price ?? "-", p.category ?? "-"].forEach(v => {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    td.className = "actions";
    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => startEdit(p);
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "danger";
    del.onclick = () => removeProduct(p.id);
    td.append(edit, del);
    tr.appendChild(td);
    body.appendChild(tr);
  });
}

async function loadProducts() {
  const res = await fetch(API);
  render(await res.json());
}

async function searchProduct() {
  const id = searchId.value.trim();
  if (!id) return loadProducts();
  const res = await fetch(API + "/" + id);
  const type = res.headers.get("content-type") || "";
  if (type.includes("json")) {
    render([await res.json()]);
  } else {
    render([]);
    show(await res.text(), true);
  }
}

function startEdit(p) {
  idField.value = p.id;
  nameField.value = p.name ?? "";
  priceField.value = p.price ?? "";
  categoryField.value = p.category ?? "";
  formTitle.textContent = "Edit Product #" + p.id;
  saveBtn.textContent = "Update";
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  form.reset();
  idField.value = "";
  formTitle.textContent = "Add Product";
  saveBtn.textContent = "Add";
  cancelBtn.hidden = true;
}

async function removeProduct(id) {
  if (!confirm("Delete product " + id + "?")) return;
  const res = await fetch(API + "/" + id, { method: "DELETE" });
  show(await res.text());
  loadProducts();
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    name: nameField.value,
    price: Number(priceField.value),
    category: categoryField.value
  };
  const editing = idField.value !== "";
  const res = await fetch(editing ? API + "/" + idField.value : API, {
    method: editing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  show(await res.text());
  resetForm();
  loadProducts();
});

cancelBtn.addEventListener("click", resetForm);
document.getElementById("searchBtn").addEventListener("click", searchProduct);
document.getElementById("showAllBtn").addEventListener("click", () => { searchId.value = ""; loadProducts(); });

loadProducts();
