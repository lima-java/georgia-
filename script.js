// DATOS DE LAS OBRAS
        const artworks = [
            { id: 1, title: "Ola Matinal", artist: "Georgia Suter", price: "18.750€", img: "fotos/1.jpg" },
            { id: 2, title: "Profundidad Marina", artist: "Georgia Suter", price: "22.500€", img: "fotos/2.png" },
            { id: 3, title: "Atardecer Oceánico", artist: "Georgia Suter", price: "19.900€", img: "fotos/3.png" },
            { id: 4, title: "Corriente Azul", artist: "Georgia Suter", price: "24.300€", img: "fotos/4.png" },
            { id: 5, title: "Espuma del Mar", artist: "Georgia Suter", price: "17.800€", img: "fotos/5.png" },
            { id: 6, title: "Reflejo Lunar", artist: "Georgia Suter", price: "21.100€", img: "fotos/6.png" },
            { id: 7, title: "Abismo Marino", artist: "Georgia Suter", price: "18.000€", img: "fotos/7.png" },
            { id: 8, title: "Costa Brava", artist: "Georgia Suter", price: "23.200€", img: "fotos/8.png" }
        ];

        // VARIABLES GLOBALES
        let cart = [];
        let currentSlide = 0;

        // INICIALIZACIÓN AL CARGAR LA PÁGINA
        document.addEventListener('DOMContentLoaded', function() {
            initMobileMenu();
            loadGallery();
            initCarousel();
            updateCart();
            
            // Smooth scroll para enlaces internos
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    if(this.getAttribute('href') === '#') return;
                    
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if(targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });

        // MENÚ MÓVIL
        function initMobileMenu() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navLinks = document.getElementById('navLinks');
            
            if(mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    this.classList.toggle('active');
                });
                
                // Cerrar menú al hacer clic en enlace
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.addEventListener('click', () => {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    });
                });
            }
        }

        // CARGAR GALERÍA
        function loadGallery() {
            const desktopGallery = document.getElementById('desktopGallery');
            const mobileCarousel = document.getElementById('mobileCarousel');
            
            artworks.forEach((artwork, index) => {
                // Versión desktop
                const desktopArtwork = createArtworkElement(artwork, index);
                desktopGallery.appendChild(desktopArtwork);
                
                // Versión móvil (carrusel)
                const mobileArtwork = createArtworkElement(artwork, index);
                mobileArtwork.style.flex = '0 0 85%';
                mobileCarousel.appendChild(mobileArtwork);
            });
            
            // Crear puntos del carrusel
            createCarouselDots();
        }

        function createArtworkElement(artwork, index) {
            const div = document.createElement('div');
            div.className = 'artwork';
            div.dataset.index = index;
            
            div.innerHTML = `
                <img src="${artwork.img}" alt="${artwork.title}" loading="lazy">
                <div class="artwork-info">
                    <h3>${artwork.title}</h3>
                    <p class="artist">${artwork.artist}</p>
                    <p class="price">${artwork.price}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${index})">🛒 Añadir al carrito</button>
                </div>
            `;
            
            // Click en la obra para ver detalles
            div.addEventListener('click', function(e) {
                if(!e.target.classList.contains('add-to-cart-btn')) {
                    showArtworkDetails(artwork);
                }
            });
            
            return div;
        }

        // CARRUSEL MÓVIL
        function initCarousel() {
            const carousel = document.getElementById('mobileCarousel');
            let isDown = false;
            let startX;
            let scrollLeft;
            
            if(!carousel) return;
            
            // Eventos táctiles
            carousel.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });
            
            carousel.addEventListener('touchend', () => {
                isDown = false;
                updateCarouselDots();
            });
            
            carousel.addEventListener('touchmove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.touches[0].pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeft - walk;
            });
            
            // Eventos de ratón
            carousel.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });
            
            carousel.addEventListener('mouseleave', () => {
                isDown = false;
            });
            
            carousel.addEventListener('mouseup', () => {
                isDown = false;
                updateCarouselDots();
            });
            
            carousel.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeft - walk;
            });
        }

        function createCarouselDots() {
            const dotsContainer = document.getElementById('carouselDots');
            
            artworks.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.dataset.index = index;
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            updateCarouselDots();
        }

        function updateCarouselDots() {
            const carousel = document.getElementById('mobileCarousel');
            const dots = document.querySelectorAll('.dot');
            
            if(!carousel || dots.length === 0) return;
            
            const scrollPosition = carousel.scrollLeft;
            const slideWidth = carousel.children[0].offsetWidth + 16; // 16px gap
            currentSlide = Math.round(scrollPosition / slideWidth);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            const carousel = document.getElementById('mobileCarousel');
            const slideWidth = carousel.children[0].offsetWidth + 16;
            
            carousel.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
            
            currentSlide = index;
            updateCarouselDots();
        }

        // DETALLES DE LA OBRA
        function showArtworkDetails(artwork) {
            const modalHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1003;
                    padding: 1rem;
                " onclick="this.remove()">
                    <div style="
                        background: white;
                        padding: 2rem;
                        border-radius: 10px;
                        max-width: 500px;
                        width: 100%;
                        max-height: 90vh;
                        overflow-y: auto;
                        position: relative;
                    " onclick="event.stopPropagation()">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">
                            &times;
                        </button>
                        <img src="${artwork.img}" alt="${artwork.title}" 
                             style="width: 100%; height: auto; border-radius: 5px; margin-bottom: 1rem;">
                        <h2>${artwork.title}</h2>
                        <p><strong>Artista:</strong> ${artwork.artist}</p>
                        <p><strong>Precio:</strong> ${artwork.price}</p>
                        <button onclick="addToCart(${artwork.id - 1}); this.parentElement.parentElement.parentElement.remove()" 
                                style="background: #2ecc71; color: white; border: none; padding: 1rem 2rem; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 1rem;">
                            🛒 Añadir al carrito
                        </button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // CARRITO DE COMPRAS
        function addToCart(index) {
            const artwork = artworks[index];
            cart.push({
                id: artwork.id,
                title: artwork.title,
                price: artwork.price,
                img: artwork.img
            });
            
            updateCart();
            
            // Notificación móvil
            showNotification(`¡${artwork.title} añadida al carrito!`);
        }

        function updateCart() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            // Actualizar contador
            cartCount.textContent = cart.length;
            
            // Actualizar items del carrito
            if(cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #777;">El carrito está vacío</p>';
                cartTotal.style.display = 'none';
                document.getElementById('checkoutBtn').style.display = 'none';
                return;
            }
            
            document.getElementById('checkoutBtn').style.display = 'block';
            cartTotal.style.display = 'block';
            
            let html = '';
            let total = 0;
            
            cart.forEach((item, index) => {
                const priceNum = parseFloat(item.price.replace('€', '').replace('.', '').replace(',', '.'));
                total += priceNum;
                
                html += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.title}">
                        <div style="flex: 1;">
                            <strong>${item.title}</strong><br>
                            <span>${item.price}</span>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${index})">✕</button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = html;
            cartTotal.textContent = `Total: ${total.toLocaleString('es-ES', {minimumFractionDigits: 2})}€`;
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCart();
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        }

        function showOrderForm() {
            document.getElementById('orderFormSection').style.display = 'block';
            document.getElementById('checkoutBtn').style.display = 'none';
        }

        // FORMULARIO DE PEDIDO
        document.getElementById('orderForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if(cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }
            
            // Simular envío del pedido
            const formData = new FormData(this);
            const orderData = {
                items: cart,
                customer: Object.fromEntries(formData),
                total: document.getElementById('cartTotal').textContent,
                date: new Date().toISOString()
            };
            
            console.log('Pedido realizado:', orderData);
            
            // Mostrar confirmación
            alert('¡Pedido confirmado! Te contactaremos pronto para finalizar la compra.');
            
            // Resetear
            cart = [];
            updateCart();
            toggleCart();
            this.reset();
            document.getElementById('orderFormSection').style.display = 'none';
        });

        // NOTIFICACIONES MÓVILES
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 1rem;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 1004;
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
            
            // Añadir keyframes para animación
            if(!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // CERRAR MODALES AL HACER CLIC FUERA
        window.addEventListener('click', function(e) {
            const cartModal = document.getElementById('cartModal');
            if(e.target === cartModal) {
                cartModal.style.display = 'none';
            }
            
            // Cerrar menú móvil al hacer clic fuera
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if(navLinks.classList.contains('active') && 
               !e.target.closest('.nav-links') && 
               !e.target.closest('.mobile-menu-btn')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // OPTIMIZACIÓN PARA IIS
        // Esta función ayuda con la carga diferida de imágenes
        function lazyLoadImages() {
            const images = document.querySelectorAll('img');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        const img = entry.target;
                        if(img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                if(!img.src) {
                    img.dataset.src = img.getAttribute('data-src') || img.src;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==';
                    imageObserver.observe(img);
                }
            });
        }

        // Iniciar carga diferida
        setTimeout(lazyLoadImages, 100);

        /* =============================================
   BANNER DE COOKIES – Georgia Suter Ocean Art
   Añade este bloque a tu script.js
   (o en un archivo cookie-banner.js aparte)
   ============================================= */

(function () {
  'use strict';

  /* ---------- Utilidades de cookie ---------- */

  /**
   * Guarda una cookie.
   * @param {string} name  - Nombre de la cookie
   * @param {string} value - Valor
   * @param {number} days  - Días hasta la caducidad
   */
  function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      '; expires=' + date.toUTCString() +
      '; path=/' +
      '; SameSite=Lax';
      // Añade "; Secure" si tu sitio usa HTTPS (recomendado en producción)
  }

  /**
   * Lee el valor de una cookie por nombre.
   * @param  {string} name
   * @returns {string|null}
   */
  function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  /* ---------- Lógica del banner ---------- */

  var COOKIE_NAME     = 'cookieConsent';
  var COOKIE_DAYS     = 30;
  var HIDDEN_CLASS    = 'cookie-banner--hidden';

  var banner    = document.getElementById('cookieBanner');
  var btnAccept = document.getElementById('cookieBtnAccept');
  var btnReject = document.getElementById('cookieBtnReject');

  // Seguridad: si los elementos no existen en el DOM, salimos sin error
  if (!banner || !btnAccept || !btnReject) return;

  /**
   * Oculta el banner con animación y lo elimina del flujo tras la transición.
   */
  function hideBanner() {
    banner.classList.add(HIDDEN_CLASS);
    // Eliminamos del tab order durante la animación
    banner.setAttribute('aria-hidden', 'true');
    banner.addEventListener('animationend', function () {
      banner.style.display = 'none';
    }, { once: true });
  }

  /* ---- Arranque: mostrar siempre al cargar la página ---- */
  // El banner se muestra automáticamente en cada carga de página.
  // Si ya existe consentimiento previo, se acepta silenciosamente en segundo plano.
  if (getCookie(COOKIE_NAME)) {
    console.info('[Cookies] Consentimiento previo detectado – banner visible igualmente.');
  }
  // El CSS maneja la animación de entrada automáticamente.

  /* ---- Aceptar ---- */
  btnAccept.addEventListener('click', function () {
    setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
    hideBanner();

    // Aquí puedes activar scripts de analítica, etc.
    // Ejemplo: initGoogleAnalytics();
    console.info('[Cookies] Consentimiento aceptado ✓');
  });

  /* ---- Rechazar ---- */
  btnReject.addEventListener('click', function () {
    // No guardamos ninguna cookie; solo ocultamos el banner en esta sesión
    hideBanner();
    console.info('[Cookies] Consentimiento rechazado – sin cookies guardadas.');
  });

  /* ---- Accesibilidad: cerrar con Escape ---- */
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && !banner.hidden) {
      hideBanner();
    }
  });

})();