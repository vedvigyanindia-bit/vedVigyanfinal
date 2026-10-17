// Reusable Dynamic Premium Product Carousel Gallery for Ved Vigyan
const GALLERY_STYLES = `
/* Strict 1:1 Square Structure */
.product-carousel {
  position: relative;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}
.carousel-track-wrapper {
  position: relative !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  aspect-ratio: 1 / 1 !important;
  height: auto !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
  border-radius: 14px;
}
.carousel-track {
  display: flex !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
  will-change: transform !important;
}
.carousel-slide {
  flex: 0 0 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  width: 100% !important;
  height: 100% !important;
  aspect-ratio: 1 / 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
  position: relative !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}
.carousel-slide img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  transition: transform 0.15s ease-out;
  cursor: zoom-in;
  display: block !important;
  box-sizing: border-box !important;
}
.carousel-slide img.certificate-image,
.carousel-slide.is-certificate-slide img,
.carousel-slide img[src*="cert"],
.carousel-slide img[src*="report"],
.carousel-slide img[src*="lab-certificate"] {
  object-fit: contain !important;
  background: #ffffff !important;
  padding: 8px !important;
  box-sizing: border-box !important;
}
.carousel-slide.is-certificate-slide {
  background: #ffffff !important;
}

/* Thumbnail Navigation */
.carousel-thumbnails {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 10px !important;
  margin-top: 14px !important;
  padding: 8px 10px !important;
  background: #ffffff !important;
  border-radius: 10px !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  -webkit-overflow-scrolling: touch !important;
  scrollbar-width: none !important;
  box-sizing: border-box !important;
}
.carousel-thumbnails::-webkit-scrollbar {
  display: none !important;
}
.carousel-thumbnail {
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  border: 1.5px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  box-sizing: border-box;
}
.carousel-thumbnail:hover {
  transform: translateY(-2px);
  border-color: #8a1a23;
}
.carousel-thumbnail.active {
  border-color: #8a1a23;
  box-shadow: 0 0 12px rgba(138, 26, 35, 0.35);
  transform: scale(1.05);
}
.carousel-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.carousel-thumbnail.active img, .carousel-thumbnail:hover img {
  opacity: 1;
}

/* Lightbox Overlay */
.pdp-lightbox {
  position: fixed;
  z-index: 100000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: rgba(6, 12, 9, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: env(safe-area-inset-top, 16px) env(safe-area-inset-right, 16px) env(safe-area-inset-bottom, 16px) env(safe-area-inset-left, 16px);
  box-sizing: border-box;
}
.pdp-lightbox.active {
  opacity: 1;
  pointer-events: auto;
}
.lightbox-close {
  position: absolute;
  top: max(16px, env(safe-area-inset-top, 16px));
  right: max(16px, env(safe-area-inset-right, 16px));
  color: #fff;
  font-size: 32px;
  font-family: inherit;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s, color 0.2s;
  z-index: 100002;
}
.lightbox-close:hover {
  background: rgba(212, 175, 55, 0.3);
  color: #d4af37;
  transform: rotate(90deg);
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 42px;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  user-select: none;
  z-index: 100001;
}
.lightbox-nav:hover {
  background: rgba(212, 175, 55, 0.25);
  color: #d4af37;
  transform: translateY(-50%) scale(1.1);
}
.lightbox-nav.prev { left: 24px; }
.lightbox-nav.next { right: 24px; }
.lightbox-content {
  width: 88%;
  height: 74%;
  max-width: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  touch-action: pan-y pinch-zoom;
}
.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: zoom-in;
  user-select: none;
  -webkit-user-drag: none;
}
.lightbox-content img.visible {
  opacity: 1;
  transform: scale(1);
}
.lightbox-content img.is-zoomed {
  transform: scale(1.9) !important;
  cursor: zoom-out !important;
}
.lightbox-caption {
  margin-top: 16px;
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  padding: 0 16px;
}
.lightbox-counter {
  margin-top: 6px;
  color: #a0aec0;
  font-size: 12px;
  font-family: inherit;
}
.lightbox-zoom-hint {
  margin-top: 4px;
  color: rgba(212, 175, 55, 0.85);
  font-size: 11px;
  letter-spacing: 0.5px;
}
@media (max-width: 768px) {
  .lightbox-content {
    width: 96%;
    height: 65%;
    max-height: 65dvh;
  }
  .lightbox-nav {
    width: 44px;
    height: 44px;
    font-size: 28px;
    top: auto;
    bottom: max(16px, env(safe-area-inset-bottom, 16px));
    transform: none;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
  .lightbox-nav:hover,
  .lightbox-nav:active {
    background: rgba(212, 175, 55, 0.4);
    transform: scale(1.05);
  }
  .lightbox-nav.prev {
    left: 24px;
  }
  .lightbox-nav.next {
    right: 24px;
  }
  .lightbox-caption {
    font-size: 13px;
    margin-top: 12px;
  }
  .lightbox-counter {
    font-size: 11px;
    margin-bottom: 60px;
  }
}
`;

// Inject Premium Gallery styles
if (typeof document !== "undefined" && !document.getElementById("vv-gallery-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "vv-gallery-styles";
  styleEl.textContent = GALLERY_STYLES;
  document.head.appendChild(styleEl);
}

function getOrCreateLightbox() {
  let lightbox = document.getElementById("pdpLightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "pdpLightbox";
    lightbox.className = "pdp-lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-nav prev" type="button" aria-label="Previous image">&#8249;</button>
      <div class="lightbox-content">
        <img id="lightboxImg" src="" alt="Enlarged product view" />
      </div>
      <button class="lightbox-nav next" type="button" aria-label="Next image">&#8250;</button>
      <div class="lightbox-caption"></div>
      <div class="lightbox-counter"></div>
      <div class="lightbox-zoom-hint">🔍 Tap image to zoom / Swipe to navigate</div>
    `;
    document.body.appendChild(lightbox);
  }
  return lightbox;
}

window.VedVigyanCarousel = {
  isCertificateImage(url, product) {
    if (!url) return false;
    const u = String(url).toLowerCase();
    if (product && product.certificate && String(product.certificate).toLowerCase() === u) return true;
    if (product && (product.slug === "7-mukhi-rudraksh" || product.id === "vv_p13")) {
      return /cert|lab-certificate|report|authenticity/.test(u);
    }
    return /cert|lab-certificate|report|authenticity|asli-brand-comparison|\/3\.webp|tulsi jap mala/.test(u);
  },

  isGeneratedPlaceholderImage(url) {
    if (!url) return false;
    const u = String(url).toLowerCase();
    return /\/generated\/(styled_|model_)/.test(u);
  },

  normalizeProductImages(product) {
    let list = [];
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      list = [...product.images.filter(Boolean)];
    } else if (product && product.image) {
      list = [product.image];
    }

    const unique = [...new Set(list)];
    if (unique.length === 0) {
      return ["/product/Ved vigyan products/5 Mukhi Rudraksh/1.webp"];
    }
    return unique;
  },

  renderCarouselHtml(product) {
    const images = this.normalizeProductImages(product);
    const total = images.length;
    const hasMultiple = total > 1;

    const slideLabels = images.map((imgUrl, idx) => {
      const isCert = this.isCertificateImage(imgUrl, product) || (idx === 2 && images.length === 3 && !/1\.webp|2\.webp/.test(imgUrl));
      if (isCert) {
        return `${idx + 1}/${total} Lab Certificate`;
      }
      return `${idx + 1}/${total} Product View`;
    });

    const slideAltLabels = images.map((imgUrl, idx) => {
      const isCert = this.isCertificateImage(imgUrl, product) || (idx === 2 && images.length === 3 && !/1\.webp|2\.webp/.test(imgUrl));
      if (isCert) {
        return `Lab Certificate`;
      }
      if (idx === 0) {
        return `Main Product Image`;
      }
      return `Product Detail View ${idx + 1}`;
    });

    const slidesHtml = images.map((imgUrl, idx) => {
      // First slide loads eagerly for LCP, others are lazy loaded
      const isLcp = idx === 0;
      const isCert = this.isCertificateImage(imgUrl, product) || (idx === 2 && images.length === 3 && !/1\.webp|2\.webp/.test(imgUrl));
      return `
        <div class="carousel-slide ${isCert ? 'is-certificate-slide' : ''}" data-slide-index="${idx}">
          <img src="${imgUrl}" class="${isCert ? 'certificate-image' : ''}" alt="${product?.name || 'Product'} - ${slideAltLabels[idx]}" width="400" height="400" ${isLcp ? 'fetchpriority="high"' : 'loading="lazy"'} />
        </div>
      `;
    }).join("");

    const thumbnailsHtml = hasMultiple ? images.map((imgUrl, idx) => `
      <button class="carousel-thumbnail ${idx === 0 ? 'active' : ''}" type="button" data-thumb-index="${idx}" aria-label="Go to slide ${idx + 1}" title="${slideAltLabels[idx]}">
        <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" width="54" height="54" loading="lazy" />
      </button>
    `).join("") : "";

    return `
      <div class="product-carousel" data-carousel-id="${product?.id || 'prod'}" data-total-slides="${total}" data-product-name="${encodeURIComponent(product?.name || 'Product')}" tabindex="0" aria-label="${product?.name || 'Product'} ${total}-image gallery">
        <div class="carousel-track-wrapper">
          <div class="carousel-track" style="transform: translateX(0%);">
            ${slidesHtml}
          </div>
          ${hasMultiple ? `
            <button class="carousel-nav prev" type="button" aria-label="Previous image">‹</button>
            <button class="carousel-nav next" type="button" aria-label="Next image">›</button>
          ` : ''}
        </div>
        ${hasMultiple ? `
          <div class="carousel-thumbnails">
            ${thumbnailsHtml}
          </div>
        ` : ''}
      </div>
    `;
  },

  bindCarouselEvents(container) {
    const carousels = container.querySelectorAll('.product-carousel');
    carousels.forEach((carousel) => {
      if (carousel.__vv_bound) return;
      carousel.__vv_bound = true;

      const track = carousel.querySelector('.carousel-track');
      const badge = carousel.querySelector('.carousel-badge');
      const prevBtn = carousel.querySelector('.carousel-nav.prev');
      const nextBtn = carousel.querySelector('.carousel-nav.next');
      const thumbnails = carousel.querySelectorAll('.carousel-thumbnail');
      
      const totalSlides = Number(carousel.getAttribute('data-total-slides') || thumbnails.length || 4);
      const productName = decodeURIComponent(carousel.getAttribute('data-product-name') || 'Product');
      let currentIndex = 0;

      const getSlideLabel = (idx) => {
        const slide = carousel.querySelector(`.carousel-slide[data-slide-index="${idx}"] img`);
        const src = slide ? slide.getAttribute('src') : '';
        if (window.VedVigyanCarousel.isCertificateImage(src) || (idx === totalSlides - 1 && totalSlides > 1)) {
          return `${idx + 1}/${totalSlides} Lab Certificate`;
        }
        return `${idx + 1}/${totalSlides} Product View`;
      };

      const updateSlide = (index) => {
        currentIndex = (index + totalSlides) % totalSlides;
        if (track) track.style.transform = `translateX(-${currentIndex * 100}%)`;
        if (badge) badge.textContent = getSlideLabel(currentIndex);

        const thumbStrip = carousel.querySelector('.carousel-thumbnails');
        thumbnails.forEach((thumb, idx) => {
          const isActive = idx === currentIndex;
          thumb.classList.toggle('active', isActive);
          if (isActive && thumbStrip) {
            const targetLeft = thumb.offsetLeft - (thumbStrip.clientWidth / 2) + (thumb.offsetWidth / 2);
            thumbStrip.scrollTo({ left: targetLeft, behavior: 'smooth' });
          }
        });
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          updateSlide(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          updateSlide(currentIndex + 1);
        });
      }

      thumbnails.forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetIdx = Number(thumb.getAttribute('data-thumb-index') || 0);
          updateSlide(targetIdx);
        });
      });

      // Touch swipe support with swipe-vs-tap detection to avoid accidental opening
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;
      let isSwiping = false;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false;
      }, { passive: true });

      carousel.addEventListener('touchmove', (e) => {
        const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
        const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
        if (diffX > 10 || diffY > 10) {
          isSwiping = true;
        }
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        if (Math.abs(diffX) > 30 && Math.abs(diffX) > diffY) {
          isSwiping = true;
          if (diffX > 0) {
            updateSlide(currentIndex + 1);
          } else {
            updateSlide(currentIndex - 1);
          }
        }
        setTimeout(() => {
          isSwiping = false;
        }, 280);
      }, { passive: true });

      // Image click: opens product page if inside catalog card, or opens lightbox on PDP detail page
      const slideImgs = carousel.querySelectorAll('.carousel-slide img');
      slideImgs.forEach((img, idx) => {
        img.addEventListener('click', (e) => {
          if (isSwiping) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          const card = img.closest('.lux-product-card, .card, [data-product-id]');
          if (card) {
            const productId = card.getAttribute('data-product-id') || card.dataset.productId;
            const product = window.VED_VIGYAN_DATA?.products?.find((p) => p.id === productId);
            const targetUrl = product?.url || (productId ? `/product/detail.html?id=${productId}` : null);
            if (targetUrl) {
              window.location.href = targetUrl;
            }
          } else {
            // We are on PDP: open lightbox so certificate or product image is viewed in high-res
            openLightbox(idx);
          }
        });
      });

      // Keyboard navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateSlide(currentIndex + 1);
        }
      });

      // Lightbox Overlay Implementation
      const openLightbox = (index) => {
        const lightbox = getOrCreateLightbox();
        const lightboxImg = lightbox.querySelector('#lightboxImg');
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
        const nextBtn = lightbox.querySelector('.lightbox-nav.next');
        
        let lightboxIndex = index;
        const images = Array.from(carousel.querySelectorAll('.carousel-slide img')).map(img => img.getAttribute('src'));
        
        const updateLightboxImage = (idx) => {
          lightboxIndex = (idx + images.length) % images.length;
          const src = images[lightboxIndex];
          
          lightboxImg.classList.remove('visible');
          lightboxImg.classList.remove('is-zoomed');
          
          setTimeout(() => {
            lightboxImg.src = src;
            lightboxImg.classList.add('visible');
            
            const isCert = window.VedVigyanCarousel.isCertificateImage(src);
            caption.textContent = isCert ? "Lab Authenticity Verification Certificate" : productName;
            counter.textContent = `${lightboxIndex + 1} / ${images.length}`;
          }, 100);
        };
        
        if (prevBtn) prevBtn.style.display = images.length > 1 ? '' : 'none';
        if (nextBtn) nextBtn.style.display = images.length > 1 ? '' : 'none';
        if (counter) counter.style.display = images.length > 1 ? '' : 'none';

        updateLightboxImage(lightboxIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        // Setup lightbox controls event listeners
        const handlePrev = (e) => { e.stopPropagation(); updateLightboxImage(lightboxIndex - 1); };
        const handleNext = (e) => { e.stopPropagation(); updateLightboxImage(lightboxIndex + 1); };
        const handleClose = () => {
          lightboxImg.classList.remove('is-zoomed');
          lightbox.classList.remove('active');
          document.body.style.overflow = ''; // Unlock scrolling
          cleanup();
        };
        
        const handleImageClick = (e) => {
          e.stopPropagation();
          lightboxImg.classList.toggle('is-zoomed');
        };

        prevBtn.addEventListener('click', handlePrev);
        nextBtn.addEventListener('click', handleNext);
        closeBtn.addEventListener('click', handleClose);
        lightbox.addEventListener('click', handleClose);
        lightboxImg.addEventListener('click', handleImageClick);
        
        // Keyboard controls
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') handleClose();
          else if (e.key === 'ArrowLeft') handlePrev(e);
          else if (e.key === 'ArrowRight') handleNext(e);
        };
        window.addEventListener('keydown', handleKeyDown);
        
        // Touch swipe controls for lightbox
        let lTouchStartX = 0;
        let lTouchEndX = 0;
        const handleTouchStart = (e) => { lTouchStartX = e.changedTouches[0].screenX; };
        const handleTouchEnd = (e) => {
          lTouchEndX = e.changedTouches[0].screenX;
          const diff = lTouchStartX - lTouchEndX;
          if (Math.abs(diff) > 40 && !lightboxImg.classList.contains('is-zoomed')) {
            if (diff > 0) updateLightboxImage(lightboxIndex + 1); // Swipe left -> next
            else updateLightboxImage(lightboxIndex - 1); // Swipe right -> prev
          }
        };
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        const cleanup = () => {
          prevBtn.removeEventListener('click', handlePrev);
          nextBtn.removeEventListener('click', handleNext);
          closeBtn.removeEventListener('click', handleClose);
          lightbox.removeEventListener('click', handleClose);
          lightboxImg.removeEventListener('click', handleImageClick);
          window.removeEventListener('keydown', handleKeyDown);
          lightbox.removeEventListener('touchstart', handleTouchStart);
          lightbox.removeEventListener('touchend', handleTouchEnd);
        };
      };

    });
  }
};
