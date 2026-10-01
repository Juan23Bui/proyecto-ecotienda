const productos = [
    { 
        id: 1, 
        nombre: "Kit de limpieza ecológico", 
        categoria: "hogar", 
        precio: 45900,
        imagen: "https://placehold.co/400x300/1a4d2e/white?text=Kit+Limpieza",
        rating: 4.5,
        reviews: 28
    },
    { 
        id: 2, 
        nombre: "Camiseta de algodón orgánico", 
        categoria: "moda", 
        precio: 68900,
        imagen: "https://placehold.co/400x300/2e7d32/white?text=Camiseta+Eco",
        rating: 4.8,
        reviews: 42
    },
    { 
        id: 3, 
        nombre: "Miel orgánica (500g)", 
        categoria: "alimentos", 
        precio: 32900,
        imagen: "https://placehold.co/400x300/81c784/white?text=Miel+Orgánica",
        rating: 4.7,
        reviews: 35
    },
    { 
        id: 4, 
        nombre: "Set de cubiertos de bambú", 
        categoria: "hogar", 
        precio: 28900,
        imagen: "https://placehold.co/400x300/c8e6c9/1a4d2e?text=Cubiertos+Bambú",
        rating: 4.3,
        reviews: 19
    },
    { 
        id: 5, 
        nombre: "Chaqueta de fibras recicladas", 
        categoria: "moda", 
        precio: 159900,
        imagen: "https://placehold.co/400x300/f1f8e9/1a4d2e?text=Chaqueta+Reciclada",
        rating: 4.6,
        reviews: 31
    },
    { 
        id: 6, 
        nombre: "Quinua orgánica (1kg)", 
        categoria: "alimentos", 
        precio: 18900,
        imagen: "https://placehold.co/400x300/a5d6a7/1a4d2e?text=Quinua",
        rating: 4.9,
        reviews: 56
    },
    { 
        id: 7, 
        nombre: "Shampoo sólido natural", 
        categoria: "cuidado", 
        precio: 24900,
        imagen: "https://placehold.co/400x300/66bb6a/1a4d2e?text=Shampoo+Sólido",
        rating: 4.4,
        reviews: 23
    },
    { 
        id: 8, 
        nombre: "Bolsa de tela reutilizable", 
        categoria: "hogar", 
        precio: 15900,
        imagen: "https://placehold.co/400x300/4caf50/1a4d2e?text=Bolsa+Tela",
        rating: 4.2,
        reviews: 47
    }
];

const testimonios = [
    {
        id: 1,
        nombre: "Ana Rodríguez",
        rol: "Cliente frecuente",
        avatar: "AR",
        texto: "¡EcoTienda cambió mi forma de consumir! Productos de calidad y un compromiso real con el medio ambiente.",
        rating: 5
    },
    {
        id: 2,
        nombre: "Carlos Pérez",
        rol: "Primera compra",
        avatar: "CP",
        texto: "Excelente servicio y productos. Me encanta que los empaques sean completamente reciclables.",
        rating: 5
    },
    {
        id: 3,
        nombre: "María Gómez",
        rol: "Cliente desde 2025",
        avatar: "MG",
        texto: "La mejor tienda online de productos sostenibles. Recomiendo especialmente los alimentos orgánicos.",
        rating: 5
    }
];

let carrito = [];
let categoriaActiva = "todos";
let videoReproduciendo = false;
let videoProgreso = 0;
let videoInterval = null;

const DOM = {
    productsGrid: document.getElementById('productsGrid'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    emptyMessage: document.getElementById('emptyMessage'),
    resetFilters: document.getElementById('resetFilters'),
    
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    
    categoryBtns: document.querySelectorAll('.category-btn'),
    
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    cartModal: document.getElementById('cartModal'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartModalClose: document.getElementById('cartModalClose'),
    cartItems: document.getElementById('cartItems'),
    cartSummary: document.getElementById('cartSummary'),
    cartTotalPrice: document.getElementById('cartTotalPrice'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    userIcon: document.getElementById('userIcon'),
    loginModal: document.getElementById('loginModal'),
    loginOverlay: document.getElementById('loginOverlay'),
    loginModalClose: document.getElementById('loginModalClose'),
    loginForm: document.getElementById('loginForm'),
    showRegister: document.getElementById('showRegister'),
    
    heroBtn: document.getElementById('heroBtn'),
    statNumbers: document.querySelectorAll('.stat-number'),
    
    playVideoBtn: document.getElementById('playVideoBtn'),
    videoStatus: document.getElementById('videoStatus'),
    videoControls: document.getElementById('videoControls'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    progressFill: document.getElementById('progressFill'),
    timeDisplay: document.getElementById('timeDisplay'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    chapterBtns: document.querySelectorAll('.chapter-btn'),
    
    contactForm: document.getElementById('contactForm'),
    contactName: document.getElementById('contactName'),
    contactEmail: document.getElementById('contactEmail'),
    contactPhone: document.getElementById('contactPhone'),
    contactSubject: document.getElementById('contactSubject'),
    contactMessage: document.getElementById('contactMessage'),
    contactConsent: document.getElementById('contactConsent'),
    formStatus: document.getElementById('formStatus'),
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    messageError: document.getElementById('messageError'),
    
    newsletterForm: document.getElementById('newsletterForm'),
    newsletterEmail: document.getElementById('newsletterEmail'),
    newsletterMessage: document.getElementById('newsletterMessage'),
    
    testimonialsGrid: document.getElementById('testimonialsGrid'),
    
    scrollTopBtn: document.getElementById('scrollTopBtn'),
    
    cookieConsent: document.getElementById('cookieConsent'),
    cookieAccept: document.getElementById('cookieAccept'),
    cookieDecline: document.getElementById('cookieDecline'),
    
    toastContainer: document.getElementById('toastContainer')
};

function renderizarProductos() {
    const searchTerm = DOM.searchInput.value.toLowerCase().trim();

    let productosFiltrados = productos;
    
    if (categoriaActiva !== "todos") {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoriaActiva);
    }
    
    if (searchTerm) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );
    }
    
    if (productosFiltrados.length === 0) {
        DOM.productsGrid.innerHTML = '';
        DOM.emptyMessage.hidden = false;
        DOM.productsGrid.hidden = true;
        return;
    }
    
    DOM.emptyMessage.hidden = true;
    DOM.productsGrid.hidden = false;
    
    DOM.productsGrid.innerHTML = productosFiltrados.map(producto => `
        <div class="product-card" role="listitem" data-id="${producto.id}">
            <img 
                src="${producto.imagen}" 
                alt="${producto.nombre}" 
                class="product-img" 
                loading="lazy"
                onerror="this.src='https://placehold.co/400x300/1a4d2e/white?text=Producto'"
            >
            <div class="product-info">
                <div class="product-title">${producto.nombre}</div>
                <div class="product-category">${getCategoriaLabel(producto.categoria)}</div>
                <div class="product-rating">
                    <span class="stars">${renderStars(producto.rating)}</span>
                    <span>(${producto.reviews})</span>
                </div>
                <div class="product-price">$${producto.precio.toLocaleString()}</div>
                <button class="add-to-cart" data-id="${producto.id}">
                    <span aria-hidden="true">🛒</span> Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            agregarAlCarrito(id);
        });
    });
}

function getCategoriaLabel(categoria) {
    const labels = {
        'hogar': '🏠 Hogar',
        'moda': '👕 Moda',
        'alimentos': '🍎 Alimentos',
        'cuidado': '🧴 Cuidado personal'
    };
    return labels[categoria] || categoria;
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    guardarCarrito();
    actualizarBadgeCarrito();
    mostrarToast(`✅ ${producto.nombre} agregado al carrito`, 'success');
}

function guardarCarrito() {
    try {
        localStorage.setItem('ecotienda_carrito', JSON.stringify(carrito));
    } catch (e) {
        console.warn('No se pudo guardar el carrito:', e);
    }
}

function cargarCarrito() {
    try {
        const data = localStorage.getItem('ecotienda_carrito');
        if (data) {
            carrito = JSON.parse(data);
            actualizarBadgeCarrito();
        }
    } catch (e) {
        console.warn('No se pudo cargar el carrito:', e);
    }
}

function actualizarBadgeCarrito() {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = DOM.cartCount;
    badge.textContent = total;
    
    if (total > 0) {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 400);
    }
}

function mostrarCarrito() {
    const container = DOM.cartItems;
    const summary = DOM.cartSummary;
    
    if (carrito.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">🛒 Tu carrito está vacío</p>';
        summary.hidden = true;
        return;
    }
    
    container.innerHTML = carrito.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='https://placehold.co/56x56/1a4d2e/white?text=Producto'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
                <button class="cart-decrease" data-id="${item.id}">−</button>
                <span>${item.cantidad}</span>
                <button class="cart-increase" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}" aria-label="Eliminar producto">✕</button>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.cart-increase').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = carrito.find(i => i.id === id);
            if (item) {
                item.cantidad++;
                guardarCarrito();
                actualizarBadgeCarrito();
                mostrarCarrito();
            }
        });
    });
    
    container.querySelectorAll('.cart-decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = carrito.find(i => i.id === id);
            if (item) {
                if (item.cantidad > 1) {
                    item.cantidad--;
                } else {
                    carrito = carrito.filter(i => i.id !== id);
                }
                guardarCarrito();
                actualizarBadgeCarrito();
                mostrarCarrito();
            }
        });
    });
    
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            carrito = carrito.filter(i => i.id !== id);
            guardarCarrito();
            actualizarBadgeCarrito();
            mostrarCarrito();
        });
    });
    
    summary.hidden = false;
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    DOM.cartTotalPrice.textContent = `$${total.toLocaleString()}`;
}

function mostrarToast(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensaje;
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

function toggleVideo() {
    videoReproduciendo = !videoReproduciendo;
    
    if (videoReproduciendo) {
        iniciarVideo();
    } else {
        pausarVideo();
    }
}

function iniciarVideo() {
    videoReproduciendo = true;
    DOM.videoStatus.textContent = '▶️ Reproduciendo video...';
    DOM.playVideoBtn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    DOM.videoControls.hidden = false;
    
    videoInterval = setInterval(() => {
        videoProgreso += 0.5;
        if (videoProgreso >= 100) {
            videoProgreso = 100;
            clearInterval(videoInterval);
            videoReproduciendo = false;
            DOM.videoStatus.textContent = '✅ Video completado · ¡Gracias por aprender a reciclar!';
            DOM.playVideoBtn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
            DOM.playPauseBtn.textContent = '▶️';
        }
        DOM.progressFill.style.width = videoProgreso + '%';
        actualizarTiempoVideo();
    }, 80);
}

function pausarVideo() {
    videoReproduciendo = false;
    clearInterval(videoInterval);
    DOM.videoStatus.textContent = '⏸️ Video pausado';
    DOM.playVideoBtn.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
    DOM.playPauseBtn.textContent = '▶️';
}

function actualizarTiempoVideo() {
    const totalSegundos = 150;
    const actual = Math.floor((videoProgreso / 100) * totalSegundos);
    const minutos = Math.floor(actual / 60);
    const segundos = actual % 60;
    const totalMin = Math.floor(totalSegundos / 60);
    const totalSeg = totalSegundos % 60;
    DOM.timeDisplay.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')} / ${String(totalMin).padStart(2, '0')}:${String(totalSeg).padStart(2, '0')}`;
}

function saltarCapitulo(chapter) {
    const map = {
        intro: { label: 'Introducción', progress: 5 },
        separacion: { label: 'Separación de residuos', progress: 30 },
        limpieza: { label: 'Limpieza de materiales', progress: 55 },
        deposito: { label: 'Depósito y reciclaje', progress: 80 }
    };
    
    const data = map[chapter];
    if (!data) return;
    
    videoProgreso = data.progress;
    DOM.progressFill.style.width = videoProgreso + '%';
    DOM.videoStatus.textContent = `📌 Capítulo: ${data.label}`;
    actualizarTiempoVideo();
    
    DOM.chapterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.chapter === chapter);
    });
    
    mostrarToast(`⏩ Saltando a: ${data.label}`, 'info');
}

function animarEstadisticas() {
    DOM.statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = 2000;
        const start = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            stat.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                stat.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    });
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarFormularioContacto() {
    let valido = true;
    
    if (!DOM.contactName.value.trim()) {
        DOM.nameError.textContent = '⚠️ El nombre es obligatorio';
        DOM.contactName.classList.add('error');
        valido = false;
    } else {
        DOM.nameError.textContent = '';
        DOM.contactName.classList.remove('error');
    }
    
    if (!DOM.contactEmail.value.trim()) {
        DOM.emailError.textContent = '⚠️ El correo es obligatorio';
        DOM.contactEmail.classList.add('error');
        valido = false;
    } else if (!validarEmail(DOM.contactEmail.value)) {
        DOM.emailError.textContent = '⚠️ Ingresa un correo válido (ejemplo@correo.com)';
        DOM.contactEmail.classList.add('error');
        valido = false;
    } else {
        DOM.emailError.textContent = '';
        DOM.contactEmail.classList.remove('error');
    }
    
    if (!DOM.contactMessage.value.trim()) {
        DOM.messageError.textContent = '⚠️ El mensaje es obligatorio';
        DOM.contactMessage.classList.add('error');
        valido = false;
    } else if (DOM.contactMessage.value.trim().length < 10) {
        DOM.messageError.textContent = '⚠️ El mensaje debe tener al menos 10 caracteres';
        DOM.contactMessage.classList.add('error');
        valido = false;
    } else {
        DOM.messageError.textContent = '';
        DOM.contactMessage.classList.remove('error');
    }
    
    if (!DOM.contactConsent.checked) {
        valido = false;
        mostrarToast('⚠️ Debes aceptar la política de privacidad', 'error');
    }
    
    return valido;
}

function init() {
    cargarCarrito();
    
    renderizarProductos();
    
    renderizarTestimonios();
    
    setTimeout(animarEstadisticas, 500);
    
    verificarCookies();
    
    configurarEventos();
    
    console.log('🌿 EcoTienda inicializada correctamente');
}

function renderizarTestimonios() {
    DOM.testimonialsGrid.innerHTML = testimonios.map(t => `
        <div class="testimonial-card">
            <div class="stars">${renderStars(t.rating)}</div>
            <blockquote>"${t.texto}"</blockquote>
            <div class="author">
                <div class="author-avatar">${t.avatar}</div>
                <div class="author-info">
                    <div class="name">${t.nombre}</div>
                    <div class="role">${t.rol}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function verificarCookies() {
    const cookiesAceptadas = localStorage.getItem('ecotienda_cookies');
    if (!cookiesAceptadas) {
        DOM.cookieConsent.classList.add('active');
    }
}

function configurarEventos() {
    
    DOM.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.categoryBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            categoriaActiva = btn.dataset.categoria;
            renderizarProductos();
        });
    });
    
    DOM.searchBtn.addEventListener('click', renderizarProductos);
    DOM.searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') renderizarProductos();
    });
    DOM.searchInput.addEventListener('input', () => {
        const term = DOM.searchInput.value.trim().toLowerCase();
        if (term.length > 1) {
            const sugerencias = productos
                .filter(p => p.nombre.toLowerCase().includes(term))
                .slice(0, 5);
            if (sugerencias.length > 0) {
                DOM.searchSuggestions.innerHTML = sugerencias.map(p => `
                    <div class="search-suggestion-item" data-id="${p.id}">
                        <span>🔍</span> ${p.nombre}
                    </div>
                `).join('');
                DOM.searchSuggestions.classList.add('active');
                
                DOM.searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(el => {
                    el.addEventListener('click', () => {
                        const id = parseInt(el.dataset.id);
                        const producto = productos.find(p => p.id === id);
                        if (producto) {
                            DOM.searchInput.value = producto.nombre;
                            DOM.searchSuggestions.classList.remove('active');
                            renderizarProductos();
                        }
                    });
                });
            } else {
                DOM.searchSuggestions.classList.remove('active');
            }
        } else {
            DOM.searchSuggestions.classList.remove('active');
        }
    });
    document.addEventListener('click', (e) => {
        if (!DOM.searchInput.contains(e.target) && !DOM.searchSuggestions.contains(e.target)) {
            DOM.searchSuggestions.classList.remove('active');
        }
    });
    
    if (DOM.resetFilters) {
        DOM.resetFilters.addEventListener('click', () => {
            DOM.searchInput.value = '';
            categoriaActiva = 'todos';
            DOM.categoryBtns.forEach(b => {
                b.classList.toggle('active', b.dataset.categoria === 'todos');
                b.setAttribute('aria-selected', b.dataset.categoria === 'todos');
            });
            renderizarProductos();
            DOM.emptyMessage.hidden = true;
        });
    }
    
    DOM.heroBtn.addEventListener('click', () => {
        document.querySelector('.section-title')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    if (DOM.playPauseBtn) {
        DOM.playPauseBtn.addEventListener('click', toggleVideo);
    }
    
    DOM.chapterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            saltarCapitulo(btn.dataset.chapter);
        });
    });
    
    if (DOM.fullscreenBtn) {
        DOM.fullscreenBtn.addEventListener('click', () => {
            const player = document.querySelector('.video-player');
            if (player) {
                if (player.requestFullscreen) {
                    player.requestFullscreen();
                } else if (player.webkitRequestFullscreen) {
                    player.webkitRequestFullscreen();
                }
            }
        });
    }
    
    DOM.cartIcon.addEventListener('click', () => {
        DOM.cartModal.hidden = false;
        document.body.style.overflow = 'hidden';
        mostrarCarrito();
    });
    
    DOM.cartModalClose.addEventListener('click', cerrarCarrito);
    DOM.cartOverlay.addEventListener('click', cerrarCarrito);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !DOM.cartModal.hidden) {
            cerrarCarrito();
        }
    });
    
    function cerrarCarrito() {
        DOM.cartModal.hidden = true;
        document.body.style.overflow = '';
    }
    
    if (DOM.checkoutBtn) {
        DOM.checkoutBtn.addEventListener('click', () => {
            if (carrito.length > 0) {
                mostrarToast('🛒 ¡Gracias por tu compra! (Simulación)', 'success');
                carrito = [];
                guardarCarrito();
                actualizarBadgeCarrito();
                mostrarCarrito();
                cerrarCarrito();
            }
        });
    }
    
    DOM.userIcon.addEventListener('click', () => {
        DOM.loginModal.hidden = false;
        document.body.style.overflow = 'hidden';
    });
    
    DOM.loginModalClose.addEventListener('click', cerrarLogin);
    DOM.loginOverlay.addEventListener('click', cerrarLogin);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !DOM.loginModal.hidden) {
            cerrarLogin();
        }
    });
    
    function cerrarLogin() {
        DOM.loginModal.hidden = true;
        document.body.style.overflow = '';
    }
    
    DOM.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            mostrarToast('👤 Sesión iniciada correctamente (simulación)', 'success');
            cerrarLogin();
            DOM.loginForm.reset();
        } else {
            mostrarToast('⚠️ Completa todos los campos', 'error');
        }
    });
    
    if (DOM.showRegister) {
        DOM.showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarToast('📝 Funcionalidad de registro (en desarrollo)', 'info');
        });
    }
    
    DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validarFormularioContacto()) {
            const nombre = DOM.contactName.value;
            DOM.formStatus.textContent = `📨 ¡Gracias ${nombre}! Tu mensaje ha sido enviado.`;
            DOM.formStatus.className = 'form-status success';
            DOM.contactForm.reset();
            mostrarToast(`📨 ¡Mensaje enviado!`, 'success');
            
            setTimeout(() => {
                DOM.formStatus.textContent = '';
                DOM.formStatus.className = 'form-status';
            }, 5000);
        } else {
            DOM.formStatus.textContent = '⚠️ Por favor, corrige los errores marcados.';
            DOM.formStatus.className = 'form-status error';
        }
    });
    
    DOM.contactName.addEventListener('input', () => {
        if (DOM.contactName.value.trim()) {
            DOM.contactName.classList.remove('error');
            DOM.nameError.textContent = '';
        }
    });
    DOM.contactEmail.addEventListener('input', () => {
        if (DOM.contactEmail.value.trim() && validarEmail(DOM.contactEmail.value)) {
            DOM.contactEmail.classList.remove('error');
            DOM.emailError.textContent = '';
        }
    });
    DOM.contactMessage.addEventListener('input', () => {
        if (DOM.contactMessage.value.trim() && DOM.contactMessage.value.trim().length >= 10) {
            DOM.contactMessage.classList.remove('error');
            DOM.messageError.textContent = '';
        }
    });
    
    DOM.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterEmail.value.trim();
        
        if (!email) {
            DOM.newsletterMessage.textContent = '⚠️ Ingresa un correo electrónico';
            DOM.newsletterMessage.style.color = '#ef4444';
            return;
        }
        
        if (!validarEmail(email)) {
            DOM.newsletterMessage.textContent = '⚠️ Ingresa un correo válido';
            DOM.newsletterMessage.style.color = '#ef4444';
            return;
        }
        
        DOM.newsletterMessage.textContent = '✅ ¡Suscripción exitosa! Revisa tu correo.';
        DOM.newsletterMessage.style.color = '#22c55e';
        DOM.newsletterForm.reset();
        
        setTimeout(() => {
            DOM.newsletterMessage.textContent = '';
        }, 5000);
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            DOM.scrollTopBtn.hidden = false;
        } else {
            DOM.scrollTopBtn.hidden = true;
        }
    });
    
    DOM.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    DOM.cookieAccept.addEventListener('click', () => {
        localStorage.setItem('ecotienda_cookies', 'accepted');
        DOM.cookieConsent.classList.remove('active');
        mostrarToast('🍪 Cookies aceptadas', 'success');
    });
    
    DOM.cookieDecline.addEventListener('click', () => {
        localStorage.setItem('ecotienda_cookies', 'declined');
        DOM.cookieConsent.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', init);