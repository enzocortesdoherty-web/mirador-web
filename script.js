document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Comportamiento del Menú Hamburguesa ---
    const hamburger = document.getElementById("hamburger-menu");
    const navMenu = document.getElementById("nav-links-menu");

    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Cerrar menú al hacer clic en un enlace (útil en móviles)
        document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

    // --- 2. Comportamiento del Navbar al hacer scroll (Fondo oscuro) ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- 3. Animación de Revelado en Scroll (.reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 4. Procesamiento del Formulario vía PHP y AJAX ---
    const leadForm = document.getElementById('leadForm');
    
    if(leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = leadForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = "Enviando... ⌛";
            btn.style.opacity = "0.8";

            const formData = new FormData(leadForm);

            fetch('contacto.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if(!response.ok) throw new Error('Error en el servidor');
                return response.text();
            })
            .then(data => {
                btn.innerHTML = "¡Información enviada!";
                btn.style.backgroundColor = "var(--white)";
                btn.style.color = "var(--obsidiana)";
                btn.style.opacity = "1";
                
                setTimeout(() => {
                    leadForm.reset();
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = "var(--musgo)";
                    btn.style.color = "var(--obsidiana)";
                }, 3000);
            })
            .catch(error => {
                btn.innerHTML = "Error al enviar. Intenta de nuevo.";
                btn.style.backgroundColor = "#ffcccc";
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = "var(--musgo)";
                }, 3000);
            });
        });
    }
});