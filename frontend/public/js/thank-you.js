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

    // Live Shiprocket Tracking Widget Integration
    const trackingBox = document.createElement("div");
    trackingBox.className = "card";
    trackingBox.style.cssText = "border-radius:16px; padding:20px; margin-top:24px; background:#faf7f2; border:1px solid #e2d3be;";
    trackingBox.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--maroon,#7c1a22)" stroke-width="2"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l3 3v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
          <h3 style="margin:0; font-size:16px; font-weight:700; color:var(--text-dark);">Shipment &amp; Live Tracking</h3>
        </div>
        <span id="shiprocketBadge" style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:999px; background:#e0f2fe; color:#0369a1;">Processing Order</span>
      </div>
      <div id="shiprocketTrackContent" style="font-size:14px; color:var(--text-muted); line-height:1.6;">
        <p style="margin:0">📦 Your order is being packed and registered for express dispatch via Shiprocket.</p>
      </div>
    `;

    const container = document.querySelector(".container");
    if (container) {
      container.appendChild(trackingBox);
    }

    if (orderId) {
      fetch(`/api/shiprocket/track?order_id=${encodeURIComponent(orderId)}`)
        .then(r => r.json())
        .then(data => {
          const badge = document.getElementById("shiprocketBadge");
          const content = document.getElementById("shiprocketTrackContent");
          if (data && data.tracking_data) {
            const track = data.tracking_data;
            if (badge) badge.textContent = track.current_status || "Shipped";
            if (content) {
              content.innerHTML = `
                <p style="margin:0 0 4px"><strong>Courier:</strong> ${track.courier_name || "Express Courier"}</p>
                <p style="margin:0 0 4px"><strong>AWB / Tracking #:</strong> ${track.awb_code || "Generated"}</p>
                <p style="margin:0"><strong>Status:</strong> ${track.current_status || "In Transit"} (${track.destination || "En route"})</p>
                ${track.track_url ? `<a href="${track.track_url}" target="_blank" class="btn small primary" style="margin-top:10px; display:inline-block;">Track on Shiprocket &rarr;</a>` : ""}
              `;
            }
          }
        })
        .catch(() => {
          // Keep default processing state
        });
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
