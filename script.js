document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Atualização automática do footer ---
  const spanDataAtual = document.getElementById("dataAtual");
  if (spanDataAtual) {
    spanDataAtual.textContent = new Intl.DateTimeFormat("pt-BR").format(new Date());
  }
 
  // --- 2. Funções auxiliares ---
 
  // Impede que texto digitado vire código HTML (segurança)
  function limpar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }
 
  // Lê um valor do localStorage (JSON -> objeto) sem quebrar se estiver vazio ou corrompido
  function lerStorage(chave, padrao) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave));
      return valor !== null ? valor : padrao;
    } catch (erro) {
      return padrao;
    }
  }
 
  // --- 3. Catálogo de jogos ---
  const catalogoJogos = [
    { id: "1", titulo: "Red Dead Redemption 2", imagem: "red dead redemption 2.jpg" },
    { id: "2", titulo: "GTA 6", imagem: "grand theft auto VI.jpg" },
    { id: "3", titulo: "Dark Souls 3", imagem: "dark souls.jpg" },
    { id: "4", titulo: "God of War (2018)", imagem: "god of war.jpg" },
    { id: "5", titulo: "Cyberpunk 2077", imagem: "cyberpunk.jpg" },
    { id: "6", titulo: "The Witcher 3", imagem: "the witcher 3.jpg" },
    { id: "7", titulo: "Horizon Zero Dawn", imagem: "horizon zero down.jpg" },
    { id: "8", titulo: "Assassin's Creed Valhalla", imagem: "assassins creed valhalla.jpg" },
    { id: "9", titulo: "Elden Ring", imagem: "elden ring.jpg" },
    { id: "10", titulo: "Resident Evil 4", imagem: "Resident_Evil_4_(remake).png" },
    { id: "11", titulo: "Grand Theft Auto Vice City", imagem: "grand theft auto vice city.jpg" },
    { id: "12", titulo: "Final Fantasy VII Remake", imagem: "final fantasy VII.jpg" },
    { id: "13", titulo: "Hollow Knight", imagem: "hollow knight.jpg" },
    { id: "14", titulo: "Sekiro: Shadows Die Twice", imagem: "Sekiro-Shadows-Die-Twice-game-poster-cover-art.jpg" },
    { id: "15", titulo: "Grand Theft Auto", imagem: "grand theft auto.jpg" },
    { id: "16", titulo: "Grand Theft Auto: San Andreas", imagem: "grand theft auto san andreas.jpg" },
    { id: "17", titulo: "Ghost of Tsushima", imagem: "ghost of tsushima.jpg" },
    { id: "18", titulo: "Cuphead", imagem: "cuphead.jpg" },
    { id: "19", titulo: "Castlevania", imagem: "castlevania.jpg" },
    { id: "20", titulo: "Batman: Arkham Knight", imagem: "batman arkhan knight.jpg" },
    { id: "21", titulo: "Assassin's Creed IV: Black Flag", imagem: "assassins creed Iv Black flag.jpg" },
    { id: "22", titulo: "Resident Evil 2", imagem: "resident evil 2.jpg" },
    { id: "23", titulo: "Mafia", imagem: "mafia.jpg" },
    { id: "24", titulo: "The Elder Scrolls V: Skyrim", imagem: "skyrim.jpg" },
    { id: "25", titulo: "Shadow of the Colossus", imagem: "shadow of the colossus.jpg" },
    { id: "26", titulo: "The Last of Us", imagem: "the last of us.jpg" }
  ];
 
  // --- 4. Elementos da página (alguns só existem em certas páginas) ---
  const navVisitante = document.getElementById("navVisitante");
  const navUsuario = document.getElementById("navUsuario");
  const nomeUsuarioSpan = document.getElementById("nomeUsuario");
  const btnSair = document.getElementById("btnSair");
 
  const sectionInicio = document.getElementById("inicio");
  const areaUsuario = document.getElementById("areaUsuario");
  const areaAvaliar = document.getElementById("areaAvaliar");
 
  const catalogoDiv = document.getElementById("catalogo");
  const catalogoInicioDiv = document.getElementById("catalogoInicio");
  const selectTitulo = document.getElementById("titulo");
  const selectDesejo = document.getElementById("desejo");
 
  const formResenha = document.getElementById("formResenha");
  const formDesejo = document.getElementById("formDesejo");
  const listaDesejosDiv = document.getElementById("listaDesejos");
  const listaResenhasDiv = document.getElementById("listaResenhas");
 
  const formCadastro = document.getElementById("formCadastro");
  const formLogin = document.getElementById("formLogin");
 
  // --- 5. Dados salvos no navegador ---
  let usuarioLogado = lerStorage("usuarioLogado", null);
  let resenhas = lerStorage("resenhas", []);
  let listaDesejos = lerStorage("listaDesejos", []);
 
  // ======================================================
  // CADASTRO (cadastro.html)
  // ======================================================
  if (formCadastro) {
    formCadastro.addEventListener("submit", (evento) => {
      evento.preventDefault();
 
      const msg = document.getElementById("msg");
 
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;
      const cpf = document.getElementById("cpf").value.trim();
      const endereco = document.getElementById("endereco").value.trim();
 
      if (senha !== confirmarSenha) {
        msg.textContent = "As senhas não conferem.";
        return;
      }
 
      const usuarios = lerStorage("usuarios", []);
 
      const jaExiste = usuarios.some((u) => u.email === email);
      if (jaExiste) {
        msg.textContent = "Este e-mail já está cadastrado.";
        return;
      }
 
      const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha,
        cpf: cpf,
        endereco: endereco
      };
 
      // Salva no localStorage (objeto -> texto JSON)
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

      // Salva também em arquivo .txt
      salvarEmTxt(novoUsuario);

      window.location.href = "index.html#areaAvaliar";
    });
  }
 
  // Gera e baixa um arquivo .txt com os dados em formato JSON
  function salvarEmTxt(usuario) {
    const texto = JSON.stringify(usuario, null, 2);
    const arquivo = new Blob([texto], { type: "text/plain" });
    const link = document.createElement("a");
 
    link.href = URL.createObjectURL(arquivo);
    link.download = "cadastro_" + usuario.nome.replace(/\s+/g, "_") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
 
    URL.revokeObjectURL(link.href);
  }
 
  // ======================================================
  // LOGIN (login.html)
  // Precisa de: <form id="formLogin">, inputs com id="email" e
  // id="senha" e um <p id="msg">
  // ======================================================
  if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
      evento.preventDefault();
 
      const msg = document.getElementById("msg");
      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;
 
      const usuarios = lerStorage("usuarios", []);
      const encontrado = usuarios.find((u) => u.email === email && u.senha === senha);
 
      if (!encontrado) {
        msg.textContent = "E-mail ou senha incorretos.";
        return;
      }
 
      localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
      window.location.href = "index.html#areaAvaliar";
    });
  }
 
  // ======================================================
  // SESSÃO E TELAS (index.html)
  // ======================================================
  function atualizarInterfaceUsuario() {
    if (usuarioLogado) {
      if (navVisitante) navVisitante.classList.add("oculto");
      if (navUsuario) navUsuario.classList.remove("oculto");
      if (nomeUsuarioSpan) nomeUsuarioSpan.textContent = "Olá, " + usuarioLogado.nome;
 
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
      renderizarListaDesejos();
    });
  }
 
  // ======================================================
  // CATÁLOGO E SELECTS
  // ======================================================
  function popularSelects() {
    if (!selectTitulo || !selectDesejo) return;
 
    const opcaoPadrao = '<option value="">Selecione um jogo...</option>';
    const opcoes = catalogoJogos
      .map((jogo) => `<option value="${limpar(jogo.titulo)}">${limpar(jogo.titulo)}</option>`)
      .join("");
 
    selectTitulo.innerHTML = opcaoPadrao + opcoes;
    selectDesejo.innerHTML = opcaoPadrao + opcoes;
  }
 
  function renderizarCatalogo() {
    const cards = catalogoJogos
      .map(
        (jogo) => `
        <div class="card-jogo">
          ${jogo.imagem ? `<img class="imagem-jogo" src="${limpar(jogo.imagem)}" alt="Capa de ${limpar(jogo.titulo)}" loading="lazy">` : ""}
          <h3>${limpar(jogo.titulo)}</h3>
        </div>
      `
      )
      .join("");

    const cardsComAvaliacoes = catalogoJogos
      .map((jogo) => {
        const avaliacoesJogo = resenhas.filter((resenha) => resenha.jogo === jogo.titulo);
        const totalNotas = avaliacoesJogo.reduce((total, resenha) => total + Number(resenha.nota), 0);
        const media = avaliacoesJogo.length ? totalNotas / avaliacoesJogo.length : 0;
        const estrelasPreenchidas = Math.round(media);
        const estrelas = Array.from({ length: 5 }, (_, indice) =>
          indice < estrelasPreenchidas ? "★" : "☆"
        ).join("");
        const resumo = avaliacoesJogo.length
          ? `${totalNotas} pontos · média ${media.toFixed(1).replace(".", ",")}/5 · ${avaliacoesJogo.length} ${
              avaliacoesJogo.length === 1 ? "avaliação" : "avaliações"
            }`
          : "Sem avaliações";

        return `
          <div class="card-jogo">
            ${jogo.imagem ? `<img class="imagem-jogo" src="${limpar(jogo.imagem)}" alt="Capa de ${limpar(jogo.titulo)}" loading="lazy">` : ""}
            <h3>${limpar(jogo.titulo)}</h3>
            <div class="avaliacao-jogo" aria-label="${limpar(resumo)}">
              <span class="estrelas" aria-hidden="true">${estrelas}</span>
              <span class="resumo-avaliacao">${limpar(resumo)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    if (catalogoDiv) catalogoDiv.innerHTML = cardsComAvaliacoes;
    if (catalogoInicioDiv) catalogoInicioDiv.innerHTML = cards;
  }
 
  // ======================================================
  // RESENHAS
  // ======================================================
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
      renderizarCatalogo();
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
          <h3>${limpar(item.jogo)} — <span>Nota: ${limpar(item.nota)}/5</span></h3>
          <p class="autor">Por <strong>${limpar(item.usuario)}</strong> em ${limpar(item.data)}</p>
          <p>${limpar(item.texto)}</p>
        </article>
      `
      )
      .join("");
  }
 
  // ======================================================
  // LISTA DE DESEJADOS
  // ======================================================
  // Usa o e-mail para identificar o dono da lista (o e-mail é único)
  function donoAtual() {
    return usuarioLogado ? usuarioLogado.email : "anonimo";
  }
 
  if (formDesejo) {
    formDesejo.addEventListener("submit", (e) => {
      e.preventDefault();
 
      const jogoDesejado = selectDesejo.value;
      if (!jogoDesejado) return;
 
      const existe = listaDesejos.some(
        (item) => item.usuario === donoAtual() && item.jogo === jogoDesejado
      );
 
      if (existe) {
        alert("Este jogo já está na sua lista!");
        return;
      }
 
      listaDesejos.push({
        id: Date.now(),
        usuario: donoAtual(),
        jogo: jogoDesejado
      });
      localStorage.setItem("listaDesejos", JSON.stringify(listaDesejos));
 
      renderizarListaDesejos();
      formDesejo.reset();
    });
  }
 
  function renderizarListaDesejos() {
    if (!listaDesejosDiv) return;
 
    const meusDesejos = listaDesejos.filter((item) => item.usuario === donoAtual());
 
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
            <span>${limpar(item.jogo)}</span>
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
 
  // ======================================================
  // INICIALIZAÇÃO
  // ======================================================
  popularSelects();
  renderizarCatalogo();
  atualizarInterfaceUsuario();
  if (usuarioLogado && window.location.hash === "#areaAvaliar" && areaAvaliar) {
    requestAnimationFrame(() => areaAvaliar.scrollIntoView({ behavior: "smooth" }));
  }
  renderizarResenhas();
  renderizarListaDesejos();
});