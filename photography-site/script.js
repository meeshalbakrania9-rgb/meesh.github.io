const photos = [
  {
    id: "flower-1",
    title: "Crimson Bloom",
    category: "Close Up Nature",
    description: "A close-up flower study with vivid colour, crisp detail, and soft background blur.",
    image: "images/flower1.png",
    licenses: [
      { name: "Fine Art Print", price: 16 },
      { name: "Digital Personal License", price: 5 },
      { name: "Commercial License", price: 50 }
    ]
  },
  {
    id: "car-1",
    title: "Patrol at the Crossing",
    category: "Cars",
    description: "A police car scene captured with strong depth of field and bright street colour.",
    image: "images/car1.png",
    licenses: [
      { name: "Fine Art Print", price: 16 },
      { name: "Digital Personal License", price: 5 },
      { name: "Commercial License", price: 50 }
    ]
  },
  {
    id: "horse-1",
    title: "Mane in Morning Light",
    category: "Close Up Nature",
    description: "A quiet horse study with warm side light and natural texture.",
    image: "images/horse.png",
    licenses: [
      { name: "Fine Art Print", price: 16 },
      { name: "Digital Personal License", price: 5 },
      { name: "Commercial License", price: 50 }
    ]
  },
  {
    id: "crimson-bloom-2",
    title: "Crimson Bloom II",
    category: "Close Up Nature",
    description: "A second floral close-up with saturated pink petals and deep green contrast.",
    image: "images/horse2.png",
    licenses: [
      { name: "Fine Art Print", price: 16 },
      { name: "Digital Personal License", price: 5 },
      { name: "Commercial License", price: 50 }
    ]
  },
  {
    id: "field-horse",
    title: "Golden Pasture",
    category: "Close Up Nature",
    description: "A golden field image with a horse framed by soft rural light.",
    image: "images/saturated_CIMG2289.jpg",
    licenses: [
      { name: "Fine Art Print", price: 16 },
      { name: "Digital Personal License", price: 5 },
      { name: "Commercial License", price: 50 }
    ]
  }
];

const state = {
  filter: "all",
  featuredIndex: 0,
  selectedPhoto: null,
  cart: []
};

const galleryGrid = document.querySelector("#galleryGrid");
const filters = document.querySelectorAll(".filter");
const photoModal = document.querySelector("#photoModal");
const modalPreview = document.querySelector("#modalPreview");
const modalTitle = document.querySelector("#modalTitle");
const modalCategory = document.querySelector("#modalCategory");
const modalDescription = document.querySelector("#modalDescription");
const licenseSelect = document.querySelector("#licenseSelect");
const modalAddButton = document.querySelector("#modalAddButton");
const cartButton = document.querySelector("#cartButton");
const cartDrawer = document.querySelector("#cartDrawer");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutModal = document.querySelector("#checkoutModal");
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutNote = document.querySelector("#checkoutNote");
const toast = document.querySelector("#toast");
const viewingImage = document.querySelector("#viewingImage");
const viewingCategory = document.querySelector("#viewingCategory");
const viewingTitle = document.querySelector("#viewingTitle");
const viewingDescription = document.querySelector("#viewingDescription");
const viewingStrip = document.querySelector("#viewingStrip");
const previousPhoto = document.querySelector("#previousPhoto");
const nextPhoto = document.querySelector("#nextPhoto");
const viewingBuy = document.querySelector("#viewingBuy");

const formatPrice = (value) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(
    value
  );

function renderGallery() {
  const visiblePhotos =
    state.filter === "all" ? photos : photos.filter((photo) => photo.category === state.filter);

  galleryGrid.innerHTML = visiblePhotos
    .map(
      (photo) => `
        <article class="photo-card">
          <button class="photo-frame protected-preview" style="background-image: url('${photo.image}')" type="button" data-open="${photo.id}" aria-label="Preview ${photo.title}"></button>
          <div class="photo-body">
            <div class="photo-meta">
              <div>
                <p class="eyebrow">${photo.category}</p>
                <h3>${photo.title}</h3>
              </div>
              <span class="price">from ${formatPrice(photo.licenses[1].price)}</span>
            </div>
            <p>${photo.description}</p>
            <div class="card-actions">
              <button class="secondary-action" type="button" data-open="${photo.id}">Preview</button>
              <button class="primary-action" type="button" data-quick-add="${photo.id}">Buy</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderViewingRoom() {
  const photo = photos[state.featuredIndex];
  viewingImage.style.backgroundImage = `url('${photo.image}')`;
  viewingCategory.textContent = photo.category;
  viewingTitle.textContent = photo.title;
  viewingDescription.textContent = photo.description;

  viewingStrip.innerHTML = photos
    .map(
      (item, index) => `
        <button class="viewing-thumb ${index === state.featuredIndex ? "is-active" : ""}" style="background-image: url('${item.image}')" type="button" data-featured="${index}" aria-label="Feature ${item.title}">
          <span>${String(index + 1).padStart(2, "0")}</span>
        </button>
      `
    )
    .join("");
}

function setFeaturedPhoto(index) {
  state.featuredIndex = (index + photos.length) % photos.length;
  renderViewingRoom();
}

function openPhoto(photoId) {
  const photo = photos.find((item) => item.id === photoId);
  state.selectedPhoto = photo;
  modalPreview.style.backgroundImage = `url('${photo.image}')`;
  modalTitle.textContent = photo.title;
  modalCategory.textContent = photo.category;
  modalDescription.textContent = photo.description;
  licenseSelect.innerHTML = photo.licenses
    .map((license, index) => `<option value="${index}">${license.name} - ${formatPrice(license.price)}</option>`)
    .join("");
  photoModal.classList.add("is-open");
  photoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closePhoto() {
  photoModal.classList.remove("is-open");
  photoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function addToCart(photo, licenseIndex = 0) {
  const license = photo.licenses[licenseIndex];
  state.cart.push({
    key: crypto.randomUUID(),
    photoId: photo.id,
    title: photo.title,
    image: photo.image,
    license: license.name,
    price: license.price
  });
  renderCart();
  showToast(`${photo.title} added to bag`);
}

function renderCart() {
  cartCount.textContent = state.cart.length;
  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);

  cartItems.innerHTML = state.cart.length
    ? state.cart
        .map(
          (item) => `
            <article class="cart-item">
              <div class="cart-thumb" style="background-image: url('${item.image}')"></div>
              <div>
                <h3>${item.title}</h3>
                <p>${item.license} - ${formatPrice(item.price)}</p>
              </div>
              <button class="remove-item" type="button" data-remove="${item.key}" aria-label="Remove ${item.title}">x</button>
            </article>
          `
        )
        .join("")
    : `<p>Your bag is empty.</p>`;
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function buildOrderSummary() {
  return state.cart.map((item) => `${item.title} - ${item.license} - ${formatPrice(item.price)}`).join("%0D%0A");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.filter = button.dataset.filter;
    renderGallery();
  });
});

galleryGrid.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open]");
  const quickAddButton = event.target.closest("[data-quick-add]");

  if (openButton) {
    openPhoto(openButton.dataset.open);
  }

  if (quickAddButton) {
    const photo = photos.find((item) => item.id === quickAddButton.dataset.quickAdd);
    addToCart(photo, 0);
    openCart();
  }
});

modalAddButton.addEventListener("click", () => {
  addToCart(state.selectedPhoto, Number(licenseSelect.value));
  closePhoto();
  openCart();
});

document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", closePhoto));
photoModal.addEventListener("click", (event) => {
  if (event.target === photoModal) closePhoto();
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  state.cart = state.cart.filter((item) => item.key !== removeButton.dataset.remove);
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Add an image before checkout");
    return;
  }

  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");
  checkoutNote.textContent = "";
});

document
  .querySelectorAll("[data-close-checkout]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      checkoutModal.classList.remove("is-open");
      checkoutModal.setAttribute("aria-hidden", "true");
    })
  );

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.remove("is-open");
    checkoutModal.setAttribute("aria-hidden", "true");
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(checkoutForm);
  const subject = encodeURIComponent("Photography order request");
  const body = `Name: ${encodeURIComponent(data.get("name"))}%0D%0AEmail: ${encodeURIComponent(
    data.get("email")
  )}%0D%0A%0D%0AOrder:%0D%0A${buildOrderSummary()}%0D%0A%0D%0ANotes:%0D%0A${encodeURIComponent(
    data.get("notes") || ""
  )}`;

  checkoutNote.innerHTML = `Order prepared. <a href="mailto:hello@example.com?subject=${subject}&body=${body}">Open email checkout request</a>.`;
  showToast("Order request prepared");
});

viewingStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-featured]");
  if (!button) return;
  setFeaturedPhoto(Number(button.dataset.featured));
});

previousPhoto.addEventListener("click", () => setFeaturedPhoto(state.featuredIndex - 1));
nextPhoto.addEventListener("click", () => setFeaturedPhoto(state.featuredIndex + 1));
viewingBuy.addEventListener("click", () => {
  addToCart(photos[state.featuredIndex], 0);
  openCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePhoto();
    closeCartDrawer();
    checkoutModal.classList.remove("is-open");
    checkoutModal.setAttribute("aria-hidden", "true");
  }
});

["contextmenu", "dragstart", "selectstart", "copy"].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    if (event.target.closest(".protected-preview")) {
      event.preventDefault();
      showToast("Preview images are protected");
    }
  });
});

renderGallery();
renderViewingRoom();
renderCart();
