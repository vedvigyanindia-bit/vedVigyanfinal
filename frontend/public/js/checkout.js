const CUSTOMER_KEY = "ved_vigyan_checkout_customer_v1";
const ORDER_KEY = "ved_vigyan_orders_v1";

let appliedCoupon = null;
let discountPercent = 0;

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function collectCheckoutPayload(form) {
  const customer = Object.fromEntries(new FormData(form).entries());
  const cart = window.VedVigyanCart.loadCart();
  const items = Object.values(cart.items).map(item => {
    if (appliedCoupon === "VED_V95") {
      const discountedPrice = Math.round(item.price * 0.05);
      return {
        ...item,
        price: discountedPrice
      };
    }
    return item;
  });

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const hasFreeShippingProduct = items.some(item => item.id === "vv_p08" || item.id === "p_rud_5m");
  const shipping = hasFreeShippingProduct ? 0 : (subtotal >= 999 ? 0 : 99);

  return {
    customer,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

function validateCheckoutPayload({ customer, items }) {
  if (
    !customer.name ||
    !customer.phone ||
    !customer.email ||
    !customer.address ||
    !customer.city ||
    !customer.state ||
    !customer.pincode
  ) {
    throw new Error("Please fill in all required delivery details");
  }

  if (!items.length) {
    throw new Error("Your cart is empty");
  }
}

function renderCheckoutSummary() {
  const summary = document.getElementById("checkoutSummary");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const shippingEl = document.getElementById("checkoutShipping");
  const totalEl = document.getElementById("checkoutTotal");
  if (!summary || !totalEl) return;

  const cart = window.VedVigyanCart.loadCart();
  const items = Object.values(cart.items);
  if (!items.length) {
    summary.innerHTML = `<p class="sub" style="margin:0">Your cart is empty. <a href="/shop.html">Go to shop</a>.</p>`;
    if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(0);
    if (shippingEl) shippingEl.textContent = window.VedVigyanCart.formatINR(0);
    totalEl.textContent = window.VedVigyanCart.formatINR(0);
    return;
  }

  summary.innerHTML = items
    .map((it) => {
      return `
        <div style="display:flex; justify-content:space-between; gap:10px; padding:10px 0; border-bottom:1px solid var(--line)">
          <div>
            <b>${it.name}</b>
            <div class="muted">Qty: ${it.qty}</div>
          </div>
          <div><b>${window.VedVigyanCart.formatINR((it.price || 0) * (it.qty || 0))}</b></div>
        </div>
      `;
    })
    .join("");

  const subtotal = window.VedVigyanCart.cartSubtotal(cart);
  let discount = 0;
  if (appliedCoupon === "VED_V95") {
    discount = Math.round(subtotal * 0.95);
  }
  const netSubtotal = subtotal - discount;
  const hasFreeShippingProduct = items.some(item => item.id === "vv_p08" || item.id === "p_rud_5m");
  const shipping = hasFreeShippingProduct ? 0 : (netSubtotal >= 999 ? 0 : 99);
  const netTotal = netSubtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(subtotal);

  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("checkoutDiscount");
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = "flex";
      discountEl.textContent = "-" + window.VedVigyanCart.formatINR(discount);
    } else {
      discountRow.style.display = "none";
    }
  }

  if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : window.VedVigyanCart.formatINR(shipping);
  totalEl.textContent = window.VedVigyanCart.formatINR(netTotal);
}

function loadSavedCustomer() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "{}");
  } catch {
    return {};
  }
}

function prefillCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  const saved = loadSavedCustomer();
  Object.entries(saved).forEach(([key, value]) => {
    if (form.elements[key] && typeof value === "string") {
      form.elements[key].value = value;
    }
  });
}

function saveCustomerProfile(data) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(data));
}

function saveOrder(order) {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...orders].slice(0, 10)));
  } catch {
    // Ignore localStorage issues.
  }
}

function renderOrderConfirmation(order) {
  const form = document.getElementById("checkoutForm");
  const summary = document.getElementById("checkoutSummary");
  const totalEl = document.getElementById("checkoutTotal");
  const intro = document.getElementById("checkoutIntro");
  if (!form || !summary || !totalEl) return;
  if (intro) {
    intro.textContent = "Your payment was received and your order was created successfully.";
  }

  form.innerHTML = `
    <div class="order-confirm">
      <div class="eyebrow">Order placed</div>
      <h2>Your spiritual essentials are booked</h2>
      <p class="sub" style="margin:0">
        Order is confirmed with ${order.items.length} item(s).
      </p>
      <div class="pagecard" style="margin-top:14px; padding:14px">
        <p style="margin:0 0 8px"><b>Delivery to:</b> ${order.customer.name}, ${order.customer.phone}</p>
        <p class="muted" style="margin:0">${order.customer.address}, ${order.customer.city || ""}, ${order.customer.state || ""}${order.customer.pincode ? ` - ${order.customer.pincode}` : ""}</p>
      </div>
      <div class="pagecard" style="margin-top:14px; padding:14px">
        <p style="margin:0 0 8px"><b>Payment:</b> Paid via Razorpay</p>
        <p class="muted" style="margin:0">
          Status: paid
          ${order.razorpayPaymentId ? ` | Payment ID: ${order.razorpayPaymentId}` : ""}
        </p>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px">
        <a class="btn small primary" href="/shop.html">Continue Shopping</a>
        <a class="btn small" href="/cart.html">View Cart</a>
      </div>
    </div>
  `;

  summary.innerHTML = order.items
    .map((item) => {
      return `
        <div style="display:flex; justify-content:space-between; gap:10px; padding:10px 0; border-bottom:1px solid var(--line)">
          <div>
            <b>${item.name}</b>
            <div class="muted">Qty: ${item.qty}</div>
          </div>
          <div><b>${window.VedVigyanCart.formatINR((item.price || 0) * (item.qty || 0))}</b></div>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = window.VedVigyanCart.formatINR(order.total);
}

async function placeCodOrder(payload) {
  const response = await postJson("/api/orders/cod", {
    customer: payload.customer,
    items: payload.items
  });

  return response.order;
}

async function launchRazorpayCheckout(payload) {
  if (typeof window.Razorpay !== "function") {
    throw new Error("Razorpay SDK failed to load");
  }

  const { customer, items, total } = payload;
  const orderData = await postJson("/api/payments/create-order", {
    customer,
    items
  });

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.razorpayOrder.amount,
      currency: orderData.razorpayOrder.currency,
      name: "Ved Vigyan",
      description: "Spiritual essentials order",
      order_id: orderData.razorpayOrder.id,
      prefill: {
        name: customer.name,
        contact: customer.phone,
        email: customer.email || ""
      },
      notes: {
        address: customer.address,
        city: customer.city || "",
        pincode: customer.pincode || ""
      },
      theme: {
        color: "#9b6b2f"
      },
      handler: async function handlePaymentSuccess(paymentResponse) {
        try {
          const verified = await postJson("/api/payments/verify", {
            customer,
            items,
            payment: paymentResponse
          });
          resolve(verified.order);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: function onDismiss() {
          reject(new Error("Payment was cancelled"));
        }
      }
    });

    razorpay.on("payment.failed", (event) => {
      const description = event?.error?.description || "Payment failed";
      reject(new Error(description));
    });

    razorpay.open();
  }).then((order) => ({
    ...order,
    total
  }));
}

function wireCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');

    try {
      const payload = collectCheckoutPayload(form);
      validateCheckoutPayload(payload);
      saveCustomerProfile(payload.customer);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Opening Razorpay...";
      }

      const order = await launchRazorpayCheckout(payload);

      saveOrder(order);
      window.VedVigyanCart.clearCart();
      renderOrderConfirmation(order);
      window.VedVigyanCart.toast("Payment successful");
    } catch (error) {
      window.VedVigyanCart.toast(error.message || "Unable to complete checkout");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Place Order";
      }
    }
  });
}

function setupCouponHandler() {
  const couponInput = document.getElementById("couponCode");
  const applyBtn = document.getElementById("applyCouponBtn");
  const messageEl = document.getElementById("couponMessage");

  if (!couponInput || !applyBtn || !messageEl) return;

  applyBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) {
      appliedCoupon = null;
      discountPercent = 0;
      messageEl.style.display = "none";
      renderCheckoutSummary();
      return;
    }

    if (code === "VED_V95") {
      appliedCoupon = "VED_V95";
      discountPercent = 95;
      messageEl.textContent = "Coupon VED_V95 applied! 95% discount has been applied to product prices.";
      messageEl.style.color = "#2e7d32";
      messageEl.style.display = "block";
    } else {
      appliedCoupon = null;
      discountPercent = 0;
      messageEl.textContent = "Invalid coupon code.";
      messageEl.style.color = "#d32f2f";
      messageEl.style.display = "block";
    }
    renderCheckoutSummary();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  prefillCheckoutForm();
  renderCheckoutSummary();
  wireCheckoutForm();
  setupCouponHandler();
  window.addEventListener("vedvigyan:cart-updated", renderCheckoutSummary);
});

