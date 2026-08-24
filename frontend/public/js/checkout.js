const CUSTOMER_KEY = "ved_vigyan_checkout_customer_v1";
const ORDER_KEY = "ved_vigyan_orders_v1";

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
    const errorMsg = data.error || data.message || (typeof data === "string" ? data : null) || `Server Error (${response.status}): Unable to complete request`;
    throw new Error(errorMsg);
  }

  return data;
}

function collectCheckoutPayload(form) {
  const customer = Object.fromEntries(new FormData(form).entries());
  const cart = window.VedVigyanCart.loadCart();
  const items = Object.values(cart.items);
  const subtotal = window.VedVigyanCart.cartSubtotal(cart);
  const isPrepaid = customer.payment !== "cod";
  const prepaidDiscount = isPrepaid ? Math.round(subtotal * 0.05) : 0;
  const shipping = subtotal >= 999 ? 0 : 99;

  return {
    customer,
    items,
    subtotal,
    prepaidDiscount,
    shipping,
    total: subtotal - prepaidDiscount + shipping
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
  const discountRowEl = document.getElementById("checkoutDiscountRow");
  const discountEl = document.getElementById("checkoutDiscount");
  const shippingEl = document.getElementById("checkoutShipping");
  const totalEl = document.getElementById("checkoutTotal");
  if (!summary || !totalEl) return;

  const cart = window.VedVigyanCart.loadCart();
  const items = Object.values(cart.items);
  if (!items.length) {
    summary.innerHTML = `<p class="sub" style="margin:0">Your cart is empty. <a href="/shop.html">Go to shop</a>.</p>`;
    if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(0);
    if (discountRowEl) discountRowEl.style.display = "none";
    if (shippingEl) shippingEl.textContent = window.VedVigyanCart.formatINR(0);
    totalEl.textContent = window.VedVigyanCart.formatINR(0);
    return;
  }

  summary.innerHTML = items
    .map((it) => {
      const isFree = it.price === 0 || it.isFreeGift;
      const priceText = isFree ? `<span style="color:#27ae60; font-weight:700;">FREE (₹0)</span>` : window.VedVigyanCart.formatINR((it.price || 0) * (it.qty || 0));
      return `
        <div style="display:flex; justify-content:space-between; gap:10px; padding:10px 0; border-bottom:1px solid var(--line)">
          <div>
            <b>${it.name}</b>
            <div class="muted">Qty: ${it.qty}</div>
          </div>
          <div><b>${priceText}</b></div>
        </div>
      `;
    })
    .join("");

  const subtotal = window.VedVigyanCart.cartSubtotal(cart);
  const paymentRadio = document.querySelector('input[name="payment"]:checked');
  const isPrepaid = paymentRadio ? paymentRadio.value !== "cod" : true;
  const prepaidDiscount = isPrepaid ? Math.round(subtotal * 0.05) : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const netTotal = subtotal - prepaidDiscount + shipping;

  if (subtotalEl) subtotalEl.textContent = window.VedVigyanCart.formatINR(subtotal);
  if (discountRowEl) {
    if (prepaidDiscount > 0) {
      discountRowEl.style.display = "flex";
      if (discountEl) discountEl.textContent = `- ${window.VedVigyanCart.formatINR(prepaidDiscount)}`;
    } else {
      discountRowEl.style.display = "none";
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

  const isCod = order.payment === "cod" || (order.paymentStatus && order.paymentStatus.includes("Cash on Delivery"));

  if (intro) {
    intro.textContent = isCod
      ? "Your Cash on Delivery order has been placed successfully."
      : "Your payment was received and your order was created successfully.";
  }

  const paymentBlock = isCod
    ? `
      <div class="pagecard" style="margin-top:14px; padding:14px">
        <p style="margin:0 0 8px"><b>Payment Method:</b> Cash on Delivery (COD)</p>
        <p class="muted" style="margin:0">Status: Pending (Pay cash upon delivery at your doorstep)</p>
      </div>
    `
    : `
      <div class="pagecard" style="margin-top:14px; padding:14px">
        <p style="margin:0 0 8px"><b>Payment:</b> Paid via Razorpay</p>
        <p class="muted" style="margin:0">
          Status: Paid
          ${order.razorpayPaymentId ? ` | Payment ID: ${order.razorpayPaymentId}` : ""}
        </p>
      </div>
    `;

  form.innerHTML = `
    <div class="order-confirm">
      <div class="eyebrow" style="color:var(--maroon,#8a1a23); font-weight:bold;">🎉 Order Confirmed</div>
      <h2 style="font-family:var(--font-display,serif); margin:6px 0 10px;">Thank you for your order!</h2>
      <p class="sub" style="margin:0">
        Your spiritual essentials order #${order.orderId || ""} is booked with ${order.items.length} item(s).
      </p>
      <div class="pagecard" style="margin-top:14px; padding:14px">
        <p style="margin:0 0 8px"><b>Delivery to:</b> ${order.customer.name}, ${order.customer.phone}</p>
        <p class="muted" style="margin:0">${order.customer.address}, ${order.customer.city || ""}, ${order.customer.state || ""}${order.customer.pincode ? ` - ${order.customer.pincode}` : ""}</p>
      </div>
      ${paymentBlock}
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px">
        <a class="btn small primary" href="/shop.html">Continue Shopping</a>
        <a class="btn small" href="/index.html">Back to Home</a>
      </div>
    </div>
  `;

  summary.innerHTML = order.items
    .map((item) => {
      const isFree = item.price === 0 || item.isFreeGift;
      const priceText = isFree ? `<span style="color:#27ae60; font-weight:700;">FREE (₹0)</span>` : window.VedVigyanCart.formatINR((item.price || 0) * (item.qty || 0));
      return `
        <div style="display:flex; justify-content:space-between; gap:10px; padding:10px 0; border-bottom:1px solid var(--line)">
          <div>
            <b>${item.name}</b>
            <div class="muted">Qty: ${item.qty}</div>
          </div>
          <div><b>${priceText}</b></div>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = window.VedVigyanCart.formatINR(order.total || order.amount);
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
        color: "#8a1a23"
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

  // Sync radio button borders & update summary total on payment selection change
  form.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      form.querySelectorAll('.lux-payment-methods label').forEach((label) => {
        const checked = label.querySelector('input').checked;
        label.style.borderColor = checked ? "var(--maroon,#8a1a23)" : "var(--line)";
        label.style.borderWidth = checked ? "1.5px" : "1px";
      });
      renderCheckoutSummary();
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const isCod = form.elements["payment"]?.value === "cod";

    try {
      const payload = collectCheckoutPayload(form);
      validateCheckoutPayload(payload);
      saveCustomerProfile(payload.customer);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = isCod ? "Placing Order..." : "Opening Razorpay...";
      }

      let order;
      if (isCod) {
        order = await placeCodOrder(payload);
      } else {
        order = await launchRazorpayCheckout(payload);
      }

      saveOrder(order);
      try {
        sessionStorage.setItem("ved_vigyan_last_order", JSON.stringify(order));
      } catch (e) {
        console.warn("sessionStorage failed:", e);
      }
      window.VedVigyanCart.clearCart();
      window.location.href = `/thank-you.html?orderId=${encodeURIComponent(order.orderId || order.id || "")}`;
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

document.addEventListener("DOMContentLoaded", () => {
  prefillCheckoutForm();
  renderCheckoutSummary();
  wireCheckoutForm();
  window.addEventListener("vedvigyan:cart-updated", renderCheckoutSummary);

  try {
    const cart = window.VedVigyanCart?.loadCart() || {};
    const items = Object.values(cart.items || {});
    const subtotal = window.VedVigyanCart?.cartSubtotal(cart) || 0;
    if (typeof window.fbq === "function" && items.length > 0) {
      window.fbq("track", "InitiateCheckout", {
        content_type: "product",
        contents: items.map((it) => ({ id: it.id, quantity: it.qty, item_price: it.price })),
        value: subtotal,
        currency: "INR",
        num_items: items.length
      });
    }
  } catch (e) {
    console.warn("Meta Pixel InitiateCheckout notice:", e);
  }
});

