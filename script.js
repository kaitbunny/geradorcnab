//funcoes auxiliares para formatacao dos atributos do cnab
function completeAlfa(str, length) {
  return ((str.toString()).padEnd(length, " ")).toUpperCase();
}

function completeNum(num, length) {
  return num.toString().padStart(length, "0");
}  

function fillWithSpaces(length) {
    return " ".repeat(length);
}

function fillWithZeros(length) {
    return "0".repeat(length);
}

let beneficiaries = []; // Lista para armazenar beneficiários

function addBeneficiary() {
  // Captura os valores do formulário
  const beneficiary = {
    name: completeAlfa(
      document.getElementById("beneficiaryName").value.toUpperCase(),
      30
    ),
    registrationType: document.getElementById("beneficiaryRegistrationType").value,
    registrationNumber: completeNum(parseInt(
      document.getElementById("beneficiaryRegistrationNumber").value),
      14
    ),
    bank: completeNum(parseInt(document.getElementById("beneficiaryBank").value), 3),
    agency: completeNum(parseInt(document.getElementById("beneficiaryAgency").value), 5),
    agencyDv: completeNum(parseInt(
      document.getElementById("beneficiaryAgencyDv").value),
      1
    ),
    account: completeNum(parseInt(
      document.getElementById("beneficiaryAccount").value),
      12
    ),
    accountDv: completeNum(parseInt(
      document.getElementById("beneficiaryAccountDv").value),
      1
    ),
    paymentDate: document
      .getElementById("beneficiaryDate")
      .value.split("-")
      .reverse()
      .join(""),
    value: completeNum(parseInt(document.getElementById("beneficiaryValue").value * 100),15),
    logradouro: completeAlfa(
      document.getElementById("beneficiaryLogradouro").value,
      30
    ),
    numero: completeAlfa(document.getElementById("beneficiaryNumero").value, 5),
    complemento: completeAlfa(
      document.getElementById("beneficiaryComplemento").value,
      15
    ),
    bairro: completeAlfa(
      document.getElementById("beneficiaryBairro").value,
      15
    ),
    cidade: completeAlfa(
      document.getElementById("beneficiaryCidade").value,
      20
    ),
    cep: completeAlfa(document.getElementById("beneficiaryCep").value, 8),
    uf: completeAlfa(document.getElementById("beneficiaryUf").value, 2),
  };

  beneficiaries.push(beneficiary);

  const tableBody = document.querySelector("#beneficiariesTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${beneficiary.name.trim()}</td>
        <td>${beneficiary.bank}</td>
        <td>${beneficiary.agency}</td>
        <td>${beneficiary.agencyDv}</td>
        <td>${beneficiary.account}</td>
        <td>${beneficiary.accountDv}</td>
        <td>${beneficiary.paymentDate}</td>
        <td>${(parseInt(beneficiary.value) / 100).toFixed(2)}</td>
    `;
  tableBody.appendChild(row);
  document.getElementById("beneficiaryForm").reset();
}

class RegisterType {
    static HEADER_ARQUIVO = '0';
    static HEADER_LOTE = '1';
    static DETALHE = '3';
    static TRAILER_LOTE = '5';
    static TRAILER_ARQUIVO = '9';
}

class TipoInscricao {
    static CPF = '1';
    static CNPJ = '2';
}

function generateCnab() {
  //parter 1: gerar os headers
  //header do arquivo
  const bankCode = completeNum(parseInt(
    document.getElementById("header-bankCode").value),
    3
  );
  const batch = '0000';
  const registrationNumber = completeNum(parseInt(
    document.getElementById("header-registrationNumber").value),
    14
  );
  const convenioCode = completeAlfa(
    document.getElementById("header-convenioCode").value,
    20
  );
  const agency = completeNum(parseInt(document.getElementById("header-agency").value), 5);
  const agencyDv = completeNum(parseInt(
    document.getElementById("header-agencyDv").value),
    1
  );
  const account = completeNum(parseInt(
    document.getElementById("header-account").value),
    12
  );
  const accountDv = completeNum(parseInt(
    document.getElementById("header-accountDv").value),
    1
  );
  const companyName = completeAlfa(
    document.getElementById("header-companyName").value.toUpperCase(),
    30
  );
  const bankName = completeAlfa(
    document.getElementById("header-bankName").value.toUpperCase(),
    30
  );
  const shippingCode = '1';
  const generationDateInput = document.getElementById(
    "header-generationDate"
  ).value;
  const generationDate = generationDateInput.split("-").reverse().join("");
  const generationTime = document
    .getElementById("header-generationTime")
    .value.replace(/:/g, "")
    .padEnd(6, "0");
  const sequentialNumber = completeNum(parseInt('1'), 6);
  const layoutVersion = '084';
  const density = completeNum(parseInt('1600'), 5);

  //header do lote
  const serviceBatch = completeNum(parseInt('1'), 4);
  const movementType = 'C';
  const serviceType = '30';
  const serviceForm = '01'; //credito em conta corrente
  const layoutBatchVersion = '043';
  const message = completeAlfa(
    document.getElementById("header-message").value,
    40
  );
  const logradouro = completeAlfa(
    document.getElementById("header-logradouro").value,
    30
  );
  const numero = completeNum(parseInt(document.getElementById("header-numero").value), 5);
  const complemento = completeAlfa(
    document.getElementById("header-complemento").value,
    15
  );
  const cidade = completeAlfa(
    document.getElementById("header-cidade").value,
    20
  );
  const cep = completeAlfa(document.getElementById("header-cep").value, 8);
  const uf = completeAlfa(document.getElementById("header-uf").value, 2);

  const headerArquivo = `${bankCode}${batch}${RegisterType.HEADER_ARQUIVO}${fillWithSpaces(9)}${TipoInscricao.CNPJ}${registrationNumber}${convenioCode}${agency}${agencyDv}${account}${accountDv}${fillWithSpaces(1)}${companyName}${bankName}${fillWithSpaces(10)}${shippingCode}${generationDate}${generationTime}${sequentialNumber}${layoutVersion}${density}${fillWithSpaces(69)}`;
  const headerLote = `${bankCode}${serviceBatch}${RegisterType.HEADER_LOTE}${movementType}${serviceType}${serviceForm}${layoutBatchVersion}${fillWithSpaces(1)}${TipoInscricao.CNPJ}${registrationNumber}${convenioCode}${agency}${agencyDv}${account}${accountDv}${fillWithSpaces(1)}${companyName}${message}${logradouro}${numero}${complemento}${cidade}${cep}${uf}${fillWithSpaces(18)}`;

  //parte 2: gerar os beneficiarios
  let registersCount = 2;
  let totalValue = 0;

  const segments = beneficiaries.map((beneficiary, index) => {
    const indiceImpar = index * 2 + 1;
    beneficiary.bank = completeNum(parseInt(beneficiary.bank), 3);
    beneficiary.registrationNumber = completeNum(parseInt(beneficiary.registrationNumber), 14);
    beneficiary.agency = completeNum(parseInt(beneficiary.agency), 5);
    beneficiary.agencyDv = completeNum(parseInt(beneficiary.agencyDv), 1);
    beneficiary.account = completeNum(parseInt(beneficiary.account), 12);
    beneficiary.accountDv = completeNum(parseInt(beneficiary.accountDv), 1);
    beneficiary.name = completeAlfa(beneficiary.name, 30);
    beneficiary.paymentDate = beneficiary.paymentDate.split("-").reverse().join("");
    beneficiary.value = completeNum(parseInt(beneficiary.value), 15);
    beneficiary.logradouro = completeAlfa(beneficiary.logradouro, 30);
    beneficiary.numero = completeNum(parseInt(beneficiary.numero), 5);
    beneficiary.complemento = completeAlfa(beneficiary.complemento, 15);
    beneficiary.bairro = completeAlfa(beneficiary.bairro, 15);
    beneficiary.cidade = completeAlfa(beneficiary.cidade, 20);
    beneficiary.cep = completeAlfa(beneficiary.cep, 8);
    beneficiary.uf = completeAlfa(beneficiary.uf, 2);
                                                                                                                                                                                                                                                                                                                                                                                                         //credito em conta
    let segmentA = `${bankCode}${serviceBatch}${RegisterType.DETALHE}${completeNum(parseInt(indiceImpar), 5)}A000000${beneficiary.bank}${beneficiary.agency}${beneficiary.agencyDv}${beneficiary.account}${beneficiary.accountDv} ${beneficiary.name}${fillWithSpaces(20)}${beneficiary.paymentDate}BRL${fillWithZeros(15)}${beneficiary.value}${fillWithSpaces(20)}${fillWithZeros(8)}${fillWithZeros(15)}${fillWithSpaces(40)}01${fillWithSpaces(10)}0${fillWithSpaces(10)}`;                                                                                     //cpf
    let segmentB = `${bankCode}${serviceBatch}${RegisterType.DETALHE}${completeNum(parseInt(indiceImpar + 1), 5)}B${fillWithSpaces(3)}${beneficiary.registrationType}${beneficiary.registrationNumber}${beneficiary.logradouro}${beneficiary.numero}${beneficiary.complemento}${beneficiary.bairro}${beneficiary.cidade}${beneficiary.cep}${beneficiary.uf}${generationDate}${beneficiary.value}${fillWithZeros(60)}${fillWithSpaces(15)}0${fillWithSpaces(14)}`;
    
    registersCount += 2;
    totalValue += parseInt(beneficiary.value);
    
    return `${segmentA}\n${segmentB}`;
  }).join("\n");

  //parte 3: gerar os trailers
  let registersWithTrailers = registersCount + 2;

  registersCount = completeNum(parseInt(registersCount), 6);
  totalValue = completeNum(parseInt(totalValue), 18);

  const trailerLote = `${bankCode}${serviceBatch}${RegisterType.TRAILER_LOTE}${fillWithSpaces(9)}${registersCount}${totalValue}${fillWithZeros(18)}${fillWithZeros(6)}${fillWithSpaces(165)}${fillWithSpaces(10)}`;
  
  registersWithTrailers = completeNum(parseInt(registersWithTrailers), 6);
  const trailerArquivo = `${bankCode}9999${RegisterType.TRAILER_ARQUIVO}${fillWithSpaces(9)}000001${registersWithTrailers}${fillWithZeros(6)}${fillWithSpaces(205)}`;

  document.getElementById("output").value = `${headerArquivo}\n${headerLote}\n${segments}\n${trailerLote}\n${trailerArquivo}`;
}

//TODO implementar a logica de gerar os trailers
function generateTrailerLote() {}

function generateTrailerArquivo() {}

//TODO implementar uma opcao de baixar arquivo txt do CNAB
document.getElementById("output").value = "";

function saveHeader() {
    let headerData = {};
    let inputs = document.querySelectorAll("#cnabForm input");
    inputs.forEach(input => {
      headerData[input.id] = input.value;
    });
    
    let savedHeaders = JSON.parse(localStorage.getItem("savedHeaders") || "[]");
    savedHeaders.push(headerData);
    
    localStorage.setItem("savedHeaders", JSON.stringify(savedHeaders));
    alert("Header salvo com sucesso!");
  }
  
  function listSavedHeaders() {
    let savedHeaders = JSON.parse(localStorage.getItem("savedHeaders") || "[]");
    if(savedHeaders.length === 0){
      alert("Nenhum header salvo.");
      return;
    }
    
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #000";
    popup.style.zIndex = "1000";
    popup.style.maxHeight = "80%";
    popup.style.overflowY = "auto";
  
    let list = document.createElement("ul");
    savedHeaders.forEach((header, index) => {
      let listItem = document.createElement("li");
      listItem.style.cursor = "pointer";
      listItem.textContent = `${header["header-companyName"]} - ${header["header-bankName"]}`;
      listItem.onclick = function(){
        fillHeaderFormFromObject(header);
        document.body.removeChild(popup);
      }
      list.appendChild(listItem);
    });
  
    popup.appendChild(list);
    
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Fechar";
    closeBtn.style.display = "block";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = function(){ document.body.removeChild(popup); }
    popup.appendChild(closeBtn);
  
    document.body.appendChild(popup);
  }
  
  function fillHeaderFormFromObject(headerData) {
    for(let key in headerData){
      let input = document.getElementById(key);
      if(input) input.value = headerData[key];
    }
  }
  
  function saveBeneficiaryData() {
    let beneficiaryData = {};
    // Captura todos os inputs e selects do formulário de beneficiário
    let inputs = document.querySelectorAll("#beneficiaryForm input, #beneficiaryForm select");
    inputs.forEach(input => {
      beneficiaryData[input.id] = input.value;
    });
  
    // Recupera a lista existente de beneficiários salvos ou inicializa uma nova lista
    let savedBeneficiaries = JSON.parse(localStorage.getItem("savedBeneficiaries") || "[]");
    savedBeneficiaries.push(beneficiaryData);
  
    // Armazena a lista atualizada no localStorage
    localStorage.setItem("savedBeneficiaries", JSON.stringify(savedBeneficiaries));
    alert("Beneficiário salvo com sucesso!");
  }

  function listSavedBeneficiaries() {
    let savedBeneficiaries = JSON.parse(localStorage.getItem("savedBeneficiaries") || "[]");
    if (savedBeneficiaries.length === 0) {
      alert("Nenhum beneficiário salvo.");
      return;
    }
  
    let popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #000";
    popup.style.zIndex = "1000";
    popup.style.maxHeight = "80%";
    popup.style.overflowY = "auto";
  
    let list = document.createElement("ul");
    savedBeneficiaries.forEach((beneficiary, index) => {
      let listItem = document.createElement("li");
      listItem.style.cursor = "pointer";
      // Exibe, por exemplo, o nome e o banco do beneficiário como referência
      listItem.textContent = `${beneficiary["beneficiaryName"]} - ${beneficiary["beneficiaryBank"]}`;
      listItem.onclick = function () {
        fillBeneficiaryFormFromObject(beneficiary);
        document.body.removeChild(popup);
      }
      list.appendChild(listItem);
    });
  
    popup.appendChild(list);
  
    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Fechar";
    closeBtn.style.display = "block";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = function () { document.body.removeChild(popup); }
    popup.appendChild(closeBtn);
  
    document.body.appendChild(popup);
  }

  function fillBeneficiaryFormFromObject(beneficiaryData) {
    for (let key in beneficiaryData) {
      let input = document.getElementById(key);
      if (input) input.value = beneficiaryData[key];
    }
  }  