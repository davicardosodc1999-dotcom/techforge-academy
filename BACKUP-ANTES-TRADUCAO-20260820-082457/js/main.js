document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchDevice = window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

  initHeader();
  initMobileMenu();
  initScrollProgress();
  initSmoothScroll();
  initReveal();
  initSpotlight();
  initTilt();
  initHeroDepth();
  initJourney();
  initQuizRecommendation();
  initFAQ();
  initCertificateDepth();
  initYear();

  function initHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initMobileMenu() {
    const button = document.getElementById("mobile-menu-btn");
    const nav = document.querySelector(".nav");
    const overlay = document.getElementById("mobile-overlay");

    if (!button || !nav || !overlay) return;

    const closeMenu = () => {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("open");
      overlay.hidden = true;
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Fechar menu");
      nav.classList.add("open");
      overlay.hidden = false;
      document.body.classList.add("menu-open");
    };

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) closeMenu();
    });
  }

  function initScrollProgress() {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function initSpotlight() {
    if (touchDevice) return;

    document.querySelectorAll(".spotlight-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  function initTilt() {
    if (touchDevice || reducedMotion) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        const rotateX = y * -5;
        const rotateY = x * 5;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  function initHeroDepth() {
    if (touchDevice || reducedMotion) return;

    const stage = document.getElementById("hero-stage");
    const card = stage?.querySelector(".hero-device-card");
    if (!stage || !card) return;

    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateY = -8 + x * 9;
      const rotateX = 4 - y * 7;

      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${x * 8}px, ${y * 8}px, 0)`;
    });

    stage.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  function initJourney() {
    const journey = document.getElementById("journey-track");
    if (!journey) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      journey.classList.add("journey-active");
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          journey.classList.add("journey-active");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.28 }
    );

    observer.observe(journey);
  }

  function initQuizRecommendation() {
    const form = document.getElementById("quiz-form");
    const result = document.getElementById("quiz-result");
    if (!form || !result) return;

    const recommendations = {
      smartphone: {
        title: "Manutenção de Smartphones: do Zero ao Primeiro Reparo",
        url: "curso-smartphones.html",
      },
      iphone: {
        title: "Troca de Tela de iPhone: Passo a Passo",
        url: "curso-iphone.html",
      },
      notebook: {
        title: "Manutenção de Notebooks para Iniciantes",
        url: "curso-notebooks.html",
      },
      eletronica: {
        title: "Eletrônica Essencial para Manutenção",
        url: "curso-eletronica.html",
      },
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const equipamento = data.get("equipamento");
      const nivel = data.get("nivel");

      if (!equipamento || !nivel || !recommendations[equipamento]) {
        result.classList.add("visible");
        result.innerHTML = `
          <span>FALTA POUCO</span>
          <strong>Selecione as duas respostas.</strong>
          <small>Assim conseguimos recomendar um ponto de partida.</small>
        `;
        return;
      }

      const recommendation = recommendations[equipamento];

      let note = "Essa trilha oferece uma base organizada para você começar.";
      if (nivel === "alguns") {
        note = "Como você já realizou pequenos reparos, avance pelos fundamentos e dê atenção especial ao diagnóstico.";
      } else if (nivel === "profissional") {
        note = "Como você já trabalha na área, use a trilha para revisar fundamentos e avançar para diagnóstico e procedimentos específicos.";
      }

      result.classList.add("visible");
      result.innerHTML = `
        <span>SUA TRILHA RECOMENDADA</span>
        <strong>${recommendation.title}</strong>
        <small>${note}</small>
        <a href="${recommendation.url}">COMEÇAR POR AQUI →</a>
      `;
    });
  }

  function initFAQ() {
    const questions = document.querySelectorAll(".faq-question");
    if (!questions.length) return;

    questions.forEach((question) => {
      question.addEventListener("click", () => {
        const item = question.closest(".faq-item");
        if (!item) return;

        const isOpen = question.getAttribute("aria-expanded") === "true";

        questions.forEach((otherQuestion) => {
          const otherItem = otherQuestion.closest(".faq-item");
          otherQuestion.setAttribute("aria-expanded", "false");
          otherItem?.classList.remove("open");
        });

        if (!isOpen) {
          question.setAttribute("aria-expanded", "true");
          item.classList.add("open");
        }
      });
    });
  }

  function initCertificateDepth() {
    if (touchDevice || reducedMotion) return;

    const stage = document.getElementById("certificate-stage");
    const card = stage?.querySelector(".certificate-card");
    if (!stage || !card) return;

    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `rotateY(${-8 + x * 8}deg) rotateX(${4 - y * 6}deg) translateY(-3px)`;
    });

    stage.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  function initYear() {
    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();
  }
});
