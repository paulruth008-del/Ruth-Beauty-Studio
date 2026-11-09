const products = [
  { id: "lipstick", name: "Everyday Lipstick", description: "A soft, lasting shade for every occasion.", price: 1200 },
  { id: "foundation", name: "Glow Foundation", description: "Lightweight coverage with a natural finish.", price: 2500 },
  { id: "face-powder", name: "Soft Finish Powder", description: "A smooth finish for your beauty routine.", price: 1800 },
  { id: "lip-gloss", name: "Nourishing Lip Gloss", description: "A glossy look with a comfortable feel.", price: 900 }
];

const cart = new Map();
const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0
});

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = currency.format(product.price);

    const addButton = document.createElement("button");
    addButton.className = "btn primary";
    addButton.type = "button";
    addButton.textContent = "Add to cart";
    addButton.addEventListener("click", () => {
      cart.set(product.id, (cart.get(product.id) || 0) + 1);
      updateCartCount();
      addButton.textContent = "Added";
      window.setTimeout(() => {
        addButton.textContent = "Add to cart";
      }, 900);
    });

    card.append(title, description, price, addButton);
    productGrid.append(card);
  });
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (!cartCount) return;

  let count = 0;
  cart.forEach((quantity) => {
    count += quantity;
  });
  cartCount.textContent = String(count);
}

function createCartDialog() {
  const dialog = document.createElement("dialog");
  dialog.id = "cartDialog";
  dialog.className = "cart-dialog";
  dialog.setAttribute("aria-labelledby", "cartDialogTitle");

  const heading = document.createElement("h2");
  heading.id = "cartDialogTitle";
  heading.textContent = "Your Cart";

  const list = document.createElement("ul");
  list.className = "cart-items";

  const total = document.createElement("p");
  total.className = "cart-total";

  const actions = document.createElement("div");
  actions.className = "cart-actions";

  const clearButton = document.createElement("button");
  clearButton.className = "btn secondary";
  clearButton.type = "button";
  clearButton.textContent = "Clear cart";

  const closeButton = document.createElement("button");
  closeButton.className = "btn primary";
  closeButton.type = "button";
  closeButton.textContent = "Continue shopping";
  closeButton.addEventListener("click", () => dialog.close());

  clearButton.addEventListener("click", () => {
    cart.clear();
    updateCartCount();
    renderCartDialog(dialog);
  });

  actions.append(clearButton, closeButton);
  dialog.append(heading, list, total, actions);
  document.body.append(dialog);
  return dialog;
}

function renderCartDialog(dialog) {
  const list = dialog.querySelector(".cart-items");
  const totalElement = dialog.querySelector(".cart-total");
  list.replaceChildren();

  let total = 0;
  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const itemTotal = product.price * quantity;
    total += itemTotal;
    const item = document.createElement("li");
    item.textContent = `${product.name} × ${quantity} — ${currency.format(itemTotal)}`;
    list.append(item);
  });

  if (cart.size === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Your cart is empty.";
    list.append(emptyMessage);
  }

  totalElement.textContent = `Total: ${currency.format(total)}`;
}

function setupCart() {
  const cartButton = document.getElementById("cartButton") || document.querySelector(".cart-button");
  if (!cartButton) return;

  const dialog = createCartDialog();
  window.showCart = () => {
    renderCartDialog(dialog);
    dialog.showModal();
  };
  cartButton.onclick = window.showCart;
}

function setupMobileNavigation() {
  const menuToggle = document.getElementById("menuToggle") || document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("navMenu");
  if (!menuToggle || !navMenu) return;

  window.toggleMenu = () => {
    const isOpen = navMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };
  menuToggle.onclick = window.toggleMenu;

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  const message = document.getElementById("bookingMessage");
  const dateInput = document.getElementById("date");
  if (!form || !message) return;

  const setMinimumDate = () => {
    if (!dateInput) return;
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localDate;
  };
  setMinimumDate();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent =
      "Thanks! Your request is ready. This demo does not send bookings, so please contact the salon to confirm.";
    form.reset();
    setMinimumDate();
  });
}

renderProducts();
setupCart();
setupMobileNavigation();
setupBookingForm();
