document.addEventListener("DOMContentLoaded", () => {
  const projetos = document.querySelectorAll(".projeto-item");
  const certificados = document.querySelectorAll(".certificado-item");
  const popup = document.createElement("div");
  popup.classList.add("popup");
  document.body.appendChild(popup);

  function showPopup(content, link = "", target) {
      popup.innerHTML = `
          <div class="popup-content">
              <span class="close">&times;</span>
              ${content}
              ${link ? `<a href="${link}" target="_blank" class="btn-projeto">Ver Projeto</a>` : ""}
          </div>
      `;
      popup.style.display = "flex";
      target.style.display = "none";

      document.querySelector(".close").addEventListener("click", () => {
          popup.style.display = "none";
          target.style.display = "block";
      });
  }

  projetos.forEach((projeto) => {
      const img = projeto.querySelector("img");
      const descricao = projeto.querySelectorAll("p");
      const link = projeto.dataset.link;
      let descricaoHTML = "";
      
      descricao.forEach((p) => {
          descricaoHTML += `<p>${p.textContent}</p>`;
      });

      projeto.addEventListener("click", () => showPopup(descricaoHTML, link, img));
  });

  certificados.forEach((certificado) => {
      const img = certificado.querySelector("img");
      const descricao = certificado.querySelector("p").textContent;
      certificado.addEventListener("click", () => {
          showPopup(`<img src="${img.src}" alt="Certificado"><p>${descricao}</p>`, "", img);
      });
  });
});
