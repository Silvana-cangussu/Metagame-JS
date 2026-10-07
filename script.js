document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Atualização automática do footer ---
  const spanAno = document.getElementById("anoAtual");
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
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
    { id: "1", titulo: "Red Dead Redemption 2" },
    { id: "2", titulo: "GTA 6" },
    { id: "3", titulo: "Dark Souls 3" },
    { id: "4", titulo: "God of War (2018)" },
    { id: "5", titulo: "Cyberpunk 2077" },
    { id: "6", titulo: "The Witcher 3" },
    { id: "7", titulo: "Horizon Zero Dawn" },
    { id: "8", titulo: "Assassin's Creed Valhalla" },
    { id: "9", titulo: "Elden Ring" },
    { id: "10", titulo: "Resident Evil Village" },
    { id: "11", titulo: "Grand Theft Auto Vice City" },
    { id: "12", titulo: "Final Fantasy VII Remake" },
    { id: "13", titulo: "Hollow Knight" },
    { id: "14", titulo: "Sekiro: Shadows Die Twice" }
  ];
 
  // --- 4. Elementos da página (alguns só existem em certas páginas) ---
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
 
      // Salva também em arquivo .txt
      salvarEmTxt(novoUsuario);
 
      msg.textContent = "Cadastro realizado com sucesso!";
      formCadastro.reset();
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
  // Precisa de: <form id="formLogin">, inputs com id="emailLogin" e
  // id="senhaLogin" e um <p id="msg">
  // ======================================================
  if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
      evento.preventDefault();
 
      const msg = document.getElementById("msg");
      const email = document.getElementById("emailLogin").value.trim().toLowerCase();
      const senha = document.getElementById("senhaLogin").value;
 
      const usuarios = lerStorage("usuarios", []);
      const encontrado = usuarios.find((u) => u.email === email && u.senha === senha);
 
      if (!encontrado) {
        msg.textContent = "E-mail ou senha incorretos.";
        return;
      }
 
      localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
      window.location.href = "index.html";
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
    if (!catalogoDiv) return;
 
    catalogoDiv.innerHTML = catalogoJogos
      .map(
        (jogo) => `
        <div class="card-jogo">
          <h3>${limpar(jogo.titulo)}</h3>
        </div>
      `
      )
      .join("");
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
  renderizarResenhas();
  renderizarListaDesejos();
});