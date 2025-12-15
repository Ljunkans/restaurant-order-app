import { menuArray } from "/data.js";

/* ===================
   DOM REFERENCES
   =================== */
const itemsContainer = document.getElementById("items-container");
const selectedItemContainer = document.getElementById("selected-item");
const cartContainer = document.getElementById("cart-container");
const checkoutContainer = document.getElementById("checkout-container");
const orderCompleteContainer = document.getElementById(
  "order-complete-container"
);
const orderCompleteText = document.getElementById("order-complete-text");
const completeOrderBtn = document.getElementById("completeorder-button");
const closeCheckoutBtn = document.getElementById("close-checkout");
const checkoutForm = document.getElementById("checkout-form");

/* ===================
   STATE
   =================== */
let cart = [];

/* ===================
   HELPER FUNCTIONS
   =================== */
function addToCart(itemId) {
  const item = menuArray.find((product) => product.id == itemId);
  cart.push(item);
  renderCart();
}

function removeFromCart(itemId) {
  const index = cart.findIndex((item) => item.id == itemId);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  renderCart();
}

/* ===================
   RENDER MENU
   =================== */
let feedHtml = "";

menuArray.forEach((item) => {
  feedHtml += `
    <div class="menu-item">
        <div id="item-wrapper">
            <div id="item-img-container">
                <p id="item-img">${item.emoji}</p> 
            </div>
            <div id="item-info-container">
                <h3>${item.name}</h3>
                <p id="ingrediens-p">${item.ingredients.join(", ")}</p>
                <p>$${item.price}</p>
            </div>
            <div id="addtocart-button-container">
                <button id="addtocart-button" class="btn-round" data-id="${
                  item.id
                }">+</button>
            </div>
        </div>  
    </div>
    <hr />`;
});

itemsContainer.innerHTML = feedHtml;

/* ===================
   RENDER CART
   =================== */
function renderCart() {
  selectedItemContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.style.display = "none";
    return;
  }

  cartContainer.style.display = "flex";

  // Group items by id
  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  // Calculate total and render items
  let totalPrice = 0;

  groupedCart.forEach((item) => {
    totalPrice += item.price * item.quantity;
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
      <div class="cart-item">
        <span class="item-name-cart">${item.name}</span>
        <div class="quantity-controls">
          <button class="minus-btn btn-round" data-id="${item.id}">-</button>
          <span class="quantity-text">${item.quantity}</span>
          <button class="plus-btn btn-round" data-id="${item.id}">+</button>
        </div>
        <span class="price">$${item.price * item.quantity}</span>
      </div>
    `;
    selectedItemContainer.appendChild(itemDiv);
  });

  // Render total
  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
    <hr class="hr-cart" />
    <div class="cart-item">
      <span class="item-name-cart">Total price:</span>
      <span class="price">$${totalPrice}</span>
    </div>
  `;
  selectedItemContainer.appendChild(totalDiv);

  // Add event listeners to quantity buttons
  document.querySelectorAll(".minus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => removeFromCart(e.target.dataset.id));
  });

  document.querySelectorAll(".plus-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => addToCart(e.target.dataset.id));
  });
}

/* ===================
   EVENT LISTENERS
   =================== */
// Add to cart buttons
document.querySelectorAll("#addtocart-button").forEach((button) => {
  button.addEventListener("click", (e) => addToCart(e.target.dataset.id));
});

// Complete order button
completeOrderBtn.addEventListener("click", () => {
  checkoutContainer.style.display = "flex";
});

// Close checkout button
closeCheckoutBtn.addEventListener("click", () => {
  checkoutContainer.style.display = "none";
});

// Checkout form submit
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  orderCompleteText.textContent = `Thanks, ${name}! Your order is on it's way (no, just kidding).`;
  orderCompleteContainer.style.display = "flex";
  checkoutContainer.style.display = "none";
  cartContainer.style.display = "none";
});
