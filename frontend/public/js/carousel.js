// Reusable Dynamic Premium Product Carousel Gallery for Ved Vigyan
const GALLERY_STYLES = `
/* Hover Zoom */
.carousel-slide {
  overflow: hidden;
  position: relative;
}
.carousel-slide img {
  transition: transform 0.15s ease-out;
  cursor: zoom-in;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Thumbnail Navigation */
.carousel-thumbnails {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  padding: 8px 12px;
  background: #ffffff;
  border-radius: 10px;
}
.carousel-thumbnail {
  width: 56px;
  height: 56px;
  border: 1.5px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  overflow: hidden;
  padding: 2px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
  background-color: rgba(6, 12, 9, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(10px);
}
.pdp-lightbox.active {
  opacity: 1;
  pointer-events: auto;
}
.lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  color: #fff;
  font-size: 36px;
  font-family: inherit;
  font-weight: 300;
  background: none;
  border: none;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, color 0.2s;
}
.lightbox-close:hover {
  color: #d4af37;
  transform: rotate(90deg);
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-size: 48px;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  user-select: none;
}
.lightbox-nav:hover {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  transform: translateY(-50%) scale(1.1);
}
.lightbox-nav.prev { left: 24px; }
.lightbox-nav.next { right: 24px; }
.lightbox-content {
  width: 85%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.lightbox-content img.visible {
  opacity: 1;
  transform: scale(1);
}
.lightbox-caption {
  margin-top: 20px;
  color: #ffffff;
  font-size: 16px;
  font-family: inherit;
  font-weight: 500;
  letter-spacing: 1px;
}
.lightbox-counter {
  margin-top: 8px;
  color: #a0aec0;
  font-size: 13px;
  font-family: inherit;
}
@media (max-width: 768px) {
  .lightbox-nav {
    width: 48px;
    height: 48px;
    font-size: 32px;
  }
  .lightbox-nav.prev { left: 8px; }
  .lightbox-nav.next { right: 8px; }
  .lightbox-content {
    width: 95%;
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
    `;
    document.body.appendChild(lightbox);
  }
  return lightbox;
}

window.VedVigyanCarousel = {
  isCertificateImage(url) {
    if (!url) return false;
    const u = String(url).toLowerCase();
    return /cert|lab|report|authent|quality|verify|siddhi|test|3\.webp|3\.jpg|3\.png|3\.jpeg|4\.webp|4\.jpg|4\.png|4\.jpeg/.test(u);
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

    const defaultCert = "/product/Ved vigyan products/5 Mukhi Rudraksh/3.webp";
    const certIndex = list.findIndex((img) => this.isCertificateImage(img) && (product?.id === "vv_p09" || !img.includes(defaultCert)));

    if (certIndex !== -1) {
      const foundCert = list[certIndex];
      const productPhotos = list.filter((img) => !this.isCertificateImage(img)).slice(0, 3);
      list = [...productPhotos, foundCert];
    } else {
      list = list.filter((img) => product?.id === "vv_p09" || !img.includes(defaultCert)).slice(0, 4);
    }

    return [...new Set(list)];
  },

  renderCarouselHtml(product) {
    const images = this.normalizeProductImages(product);
    const total = images.length;

    const slideLabels = images.map((imgUrl, idx) => {
      const isCert = this.isCertificateImage(imgUrl);
      if (isCert) {
        return `${idx + 1}/${total} Lab Certificate`;
      }
      return `${idx + 1}/${total} Product View`;
    });

    const slideAltLabels = images.map((imgUrl, idx) => {
      const isCert = this.isCertificateImage(imgUrl);
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
      const isCert = this.isCertificateImage(imgUrl);
      return `
        <div class="carousel-slide" data-slide-index="${idx}">
          <img src="${imgUrl}" class="${isCert ? 'certificate-image' : ''}" alt="${product.name} - ${slideAltLabels[idx]}" width="400" height="400" ${isLcp ? 'fetchpriority="high"' : 'loading="lazy"'} />
        </div>
      `;
    }).join("");

    const thumbnailsHtml = images.map((imgUrl, idx) => `
      <button class="carousel-thumbnail ${idx === 0 ? 'active' : ''}" type="button" data-thumb-index="${idx}" aria-label="Go to slide ${idx + 1}" title="${slideAltLabels[idx]}">
        <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" width="54" height="54" loading="lazy" />
      </button>
    `).join("");

    return `
      <div class="product-carousel" data-carousel-id="${product.id}" data-total-slides="${total}" data-product-name="${encodeURIComponent(product.name)}" tabindex="0" aria-label="${product.name} ${total}-image gallery">
        <div class="carousel-track-wrapper">
          <div class="carousel-track" style="transform: translateX(0%);">
            ${slidesHtml}
          </div>
          <button class="carousel-nav prev" type="button" aria-label="Previous image">‹</button>
          <button class="carousel-nav next" type="button" aria-label="Next image">›</button>
          <div class="carousel-badge">${slideLabels[0] || ""}</div>
        </div>
        <div class="carousel-thumbnails">
          ${thumbnailsHtml}
        </div>
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

        thumbnails.forEach((thumb, idx) => {
          thumb.classList.toggle('active', idx === currentIndex);
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

      // Image click opens detail page directly without hover zoom or lightbox overlay
      const slideImgs = carousel.querySelectorAll('.carousel-slide img');
      slideImgs.forEach((img) => {
        img.addEventListener('click', (e) => {
          const card = img.closest('.lux-product-card, .card, [data-product-id]');
          if (card) {
            const productId = card.getAttribute('data-product-id') || card.dataset.productId;
            const product = window.VED_VIGYAN_DATA?.products?.find((p) => p.id === productId);
            const targetUrl = product?.url || (productId ? `/product/detail.html?id=${productId}` : null);
            if (targetUrl) {
              window.location.href = targetUrl;
            }
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

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 30) {
          if (diff > 0) {
            updateSlide(currentIndex + 1);
          } else {
            updateSlide(currentIndex - 1);
          }
        }
      }, { passive: true });

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
          
          setTimeout(() => {
            lightboxImg.src = src;
            lightboxImg.classList.add('visible');
            
            const isCert = window.VedVigyanCarousel.isCertificateImage(src);
            caption.textContent = isCert ? "Lab Authenticity Verification Certificate" : productName;
            counter.textContent = `${lightboxIndex + 1} / ${images.length}`;
          }, 100);
        };
        
        updateLightboxImage(lightboxIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        // Setup lightbox controls event listeners
        const handlePrev = (e) => { e.stopPropagation(); updateLightboxImage(lightboxIndex - 1); };
        const handleNext = (e) => { e.stopPropagation(); updateLightboxImage(lightboxIndex + 1); };
        const handleClose = () => {
          lightbox.classList.remove('active');
          document.body.style.overflow = ''; // Unlock scrolling
          cleanup();
        };
        
        prevBtn.addEventListener('click', handlePrev);
        nextBtn.addEventListener('click', handleNext);
        closeBtn.addEventListener('click', handleClose);
        lightbox.addEventListener('click', handleClose);
        lightboxImg.addEventListener('click', (e) => e.stopPropagation()); // Prevent clicking image from closing it
        
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
          if (Math.abs(diff) > 40) {
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
          window.removeEventListener('keydown', handleKeyDown);
          lightbox.removeEventListener('touchstart', handleTouchStart);
          lightbox.removeEventListener('touchend', handleTouchEnd);
        };
      };

    });
  }
};
