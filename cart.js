// cart.js - Shopping Cart Functionality

let cart = [];
let products = [
  {
    id: 1,
    name: "SnackSip Large",
    price: 4.99,
    image: "image/snacksip-large.jpg",
  },
  {
    id: 2,
    name: "SnackSip Medium",
    price: 3.99,
    image: "image/snacksip-medium.jpg",
  },
  {
    id: 3,
    name: "SnackSip Small",
    price: 1.99,
    image: "image/snacksip-small.jpg",
  },
];

// Add to cart function
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  updateCartUI();
  saveCart();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
  saveCart();
}

// Update quantity
function updateQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
      saveCart();
    }
  }
}

// Calculate total
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("snacksipCart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("snacksipCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
  }
}

// Update cart UI
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;

  // Update cart dropdown
  if (cartItems) {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
      cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItems.appendChild(cartItem);
      });

      // Add event listeners to new buttons
      document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          updateQuantity(
            parseInt(e.target.dataset.id),
            cart.find((item) => item.id === parseInt(e.target.dataset.id))
              .quantity - 1
          );
        });
      });

      document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          updateQuantity(
            parseInt(e.target.dataset.id),
            cart.find((item) => item.id === parseInt(e.target.dataset.id))
              .quantity + 1
          );
        });
      });

      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          removeFromCart(parseInt(e.target.dataset.id));
        });
      });
    }
  }

  // Update total
  if (cartTotal) cartTotal.textContent = `RM ${calculateTotal().toFixed(2)}`;
}

// Initialize cart
document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  // Add to cart buttons
  document.querySelectorAll(".btn[data-product-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.productId);
      addToCart(productId);

      // Show notification
      const notification = document.createElement("div");
      notification.className = "cart-notification";
      notification.textContent = "Added to cart!";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("show");
      }, 10);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    });
  });

  // Cart toggle
  const cartToggle = document.getElementById("cart-toggle");
  const cartDropdown = document.getElementById("cart-dropdown");

  if (cartToggle && cartDropdown) {
    cartToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      cartDropdown.classList.toggle("show");
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      cartDropdown.classList.remove("show");
    });
  }
});
