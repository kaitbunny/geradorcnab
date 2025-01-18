function completeAlfa(str, length) {
  //TODO fazer a logica de jogar o que ta escrito em alfa para a esquerda e completar a direita com espacos em branco
  return str.padEnd(length, " ");
}

function completeNum(str, length) {
  //TODO fazer a logica de jogar o que ta escrito em num para a direita e completar a esquerda com zeros
  return str.padStart(length, "0");
}

let beneficiaries = []; // Lista para armazenar beneficiários

function addBeneficiary() {
  // Captura os valores do formulário
  const beneficiary = {
    name: completeAlfa(
      document.getElementById("beneficiaryName").value.toUpperCase(),
      30
    ),
    bank: completeNum(document.getElementById("beneficiaryBank").value, 3),
    agency: completeNum(document.getElementById("beneficiaryAgency").value, 5),
    account: completeNum(
      document.getElementById("beneficiaryAccount").value,
      12
    ),
    accountDv: completeNum(
      document.getElementById("beneficiaryAccountDv").value,
      1
    ),
    paymentDate: document
      .getElementById("beneficiaryDate")
      .value.split("-")
      .reverse()
      .join(""),
    value: completeNum(
      parseInt(
        document.getElementById("beneficiaryValue").value * 100
      ).toString(),
      15
    ),
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
        <td>${beneficiary.account}</td>
        <td>${beneficiary.accountDv}</td>
        <td>${beneficiary.paymentDate}</td>
        <td>${(parseInt(beneficiary.value) / 100).toFixed(2)}</td>
    `;
  tableBody.appendChild(row);
}

function generateHeaderArquivo() {}

function generateHeaderLote() {}

//TODO dividir essa logica de gerar os headers entre os headers de arquivo e lote
function generateCNABHeaders() {
  const bankCode = completeNum(
    document.getElementById("header-bankCode").value,
    3
  );
  const companyName = completeAlfa(
    document.getElementById("header-companyName").value.toUpperCase(),
    30
  );
  const bankName = completeAlfa(
    document.getElementById("header-bankName").value.toUpperCase(),
    30
  );
  const registrationNumber = completeNum(
    document.getElementById("header-registrationNumber").value,
    14
  );
  const convenioCode = completeAlfa(
    document.getElementById("header-convenioCode").value,
    20
  );
  const agency = completeNum(document.getElementById("header-agency").value, 5);
  const agencyDv = completeNum(
    document.getElementById("header-agencyDv").value,
    1
  );
  const account = completeNum(
    document.getElementById("header-account").value,
    12
  );
  const accountDv = completeNum(
    document.getElementById("header-accountDv").value,
    1
  );

  const generationDateInput = document.getElementById(
    "header-generationDate"
  ).value;
  const generationDate = generationDateInput.split("-").reverse().join("");

  const generationTime = document
    .getElementById("header-generationTime")
    .value.replace(/:/g, "")
    .padEnd(6, "0");

  const layoutVersion = completeNum(
    document.getElementById("header-layoutVersion").value,
    3
  );

  const message = completeAlfa(
    document.getElementById("header-message").value,
    40
  );

  const logradouro = completeAlfa(
    document.getElementById("header-logradouro").value,
    30
  );

  const numero = completeNum(document.getElementById("header-numero").value, 5);

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

  const headerArquivo = `${bankCode}00000         2${registrationNumber}${convenioCode}${agency}${agencyDv}${account}${accountDv} ${companyName}${bankName}${completeAlfa(
    "",
    10
  )}1${generationDate}${generationTime}${completeNum(
    "232",
    6
  )}${layoutVersion}01600${completeAlfa("", 20)}${completeAlfa(
    "",
    20
  )}${completeAlfa("", 29)}`;
  const headerLote = `${bankCode}00011C3001045 2${registrationNumber}${convenioCode}${agency}${agencyDv}${account}${accountDv} ${companyName}${message}${logradouro}${numero}${complemento}${cidade}${cep}${uf}${completeAlfa("", 8)}${completeAlfa("", 10)}`;

  return `${headerArquivo}\n${headerLote}`;
}

function generateBeneficiarios() {}

function generateRegistroDetalhe() {}

function generateSegmentoA() {}

function generateSegmentoB() {}

//TODO dividir essa logica de gerar os segmentos entre os segmentos A e B
function generateSegments() {
  const bankCode = completeNum(
    document.getElementById("header-bankCode").value,
    3
  );
  return beneficiaries
    .map((beneficiary, index) => {
      const segmentA = `${bankCode}00013${completeNum(
        (index + 1).toString(),
        5
      )}A${beneficiary.bank}${beneficiary.agency}${beneficiary.account}${
        beneficiary.accountDv
      } ${beneficiary.name}${beneficiary.paymentDate}${
        beneficiary.value
      }${completeAlfa("", 58)}`;
      const segmentB = `${bankCode}00013${completeNum(
        (index + 1).toString(),
        5
      )}B${beneficiary.logradouro}${beneficiary.numero}${
        beneficiary.complemento
      }${beneficiary.bairro}${beneficiary.cidade}${beneficiary.cep}${
        beneficiary.uf
      }${completeAlfa("", 74)}`;
      return `${segmentA}\n${segmentB}`;
    })
    .join("\n");
}

//TODO implementar a logica de gerar os trailers
function generateTrailerLote() {}

function generateTrailerArquivo() {}

function generateCnab() {
  const header = generateCNABHeaders();
  const segments = generateSegments();
  document.getElementById("output").value = `${header}\n${segments}`;
}

//TODO implementar uma opcao de baixar arquivo txt do CNAB
document.getElementById("output").value = generateCnab();
