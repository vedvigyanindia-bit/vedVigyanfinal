(function () {
  "use strict";

  function getOrderData() {
    try {
      // 1. Try sessionStorage (most recent order)
      const sessionData = sessionStorage.getItem("ved_vigyan_last_order");
      if (sessionData) {
        return JSON.parse(sessionData);
      }

      // 2. Try localStorage order history
      const historyData = localStorage.getItem("ved_vigyan_orders_v1");
      if (historyData) {
        const orders = JSON.parse(historyData);
        if (Array.isArray(orders) && orders.length > 0) {
          return orders[0];
        }
      }
    } catch (e) {
      console.warn("Failed to load order data:", e);
    }
    return null;
  }

  function formatCurrency(amount) {
    if (window.VedVigyanCart?.formatINR) {
      return window.VedVigyanCart.formatINR(amount);
    }
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  }

  function renderThankYouPage() {
    const order = getOrderData();

    const orderIdEl = document.getElementById("tyOrderId");
    const customerEl = document.getElementById("tyCustomerDetails");
    const paymentEl = document.getElementById("tyPaymentDetails");
    const itemsEl = document.getElementById("tyItemsList");
    const totalEl = document.getElementById("tyGrandTotal");

    if (!order) {
      if (orderIdEl) orderIdEl.textContent = "#VED-VIGYAN";
      if (customerEl) customerEl.textContent = "No recent order details found.";
      if (paymentEl) paymentEl.textContent = "Please visit your order history or return to shop.";
      return;
    }

    const orderId = order.orderId || order.id || "VV-" + Date.now().toString().slice(-6);
    if (orderIdEl) orderIdEl.textContent = `#${orderId}`;

    // Customer / Shipping Address
    if (customerEl && order.customer) {
      const c = order.customer;
      customerEl.innerHTML = `
        <p style="margin: 0 0 4px;"><strong>Name:</strong> ${c.name || "N/A"}</p>
        <p style="margin: 0 0 4px;"><strong>Phone:</strong> ${c.phone || "N/A"}</p>
        <p style="margin: 0 0 4px;"><strong>Email:</strong> ${c.email || "N/A"}</p>
        <p style="margin: 0 0 4px;"><strong>Address:</strong> ${c.address || ""}, ${c.city || ""}, ${c.state || ""} - ${c.pincode || ""}</p>
      `;
    }

    // Payment Details
    if (paymentEl) {
      const isCod = order.payment === "cod" || (order.paymentStatus && order.paymentStatus.toLowerCase().includes("cash on delivery"));
      if (isCod) {
        paymentEl.innerHTML = `
          <p style="margin: 0 0 4px;"><strong>Method:</strong> Cash on Delivery (COD)</p>
          <p style="margin: 0 0 4px; color: #b8860b;"><strong>Status:</strong> Pending (Pay cash upon delivery)</p>
          <p style="margin: 0; font-size: 12px; color: var(--text-muted);">Please keep exact cash ready at delivery.</p>
        `;
      } else {
        paymentEl.innerHTML = `
          <p style="margin: 0 0 4px;"><strong>Method:</strong> Online Payment (Razorpay)</p>
          <p style="margin: 0 0 4px; color: #2e7d32;"><strong>Status:</strong> Paid / Confirmed</p>
          ${order.razorpayPaymentId ? `<p style="margin: 0; font-size: 12px; color: var(--text-muted);">Payment ID: ${order.razorpayPaymentId}</p>` : ""}
        `;
      }
    }

    // Items List
    if (itemsEl && Array.isArray(order.items)) {
      itemsEl.innerHTML = order.items
        .map((item) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line,#ebd9c0);">
            <div>
              <div style="font-weight: 700; color: var(--text-dark);">${item.name}</div>
              <div style="font-size: 13px; color: var(--text-muted);">Quantity: ${item.qty}</div>
            </div>
            <div style="font-weight: 700; color: var(--maroon,#7c1a22);">${formatCurrency((item.price || 0) * (item.qty || 1))}</div>
          </div>
        `)
        .join("");
    }

    // Total Price
    const grandTotal = order.total || order.amount || 0;
    if (totalEl) {
      totalEl.textContent = formatCurrency(grandTotal);
    }

    // Trigger Conversion Tracking Events (Meta Pixel & Google Analytics)
    try {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", {
          value: Number(grandTotal),
          currency: "INR"
        });
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "purchase", {
          transaction_id: orderId,
          value: Number(grandTotal),
          currency: "INR"
        });
      }
    } catch (err) {
      console.warn("Analytics purchase tracking error:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", renderThankYouPage);
})();
