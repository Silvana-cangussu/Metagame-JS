document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Atualização Automática do Footer (Obrigatoriedade) ---
  const spanAno = document.getElementById("anoAtual");
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }

  // --- 2. Catálogo de Jogos (Mock Data) ---
  const catalogoJogos = [
    { id: "1", titulo: "gta-6" },
    { id: "2", titulo: "Red_Dead_Redemption_2" },
    { id: "3", titulo: "Dark_Souls_3_capa" },
    { id: "4", titulo: "God of War " },
    { id: "5", titulo: "Cyberpunk 2077" },
    { id: "6", titulo: "The Witcher 3" },
    { id: "7", titulo: "Horizon Zero Dawn" },
    { id: "8", titulo: "Assassin's Creed Valhalla" },
    { id: "9", titulo: "Elden Ring" },
    { id: "10", titulo: "Resident Evil Village" }
  ];

  // --- 3. Mapeamento dos Elementos DOM (IDs do index.html) ---
  const navVisitante = document.getElementById("navVisitante");
  const navUsuario = document.getElementById("navUsuario");
  const nomeUsuarioSpan = document.getElementById("nomeUsuario");
  const btnSair = document.getElementById("btnSair");

  const sectionInicio = document.getElementById("inicio");
  const areaUsuario = document.getElementById("areaUsuario");

  const catalogoDiv = document.getElementById("catalogo");
  const selectTitulo = document.getElementById("titulo");
  const selectDesejo = document.getElementById("desejo");

  const formResenha = document.getElementById("formResenha");
  const formDesejo = document.getElementById("formDesejo");
  const listaDesejosDiv = document.getElementById("listaDesejos");
  const listaResenhasDiv = document.getElementById("listaResenhas");

  // --- 4. Leitura do LocalStorage ---
  let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;
  let resenhas = JSON.parse(localStorage.getItem("resenhas")) || [];
  let listaDesejos = JSON.parse(localStorage.getItem("listaDesejos")) || [];

  // --- 5. Inicialização do App ---
  function init() {
    popularSelects();
    renderizarCatalogo();
    atualizarInterfaceUsuario();
    renderizarResenhas();
    renderizarListaDesejos();
  }

  // --- 6. Controle de Sessão e Exibição de Telas ---
  function atualizarInterfaceUsuario() {
    if (usuarioLogado) {
      if (navVisitante) navVisitante.classList.add("oculto");
      if (navUsuario) navUsuario.classList.remove("oculto");
      if (nomeUsuarioSpan) nomeUsuarioSpan.textContent = `Olá, ${usuarioLogado.nome}`;

      if (sectionInicio) sectionInicio.classList.add("oculto");
      if (areaUsuario) areaUsuario.classList.remove("oculto");
    } else {
      if (navVisitante) navVisitante.classList.remove("oculto");
      if (navUsuario) navUsuario.classList.add("oculto");

      if (sectionInicio) sectionInicio.classList.remove("oculto");
      if (areaUsuario) areaUsuario.classList.add("oculto");
    }
  }

  if (btnSair) {
    btnSair.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      usuarioLogado = null;
      atualizarInterfaceUsuario();
    });
  }

  // --- 7. Popular Catálogo e Selects ---
  function popularSelects() {
    if (!selectTitulo || !selectDesejo) return;

    const defaultOption = '<option value="">Selecione um jogo...</option>';
    const optionsHTML = catalogoJogos
      .map((jogo) => `<option value="${jogo.titulo}">${jogo.titulo}</option>`)
      .join("");

    selectTitulo.innerHTML = defaultOption + optionsHTML;
    selectDesejo.innerHTML = defaultOption + optionsHTML;
  }

  function renderizarCatalogo() {
    if (!catalogoDiv) return;

    catalogoDiv.innerHTML = catalogoJogos
      .map(
        (jogo) => `
        <div class="card-jogo">
          <h3>${jogo.titulo}</h3>
        </div>
      `
      )
      .join("");
  }

  // --- 8. Gestão de Resenhas ---
  if (formResenha) {
    formResenha.addEventListener("submit", (e) => {
      e.preventDefault();

      const tituloJogo = selectTitulo.value;
      const nota = document.getElementById("notaJogo").value;
      const texto = document.getElementById("texto").value;

      if (!tituloJogo || !texto.trim()) return;

      const novaResenha = {
        id: Date.now(),
        usuario: usuarioLogado ? usuarioLogado.nome : "Anônimo",
        jogo: tituloJogo,
        nota: nota,
        texto: texto,
        data: new Date().toLocaleDateString("pt-BR")
      };

      resenhas.unshift(novaResenha);
      localStorage.setItem("resenhas", JSON.stringify(resenhas));

      renderizarResenhas();
      formResenha.reset();
    });
  }

  function renderizarResenhas() {
    if (!listaResenhasDiv) return;

    if (resenhas.length === 0) {
      listaResenhasDiv.innerHTML = "<p>Nenhuma resenha publicada ainda.</p>";
      return;
    }

    listaResenhasDiv.innerHTML = resenhas
      .map(
        (item) => `
        <article class="card-resenha">
          <h3>${item.jogo} — <span>Nota: ${item.nota}/5</span></h3>
          <p class="autor">Por <strong>${item.usuario}</strong> em ${item.data}</p>
          <p>${item.texto}</p>
        </article>
      `
      )
      .join("");
  }

  // --- 9. Gestão da Lista de Desejados ---
  if (formDesejo) {
    formDesejo.addEventListener("submit", (e) => {
      e.preventDefault();

      const jogoDesejado = selectDesejo.value;
      if (!jogoDesejado) return;

      const usuarioAtual = usuarioLogado ? usuarioLogado.nome : "Anônimo";
      const existe = listaDesejos.some(
        (item) => item.usuario === usuarioAtual && item.jogo === jogoDesejado
      );

      if (existe) {
        alert("Este jogo já está na sua lista!");
        return;
      }

      const novoDesejo = {
        id: Date.now(),
        usuario: usuarioAtual,
        jogo: jogoDesejado
      };

      listaDesejos.push(novoDesejo);
      localStorage.setItem("listaDesejos", JSON.stringify(listaDesejos));

      renderizarListaDesejos();
      formDesejo.reset();
    });
  }

  function renderizarListaDesejos() {
    if (!listaDesejosDiv) return;

    const usuarioAtual = usuarioLogado ? usuarioLogado.nome : "Anônimo";
    const meusDesejos = listaDesejos.filter((item) => item.usuario === usuarioAtual);

    if (meusDesejos.length === 0) {
      listaDesejosDiv.innerHTML = "<p>Sua lista de desejos está vazia.</p>";
      return;
    }

    listaDesejosDiv.innerHTML = `
      <ul>
        ${meusDesejos
          .map(
            (item) => `
          <li>
            <span>${item.jogo}</span>
            <button class="botao sec" onclick="removerDesejo(${item.id})">Remover</button>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
  }

  window.removerDesejo = function (id) {
    listaDesejos = listaDesejos.filter((item) => item.id !== id);
    localStorage.setItem("listaDesejos", JSON.stringify(listaDesejos));
    renderizarListaDesejos();
  };

  // Inicializa o script
  init();
});