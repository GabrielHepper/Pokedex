document.addEventListener("DOMContentLoaded", function () {
  carregarListaTimes();

  document
    .getElementById("formTime")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      adicionarEquipe();
    });
});

function adicionarEquipe() {
  const id = parseInt(document.getElementById("idTime").value, 10);
  const nome = document.getElementById("nomeTime").value;
  const estadio = document.getElementById("estadio").value;
  const local = document.getElementById("local").value;
  const foto = document.getElementById("foto").files[0].name;
  const resumo = document.getElementById("resumo").value;

  fetch('http://localhost:3000/times', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      nome: nome,
      estadio: estadio,
      local: local,
      foto: foto,
      resumo: resumo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("Equipe adicionada com sucesso:", data);
      carregarListaTimes();
    })
    .catch((error) => console.error("Erro:", error))
}

function carregarListaTimes() {
  fetch('http://localhost:3000/times')
    .then(response => response.json())
    .then(function (data) {
      let lista = document.getElementById("listaTimes")
      if (!lista) {
        console.error("Elemento listaTimes não encontrado.");
        return;
      }
      listaTimes.innerHTML = "";

      data.forEach(function (time) {
        const timeItem = document.createElement("div");

        timeItem.classList.add("time");
        timeItem.id = `time${time.id}`;

        timeItem.innerHTML = `
        <div class="times">
        <div class="foto">
          <img src="${time.foto}" alt="Foto do Time">
        </div>
        <div class="informacao">
          <div class="nome">
            <h2>${time.nome.charAt(0).toUpperCase() + time.nome.slice(1)}</h2>
          </div>
          <div class="tipo">
            <p class="tipo">${time.resumo}</p>
          </div>
          <div class="pokemon-status">
            <p class="statusAltura"><i class="bi bi-house-door-fill"></i>${time.estadio}</p>
            <p class="statusPeso"><i class="bi bi-pin-map-fill"></i>${time.local}</p>
          </div>
          <div class="buttonDiv">
            <button class="detalhesButton" onClick="abrirDialog(${time.id})">Detalhes</button>
            <button class="excluirButton" onClick="excluirTime(${time.id})">Excluir</button>
          </div>
        </div>
        </div>
      `;

        lista.appendChild(timeItem);
      });
    });
}

function excluirTime(id) {
  fetch(`http://localhost:3000/times/${id}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      console.log("Time excluído com sucesso:", data);
      carregarListaTimes();
    })
    .catch(error => console.error("Erro ao excluir time:", error));
}

function abrirDialog(id) {
  fetch(`http://localhost:3000/times/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar informações do time. Status: ${response.status}, Texto: ${response.statusText}`);
      }
      return response.json();
    })
    .then(time => {
      const dialog = document.createElement('dialog');
      dialog.classList.add("dialog");

      const dialogContent = `
        <div class="content">
          <div class="conteudoDialog">
            <div class="foto">
              <img src="${time.foto}" alt="Foto do Time">
            </div>
            <div class="informacao">
              <div class="nome">
                <h2>${time.nome.charAt(0).toUpperCase() + time.nome.slice(1)}</h2>
              </div>
              <div class="tipo">
                <p class="tipo">${time.resumo}</p>
              </div>
              <div class="detalhes">
                <div class="row"><p>Estádio:</p><span>${time.estadio}</span></div>
                <div class="row"><p>Local:</p><span>${time.local}</span></div>
              </div>
            </div>
          </div>
        </div>
      `;

      dialog.innerHTML = dialogContent;

      document.body.appendChild(dialog);

      dialog.showModal();

      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) {
          dialog.close();
        }
      });
    })
    .catch(error => console.error("Erro ao carregar informações do time:", error));
}