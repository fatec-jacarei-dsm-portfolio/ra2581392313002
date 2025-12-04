document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  /* ===== Ano no footer (opcional) ===== */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Menu mobile (se existir) ===== */
  const btnMenu = $(".menu-toggle");
  const nav = $("#menu");
  if (btnMenu && nav) {
    btnMenu.addEventListener("click", () => {
      const active = nav.classList.toggle("active");
      btnMenu.setAttribute("aria-expanded", active ? "true" : "false");
    });
    $$("#menu a").forEach(a =>
      a.addEventListener("click", () => {
        nav.classList.remove("active");
        btnMenu.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ====== POPUP: cria se não existir ====== */
  let popup = $(".popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "popup";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-modal", "true");
    popup.setAttribute("aria-hidden", "true");
    popup.innerHTML = `
      <div class="popup__content" role="document">
        <button class="popup__close" aria-label="Fechar">×</button>
        <div class="popup__body"></div>
      </div>
    `;
    document.body.appendChild(popup);
  }
  const popupBody = $(".popup__body", popup);
  const popupClose = $(".popup__close", popup);
  let lastFocused = null;

  function openPopup(html) {
    lastFocused = document.activeElement;
    popupBody.innerHTML = html;
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    popupClose?.focus?.();
  }

  function closePopup() {
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    popupBody.innerHTML = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  popupClose?.addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => {
    // fecha clicando fora do conteúdo
    if (e.target === popup) closePopup();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });

  /* ====== CERTIFICADOS: delegação de clique ====== */
  document.addEventListener("click", (e) => {
    const certEl = e.target.closest?.(".certificado-item");
    if (!certEl) return;

    const img = certEl.querySelector("img");
    if (!img) return;

    const caption =
      (certEl.querySelector("figcaption")?.textContent ||
        certEl.querySelector("p")?.textContent ||
        "")
        .trim();

    const html = `
      <img src="${img.src}" alt="${img.alt || "Certificado"}" />
      ${caption ? `<p class="muted" style="margin-top:8px">${caption}</p>` : ""}
    `;
    openPopup(html);
  });

  /* Acessibilidade: abrir pelo teclado também */
  $$(".certificado-item").forEach((el) => {
    el.setAttribute("tabindex", el.getAttribute("tabindex") || "0");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  /* ===== Formulário de contato (Formgrid) ===== */
  const contactForm = $("#contact-form");
  const formStatus = $("#form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // não recarrega a página

      if (formStatus) {
        formStatus.textContent = "Enviando...";
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.textContent = "Mensagem enviada com sucesso! 💌";
          }
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.textContent =
              "Ops, algo deu errado. Tente novamente mais tarde.";
          }
        }
      } catch (error) {
        console.error(error);
        if (formStatus) {
          formStatus.textContent =
            "Erro ao enviar. Verifique sua conexão e tente de novo.";
        }
      }
    });
  }
});
