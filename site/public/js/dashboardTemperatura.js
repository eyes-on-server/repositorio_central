nome_do_usuario.innerHTML = sessionStorage.NOME_USER;
nome_da_empresa.innerHTML = sessionStorage.NOME_FANTASIA;

let temperatura = [];
let usoCpu = [];
let usoRam = [];
let usoDisco = [];
let cpuAlerts = 0;
let discAlerts = 0;
let memoryAlerts = 0;

const opcoes = [usoCpu, usoRam, usoDisco];

let escolhaGrafico = 0;

// Calcule a correlação entre os dados
const correlationCpu = calculateCorrelation(temperatura, usoCpu);
const correlationRam = calculateCorrelation(temperatura, usoRam);
const correlationDisco = calculateCorrelation(temperatura, usoDisco);

function buscarServidores() {
  // Comando a ser realizado no banco de dados
  var query = `SELECT id_servidor, nome_servidor 
FROM Servidor 
WHERE fk_empresa = ${sessionStorage.FK_EMPRESA};`;

  // Mysql: SELECT id_servidor, nome_servidor FROM Eyes_On_Server.Servidor WHERE fk_empresa = "${fk}";

  // Limpar as options quando trocar de setor
  select_servidores.innerHTML = `<option value="" selected disabled>Servidores</option>`;

  fetch("/graficosAnalista/buscarInformacoes", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      selectServer: query,
    }),
  })
    .then(function (resposta) {
      if (resposta.status == 200) {
        resposta.json().then((json) => {
          // Criamos um vetor para conferir se aquele servidor já foi inserido no HTML
          var servidores = [];
          // Esse for roda todo o json de resposta da query e insere o nome dos setores no select do HTML
          for (var i = 0; i < json.length; i++) {
            if (!servidores.includes(json[i].nome_servidor)) {
              var servidor = json[i].nome_servidor;
              var id_servidor = json[i].id_servidor;
              select_servidores.innerHTML += `<option value="${id_servidor}">${servidor}</option>`;
            }
          }
        });
      } else {
        console.log(
          "Erro ao realizar a busca dos servidores <function buscarServidores>"
        );
        resposta.text().then((texto) => {
          console.log(resposta);
        });
      }
    })
    .catch((erro) => {
      console.log("Erro ao realizar a busca: " + erro);
    });
}

function buscarAlertas(idServidor) {
  //busca os alertas de cada componente de acordo com o servidor
  fetch(`/alertas/capturarTodosAlertas/?fkServidor=${idServidor}`).then(
    (resultado) => {
      resultado.json().then((resultado) => {
        cpuAlerts = resultado.totalAlertasCpu;
        memoryAlerts = resultado.totalAlertasMemoria;
        discAlerts = resultado.totalAlertasDisco;
      });
    }
  );

  document.getElementById('qtdAlertasCpu').text = cpuAlerts
  document.getElementById('qtdAlertasMem').text = memoryAlerts
  document.getElementById('qtdAlertasDisco').text = discAlerts
}

function buscarDadosServidor(idServidor) {
  //busca os dados do servidor escolhido
  fetch(`/temperatura/dadosUsoPorServidor/?fkServidor=${idServidor}`).then(
    (resultado) => {
      resultado.json().then((resultado) => {
        resultado.map((dado) => {
          if (dado.Componente == "Cpu") {
            usoCpu.push(dado);
          } else if (dado.Componente == "Memoria") {
            usoRam.push(dado);
          } else if (dado.Componente == "Disco") {
            usoDisco.push(dado);
          }
        });
      });
    }
  );
}

function selecionarServidor(idServidor) {
  buscarAlertas(idServidor)
  buscarDadosServidor(idServidor)
  atualizarGrafico()
}

function selecionarGrafico(escolha) {
  escolhaGrafico = escolha
  
}

function criarGrafico() {
  const ctx = document.getElementById("graficoCorrelacao").getContext("2d");

  // Configurações do gráfico
  const config = {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Dispersão",
          data: temperatura.map((value, index) => ({
            x: value,
            y: usoCpu[index],
          })),
          borderColor: "#0000FF", // Cor de fundo
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Temperatura",
          },
        },
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Uso de CPU",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Gráfico de Correlação",
        },
      },
    },
  };

  return new Chart(ctx, config);
}

function atualizarGrafico() {
  let regressionLine = calculateLinearRegression(
    temperatura,
    opcoes[escolhaGrafico]
  );

  // Adicionar a linha de regressão linear ao gráfico
  chart.data.datasets.push({
    label: "Linha de Regressão",
    type: "line",
    data: [
      {
        x: Math.min(...temperatura),
        y: regressionLine(Math.min(...temperatura)),
      },
      {
        x: Math.max(...temperatura),
        y: regressionLine(Math.max(...temperatura)),
      },
    ],
    borderColor: "red",
    borderWidth: 4,
    fill: false,
  });
  chart.update();
}

// Função para calcular a correlação
function calculateCorrelation(x, y) {
  if (x.length !== y.length) {
    throw new Error("Os arrays devem ter o mesmo comprimento");
  }

  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  let numerator = 0.0;
  let sumSquaredXDiff = 0.0;
  let sumSquaredYDiff = 0.0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;

    numerator += xDiff * yDiff;
    sumSquaredXDiff += xDiff * xDiff;
    sumSquaredYDiff += yDiff * yDiff;
  }

  const denominator = Math.sqrt(sumSquaredXDiff * sumSquaredYDiff);
  return numerator / denominator;
}

// Função para calcular a média de um array
function calculateMean(array) {
  const sum = array.reduce((acc, value) => acc + value, 0);
  return sum / array.length;
}

// Função para calcular a regressão linear manualmente
function calculateLinearRegression(x, y) {
  if (x.length !== y.length) {
    throw new Error("Os arrays devem ter o mesmo comprimento");
  }

  const n = x.length;
  const meanX = calculateMean(x);
  const meanY = calculateMean(y);

  let numerator = 0.0;
  let denominator = 0.0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }

  const m = numerator / denominator; // Coeficiente angular
  const b = meanY - m * meanX; // Interceptação y

  // Retornar a função da linha de regressão
  return (inputX) => m * inputX + b;
}

buscarServidores();

const chart = criarGrafico();
atualizarGrafico();
document.getElementById("correlacaoCPU").textContent = `CPU: ${(
  correlationCpu * 100
).toFixed(1)}%`;
document.getElementById("correlacaoMemoria").textContent = `RAM: ${(
  correlationRam * 100
).toFixed(1)}%`;
document.getElementById("correlacaoDisco").textContent = `Disco: ${(
  correlationDisco * 100
).toFixed(1)}%`;
