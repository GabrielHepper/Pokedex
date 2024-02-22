const express = require("express");
const server = express();
const dadosTimes = require("./data/times.json");
const fs = require("fs");
const cors = require("cors");

server.use(cors()); // permite que o servidor seja acessado por outros domínios,

server.use(express.json());

// Middleware para tratamento de erros
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro interno do servidor!");
});

server.listen(3000, () => {
  console.log(`O servidor está funcionando!`);
});

server.post("/times", (req, res) => {
  const novoTime = req.body;
  let foto = "../assets/" + novoTime.foto
  novoTime.foto = foto

  if (
    !novoTime.id ||
    !novoTime.nome ||
    !novoTime.estadio ||
    !novoTime.local ||
    !novoTime.foto ||
    !novoTime.resumo
  ) {
    return res
      .status(400)
      .json({ mensagem: "Dados incompletos, tente novamente" });
  } else {
    dadosTimes.times.push(novoTime);
    salvarDados(dadosTimes);
    return res
      .status(201)
      .json({ mensagem: "Novo time cadastrado com sucesso!" });
  }
});

server.get("/times", (req, res) => {
  return res.json(dadosTimes.times);
});

server.put("/times/:id", (req, res) => {
  const timesId = parseInt(req.params.id);

  const atualizarTimes = req.body;

  const idTimes = dadosTimes.times.findIndex((u) => u.id === timesId);

  if (timesId === -1) {
    return res.status(404).json({ mensagem: "Time não encontrado :/" });
  } else {
    dadosTimes.times[idTimes].nome =
      atualizarTimes.nome || dadosTimes.times[idTimes].nome;

    dadosTimes.times[idTimes].estadio =
      atualizarTimes.estadio || dadosTimes.times[idTimes].estadio;

    dadosTimes.times[idTimes].local =
      atualizarTimes.local || dadosTimes.times[idTimes].local;

    dadosTimes.times[idTimes].foto =
      atualizarTimes.foto || dadosTimes.times[idTimes].foto;

    dadosTimes.times[idTimes].resumo =
      atualizarTimes.resumo || dadosTimes.times[idTimes].resumo;

    salvarDados(dadosTimes);

    return res.json({ mensagem: "Time atualizado com sucesso!" });
  }
});

server.delete("/times/:id", (req, res) => {
  const timesId = parseInt(req.params.id)

  dadosTimes.times = dadosTimes.times.filter(u => u.id !== timesId)

  salvarDados(dadosTimes)

  return res.status(200).json({ mensagem: "Time excluído com sucesso" })
})

function salvarDados() {
  fs.writeFileSync(__dirname + '/data/times.json', JSON.stringify(dadosTimes, null, 2))
}