document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Hero 3D Mouse Tracking ---
    const shoe = document.getElementById('hero-shoe');
    document.addEventListener('mousemove', (e) => {
        if(window.scrollY < window.innerHeight) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            shoe.style.transform = `translateY(${yAxis}px) translateX(${xAxis}px) rotateZ(${xAxis * 0.5}deg)`;
        }
    });
    document.addEventListener('mouseleave', () => {
        shoe.style.transform = `translateY(0px) translateX(0px) rotateZ(0deg)`;
        shoe.style.transition = 'transform 0.5s ease';
    });
    document.addEventListener('mouseenter', () => shoe.style.transition = 'none');

     // --- 2. Product Data Database ---
    const products = [
        { id: 1, name: "A-1 Core", category: "men casual", price: "$299", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80", desc: "The foundational antigravity sneaker for men. Everyday wear redefined." },
        { id: 2, name: "A-1 Nova", category: "women casual", price: "$299", img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d1a6?w=600&auto=format&fit=crop&q=80", desc: "Sleek, lightweight, and engineered specifically for women's daily comfort." },
        { id: 3, name: "Velocity Strike", category: "men sports", price: "$349", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80", desc: "Maximum kinetic return. Designed for high-impact sports and running." },
        { id: 4, name: "Aero Glide", category: "women sports", price: "$349", img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80", desc: "Ultra-responsive cushioning tailored for female athletes." },
        { id: 5, name: "Mini-G Sparks", category: "kids casual", price: "$150", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80", desc: "Durable, floating steps for the next generation. Features light-up quantum soles." },
        { id: 6, name: "Street Stealth", category: "men casual", price: "$320", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80", desc: "Matte black finish, urban utility. Perfect for city environments." }
    ];

    const grid = document.getElementById('product-grid');
    
    // --- 3. Render Products to Screen ---
    function renderProducts(filter = "all") {
        grid.innerHTML = "";
        const filteredProducts = filter === "all" ? products : products.filter(p => p.category.includes(filter));

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p style="color: var(--accent); margin-top: 10px;">${product.price}</p>
            `;
            card.addEventListener('click', () => openModal(product));
            grid.appendChild(card);
        });
        attachCursorHoverEvents(); // Reattach hover animations to new cards
    }
    renderProducts();

    // --- 4. Category Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.getAttribute('data-filter'));
        });
    });

    // --- 5. Modal & Cart Logic (State Management) ---
    const productModal = document.getElementById('product-modal');
    const closeProductBtn = productModal.querySelector('.close-btn');
    
    // Grab the exact button IDs we just added to HTML
    const addToCartBtn = document.getElementById('add-to-cart-btn'); 
    const cartCountElement = document.getElementById('cart-count');
    const exploreBtn = document.getElementById('explore-a1-btn'); 
    const floatingCartBtn = document.getElementById('floating-cart-btn');
    
    let cart = [];
    let currentSelectedProduct = null;
    
    function openModal(product) {
        currentSelectedProduct = product;
        document.getElementById('modal-img').src = product.img;
        document.getElementById('modal-title').innerText = product.name;
        document.getElementById('modal-price').innerText = product.price;
        document.getElementById('modal-desc').innerText = product.desc;
        productModal.style.display = 'flex';
    }

    // 1. Explore Button Logic (Scroll + Auto Open)
    if(exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            // Smooth scroll to the collection
            document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
            // Wait 800ms for the scroll to finish, then pop the A-1 Core modal
            setTimeout(() => {
                openModal(products[0]);
            }, 800);
        });
    }

    // Modal Close Logic
    closeProductBtn.addEventListener('click', () => productModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.style.display = 'none';
    });

    // 2. Add to Cart Logic
    if(addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentSelectedProduct) {
                cart.push(currentSelectedProduct);
                cartCountElement.innerText = cart.length; // Update floating number
                
                // Visual feedback
                addToCartBtn.innerText = "Secured!";
                addToCartBtn.style.background = "var(--accent)";
                addToCartBtn.style.color = "var(--bg-color)";
                
                setTimeout(() => {
                    addToCartBtn.innerText = "Add to Cart";
                    addToCartBtn.style.background = "transparent";
                    addToCartBtn.style.color = "var(--accent)";
                }, 1500);
            }
        });
    }

    // 3. View Cart Logic
    if(floatingCartBtn) {
        floatingCartBtn.addEventListener('click', () => {
            if(cart.length === 0) {
                alert("Your cart is experiencing zero gravity (it's completely empty!).");
            } else {
                // Map through the cart array and pull out just the names
                const itemNames = cart.map(item => item.name).join("\n- ");
                alert("Ready for checkout! You've secured:\n- " + itemNames);
            }
        });
    }

    // --- 6. Form Submission ---
    document.getElementById('preorder-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Pre-order secured! The future awaits.");
        e.target.reset();
    });

    // --- 7. Advanced Custom Cursor & Footprints ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.innerHTML = `
        <div class="shoe-cursor shoe-left"></div>
        <div class="shoe-cursor shoe-right"></div>
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0;
    let moveTimer, lastFootprintTime = 0;
    let isLeftFoot = true;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

        const deltaX = mouseX - lastMouseX;
        const deltaY = mouseY - lastMouseY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 2) {
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            cursor.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
            
            const isRunning = distance > 25;
            cursor.classList.add(isRunning ? 'is-running' : 'is-moving');
            cursor.classList.remove(isRunning ? 'is-moving' : 'is-running');

            const now = Date.now();
            const footprintDelay = isRunning ? 80 : 150;
            
            if (now - lastFootprintTime > footprintDelay) {
                spawnFootprint(e.pageX, e.pageY, angle + 90);
                lastFootprintTime = now;
            }
        }
        lastMouseX = mouseX; lastMouseY = mouseY;

        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => {
            cursor.classList.remove('is-moving', 'is-running');
        }, 80);
    });

    function spawnFootprint(x, y, angle) {
        const print = document.createElement('div');
        print.classList.add('footprint');
        const offset = isLeftFoot ? -15 : 15;
        print.style.left = `${x}px`;
        print.style.top = `${y}px`;
        print.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateX(${offset}px)`;
        document.body.appendChild(print);
        isLeftFoot = !isLeftFoot;

        setTimeout(() => print.remove(), 1500);
    }

    // --- 8. Random Hover Animations ---
    const animations = ['hover-bounce', 'hover-tap', 'hover-moonwalk'];
    
    function attachCursorHoverEvents() {
        const interactables = document.querySelectorAll('a, button, .product-card, .filter-btn, select, input');
        interactables.forEach(el => {
            // Remove old listeners to prevent duplication if re-rendered
            const clone = el.cloneNode(true);
            if(el.parentNode) el.parentNode.replaceChild(clone, el);
            
            clone.addEventListener('mouseenter', () => {
                const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                cursor.classList.add(randomAnim);
            });
            clone.addEventListener('mouseleave', () => {
                animations.forEach(anim => cursor.classList.remove(anim));
                cursor.style.transition = "transform 0.2s ease"; 
            });
            
            // Re-attach specific click events for dynamic elements
            if(clone.classList.contains('product-card')) {
                const productName = clone.querySelector('h3').innerText;
                const product = products.find(p => p.name === productName);
                clone.addEventListener('click', () => openModal(product));
            } else if (clone.classList.contains('filter-btn')) {
                clone.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    renderProducts(e.target.getAttribute('data-filter'));
                });
            }
        });
    }
    attachCursorHoverEvents(); // Initial attachment

    // --- 9. Exit-Intent Boundary Detection ---
    const exitModal = document.getElementById('exit-modal');
    const closeExitBtn = document.querySelector('.close-exit');
    const stayBtn = document.getElementById('stay-btn');
    let hasTriggeredExit = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !hasTriggeredExit) {
            exitModal.classList.add('active');
            hasTriggeredExit = true;
            cursor.style.opacity = '1'; // Fix: Use opacity instead of display
        }
    });

    function closeExitModal() {
        exitModal.classList.remove('active');
        cursor.style.opacity = '1'; // Fix: Bring opacity back to 1
        
        // Remove the inline display style so it doesn't break future CSS classes
        setTimeout(() => {
            exitModal.style.display = ''; 
        }, 400); 
    }

    closeExitBtn.addEventListener('click', closeExitModal);
    stayBtn.addEventListener('click', closeExitModal);
    exitModal.addEventListener('click', (e) => {
        if (e.target === exitModal) closeExitModal();
    });
});