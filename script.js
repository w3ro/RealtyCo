const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const filterButtons = document.querySelectorAll("[data-filter]");
const propertyCards = document.querySelectorAll(".property-card");
const counters = document.querySelectorAll("[data-count]");
const contactForm = document.querySelector("[data-contact-form]");
const feedback = document.querySelector("[data-form-feedback]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navToggle.classList.toggle("is-open", !expanded);
    navMenu.classList.toggle("is-open", !expanded);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.classList.remove("is-open");
      navMenu.classList.remove("is-open");
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter || "all";

    filterButtons.forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");

    propertyCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const shouldShow =
        selectedFilter === "all" || categories.includes(selectedFilter);

      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1200;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${target}`;
    }
  };

  requestAnimationFrame(step);
};

if (counters.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = String(formData.get("nombre") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const interes = String(formData.get("interes") || "").trim();
    const zona = String(formData.get("zona") || "").trim();
    const mensaje = String(formData.get("mensaje") || "").trim();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombre || !email || !interes || !zona || !mensaje) {
      feedback.textContent = "Completa todos los campos para continuar.";
      feedback.classList.add("is-error");
      feedback.classList.remove("is-success");
      return;
    }

    if (!emailValido) {
      feedback.textContent = "Escribe un correo electronico valido.";
      feedback.classList.add("is-error");
      feedback.classList.remove("is-success");
      return;
    }

    feedback.textContent =
      "Solicitud lista. El siguiente paso es conectar este formulario con tu CRM o backend seguro.";
    feedback.classList.add("is-success");
    feedback.classList.remove("is-error");
    contactForm.reset();
  });
}
