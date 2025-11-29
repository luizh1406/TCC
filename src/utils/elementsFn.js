import stylesColor from "../styles/styles.stylesColor";
import list from "./linksList";
import defaultValues from "./defaultValues";
import buttonsList from "./buttonsList";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import CryptoJS from "crypto-js";
import html2canvas from "html2canvas";

// FUNÇÕES PARA CRIPTOGRAFIA XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      console.warn(
        "Texto descriptografado está vazio — verifique a chave ou o token.",
      );
    }
    return decrypted;
  } catch (err) {
    console.error("Erro ao descriptografar:", err);
    return null;
  }
}

//FUNÇÕES INTERNAS XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

function closeWindow(element) {
  element.innerHTML = "";
}

function concatBorder(size, style, color) {
  const borderParams = [size, style, color].join(" ");

  return borderParams;
}

function element_Input1(id) {
  const input = document.createElement("input");
  input.id = id || "";

  return input;
}

function element_Label1(text, preferences) {
  const label = document.createElement("label");
  label.style.color = stylesColor.fontsColor.white;
  label.style.marginRight = preferences.dimensions.defaultDivMargin;
  label.style.width = "100%";
  label.textContent = text;
  
  return label;
}

function element_Div1(display, preferences) {
  const container = document.createElement("div");
  container.style.padding = preferences.dimensions.defaultDivPadding;
  container.style.display = display;
  const border = concatBorder(
    preferences.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.balck,
  );
  container.style.borderLeft = border;
  container.style.borderBottom = border;
  container.style.margin = preferences.dimensions.defaultDivMargin;
  container.style.backgroundColor = stylesColor.darkBkgColor.blue1;
  container.style.alignItems = "stretch";

  return container;
}

function element_ListOfInputs1(data, pergunta, preferences) {
  const container = document.createElement("div");
  container.class = "element_ListOfInputs1";

  data
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((row) => {
      const label = element_Label1(row[pergunta], preferences);
      const input = element_Input1(row.variavel);
      const div = element_Div1("flex", preferences);

      setInputType(input, row);

      div.appendChild(label);
      div.appendChild(input);

      container.appendChild(div);
    });

  return container;
}

function element_InputFile1(element) {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";

    // 1. Função de Limpeza (Cleanup): Remove o listener e o input do DOM
    const cleanup = () => {
        input.onchange = null; // Remove o listener do evento para evitar vazamento
        
        // Remove o input do DOM, se ele tiver sido anexado
        if (input.parentNode) { 
            input.parentNode.removeChild(input);
        }
    };

    input.onchange = async () => {
      const file = input.files[0];

      // Caso o usuário feche a janela sem selecionar um arquivo
      if (!file) {
        cleanup(); // Limpa e resolve
        resolve(null);
        return;
      }

      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        cleanup(); // Limpa antes de resolver
        resolve(jsonData);
      } catch (error) {
        cleanup(); // Limpa antes de rejeitar
        reject(error);
      }
    };

    // 2. Anexar o input (Temporário)
    // O input precisa estar no DOM (ou pelo menos existir no contexto) para 
    // garantir que o .click() funcione perfeitamente em todos os navegadores.
    if (element) {
        element.appendChild(input);
    } else {
        // Se 'element' não foi fornecido, anexa temporariamente ao body
        document.body.appendChild(input);
    }

    // 3. Simular o clique para abrir a janela de seleção
    input.click();
    
    // O Sonar pode ter o requisito de remover o input, mesmo se a Promise for
    // cancelada/interrompida.
    // Para resolver isso, a função que CHAMA element_InputFile1 deve tratar 
    // um timeout, mas o código acima já cobre os fluxos de sucesso e erro.
  });
}

function select_ListOfOptions1(
  listOfData,
  headersDV,
  element,
  preferences,
  dtAffects,
  id,
) {
  listOfData.forEach((db, lap) => {
    const div = element_Div1("", preferences);

    const selectAffected = headersDV[lap + 1] || "";
    let colAffected;
    let colAffectedV;
    let colAffectedR;
    if (defaultValues.productOptions[headersDV[lap + 1]] !== undefined) {
      colAffected =
        defaultValues.productOptions[headersDV[lap + 1]]["requestV"];
      colAffectedV =
        defaultValues.productOptions[headersDV[lap + 1]]["colValue"];
      colAffectedR =
        defaultValues.productOptions[headersDV[lap + 1]]["responseV"];
    } else {
      colAffected = "";
      colAffectedV = "";
    }

    const select = document.createElement("select");
    select.style.width = "100%";
    select.style.padding = preferences.dimensions.smallDivPadding;
    select.id = headersDV[lap];
    select.onchange = () =>
      event_changeValueProductSelect(
        dtAffects[lap],
        selectAffected,
        select.value,
        colAffected,
        colAffectedV,
        colAffectedR,
        true,
      );

    const label = element_Label1(
      defaultValues.productOptions[headersDV[lap]]["question"],
      preferences,
    );

    const col = defaultValues.productOptions[headersDV[lap]]["requestV"];
    const valueD = defaultValues.productOptions[headersDV[lap]]["valueV"];

    const filteredData = db.filter((db) => db[col] === valueD);

    if (headersDV[lap] !== "chassis") {
      filteredData.forEach((row) => {
        const option = document.createElement("option");
        option.textContent =
          row[defaultValues.productOptions[headersDV[lap]]["colValue"]];
        option.value =
          row[defaultValues.productOptions[headersDV[lap]]["responseV"]];
        select.appendChild(option);
      });
    } else {
      db.forEach((row) => {
        const option = document.createElement("option");
        option.textContent =
          row[defaultValues.productOptions[headersDV[lap]]["colValue"]];
        option.value =
          row[defaultValues.productOptions[headersDV[lap]]["responseV"]];
        select.appendChild(option);
      });
    }
    div.appendChild(label);
    div.appendChild(select);

    element.appendChild(div);
  });
  const buttonDiv = element_Div1("", preferences);
  const button = element_Button1("Avançar", preferences, checkProductSelect, [
    [listOfData, headersDV, dtAffects],
    element,
    preferences,
    id,
  ]);

  buttonDiv.appendChild(button);

  element.appendChild(buttonDiv);
}

function event_changeValueProductSelect(
  data,
  affected,
  elementValue,
  colAffected,
  colAffectedV,
  colAffectedR,
  changeContent,
) {
  if (affected !== "") {
    const filteredDt = data.filter((dt) => dt[colAffected] === elementValue);

    if (changeContent) {
      const affectedElement = document.getElementById(affected);
      affectedElement.innerHTML = "";

      filteredDt.forEach((row) => {
        const option = document.createElement("option");
        option.textContent = row[colAffectedV];
        option.value = row[colAffectedR];
        affectedElement.appendChild(option);
      });
    }

    return filteredDt;
  } else {
  }
}

function element_Button1(text, preferences, functionToCall, args) {
  const button = document.createElement("button");
  button.onclick = () => functionToCall(...args);
  button.textContent = text;
  button.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  button.style.color = stylesColor.fontsColor.white;
  button.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  button.style.height = "100%";
  button.style.width = "40%";
  button.style.padding = preferences.dimensions.smallDivPadding;

  return button;
}

function element_Button2(text, preferences, functionToCall, args, color) {
  const button = document.createElement("button");
  button.onclick = () => functionToCall(...args);
  button.textContent = text;
  button.style.backgroundColor = color;
  button.style.color = stylesColor.fontsColor.white;
  button.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  button.style.height = "100%";
  button.style.width = "40%";
  button.style.padding = preferences.dimensions.smallDivPadding;

  return button;
}

function checkProductSelect(listOfElements, productDiv, preferences, id) {
  let status = true;
  let sigla;

  listOfElements[1].map((element, index) => {
    let affected = listOfElements[1][index + 1] || "";
    let elementValue = document.getElementById(element).value;
    let colAffected;
    let colAffectedV;
    let colAffectedR;
    if (affected !== "") {
      if (
        defaultValues.productOptions[listOfElements[1][index + 1]] !== undefined
      ) {
        colAffected =
          defaultValues.productOptions[listOfElements[1][index + 1]][
            "requestV"
          ];
        colAffectedV =
          defaultValues.productOptions[listOfElements[1][index + 1]][
            "colValue"
          ];
        colAffectedR =
          defaultValues.productOptions[listOfElements[1][index + 1]][
            "responseV"
          ];
      } else {
        colAffected = "";
        colAffectedV = "";
      }
      let statusSelect = event_changeValueProductSelect(
        listOfElements[2][index],
        affected,
        elementValue,
        colAffected,
        colAffectedV,
        colAffectedR,
        false,
      );
      if (statusSelect.length <= 0) {
        status = false;
      }
    } else {
      if (defaultValues.productOptions[listOfElements[1][1]] !== undefined) {
        colAffected =
          defaultValues.productOptions[listOfElements[1][2]]["requestV"];
        colAffectedV =
          defaultValues.productOptions[listOfElements[1][1]]["colValue"];
      } else {
        colAffected = "";
        colAffectedV = "";
      }
      const familySelect = document.getElementById(listOfElements[1][1]).value;
      const filterdData = listOfElements[0][2].filter(
        (dt) => dt[colAffected] === familySelect,
      );
      let wagonStatus = filterdData.filter(
        (ftDt) => ftDt["descricao"] === elementValue,
      );
      if (wagonStatus.length <= 0) {
        status = false;
      } else {
        sigla = wagonStatus[0].sigla;
        dimensionsProductInput(productDiv, sigla, preferences, id);
      }
    }
    if (status) {
    }
  });
}

function checkDimensions(data, elementList, sigla, preferences, element, id) {
  let status = true;
  const dimensionsData = [];

  elementList.forEach((item) => {
    const element = document.getElementById(item);

    const elementDtLine = data.filter((row) => row.variavel === item);

    if (elementDtLine.length > 0 && elementDtLine[0].obrigatorio === "Sim") {
      const elementValue = element.value;
      if (elementValue === "") {
        element.style.border = concatBorder(
          stylesColor.borderColor.red,
          "solid",
          preferences.dimensions.mediumBorderHeight,
        );
        status = false;
      } else {
        dimensionsData.push({
          id: id,
          descricao: elementDtLine[0].descricao,
          variavel: elementDtLine[0].variavel,
          valor: element.value,
        });
      }
    } else if (elementDtLine.length > 0) {
      dimensionsData.push({
        id: id,
        descricao: elementDtLine[0].descricao,
        variavel: elementDtLine[0].variavel,
        valor: element.value,
        sigla: sigla
      });
    }
  });
  if (status) {
    addDimensions(dimensionsData);
    prodcutCaracteristics(element, sigla, preferences, id);
  } else {
    alert("Preecha todos os campos obrigatórios!");
  }
}

function setInputType(element, rowData) {
  try {
    if (rowData.tipo === "int") {
      element.inputMode = "numeric";
      element.type = "text";
      element.addEventListener("input", () => {
        element.value = element.value.replace(/\D/g, "");
      });
    } else if (rowData.tipo === "decimal") {
      element.inputMode = "decimal";
      element.type = "text";
      element.addEventListener("input", () => {
        let value = element.value;

        value = value.replace(/[^0-9,]/g, "");

        const partsComma = value.split(",");
        if (partsComma.length > 2) {
          value = partsComma.shift() + "," + partsComma.join("");
        }
        element.value = value;
      });
    }
  } catch (error) {
    console.error(
      "Elemento não suporta ou não é preparado para condicionamento de respostas:",
      element,
      error,
    );
  }
}

function singinRoute(path) {
  window.location.href = path;
}

function alterClientQuestions(tableElement, data, headers) {
  const elementChildren = [...tableElement.parentElement.children[1].children];

  elementChildren.forEach((row, index) => {
    const currentId = Number(row.id);

    if (data.some((obj) => obj.id === currentId)) {
      let td;
      let tdValue;
      headers.forEach((item) => {
        if (item === "sequencia") {
          td = row.querySelector(`td input[id="${item}"]`);
          try {
            tdValue = parseInt(td.value, 0);
          } catch (error) {
            return console.log(error);
          }
          if (data[index] === undefined || data[index].sequencia !== tdValue) {
            updateInputListClientData("sequencia", row.id, tdValue);
          }
        } else if (data[index] === undefined || item === "pergunta") {
          td = row.querySelector(`td input[id="${item}"]`);
          tdValue = td.value;
          if (data[index] === undefined || data[index][item] !== tdValue) {
            updateInputListClientData("pergunta", row.id, tdValue);
          }
        } else if (data[index] === undefined || item === "obrigatorio") {
          td = row.querySelector(`td select[id="${item}"]`);
          tdValue = td.value;
          if (data[index][item] !== tdValue) {
            updateInputListClientData("obrigatorio", row.id, tdValue);
          }
        }
      });
    } else {
      const addData = [
        {
          id: currentId,
          sequencia: 0,
          pergunta: "",
          obrigatorio: "",
          variavel: "",
        },
      ];
      headers.forEach((item) => {
        let tdValue;
        if (item === "obrigatorio") {
          let td = row.querySelector(`td select[id="${item}"]`);
          tdValue = td.value;
          addData[0][item] = tdValue;
        } else if (item !== "id") {
          let td = row.querySelector(`td input[id="${item}"]`);
          if (item === "sequencia") {
            try {
              tdValue = parseInt(td.value, 0);
            } catch (error) {
              return console.log(error);
            }
          } else {
            tdValue = td.value;
          }
          addData[0][item] = tdValue;
        }
      });
      addInputQuestionClientData(addData);
    }
  });
}

function changeMPOptions(data, mpStock, id, value) {
  const filterData = data.chapa[id];
  const depends = filterData["depends"];
  const affects = filterData["affects"];

  if (depends.length === 0) {
    const mpStockFilter = mpStock.filter((mp) => mp[id] === parseFloat(value));
    affects.forEach((element) => {
      const select_el = document.getElementById(element);
      select_el.innerHTML = "";

      let filterData = new Set(
        mpStockFilter.map((row) => {
          return row[element];
        }),
      );
      filterData.forEach((filter) => {
        const option = document.createElement("option");
        option.value = filter;
        option.text = filter;

        select_el.appendChild(option);
      });
    });
  } else {
    let mpStockFilter = mpStock.filter((mp) => mp[id] === parseFloat(value));
    depends.forEach((item) => {
      const element = document.getElementById(item).value;
      mpStockFilter = mpStockFilter.filter(
        (mp) => mp[item] === parseFloat(element),
      );
    });
    affects.forEach((aff) => {
      const select_el = document.getElementById(aff);
      select_el.innerHTML = "";

      mpStockFilter.forEach((filter) => {
        const option = document.createElement("option");
        option.value = filter[aff];
        option.text = filter[aff];

        select_el.appendChild(option);
      });
    });
  }
}

function addMovimentStock(div, mpStock, preferences) {
  div.innerHTML = "";

  const data = {
    chapa: {
      espessura: {
        descricao: "Espessura:",
        id: "espessura",
        affects: ["largura", "comprimento", "qualidade"],
        depends: [],
      },
      largura: {
        descricao: "Largura:",
        id: "largura",
        affects: ["comprimento", "qualidade"],
        depends: ["espessura"],
      },
      comprimento: {
        descricao: "Comprimento:",
        id: "comprimento",
        affects: ["qualidade"],
        depends: ["espessura", "largura"],
      },
      qualidade: {
        descricao: "Qualidade do material:",
        id: "qualidade",
        affects: [],
        depends: [],
      },
    },
  };

  const dataHeaders = Object.keys(data.chapa);
  dataHeaders.forEach((header) => {
    const rowQuestion = element_Div1("", preferences);
    const label = element_Label1(data.chapa[header]["descricao"], preferences);

    const questionId = data.chapa[header]["id"];

    const select = document.createElement("select");
    select.style.padding = preferences.dimensions.smallDivPadding;
    select.id = questionId;
    select.onchange = () =>
      changeMPOptions(data, mpStock, questionId, select.value);

    const dftOpt = document.createElement("option");
    select.appendChild(dftOpt);

    if (questionId === "espessura") {
      let bruteValue = mpStock.map((item) => {
        return item[questionId];
      });
      const options = new Set(bruteValue);
      options.forEach((esp) => {
        const opt = document.createElement("option");
        opt.value = esp;
        opt.text = esp;
        select.appendChild(opt);
      });
    }

    rowQuestion.appendChild(label);
    rowQuestion.appendChild(select);
    div.appendChild(rowQuestion);
  });

  const rowMoviment = element_Div1("", preferences);
  const label = element_Label1("Informe o tipo do movimento:", preferences);

  const select = document.createElement("select");
  select.style.padding = preferences.dimensions.smallDivPadding;
  select.id = "movimentType";

  const optS = document.createElement("option");
  optS.value = "saida";
  optS.text = "Saída";

  const optE = document.createElement("option");
  optE.value = "entrada";
  optE.text = "Entrada";

  select.appendChild(optS);
  select.appendChild(optE);

  rowMoviment.appendChild(label);
  rowMoviment.appendChild(select);

  const rowAmount = element_Div1("", preferences);
  const amountLabel = element_Label1(
    "Informe a quantidade a ser movimentada:",
    preferences,
  );
  const input = element_Input1("amount");
  input.style.padding = preferences.dimensions.smallDivPadding;
  input.inputMode = "numeric";
  input.type = "text";
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });

  rowAmount.appendChild(amountLabel);
  rowAmount.appendChild(input);

  const userLabel = element_Label1(
    "Informe o usuário responsável:",
    preferences,
  );

  const inputUser = element_Input1("amount");
  inputUser.style.padding = preferences.dimensions.smallDivPadding;
  inputUser.inputMode = "numeric";
  inputUser.type = "text";
  inputUser.id = "user";

  const rowuser = element_Div1("", preferences);
  rowuser.appendChild(userLabel);
  rowuser.appendChild(inputUser);

  const obsLabel = element_Label1("Observações (Opcional):", preferences);

  const inputObs = element_Input1("amount");
  inputObs.style.padding = preferences.dimensions.smallDivPadding;
  inputObs.inputMode = "numeric";
  inputObs.type = "text";
  inputObs.id = "Obs";

  const rowObs = element_Div1("", preferences);
  rowObs.appendChild(obsLabel);
  rowObs.appendChild(inputObs);

  const rowButtons = element_Div1("", preferences);

  const confirmButton = element_Button1(
    "Confirmar",
    preferences,
    makeStockMoviment,
    [data, preferences, div],
  );
  confirmButton.style.marginRight = preferences.dimensions.maxLinesPadding;
  confirmButton.style.backgroundColor = stylesColor.darkBkgColor.green1;
  confirmButton.style.fontWeight = "bold";
  confirmButton.style.backgroundColor = stylesColor.darkBkgColor.green1;

  const cancelButton = element_Button1("Cancelar", preferences, singinRoute, [
    "/mpController",
  ]);
  cancelButton.style.backgroundColor = stylesColor.darkBkgColor.red0;
  cancelButton.style.fontWeight = "bold";

  rowButtons.appendChild(confirmButton);
  rowButtons.appendChild(cancelButton);

  div.appendChild(rowMoviment);
  div.appendChild(rowuser);
  div.appendChild(rowAmount);
  div.appendChild(rowObs);
  div.appendChild(rowButtons);
}

function element_table1(data, preferences) {
  const table = document.createElement("table");
  table.style.padding = preferences.dimensions.smallDivPadding;
  table.style.margin = preferences.dimensions.defaultDivMargin;
  table.style.color = stylesColor.fontsColor.white;
  table.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  table.style.overflow = "auto";
  table.style.backgroundColor = stylesColor.darkBkgColor.gray0;
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  const headers = Object.keys(data[0]);

  headers.forEach((text, index) => {
    let th = document.createElement("th");
    th.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    th.style.padding = preferences.dimensions.smallDivPadding;
    th.style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.black,
    );
    th.style.textAlign = "center";
    th.textContent = text;
    th.style.cursor = "pointer";
    th.onclick = () => sortTable(table, index);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  data.forEach((rowData, index) => {
    let row = document.createElement("tr");

    Object.values(rowData).forEach((text) => {
      let cell = document.createElement("td");
      cell.style.textAlign = "center";
      cell.style.border = concatBorder(
        preferences.dimensions.mediumBorderHeight,
        "solid",
        stylesColor.borderColor.black,
      );
      cell.textContent = text;

      if (index % 2 === 0) {
        cell.style.backgroundColor = stylesColor.lightBkgColor.blue0;
        cell.style.color = stylesColor.fontsColor.black;
      } else {
        cell.style.backgroundColor = stylesColor.darkBkgColor.blue1;
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}

function element_flagBox(id, defaultValue, preferences) {
  const input = document.createElement("input");
  input.style.width = preferences.dimensions.grandDivPadding;
  input.style.height = preferences.dimensions.grandDivPadding;
  input.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "Solid",
    stylesColor.borderColor.black,
  );
  input.type = "checkbox";
  input.id = id;
  input.checked = defaultValue;

  input.addEventListener("change", () => console.log());

  return input;
}

function copyTableToClipboard(table) {
  if (typeof document !== "undefined") {
    if (table) {
      const tableHTML = table.outerHTML;
      const blob = new Blob([tableHTML], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      navigator.clipboard
        .write([clipboardItem])
        .then(() => {
          console.log("Tabela copiada com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao copiar a tabela:", err);
        });
    }
  } else {
    console.error("DOM não está disponível.");
  }
}

function exportTableToXLSX(
  tableId,
  fileName = "tabela.xlsx",
  textColumns = [],
  numberColumns = [],
) {
  const table = document.getElementById(tableId);
  if (!table) {
    alert("Erro ao gerar o arquivo.");
    return;
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const data = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    return cells.map((cell) => cell.textContent.trim());
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell) {
        if (textColumns.includes(C)) {
          cell.t = "s";
        } else if (numberColumns.includes(C)) {
          const num = parseFloat(cell.v.replace(",", "."));
          if (!isNaN(num)) {
            cell.v = num;
            cell.t = "n";
          }
        }
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
}

function addExceptionTemplate(preferences) {
  const addException = element_Div1("", preferences);
  const addExceptionLabel = element_Label1(
    "Adicionar código em exceções:",
    preferences,
  );

  const addExcCode = element_Label1("Informe o código do item", preferences);
  const inputCode = element_Input1("code");

  const subAddDiv1 = element_Div1("", preferences);
  subAddDiv1.appendChild(addExcCode);
  subAddDiv1.appendChild(inputCode);

  const addExcDesc = element_Label1("Informe a descrição do item", preferences);
  const inputDesc = element_Input1("desc");

  const subAddDiv2 = element_Div1("", preferences);
  subAddDiv2.appendChild(addExcDesc);
  subAddDiv2.appendChild(inputDesc);

  const addExcReason = element_Label1(
    "Informe o motivo (Opcional):",
    preferences,
  );
  const inputReason = element_Input1("reason");

  const subAddDiv3 = element_Div1("", preferences);
  subAddDiv3.appendChild(addExcReason);
  subAddDiv3.appendChild(inputReason);

  const saveButton = element_Button1("Gravar", preferences, addExceptionCode, [
    inputCode,
    inputDesc,
    inputReason,
    preferences,
  ]);

  const subAddDiv4 = element_Div1("", preferences);
  subAddDiv4.appendChild(saveButton);

  addException.appendChild(addExceptionLabel);
  addException.appendChild(subAddDiv1);
  addException.appendChild(subAddDiv2);
  addException.appendChild(subAddDiv3);
  addException.appendChild(subAddDiv4);

  return addException;
}

function removeExceptionTemplate(preferences) {
  const addException = element_Div1("", preferences);
  const addExceptionLabel = element_Label1(
    "Remover código em exceções:",
    preferences,
  );

  const addExcCode = element_Label1("Informe o código do item", preferences);
  const codeRemove = element_Input1("codeRemove");

  const subAddDiv1 = element_Div1("", preferences);
  subAddDiv1.appendChild(addExcCode);
  subAddDiv1.appendChild(codeRemove);

  const saveButton = element_Button1(
    "Remover",
    preferences,
    removeExceptionCode,
    [codeRemove],
  );

  const subAddDiv2 = element_Div1("", preferences);
  subAddDiv2.appendChild(saveButton);

  addException.appendChild(addExceptionLabel);
  addException.appendChild(subAddDiv1);
  addException.appendChild(subAddDiv2);

  return addException;
}

function plasmaTemplate(data) {
  const table = document.createElement("table");
  table.id = "plasmaList";
  const header = document.createElement("thead");
  const headerTR = document.createElement("tr");
  const tbody = document.createElement("tbody");

  header.appendChild(headerTR);
  table.appendChild(header);
  table.appendChild(tbody);

  const headers = [
    "ESPESSURA",
    "CÓDIGO",
    "QUANTIDADE",
    "DESCRIÇÃO",
    "MATÉRIA PRIMA",
    "KIT",
  ];

  headers.forEach((head) => {
    const th = document.createElement("th");
    th.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    th.style.color = stylesColor.fontsColor.white;
    th.style.border = "4px solid white";
    th.textContent = head;
    headerTR.appendChild(th);
  });

  let cont = 0;
  let rowColor;
  let fontColor;

  data.forEach((row) => {
    if (row.corte === "Plasma") {
      if (cont % 2 === 0) {
        rowColor = stylesColor.lightBkgColor.blue0;
        fontColor = stylesColor.fontsColor.black;
      } else {
        rowColor = stylesColor.darkBkgColor.blue0;
        fontColor = stylesColor.fontsColor.white;
      }
      cont++;
      const tr = document.createElement("tr");
      const espessura = document.createElement("td");
      espessura.style.backgroundColor = rowColor;
      espessura.style.color = fontColor;
      espessura.style.border = "4px solid white";
      espessura.textContent = row.espessura;
      tr.appendChild(espessura);
      const codigo = document.createElement("td");
      codigo.style.backgroundColor = rowColor;
      codigo.style.color = fontColor;
      codigo.style.border = "4px solid white";
      let codigoString = row.codigo;
      if (codigoString.length === 9) {
        codigoString =
          codigoString.slice(0, 2) +
          "." +
          codigoString.slice(2, 4) +
          "." +
          codigoString.slice(4, 9);
      }
      codigo.textContent = codigoString;
      tr.appendChild(codigo);
      const quantidade = document.createElement("td");
      quantidade.style.backgroundColor = rowColor;
      quantidade.style.color = fontColor;
      quantidade.style.border = "4px solid white";
      quantidade.textContent = row.quantidade;
      tr.appendChild(quantidade);
      const descricao = document.createElement("td");
      descricao.style.backgroundColor = rowColor;
      descricao.style.color = fontColor;
      descricao.style.border = "4px solid white";
      descricao.textContent = row.descricao;
      tr.appendChild(descricao);
      const materiaPrima = document.createElement("td");
      materiaPrima.style.backgroundColor = rowColor;
      materiaPrima.style.color = fontColor;
      materiaPrima.style.border = "4px solid white";
      materiaPrima.textContent = "";
      tr.appendChild(materiaPrima);
      const kit = document.createElement("td");
      kit.style.backgroundColor = rowColor;
      kit.style.color = fontColor;
      kit.style.border = "4px solid white";
      kit.textContent = row.kit;
      tr.appendChild(kit);
      tbody.appendChild(tr);
    }
  });

  return table;
}

//FUNÇÕES INTERNAS ASSINCRONAS XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

async function makeStockMoviment(data, preferences, settingsBox) {
  const sheetData = data["chapa"];
  let status = true;
  let movimentData = {};
  let stock;

  const responseMP = await fetch("/api/get_mp_stock");
  const responseMPJSON = await responseMP.json();
  let mp = responseMPJSON.props.resultRows;

  const amount = document.getElementById("amount").value;
  if (amount === "" || amount === "0") {
    status = false;
    document.getElementById("amount").style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.red,
    );
    alert("Informe a quantidade corretamente!");
  }

  const user = document.getElementById("user").value;
  if (user === "" || user === "0") {
    status = false;
    document.getElementById("user").style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.red,
    );
    alert("Informe a quantidade corretamente!");
  }

  const obs = document.getElementById("Obs").value;

  if (status) {
    const dataHeaders = Object.keys(sheetData);
    dataHeaders.forEach((header) => {
      let elementValue = document.getElementById(header).value;
      if (header !== "qualidade") {
        elementValue = parseFloat(elementValue);
      }
      if (elementValue === "" && status) {
        status = false;
        alert("Preencha todos os campos corretamente!");
      } else {
        mp = mp.filter((mp) => mp[header] === elementValue);
      }
    });

    const response = await fetch(`/api/get_sequence?id=${4}`);
    const responseJSON = await response.json();
    const sequencia = responseJSON.props.resultRows[0]["posicao"];

    const movimentType = document.getElementById("movimentType").value;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

    movimentData["seq_movimento"] = sequencia;
    movimentData["id"] = mp[0]["cod_prosyst"];
    movimentData["codigo_int"] = mp[0]["codigo_int"];
    movimentData["movimento"] = movimentType;
    movimentData["descricao"] = obs;
    movimentData["quantidade"] = amount;
    movimentData["estoque_atual"] = mp[0]["estoque_un"];
    movimentData["responsavel"] = user;
    movimentData["data_criacao"] = formattedDate;

    if (movimentData.movimento === "saida") {
      stock = parseInt(movimentData.estoque_atual, 0) - amount;
      if (stock < 0) {
        alert("O movimento causará estoque negativo! movimento interrompido ");
        status = false;
      }
    } else {
      stock = movimentData.estoque_atual + parseInt(movimentData.quantidade, 0);
    }

    if (status) {
      await fetch("/api/add_stock_moviment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movimentData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Inserção bem-sucedida:", result);
          upSequenceMoviment(parseFloat(sequencia));
          alert("Movimento adicionado com sucesso!");
          settingsBox.innerHTML = "";
        })
        .catch((error) => {
          console.error("Erro ao inserir dados:", error);
        });

      let addData = {};
      addData["codigo_int"] = movimentData["codigo_int"];
      addData["estoque_un"] = stock;

      await fetch("/api/update_stock_mp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Inserção bem-sucedida:", result);
        })
        .catch((error) => {
          console.error("Erro ao inserir dados:", error);
        });
    }
  }
}

async function listOfInputs(
  dataFunction,
  element,
  preferences,
  stepState,
  setID,
) {
  const data = await dataFunction();
  const dataOrdered = data.sort((a, b) => a.sequencia - b.sequencia);

  const questions = element_ListOfInputs1(dataOrdered, "pergunta", preferences);

  const advanceButton = element_Button1(
    "Avançar",
    preferences,
    checkClientData,
    [data, preferences, stepState, setID, element],
  );
  const buttonDiv = element_Div1("", preferences);
  buttonDiv.appendChild(advanceButton);

  element.appendChild(questions);
  element.appendChild(buttonDiv);
}

async function inputListClientData(element, preferences) {
  const inputListResponse = await fetch("/api/get_input_list_client_data");
  const inputListJson = await inputListResponse.json();
  const inputList = inputListJson.props.resultRows;

  element.innerHTML = "";

  const titleConfig = document.createElement("label");
  titleConfig.textContent = "Questionário informações do cliente:";
  titleConfig.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  titleConfig.style.padding = preferences.dimensions.mediumLinesPadding;
  titleConfig.style.margin = preferences.dimensions.defaultDivMargin;
  titleConfig.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  titleConfig.style.color = stylesColor.fontsColor.white;

  const trHeader = document.createElement("tr");

  const thead = document.createElement("thead");
  thead.appendChild(trHeader);

  const headers = Object.keys(inputList[0]);

  headers.forEach((item) => {
    if (item !== "id") {
      const th = document.createElement("th");
      th.style.backgroundColor = stylesColor.darkBkgColor.blue0;
      th.style.color = stylesColor.fontsColor.white;
      th.style.border = concatBorder(
        preferences.dimensions.minimumBorderHeight,
        "solid",
        stylesColor.borderColor.white,
      );
      th.style.padding = "4px";
      th.textContent = item;

      trHeader.appendChild(th);
    }
  });

  const tbody = document.createElement("tbody");

  inputList
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((item) => {
      const row = document.createElement("tr");
      row.id = item.id;
      headers.forEach((headersItem) => {
        if (headersItem !== "id") {
          const td = document.createElement("td");

          if (headersItem === "sequencia") {
            const input = document.createElement("input");
            input.inputMode = "numeric";
            input.type = "text";
            input.addEventListener("input", () => {
              input.value = input.value.replace(/\D/g, "");
            });

            input.id = headersItem;
            input.value = item[headersItem];

            td.appendChild(input);
          } else if (headersItem === "pergunta") {
            const input = document.createElement("input");
            input.id = headersItem;
            input.value = item[headersItem];

            td.appendChild(input);
          } else if (headersItem === "obrigatorio") {
            const option1 = document.createElement("option");
            option1.value = "Não";
            option1.textContent = "Não";

            const option2 = document.createElement("option");
            option2.value = "Sim";
            option2.textContent = "Sim";

            const select = document.createElement("select");
            select.style.width = "100%";
            select.style.cursor = "pointer";
            select.id = headersItem;

            select.appendChild(option1);
            select.appendChild(option2);

            select.value = String(item[headersItem]);

            td.appendChild(select);
          } else if (headersItem === "variavel") {
            const label = document.createElement("label");
            label.style.backgroundColor = stylesColor.lightBkgColor.white0;
            label.style.display = "flex";
            label.style.width = "100%";
            label.style.height = "100%";
            label.id = headersItem;
            label.textContent = item[headersItem];

            td.appendChild(label);
          }

          row.appendChild(td);
        }
      });
      tbody.appendChild(row);
    });

  const table = document.createElement("table");
  table.appendChild(thead);
  table.appendChild(tbody);

  const buttonsBorder = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );

  const container = document.createElement("div");
  container.style.backgroundColor = stylesColor.darkBkgColor.gray0;
  container.style.border = stylesColor.borderColor.gray;
  container.style.overflowX = "auto";
  container.style.width = "fit-content";
  container.style.height = preferences.dimensions.mediumHeightToDiv;
  container.style.margin = preferences.dimensions.defaultDivMargin;
  container.style.padding = preferences.dimensions.defaultDivPadding;
  container.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );

  const confirmButton = document.createElement("button");
  confirmButton.style.padding = preferences.dimensions.defaultDivPadding;
  confirmButton.style.margin = preferences.dimensions.defaultDivMargin;
  confirmButton.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  confirmButton.style.color = stylesColor.fontsColor.white;
  confirmButton.style.fontWeight = "bold";
  confirmButton.textContent = "Salvar alterações";
  confirmButton.onclick = () => alterClientQuestions(tbody, inputList, headers);
  confirmButton.style.border = buttonsBorder;
  confirmButton.style.cursor = "pointer";

  const cancelButton = document.createElement("button");
  cancelButton.style.padding = preferences.dimensions.defaultDivPadding;
  cancelButton.style.margin = preferences.dimensions.defaultDivMargin;
  cancelButton.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  cancelButton.style.color = stylesColor.fontsColor.white;
  cancelButton.style.fontWeight = "bold";
  cancelButton.textContent = "Cancelar";
  cancelButton.onclick = () => (window.location.href = "./budgetConfig");
  cancelButton.style.border = buttonsBorder;
  cancelButton.style.cursor = "pointer";
  cancelButton.onmouseenter = () =>
    (cancelButton.style.color = stylesColor.fontsColor.orange);
  cancelButton.onmouseleave = () =>
    (cancelButton.style.color = stylesColor.fontsColor.white);

  let handleIdValue = 0;

  function updateHandleIdValue(newId) {
    if (handleIdValue === 0) {
      handleIdValue = handleIdValue + parseInt(newId, 0);
    } else {
      handleIdValue = handleIdValue + 1;
    }

    return handleIdValue;
  }

  const addInputButton = document.createElement("button");
  addInputButton.style.padding = preferences.dimensions.defaultDivPadding;
  addInputButton.style.margin = preferences.dimensions.defaultDivMargin;
  addInputButton.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  addInputButton.style.color = stylesColor.fontsColor.white;
  addInputButton.style.fontWeight = "bold";
  addInputButton.textContent = "Adicionar nova pergunta";
  addInputButton.onclick = () =>
    addNewQuestionClientData(tbody, updateHandleIdValue);
  addInputButton.style.border = buttonsBorder;
  addInputButton.style.cursor = "pointer";

  const divButtons = document.createElement("div");

  divButtons.appendChild(cancelButton);
  divButtons.appendChild(confirmButton);
  divButtons.appendChild(addInputButton);

  container.appendChild(table);

  element.appendChild(titleConfig);
  element.appendChild(container);
  element.appendChild(divButtons);
}

async function updateInputListClientData(col, id, value) {
  await fetch("/api/update_input_list_client_data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      col: col,
      value: value,
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });
}

async function budgetInputListClientData() {
  const response = await fetch("/api/get_input_list_client_data");
  const responseJSON = await response.json();
  const data = responseJSON.props.resultRows;

  return data;
}

async function checkClientData(data, preferences, stepState, setID, element) {
  const response = await fetch(`/api/get_sequence?id=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseJSON = await response.json();
  const clientSequence = responseJSON.props.resultRows;

  let valueMissing = false;
  let state = false;

  const clientData = [{}];

  setID(clientSequence[0].posicao);

  clientData[0] = { id: clientSequence[0].posicao };

  data.forEach((item) => {
    const element = document.getElementById(item.variavel);
    const elementValue = element.value;

    if (elementValue === "" && item.obrigatorio === "Sim") {
      const border = concatBorder(
        preferences.mediumBorderHeight,
        "solid",
        stylesColor.borderColor.red,
      );
      element.style.border = border;
      valueMissing = true;
    } else {
      clientData[0] = { ...clientData[0], [item.variavel]: elementValue };
    }
  });

  if (!valueMissing) {
    await fetch("/api/add_client_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Inserção bem-sucedida:", result);
        state = true;
      })
      .catch((error) => {
        console.error("Erro ao inserir dados:", error);
      });
  } else {
    alert("Preencha os campos obrigatórios em vermelho.");
  }
  if (state) {
    const newPos = parseInt(clientSequence[0].posicao) + 1;
    const upSeq = [{ id: 1, posicao: newPos }];
    await fetch("/api/update_sequences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upSeq),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Inserção bem-sucedida:", result);
      });
  }
  stepState(element, preferences, clientSequence[0].posicao);
}

async function dimensionsProductInput(element, sigla, preferences, id) {
  element.innerHTML = "";

  await fetch(`/api/update_client_data_sigla?sigla=${sigla}&id=${id}`)

  const response = await fetch(
    `/api/get_dimensions_product_input?sigla=${sigla}`,
  );
  const responseJSON = await response.json();
  const questions = responseJSON.props.resultRows;

  const questionsList = element_ListOfInputs1(
    questions,
    "descricao",
    preferences,
  );

  const elementList = questions.map((item) => {
    return item["variavel"];
  });

  const advanceButton = element_Button1(
    "Avançar",
    preferences,
    checkDimensions,
    [questions, elementList, sigla, preferences, element, id],
  );
  const buttonDiv = element_Div1("", preferences);
  buttonDiv.appendChild(advanceButton);

  element.appendChild(questionsList);
  element.appendChild(buttonDiv);
}

async function addDimensions(data) {
  console.log(data)
  await fetch("/api/add_dimensions_product_input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });
}

async function prodcutCaracteristics(element, sigla, preferences, id) {
  const subTItle = document.getElementById("subTitleId");

  const response = await fetch(
    `/api/get_product_caracteristics_questions?sigla=${sigla}`,
  );
  const responseJSON = await response.json();
  const questionList = responseJSON.props.resultRows;

  let step = 0;

  const variables = questionList.map((row) => {
    return { [row.variavel]: "" };
  });

  function nextStep(header, value) {
    step = step + 1;

    variables.forEach((variable) => {
      let varHeader = Object.keys(variable);
      if (varHeader[0] === header) {
        variable[header] = value;
      }
    });
    if (step !== 0 && step < questionList.length) {
      saleInputs(step);
    } else if (step !== 0) {
      revisoinProductConfiguration(variables, preferences, id, sigla);
    }
  }

  function backStep() {
    step = step - 1;
    saleInputs(step);
  }

  saleInputs(step);

  async function saleInputs(step) {
    const responseVariables = await fetch(
      `/api/get_product_question?table=${questionList[step]["tabela"]}`,
    );
    const responseVariablesJSON = await responseVariables.json();
    const variablesList = responseVariablesJSON.props.resultRows;
    let firstFilter = variablesList.filter(
      (vl) => vl.sigla === sigla || vl.sigla === "",
    );
    variables.forEach((v) => {
      let vHeader = Object.keys(v);
      if (firstFilter[0][vHeader]) {
        firstFilter = firstFilter.filter(
          (vFilter) =>
            vFilter[vHeader] === "" || vFilter[vHeader] === v[vHeader],
        );
      }
    });
    let varQuestion = questionList[step]["variavel"];

    configuratorButtons(
      firstFilter,
      questionList[step].descricao,
      nextStep,
      varQuestion,
      preferences,
      element,
      subTItle,
      step,
      backStep,
      id,
    );
  }
}

async function configuratorButtons(
  data,
  questionText,
  nextStepFn,
  varQuestion,
  preferences,
  element,
  subTItle,
  step,
  backStepFn,
) {
  subTItle.textContent = questionText;

  element.innerHTML = "";
  element.style.width = preferences.dimensions.grandWidthToDiv;

  data.forEach((item) => {
    const buttonDiv = element_Div1("", preferences);
    buttonDiv.style.width = "100%";
    const button = element_Button1(item.descricao, preferences, nextStepFn, [
      varQuestion,
      item.descricao,
    ]);
    button.style.width = "100%";
    const label = element_Label1("↑ Clique acima para selecionar", preferences);
    label.style.paddingTop = preferences.dimensions.smallDivPadding;
    label.style.fontSize = preferences.dimensions.textFontSize;
    label.style.width = "100%";
    label.style.whiteSpace = "nowrap";
    buttonDiv.appendChild(button);
    buttonDiv.appendChild(label);
    element.appendChild(buttonDiv);
  });

  const cancelButtonDiv = element_Div1("flex", preferences);
  cancelButtonDiv.style.gap = preferences.dimensions.smallDivPadding;

  if (step > 0) {
    const comeBackButton = element_Button2(
      "Voltar",
      preferences,
      backStepFn,
      [""],
      stylesColor.darkBkgColor.gray0,
    );
    cancelButtonDiv.appendChild(comeBackButton);

    const cancelButton = element_Button2(
      "Cancelar",
      preferences,
      singinRoute,
      ["./addBudget"],
      stylesColor.darkBkgColor.red0,
    );
    cancelButtonDiv.appendChild(cancelButton);
  } else {
    const cancelButton = element_Button2(
      "Cancelar",
      preferences,
      singinRoute,
      ["./addBudget"],
      stylesColor.darkBkgColor.red0,
    );
    cancelButtonDiv.appendChild(cancelButton);
  }

  element.appendChild(cancelButtonDiv);
}

async function revisoinProductConfiguration(variables, preferences, id, sigla) {
  const data = variables.map((row) => {
    let variavel = Object.keys(row);
    let valor = Object.values(row);
    let dtRow = {
      id: id,
      sigla: sigla,
      variavel: variavel[0],
      valor: valor[0],
    };

    return dtRow;
  });

  await fetch("/api/add_product_question_values", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
      alert(
        "Ocorreu um erro inesperado com seu pedido. Por favor contate os administradores do sistema. \n :|",
      );
    });

  const encryptedId = encrypt(id);
  window.location.href = `/revision?id=${encryptedId}`;
}

async function addNewQuestionClientData(tableElement, updateHandleId) {
  const response = await fetch(`/api/get_sequence?id=3`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJSON = await response.json();
  const resultRows = responseJSON.props.resultRows;

  const handleId = updateHandleId(resultRows[0].posicao);

  const sequencia = document.createElement("input");
  sequencia.inputMode = "numeric";
  sequencia.type = "text";
  sequencia.addEventListener("input", () => {
    sequencia.value = sequencia.value.replace(/\D/g, "");
  });
  sequencia.id = "sequencia";

  const tdSequencia = document.createElement("td");
  tdSequencia.appendChild(sequencia);

  const pergunta = document.createElement("input");
  pergunta.id = "pergunta";

  const tdPergunta = document.createElement("td");
  tdPergunta.appendChild(pergunta);

  const option1 = document.createElement("option");
  option1.value = "Não";
  option1.textContent = "Não";

  const option2 = document.createElement("option");
  option2.value = "Sim";
  option2.textContent = "Sim";

  const select = document.createElement("select");
  select.style.width = "100%";
  select.style.cursor = "pointer";
  select.id = "obrigatorio";
  select.appendChild(option1);
  select.appendChild(option2);

  const tdSelect = document.createElement("td");
  tdSelect.appendChild(select);

  const variavel = document.createElement("input");
  variavel.inputMode = "numeric";
  variavel.type = "text";
  variavel.addEventListener("input", () => {
    variavel.value = variavel.value.replace(/\s/g, "");
  });
  variavel.id = "variavel";

  const tdVariavel = document.createElement("td");
  tdVariavel.appendChild(variavel);

  const tr = document.createElement("tr");
  tr.id = handleId;
  tr.appendChild(tdSequencia);
  tr.appendChild(tdPergunta);
  tr.appendChild(tdSelect);
  tr.appendChild(tdVariavel);

  tableElement.appendChild(tr);
}

async function addInputQuestionClientData(addData) {
  await fetch("/api/add_input_list_client_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
      upSequenceClientData(addData[0].id);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });
}

async function getMPStock() {
  const response = await fetch("./api/get_mp_stock");
  const responseJSON = await response.json();
  const stock = responseJSON.props.resultRows;

  return stock;
}

async function upSequenceClientData(currentId) {
  const newId = currentId + 1;

  const addData = [
    {
      posicao: newId,
      id: 3,
    },
  ];
  await fetch("/api/update_sequences", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });
}

async function upSequenceMoviment(currentId) {
  const newId = currentId + 1;

  const addData = [
    {
      posicao: newId,
      id: 4,
    },
  ];
  await fetch("/api/update_sequences", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });
}

async function getStockMoviments() {
  const response = await fetch("./api/get_mp_moviments");
  const responseJSON = await response.json();
  const data = responseJSON.props.resultRows;

  return data;
}

async function showMoviments(filters, div, preferences) {
  let moviments = await getStockMoviments();
  let focus = "chapa";
  let noFilter = true;
  const elementsList = Object.keys(filters[focus]);

  div.innerHTML = "";

  elementsList.forEach((row) => {
    const element = document.getElementById(filters[focus][row]["id"]);
    const elementValue = element.value;

    if (elementValue !== "") {
      moviments = moviments.filter(
        (item) =>
          item[filters[focus][row]["id"]] &&
          (String(item[filters[focus][row].id] || "")
            .toLowerCase()
            .includes(elementValue.toLowerCase()) ||
            String(item[filters[focus][row]["id"]]) === elementValue),
      );
    }
  });

  if (moviments.length <= 0) {
    alert("Não há movimentos para os filtros informados!");
  } else {
    div.appendChild(element_table1(moviments, preferences));
  }
}

async function searchMovimentsStock(div, preferences) {
  div.innerHTML = "";

  const data = {
    chapa: {
      espessura: {
        descricao: "Espessura:",
        id: "espessura",
        type: "int",
      },
      largura: {
        descricao: "Largura:",
        id: "largura",
        type: "int",
      },
      comprimento: {
        descricao: "Comprimento:",
        id: "comprimento",
        type: "int",
      },
      qualidade: {
        descricao: "Qualidade do material:",
        id: "qualidade",
        type: "string",
      },
      movimento: {
        descricao: "Número do movimento:",
        id: "seq_movimento",
        type: "int",
      },
      data: {
        descricao: "Informe a data do movimento:",
        id: "data",
        type: "date",
      },
    },
  };

  const dataHeaders = Object.keys(data["chapa"]);
  dataHeaders.forEach((item) => {
    const label = element_Label1(data["chapa"][item]["descricao"], preferences);
    const input = document.createElement("input");
    input.id = data["chapa"][item]["id"];
    input.style.padding = preferences.dimensions.smallDivPadding;
    if (data["chapa"][item]["type"] === "int") {
      input.inputMode = "decimal";
      input.type = "text";
      input.addEventListener("input", () => {
        input.value = input.value
          .replace(/[^0-9.,]/g, "")
          .replace(/(\..*)\./g, "$1")
          .replace(/(,.*),/g, "$1");
      });
    } else if (data["chapa"][item]["type"] === "date") {
      input.type = "date";
    }

    const row = element_Div1("", preferences);
    row.appendChild(label);
    row.appendChild(input);

    div.appendChild(row);
  });

  const divTable = element_Div1("", preferences);
  divTable.style.height = preferences.dimensions.mediumHeightToDiv;
  divTable.style.overflow = "auto";

  const searchButton = element_Button1("Procurar", preferences, showMoviments, [
    data,
    divTable,
    preferences,
  ]);

  const buttonsRow = element_Div1("", preferences);
  buttonsRow.appendChild(searchButton);

  div.appendChild(buttonsRow);
  div.appendChild(divTable);
}

async function makeBOMTemplate(element, preferences) {
  let data = await element_InputFile1();

  let resume = [];
  let parts = [];

  const table = document.createElement("table");
  table.id = "template";
  table.style.maxWidth = "100%";
  table.style.overflowX = "auto";
  table.style.boxSizing = "border-box";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");

  const titleRow = element_Div1("", preferences);
  titleRow.style.padding = preferences.dimensions.grandDivPadding;
  const titleLabel = element_Label1(
    "Estrutura do material informado:",
    preferences,
  );

  const copyExcelButton = element_Button1(
    "Copiar",
    preferences,
    copyTableToClipboard,
    [table],
  );
  copyExcelButton.style.width = preferences.dimensions.smallWidthToDiv;

  const downloadTable = element_Button1(
    "Baixar",
    preferences,
    exportTableToXLSX,
    ["template", "layout.xlsx", [0, 2], [4, 13, 15, 16, 17, 18, 19, 20]],
  );
  downloadTable.style.width = "150px";
  copyExcelButton.style.width = preferences.dimensions.smallWidthToDiv;

  titleRow.appendChild(titleLabel);
  titleRow.appendChild(copyExcelButton);
  titleRow.appendChild(downloadTable);

  element.appendChild(titleRow);

  const response = await fetch("/api/get/get_mp");
  const responseJson = await response.json();
  const mp = responseJson.props.resultRows;

  const headers = [
    "POSIÇÃO PAI",
    "ITEM PAI",
    "POSIÇÃO COMP.",
    "DESCRIÇÃO DO COMPONENTE",
    "QTD COMPONENTE",
    "PROCESSO 1",
    "PROCESSO 2",
    "PROCESSO 3",
    "PROCESSO 4",
    "PROCESSO 5",
    "PROCESSO 6",
    "MATERIAL DO COMPONENTE",
    "CODIGO DO MATERIAL",
    "QTD DO MATERIAL",
    "GEOMETRIA",
    "DE",
    "DI",
    "SEX",
    "C",
    "L",
    "A",
    "VERSAO",
  ];

  headers.forEach((item) => {
    const th = document.createElement("th");
    th.style.border = "2px solid white";
    th.style.padding = "2px";
    th.style.whiteSpace = "normal";
    th.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    th.style.color = stylesColor.fontsColor.white;
    th.textContent = item;
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  let currentlevel = 1;
  const levels = [];

  const fatherCode = document.getElementById("fatherCodeInput").value;
  const fatherDescription = document.getElementById(
    "fatherDescriptionInput",
  ).value;

  levels.push({
    level: 0,
    code: fatherCode,
    description: fatherDescription,
    amount: 1,
  });

  const ignoreResponse = await fetch("/api/get/get_ignore_kit");
  const ignoreJSON = await ignoreResponse.json();
  const ignoreKit = ignoreJSON.props.resultRows;

  const filteredData = data.filter((line) => {
    let code = line["Nome do Arquivo"];
    console.log(code)
    code = code.replace(/\./g, "");
    code = code.replace("par", "");
    code = code.replace("psm", "");
    code = code.replace("asm", "");

    if (/^-?\d+$/.test(code)) {
      line["Nome do Arquivo"] = code;
      let status;
      ignoreKit.forEach((kit) => {
        if (line["Kit"] === kit["kit"] || line["Corte"] === "Terceiros") {
          return (status = false);
        } else {
          return (status = true);
        }
      });
      return status;
    } else {
      return false;
    }
  });

  data = filteredData;

  data.forEach((line) => {
    if (line["Espessura do Material"] !== "") {
      let espessura = line["Espessura do Material"];
      espessura = espessura.replace(" mm", "");
      line["Espessura do Material"] = espessura;
    }
  });

  let pos = 0;

  let cont = 0;

  const responseProcess = await fetch("/api/get/get_process");
  const jsonProcess = await responseProcess.json();
  const process = jsonProcess.props.resultRows;

  const theadProcessKeys = [
    "Material",
    "Nr. Passo",
    "Grupo ou Posto",
    "Nr. Grupo ou Posto",
    "Tempo Necessário",
    "Tercerizado",
    "U.M. Serviço",
    "Quantidade Terc.",
    "Fornecedor",
    "Tipo Serviço",
    "Dias Execução",
    "Espec. Técnicas",
  ];

  const processData = [];

  data.forEach((row, index) => {
    const trB = document.createElement("tr");
    const trBMP = document.createElement("tr");

    let rowColor = stylesColor.lightBkgColor.blue0;
    let rowFontColor = stylesColor.fontsColor.black;

    if (cont % 2 !== 0) {
      rowColor = stylesColor.darkBkgColor.blue0;
      rowFontColor = stylesColor.fontsColor.white;
    }

    let step = 10;
    process.forEach((pc) => {
      const rowKit = row["Kit"];
      if (pc["kit"] === rowKit || pc["kit"] === row["Corte"]) {
        let arrayLine = {};
        theadProcessKeys.forEach((hd) => {
          if (hd === "Material") {
            arrayLine[hd] = row["Nome do Arquivo"];
          } else if (hd === "Nr. Passo") {
            arrayLine[hd] = step;
            step = step + 10;
          } else if (hd === "Grupo ou Posto") {
            arrayLine[hd] = "P";
          } else if (hd === "Nr. Grupo ou Posto") {
            arrayLine[hd] = pc["codigo"];
          } else if (hd === "Tempo Necessário") {
            arrayLine[hd] = pc["valor_padrao"].toString().replace(".", ",");
          } else if (hd === "Tercerizado") {
            arrayLine[hd] = 0;
          } else if (hd === "U.M. Serviço") {
            arrayLine[hd] = "H";
          } else if (hd === "Fornecedor") {
            arrayLine[hd] = 2;
          } else {
            arrayLine[hd] = "";
          }
        });
        processData.push(arrayLine);
      }
      if (pc["kit"] === row["Dobra"]) {
        let arrayLine = {};
        theadProcessKeys.forEach((hd) => {
          if (hd === "Material") {
            arrayLine[hd] = row["Nome do Arquivo"];
          } else if (hd === "Nr. Passo") {
            arrayLine[hd] = step;
            step = step + 10;
          } else if (hd === "Grupo ou Posto") {
            arrayLine[hd] = "P";
          } else if (hd === "Nr. Grupo ou Posto") {
            arrayLine[hd] = pc["codigo"];
          } else if (hd === "Tempo Necessário") {
            arrayLine[hd] = pc["valor_padrao"].toString().replace(".", ",");
          } else if (hd === "Tercerizado") {
            arrayLine[hd] = 0;
          } else if (hd === "U.M. Serviço") {
            arrayLine[hd] = "H";
          } else if (hd === "Fornecedor") {
            arrayLine[hd] = 2;
          } else {
            arrayLine[hd] = "";
          }
        });
        processData.push(arrayLine);
      }
    });

    headers.forEach((item) => {
      const td = document.createElement("td");
      td.style.border = "2px solid white";
      td.style.textAlign = "center";
      td.style.color = rowFontColor;
      td.style.backgroundColor = rowColor;
      td.textContent = row[item];
      if (item === "POSIÇÃO PAI") {
        td.textContent = levels[pos].code;
      } else if (item === "ITEM PAI") {
        td.textContent = levels[pos].description;
      } else if (item === "DESCRIÇÃO DO COMPONENTE") {
        td.textContent = row.Projeto;
      } else if (item === "POSIÇÃO COMP.") {
        td.textContent = row["Nome do Arquivo"];
      } else if (item === "QTD COMPONENTE") {
        td.textContent = row["Quantity"];
      } else if (
        item === "QTD DO MATERIAL" ||
        item === "DE" ||
        item === "DI" ||
        item === "SEX" ||
        item === "C" ||
        item === "L" ||
        item === "A"
      ) {
        td.textContent = 0;
      } else {
        td.textContent = "";
      }
      trB.appendChild(td);
    });
    if (row.Corte !== "" && row.Corte !== "Terceiros") {
      resume.push({
        codigo: row["Nome do Arquivo"],
        descricao: row.Projeto,
        quantidade: parseFloat(row.Quantity) * parseFloat(levels[pos].amount),
        corte: row.Corte,
        dobra: row.Dobra,
        espessura: row["Espessura do Material"],
        kit: row.Kit,
      });
    }

    if (data[index + 1]) {
      if (data[index + 1].Level > row.Level) {
        let position = levels.findIndex((lv) => lv.level === row.Level);
        if (position !== -1) {
          levels[position].level = row.Level;
          levels[position].code = row["Nome do Arquivo"];
          levels[position].description = row.Projeto;
          levels[position].amount =
            row["Quantity"] * levels[position - 1].amount;
          currentlevel = row.level;
          pos = position;
        } else {
          let descricao = row["Nome do Arquivo"];
          levels.push({
            level: row.Level,
            code: descricao,
            description: row.Projeto,
            amount: row.Quantity * levels[pos].amount,
          });
          currentlevel = row.Level;
          pos = levels.findIndex((lv) => lv.level === row.Level);
        }
      }
      if (data[index + 1].Level < row.Level) {
        let testPos = 1;
        levels.map((line, index) => {
          let position = levels.findIndex(
            (lv) =>
              lv.level === data[index + 1].Level - testPos &&
              data[index + 1].Level !== row.Level,
          );
          if (position !== -1) {
            pos = position;
            return;
          } else {
            testPos = testPos - 1;
          }
        });
      }
    }
    cont = cont + 1;
    tbody.appendChild(trB);

    let partAlreadyAdded = parts.find((p) => p === row["Nome do Arquivo"]);

    if (row["Espessura do Material"] && row["Espessura do Material"] !== "") {
      parts.push(row["Nome do Arquivo"]);
      let espessura = row["Espessura do Material"].replace(" mm", "");
      const mpItem = mp.filter(
        (mp) => mp.espessura === espessura && mp.qualidade === row["Material"],
      );

      let codigoMP =
        mpItem[0] && mpItem[0].codigo
          ? mpItem[0].codigo
          : "Adicionar chapa em configurações";
      let descMP =
        mpItem[0] && mpItem[0].descricao
          ? mpItem[0].descricao
          : "Adicionar chapa em configurações";

      if (cont % 2 !== 0) {
        rowColor = stylesColor.darkBkgColor.blue0;
        rowFontColor = stylesColor.fontsColor.white;
      } else {
        rowColor = stylesColor.lightBkgColor.blue0;
        rowFontColor = stylesColor.fontsColor.black;
      }

      headers.forEach((item) => {
        const td = document.createElement("td");
        td.style.border = "2px solid white";
        td.style.textAlign = "center";
        td.style.color = rowFontColor;
        td.style.backgroundColor = rowColor;
        td.textContent = row[item];
        if (item === "POSIÇÃO PAI") {
          td.textContent = row["Nome do Arquivo"];
        } else if (item === "ITEM PAI") {
          td.textContent = row.Projeto;
        } else if (item === "MATERIAL DO COMPONENTE") {
          td.textContent = descMP;
        } else if (item === "CODIGO DO MATERIAL") {
          td.textContent = codigoMP;
        } else if (item === "QTD DO MATERIAL") {
          td.textContent = row["Massa (Item)"].replace(" kg", "");
        } else if (
          item === "QTD COMPONENTE" ||
          item === "DE" ||
          item === "DI" ||
          item === "SEX" ||
          item === "C" ||
          item === "L" ||
          item === "A"
        ) {
          td.textContent = 0;
        } else {
          td.textContent = "";
        }
        trBMP.appendChild(td);
      });
      cont = cont + 1;
      tbody.appendChild(trBMP);
    }
  });

  table.appendChild(tbody);

  const checkException = document.getElementById("exception");
  if (checkException.checked === true) {
    const response = await fetch("/api/get/get_exceptions");
    const responseJSON = await response.json();
    const exception = responseJSON.props.resultRows;

    const rows = Array.from(tbody.children);

    rows.forEach((row) => {
      const cellF = row.cells?.[0];
      const cellI = row.cells?.[2];
      const cellC = row.cells?.[12];

      const fatherCode = cellF?.textContent.trim();
      const childCode = cellC?.textContent.trim();
      const interCode = cellI?.textContent.trim();

      const achou = exception.some(
        (item) =>
          (fatherCode && fatherCode == item.codigo) ||
          (childCode && childCode == item.codigo) ||
          (interCode && interCode == item.codigo),
      );

      if (achou) {
        row.remove();
      }
    });

    const updatedRows = Array.from(tbody.children);

    updatedRows.forEach((row, index) => {
      let rowChilds = Array.from(row.children);

      rowChilds.forEach((child) => {
        if (index % 2 === 0) {
          child.style.backgroundColor = stylesColor.darkBkgColor.blue0;
          child.style.color = stylesColor.fontsColor.white;
        } else {
          child.style.backgroundColor = stylesColor.lightBkgColor.blue0;
          child.style.color = stylesColor.fontsColor.black;
        }
      });
    });
  } else {
    checkException.checked;
  }

  const templateDiv = element_Div1("", preferences);
  templateDiv.style.maxWidth = preferences.dimensions.maxTableWidth;
  templateDiv.style.boxSizing = "border-box";
  templateDiv.style.overflow = "auto";
  templateDiv.style.height = preferences.dimensions.grandHeightToDiv;
  templateDiv.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.black,
  );

  templateDiv.style.padding = preferences.dimensions.smallDivPadding;
  templateDiv.style.marginRight = preferences.dimensions.defaultDivMargin;
  templateDiv.appendChild(table);

  element.appendChild(templateDiv);

  const plasmaDiv = element_Div1("", preferences);
  plasmaDiv.style.height = preferences.dimensions.mediumHeightToDiv;
  plasmaDiv.style.overflowY = "auto";

  const cutListCheck = document.getElementById("cutList").checked;
  if (cutListCheck) {
    const plasmaList = await plasmaTemplate(resume);
    const plasmaLabel = element_Label1(
      "Lista de peças para plasma:",
      preferences,
    );
    const plasmaLabelDiv = element_Div1("", preferences);
    plasmaLabelDiv.appendChild(plasmaLabel);
    plasmaDiv.appendChild(plasmaLabelDiv);
    plasmaDiv.appendChild(plasmaList);
    element.appendChild(plasmaDiv);
    exportTableToXLSX("plasmaList", "Lista - Plasma.xlsx", [], []);
  }

  const checkListCheck = document.getElementById("checkList").checked;
  if (checkListCheck) {
    await generateChecklistWithImage(resume, "/images/logo/CheckListLogo.png");
  }

  const filterProcessData = Array.from(
    new Map(processData.map((obj) => [JSON.stringify(obj), obj])).values(),
  );

  const processTable = element_table1(filterProcessData, preferences);
  processTable.id = "process_table";

  const processTitle = element_Div1("", preferences);

  const processLabel = element_Label1(
    "Copiar tabela de processos",
    preferences,
  );
  const copyProcessTable = element_Button1(
    "Copiar",
    preferences,
    copyTableToClipboard,
    [processTable],
  );

  const downloadProcessTable = element_Button1(
    "Baixar",
    preferences,
    exportTableToXLSX,
    ["process_table", "process.xlsx", [0], [1, 3, 4, 5, 8]],
  );
  downloadTable.style.width = "150px";

  processTitle.appendChild(processLabel);
  processTitle.appendChild(copyProcessTable);
  processTitle.appendChild(downloadProcessTable);

  const processDiv = element_Div1("", preferences);
  processDiv.style.height = preferences.dimensions.mediumHeightToDiv;
  processDiv.style.overflowY = "auto";

  processDiv.appendChild(processTable);
  element.appendChild(processTitle);
  element.appendChild(processDiv);
}

async function addExceptionCode(code, description, observation, preferences) {
  let codeValue = code.value;
  if (codeValue === "") {
    alert("Informe um código valido!");
    code.style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.red,
    );
    return;
  } else if (codeValue.length === 8) {
    codeValue = "0" + codeValue;
  }
  const descriptionValue = description.value;
  if (descriptionValue === "") {
    alert("Informe a descrição do material");
    description.style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.red,
    );
    return;
  }
  const observationValue = observation.value;

  const data = {
    codigo: codeValue,
    descricao: descriptionValue,
    observacao: observationValue,
  };

  await fetch("/api/add_exception_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
      if (result.success === true) {
        alert("Movimento adicionado com sucesso!");
      } else {
        alert(
          "Movimento não realizado. Verifique se o material já não foi cadastrado.",
        );
      }
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });

  location.reload();
}

async function removeExceptionCode(codeElement) {
  const code = codeElement.value;
  await fetch(`/api/drop_exception_code?code=${code}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
      if (result.success === true) {
        alert("Material removido com sucesso!");
      } else {
        alert(
          "Movimento não realizado. Verifique se o material está cadastrado.",
        );
      }
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });

  location.reload();
}

async function generateChecklistWithImage(data, imageUrl) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Checklist");

  // Define larguras de colunas
  worksheet.columns = [
    { width: 12 }, // CÓDIGO
    { width: 15 }, // CORTE
    { width: 40 }, // DESCRIÇÃO
    { width: 10 }, // DOBRA
    { width: 12 }, // ESPESSURA
    { width: 25 }, // KIT
    { width: 20 }, // QUANTIDADE
  ];

  // Adiciona a imagem no canto superior esquerdo
  const imageBlob = await fetch(imageUrl).then((res) => res.blob());
  const buffer = await imageBlob.arrayBuffer();

  const imageId = workbook.addImage({
    buffer: buffer,
    extension: "png", // ou "jpeg"
  });

  worksheet.addImage(imageId, {
    tl: { col: 6, row: 0 }, // top-left
    ext: { width: 100, height: 100 }, // tamanho da imagem
  });

  // Cabeçalho
  worksheet.mergeCells("B3", "F3");
  worksheet.getCell("B3").value = "Separação de Materiais";
  worksheet.getCell("B3").font = { size: 14, bold: true };

  worksheet.getCell("A5").value = "NS";
  worksheet.getCell("B5").value = "";

  worksheet.getCell("D5").value = "Cliente:";
  worksheet.getCell("E5").value = "";

  // Cabeçalho da tabela
  const tableHeader = [
    "CÓDIGO",
    "CORTE",
    "DESCRIÇÃO",
    "DOBRA",
    "ESPESSURA",
    "KIT",
    "QUANTIDADE",
  ];
  worksheet.addRow([]);
  worksheet.addRow(tableHeader).font = { bold: true };

  // Dados da matriz
  data.forEach((obj) => {
    worksheet.addRow([
      obj.codigo ?? "",
      obj.corte ?? "",
      obj.descricao ?? "",
      obj.dobra ?? "",
      obj.espessura ?? "",
      obj.kit ?? "",
      obj.quantidade?.toString() ?? "",
    ]);
  });

  // Força todas as colunas como texto
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.numFmt = "@"; // Formato texto
    });
  });

  const blob = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([blob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "CheckList.xlsx",
  );
}

async function changeProductOption(
  preferences,
  id,
  table,
  element,
  question,
  characteristics,
  sigla,
) {
  const transparentBox = document.createElement("div");
  transparentBox.id = "transparentBox";

  Object.assign(transparentBox.style, {
    zIndex: "9999",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(2px)",
  });

  const response = await fetch(`/api/get_product_question?table=${table}`);
  const responseJSON = await response.json();
  const options = responseJSON.props.resultRows;

  const questionLabel = element_Label1(question, preferences);
  questionLabel.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  questionLabel.style.padding = preferences.dimensions.smallDivPadding;
  questionLabel.style.width = "100%";

  const cancelButton = element_Button1("CANCELAR", preferences, closeWindow, [
    element,
  ]);

  const line1 = element_Div1("flex", preferences);
  line1.appendChild(questionLabel);
  line1.appendChild(cancelButton);

  const backgroundDiv = element_Div1("", preferences);
  backgroundDiv.style.height = preferences.dimensions.grandHeightToDiv;
  backgroundDiv.style.width = preferences.dimensions.grandWidthToDiv;
  backgroundDiv.style.overflowY = "auto";

  const line2 = element_Div1("grid", preferences);
  line2.style.padding = preferences.dimensions.smallDivPadding;
  line2.style.gap = preferences.dimensions.defaultDivMargin;

  backgroundDiv.appendChild(line1);
  backgroundDiv.appendChild(line2);

  changeOptionFilter(
    characteristics,
    options,
    sigla,
    preferences,
    line2,
    id,
    element,
  );

  transparentBox.appendChild(backgroundDiv);
  element.appendChild(transparentBox);
}

async function changeOptionFilter(
  chooses,
  options,
  sigla,
  preferences,
  element,
  elementID,
  windowTp,
) {
  let filter = options;
  const headers = Object.keys(filter[0]);
  const len = headers.filter((h) => !["id", "descricao"].includes(h)).length;

  filter = filter.filter((op, index) => {
    let countCheck = 0;
    if (len === 0) {
      return true;
    } else if (op.sigla === sigla || op.sigla === "") {
      countCheck = countCheck + 1;
      if (countCheck === len) {
        return true;
      } else {
        for (const hd of headers) {
          if (hd !== "id" && hd !== "sigla" && hd !== "descricao") {
            let chooseSelect = chooses.filter((chs) => chs.variavel === hd);
            let chooseSelectElement;
            if (chooseSelect[0] && chooseSelect[0].variavel) {
              chooseSelectElement = document.getElementById(
                chooseSelect[0].variavel,
              ).textContent;
            } else {
              chooseSelectElement = "";
            }
            if (op[hd] === chooseSelectElement || op[hd] === "") {
              countCheck = countCheck + 1;
            }
          }
        }
        if (countCheck === len) {
          return true;
        }
      }
    }
  });

  function applyNewChoose(element, descricao, windowTp, mesh) {
    windowTp.innerHTML = "";
    element.textContent = descricao;

    for (const ms of mesh) {
      const id = ms.variavel_retorno;
      const element = document.getElementById(id);
      if (element !== null) {
        element.textContent = "";
      }
    }
  }

  const responseSaida = await fetch(
    `/api/get_questions_mesh?variavel_saida=${elementID}`,
  );
  const saidaJSON = await responseSaida.json();
  const mesh = saidaJSON.props.resultRows;

  filter.forEach((item) => {
    const affected = document.getElementById(elementID);
    const button = element_Button1(
      item.descricao,
      preferences,
      applyNewChoose,
      [affected, item.descricao, windowTp, mesh],
    );
    button.style.padding = preferences.dimensions.maxLinesPadding;
    button.style.width = "100%";
    element.appendChild(button);
  });

}

async function organizeProductData(preferences, id, contentBox) {
  const response = await fetch(`/api/get_budget_configuration?id=${id}`);
  const responseJSON = await response.json();
  const characteristics = responseJSON.props.resultRows;

  const chooseTable = document.createElement("table");
  const cTHead = document.createElement("thead");
  const cTBody = document.createElement("tbody");

  chooseTable.appendChild(cTHead);
  chooseTable.appendChild(cTBody);

  const trHead = document.createElement("tr");
  const thDescricao = document.createElement("th");
  thDescricao.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  thDescricao.style.color = stylesColor.fontsColor.white;
  thDescricao.style.padding = preferences.dimensions.mediumLinesPadding;
  thDescricao.style.border = concatBorder(
    preferences.dimensions.minimumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  thDescricao.textContent = "Opção";

  const thValor = document.createElement("th");
  thValor.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  thValor.style.color = stylesColor.fontsColor.white;
  thValor.style.padding = preferences.dimensions.mediumLinesPadding;
  thValor.style.border = concatBorder(
    preferences.dimensions.minimumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  thValor.textContent = "Escolha";

  const thButton = document.createElement("th");
  thButton.style.backgroundColor = stylesColor.darkBkgColor.blue0;
  thButton.style.color = stylesColor.fontsColor.white;
  thButton.style.padding = preferences.dimensions.mediumLinesPadding;
  thButton.style.border = concatBorder(
    preferences.dimensions.minimumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  thButton.textContent = "";

  trHead.appendChild(thDescricao);
  trHead.appendChild(thValor);
  trHead.appendChild(thButton);
  cTHead.appendChild(trHead);

  characteristics
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((row, index) => {
      const trBody = document.createElement("tr");

      const tdDescricao = document.createElement("td");
      tdDescricao.style.padding = preferences.dimensions.mediumLinesPadding;
      tdDescricao.style.border = concatBorder(
        preferences.dimensions.minimumBorderHeight,
        "solid",
        stylesColor.borderColor.white,
      );
      tdDescricao.textContent = row.descricao;

      const tdValor = document.createElement("td");
      tdValor.style.padding = preferences.dimensions.mediumLinesPadding;
      tdValor.style.border = concatBorder(
        preferences.dimensions.minimumBorderHeight,
        "solid",
        stylesColor.borderColor.white,
      );
      tdValor.textContent = row.valor;
      tdValor.id = row.variavel;
      tdValor.class = row.tabela;

      const tdButton = document.createElement("td");
      tdButton.style.padding = preferences.dimensions.mediumLinesPadding;
      tdButton.style.border = concatBorder(
        preferences.dimensions.minimumBorderHeight,
        "solid",
        stylesColor.borderColor.white,
      );

      const changeWindow = document.createElement("div");
      contentBox.appendChild(changeWindow);

      const changeButton = element_Button1(
        "Alterar",
        preferences,
        changeProductOption,
        [
          preferences,
          tdValor.id,
          tdValor.class,
          changeWindow,
          row.descricao,
          characteristics,
          row.sigla,
        ],
      );
      changeButton.style.cursor = "pointer";
      changeButton.style.width = "100%";
      tdButton.appendChild(changeButton);

      if (index % 2 === 0) {
        tdDescricao.style.backgroundColor = stylesColor.lightBkgColor.blue0;
        tdDescricao.style.color = stylesColor.fontsColor.black;

        tdValor.style.backgroundColor = stylesColor.lightBkgColor.blue0;
        tdValor.style.color = stylesColor.fontsColor.black;

        tdButton.style.backgroundColor = stylesColor.lightBkgColor.blue0;
      } else {
        tdDescricao.style.backgroundColor = stylesColor.darkBkgColor.blue1;
        tdDescricao.style.color = stylesColor.fontsColor.white;

        tdValor.style.backgroundColor = stylesColor.darkBkgColor.blue1;
        tdValor.style.color = stylesColor.fontsColor.white;

        tdButton.style.backgroundColor = stylesColor.darkBkgColor.blue1;
      }

      trBody.appendChild(tdDescricao);
      trBody.appendChild(tdValor);
      trBody.appendChild(tdButton);

      cTBody.appendChild(trBody);
    });

  const chooseDiv = element_Div1("", preferences);
  chooseDiv.style.height = preferences.dimensions.mediumHeightToDiv;
  chooseDiv.style.overflowX = "auto";

  const chooseTitle = element_Label1(
    "Caracteristicas do Produto:",
    preferences,
  );
  const chooseTitleDiv = element_Div1("", preferences);

  const observationDivLabel = element_Div1("", preferences);
  const observationLabel = element_Label1(
    "Observações do Produto:",
    preferences,
  );
  observationDivLabel.appendChild(observationLabel);

  const observationDiv = element_Div1("", preferences);
  const textBox = document.createElement("textarea");
  textBox.style.width = "100%";
  textBox.style.height = preferences.dimensions.smallTextAreaHeight;
  (textBox.style.resize = "none"), (textBox.id = "obs_caract");
  observationDiv.appendChild(textBox);

  chooseTitleDiv.appendChild(chooseTitle);
  contentBox.appendChild(chooseTitleDiv);
  chooseDiv.appendChild(chooseTable);
  contentBox.appendChild(chooseDiv);
  contentBox.appendChild(observationDivLabel);
  contentBox.appendChild(observationDiv);

  return characteristics;
}

async function organizeClientData(id, mainElement, preferences) {
  const response = await fetch(`/api/get_client_data?id=${id}`);
  const responseJSON = await response.json();
  const clientData = responseJSON.props.resultRows;

  const responseSeq = await fetch(`/api/get_input_list_client_data`);
  const responseSeqJSON = await responseSeq.json();
  const clientSeqQuestions = responseSeqJSON.props.resultRows;

  console.log(clientData)
  const sigla = {
    id: clientData[0]["id"],
    obrigatorio: "Não",
    pergunta: "Sigla",
    sequencia: 99,
    variavel: "sigla"
  };

  clientSeqQuestions.push(sigla)

  const divLabel = element_Div1("", preferences);
  const label = element_Label1("Informações do cliente:", preferences);

  const clientDiv = element_Div1("", preferences);

  clientSeqQuestions
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((rw) => {
      const div = element_Div1("flex", preferences);

      const question = element_Label1(rw.pergunta, preferences);

      const value = element_Input1(rw.variavel);
      value.value = clientData[0][rw.variavel] || "";

      div.appendChild(question);
      div.appendChild(value);
      clientDiv.appendChild(div);
    });

  divLabel.appendChild(label);

  const observationDivLabel = element_Div1("", preferences);
  const observationLabel = element_Label1(
    "Observações do cliente:",
    preferences,
  );
  observationDivLabel.appendChild(observationLabel);

  const observationDiv = element_Div1("", preferences);
  const textBox = document.createElement("textarea");
  textBox.style.width = "100%";
  textBox.style.height = preferences.dimensions.smallTextAreaHeight;
  (textBox.style.resize = "none"), (textBox.id = "obs_cliente");
  observationDiv.appendChild(textBox);

  mainElement.appendChild(divLabel);
  mainElement.appendChild(clientDiv);
  mainElement.appendChild(observationDivLabel);
  mainElement.appendChild(observationDiv);

  console.log(clientSeqQuestions)

  return clientSeqQuestions;
}

async function organizePaymentClientData(id, mainElement, preferences) {
  const responsePay = await fetch(`/api/get_payment_data?id=${id}`);
  const payJSON = await responsePay.json();
  const payData = payJSON.props.resultRows;

  const payDivTitle = element_Div1("", preferences);
  const payTitle = element_Label1("Informações do financeiro:", preferences);
  payDivTitle.appendChild(payTitle);

  const payDiv = element_Div1("", preferences);

  payData
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((py) => {
      const div = element_Div1("flex", preferences);

      const question = element_Label1(py.descricao, preferences);

      const value = element_Input1(py.variavel);
      value.value = py.valor;
      setInputType(value, py);

      div.appendChild(question);
      div.appendChild(value);

      payDiv.appendChild(div);
    });

  const observationDivLabel = element_Div1("", preferences);
  const observationLabel = element_Label1(
    "Observações do financeiro:",
    preferences,
  );
  observationDivLabel.appendChild(observationLabel);

  const observationDiv = element_Div1("", preferences);
  const textBox = document.createElement("textarea");
  textBox.style.width = "100%";
  textBox.style.height = preferences.dimensions.smallTextAreaHeight;
  (textBox.style.resize = "none"), (textBox.id = "obs_cond_pag");
  observationDiv.appendChild(textBox);

  mainElement.appendChild(payDivTitle);
  mainElement.appendChild(payDiv);
  mainElement.appendChild(observationDivLabel);
  mainElement.appendChild(observationDiv);

  return payData;
}

async function organizeProductDimensions(id, mainElement, preferences) {
  const responseSize = await fetch(`/api/get_product_dimensions?id=${id}`);
  const sizeJSON = await responseSize.json();
  const sizeData = sizeJSON.props.resultRows;

  console.log(sizeData)

  const sizeDivTitle = element_Div1("", preferences);
  const sizeTitle = element_Label1("Dimensões do produto:", preferences);
  sizeDivTitle.appendChild(sizeTitle);

  const sizeDiv = element_Div1("", preferences);

  sizeData
    .sort((a, b) => a.sequencia - b.sequencia)
    .map((sz) => {
      const div = element_Div1("flex", preferences);

      const question = element_Label1(sz.descricao, preferences);

      const value = element_Input1(sz.variavel);
      value.value = sz.valor;
      setInputType(value, sz);

      div.appendChild(question);
      div.appendChild(value);

      sizeDiv.appendChild(div);
    });

  mainElement.appendChild(sizeDivTitle);
  mainElement.appendChild(sizeDiv);

  return sizeData;
}

async function checkPaymentsInfo(data, preferences, id, fn) {
  let validValue = true;
  let updateValue = [];

  for (const dt of data) {
    const input = document.getElementById(dt.variavel);
    const inputValue = document.getElementById(dt.variavel).value;

    if (dt.obrigatorio === "Sim" && inputValue === "") {
      input.style.border = concatBorder(
        preferences.dimensions.mediumBorderHeight,
        "solid",
        stylesColor.borderColor.red,
      );
      if (validValue) {
        alert("Preencha todos os campos obrigatórios!");
        validValue = false;
      }
    } else {
      updateValue.push({
        id: id,
        descricao: dt.pergunta,
        variavel: dt.variavel,
        valor: inputValue,
      });
    }
  }

  if (validValue) {
    await fetch("/api/add_payment_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateValue),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Inserção bem-sucedida:", result);
        fn();
      })
      .catch((error) => {
        console.error("Erro ao inserir dados:", error);
      });
  }
}

async function saveBudget(id, preferences) {
  const ctResponse = await fetch(`/api/get_client_data?id=${id}`);
  const ctJSON = await ctResponse.json();
  const clientData = ctJSON.props.resultRows;

  const ctInputListResponse = await fetch("/api/get_input_list_client_data");
  const ctInputListJSON = await ctInputListResponse.json();
  const ctInputList = ctInputListJSON.props.resultRows;

  const pyResponse = await fetch(`/api/get_payment_data?id=${id}`);
  const pyJSON = await pyResponse.json();
  const paymentData = pyJSON.props.resultRows;

  const szResponse = await fetch(`/api/get_product_dimensions?id=${id}`);
  const szJSON = await szResponse.json();
  const sizeData = szJSON.props.resultRows;

  const cgResponse = await fetch(`/api/get_budget_configuration?id=${id}`);
  const cgJSON = await cgResponse.json();
  const configurationData = cgJSON.props.resultRows;

  const clDataHeaders = Object.keys(clientData[0]);

  let warning = false;
  for (const clHd of clDataHeaders) {
    if (clHd !== "id") {
      const element = document.getElementById(clHd);
      const elementValue = element.value;
      const required = ctInputList.filter((il) => il.variavel === clHd);
      if (required[0].obrigatorio === "Sim" && elementValue === "") {
        if (!warning) {
          alert("Preecha os campos obrigatórios do cliente!");
          element.style.border = concatBorder(
            preferences.dimensions.mediumBorderHeight,
            "Solid",
            stylesColor.borderColor.red,
          );
          warning = true;
        } else {
          element.style.border = concatBorder(
            preferences.dimensions.mediumBorderHeight,
            "Solid",
            stylesColor.borderColor.red,
          );
        }
      } else {
        clientData[0][clHd] = elementValue;
      }
    }
  }

  const obs_cliente = document.getElementById("obs_cliente").value;
  let obs = {id: id, variavel:"obs_cliente", valor: obs_cliente};

  await fetch("/api/add_budget_observation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obs),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });

  const obs_cond_pag = document.getElementById("obs_cond_pag").value;
  obs = {id: id, variavel:"obs_cond_pag", valor: obs_cond_pag};

  await fetch("/api/add_budget_observation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obs),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });

    const obs_caract = document.getElementById("obs_caract").value;
    obs = {id: id, variavel:"obs_caract", valor: obs_caract};
  
    await fetch("/api/add_budget_observation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obs),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Inserção bem-sucedida:", result);
      })
      .catch((error) => {
        console.error("Erro ao inserir dados:", error);
      });

  paymentData.forEach((py, index) => {
    const element = document.getElementById(py.variavel);
    const elementValue = element.value;
    if (py.obrigatorio === "Sim" && elementValue === "") {
      if (!warning) {
        alert("Preecha os campos obrigatórios do financeiro!");
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
        warning = true;
      } else {
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
      }
    } else {
      paymentData[index]["valor"] = elementValue;
    }
  });

  sizeData.forEach((sz, index) => {
    const element = document.getElementById(sz.variavel);
    const elementValue = element.value;
    if (sz.obrigatorio === "Sim" && elementValue === "") {
      if (!warning) {
        alert("Preecha os campos obrigatórios das dimensões!");
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
        warning = true;
      } else {
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
      }
    } else {
      sizeData[index]["valor"] = elementValue;
    }
  });

  configurationData.forEach((cg, index) => {
    const element = document.getElementById(cg.variavel);
    const elementValue = element.textContent;
    if (elementValue === "") {
      if (!warning) {
        alert("Preecha os campos obrigatórios do financeiro!");
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
        warning = true;
      } else {
        element.style.border = concatBorder(
          preferences.dimensions.mediumBorderHeight,
          "Solid",
          stylesColor.borderColor.red,
        );
      }
    } else {
      configurationData[index]["valor"] = elementValue;
    }
  });
  if (!warning) {
    for (const cg of configurationData) {
      await fetch("/api/update_budget_configuration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cg),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Inserção bem-sucedida:", result);
        })
        .catch((error) => {
          console.error("Erro ao inserir dados:", error);
        });
    }
    for (const py of paymentData) {
      await fetch("/api/update_payment_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(py),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Inserção bem-sucedida:", result);
        })
        .catch((error) => {
          console.error("Erro ao inserir dados:", error);
        });
    }
    for (const sz of sizeData) {
      await fetch("/api/update_dimension_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sz),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Inserção bem-sucedida:", result);
        })
        .catch((error) => {
          console.error("Erro ao inserir dados:", error);
        });
    }
    const addData = clientData[0];
    await fetch("/api/update_client_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Inserção bem-sucedida:", result);
        alert("Pedido salvo com sucesso!");
        singinRoute("/saleOrder")
      })
      .catch((error) => {
        console.error("Erro ao inserir dados:", error);
      });
  } else {
    alert("As alteração não foram gravadas, revise os campos do pedido.");
  }
}

async function getData(id, path) {
  if(id === ""){
    const response = await fetch(path);
    const responseJSON = await response.json();
    const result = responseJSON.props.resultRows;
    return result
  }else{
    const select = [path,"?id=",id].join("")
    const response = await fetch(select);
    const responseJSON = await response.json();
    const result = responseJSON.props.resultRows;
    return result
  }
}

//FUNÇÕES EXPORTAVEIS XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

export function makeMenuTopDiv(topTitleText, preferences) {
  if (typeof document !== "undefined") {
    const topDiv = document.createElement("div");
    topDiv.style.display = "flex";
    topDiv.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    topDiv.style.height = preferences.dimensions.maxLinesHeight;
    topDiv.style.justifyContent = "center";
    topDiv.style.alignItems = "center";
    topDiv.style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.gray,
    );

    const topTitle = document.createElement("label");
    topTitle.textContent = topTitleText;
    topTitle.style.fontSize = preferences.dimensions.fontSize;
    topTitle.style.color = stylesColor.fontsColor.white;
    topTitle.style.padding = preferences.dimensions.mediumLinesPadding;

    topDiv.appendChild(topTitle);

    return topDiv;
  }
  return null;
}

export function makeSidebarDiv(preferences) {
  if (typeof document !== "undefined") {
    const sideDiv = document.createElement("div");
    sideDiv.style.display = "flex";
    sideDiv.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    sideDiv.style.minHeight = window.innerHeight + "px";
    sideDiv.style.width = preferences.dimensions.maxCloseSidebarWidth;
    sideDiv.style.minWidth = preferences.dimensions.minCloseSidebarWidth;
    sideDiv.style.justifyContent = "center";
    sideDiv.style.alignItems = "center";

    const sideDivContentBox = document.createElement("div");
    sideDivContentBox.style.backgroundColor = stylesColor.darkBkgColor.blue0;
    sideDivContentBox.style.height = "100%";
    sideDivContentBox.style.width = "100%";
    sideDivContentBox.style.justifyContent = "center";
    sideDivContentBox.style.alignItems = "center";
    sideDivContentBox.style.border = concatBorder(
      preferences.dimensions.mediumBorderHeight,
      "solid",
      stylesColor.borderColor.gray,
    );

    const ulElement = document.createElement("ul");
    ulElement.style.listStyle = "none";

    function handleSidebar(element) {
      if (sideDiv.style.width <= preferences.dimensions.maxCloseSidebarWidth) {
        let widthPX = parseFloat(preferences.dimensions.maxOpenSidebarWidth);
        if (widthPX >= preferences.dimensions.minOpenSidebarWidth) {
          sideDiv.style.width = preferences.dimensions.maxOpenSidebarWidth;
          sideDiv.style.transition = "width 0.5s ease-in-out";
          element.style.transition = "transform 0.5s ease-in-out";
          element.style.transform = "rotate(90deg)";

          setTimeout(() => {
            listOfLinks(list.sidebarOptions, ulElement);
          }, 300);
        } else {
          sideDiv.style.width = preferences.dimensions.minOpenSidebarWidth;
          sideDiv.style.transition = "width 0.5s ease-in-out";
          element.style.transition = "transform 0.5s ease-in-out";
          element.style.transform = "rotate(90deg)";

          setTimeout(() => {
            listOfLinks(list.sidebarOptions, ulElement);
          }, 300);
        }
      } else {
        ulElement.innerHTML = "";
        element.style.transition = "transform 0.5s ease-in-out";
        element.style.transform = "rotate(0deg)";

        sideDiv.style.width = preferences.dimensions.maxCloseSidebarWidth;
        sideDiv.style.minWidth = preferences.dimensions.minCloseSidebarWidth;
        sideDiv.style.transition = "width 0.5s ease-in-out";
      }
    }

    const sidebarMenuIcon = document.createElement("img");
    sidebarMenuIcon.style.margin = preferences.dimensions.sidebarPadding;
    sidebarMenuIcon.style.padding = "3px";
    sidebarMenuIcon.onclick = () => handleSidebar(sidebarMenuIcon);

    sideDivContentBox.appendChild(sidebarMenuIcon);
    sideDivContentBox.appendChild(ulElement);

    sideDiv.appendChild(sideDivContentBox);

    return sideDiv;
  }

  return null;
}

export function makePageTitle(text, preferences) {
  const title = document.createElement("h1");
  title.style.fontSize = preferences.dimensions.titlePageFontSize;
  title.style.color = stylesColor.fontsColor.orange;
  title.style.padding = preferences.dimensions.titlePagePadding;
  title.style.fontWeight = "bold";
  title.style.borderBottom = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  title.style.marginLeft = preferences.dimensions.titlePageMargin;

  title.textContent = text;

  return title;
}

export function makeTextP(text, preferences) {
  const elementP = document.createElement("p");
  elementP.style.color = stylesColor.fontsColor.white;
  elementP.style.whiteSpace = "normal";
  elementP.style.width = preferences.dimensions.homeTextContent;
  elementP.style.padding = preferences.dimensions.paddingHomeTextContent;
  elementP.style.backgroundColor = stylesColor.darkBkgColor.gray0;
  elementP.style.margin = preferences.dimensions.marginHomeTextContent;
  elementP.style.border = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );

  elementP.textContent = text;

  return elementP;
}

export function listOfLinks(data, element) {
  const dataHeaders = Object.keys(data);

  dataHeaders.forEach((row) => {
    const linkItem = document.createElement("p");
    linkItem.onclick = () => (window.location.href = data[row].route);
    linkItem.style.color = stylesColor.fontsColor.white;
    linkItem.style.fontWeight = "bold";
    linkItem.style.transition = "color 0,3 ease";
    linkItem.onmouseenter = (e) =>
      (e.target.style.color = stylesColor.linkColors.orange0);
    linkItem.textContent = data[row].descricao;
    linkItem.onmouseleave = (e) =>
      (e.target.style.color = stylesColor.fontsColor.white);
    linkItem.style.cursor = "pointer";

    const li = document.createElement("li");
    li.appendChild(linkItem);

    element.appendChild(li);
  });
}

export function makeSubTitleDiv(text, preferences) {
  const subTitleDiv = document.createElement("div");
  subTitleDiv.style.margin = preferences.dimensions.subTitlePageMargin;
  subTitleDiv.style.padding = preferences.dimensions.subTitlePadding;

  const subTitleLabel = document.createElement("label");
  subTitleLabel.style.color = stylesColor.fontsColor.white;
  let subTitleLabelBorder = concatBorder(
    preferences.dimensions.mediumBorderHeight,
    "solid",
    stylesColor.borderColor.white,
  );
  subTitleLabel.style.borderLeft = subTitleLabelBorder;
  subTitleLabel.style.borderBottom = subTitleLabelBorder;
  subTitleLabel.style.padding = "5px";

  subTitleLabel.textContent = text;
  subTitleLabel.id = "subTitleId";

  subTitleDiv.appendChild(subTitleLabel);

  return subTitleDiv;
}

export function buttonsToConfigBudgets(element, contentDiv, preferences) {
  const dataHeaders = Object.keys(buttonsList.budgetConfiguration);

  dataHeaders.forEach((row) => {
    const buttonItem = document.createElement("label");
    buttonItem.id = buttonsList["budgetConfiguration"][row].id;
    buttonItem.style.color = stylesColor.fontsColor.white;
    buttonItem.style.fontWeight = "bold";
    buttonItem.style.transition = "color 0,3 ease";
    buttonItem.onmouseenter = (e) =>
      (e.target.style.color = stylesColor.linkColors.orange0);
    buttonItem.textContent = buttonsList["budgetConfiguration"][row].descricao;
    buttonItem.onmouseleave = (e) =>
      (e.target.style.color = stylesColor.fontsColor.white);
    buttonItem.style.cursor = "pointer";

    const li = document.createElement("li");
    li.style.padding = preferences.dimensions.listOfButtonsPadding;
    li.appendChild(buttonItem);

    if (buttonItem.id === "clientInputData") {
      buttonItem.onclick = () => inputListClientData(contentDiv, preferences);
    }
    element.appendChild(li);
  });
}

//FUNÇÕES EXPORTAVEIS ASSINCRONAS XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD

export async function budgetRoadMap(contentElement, preferences) {
  let id;
  function setID(searchId) {
    if (searchId === "") {
      return id;
    } else {
      id = searchId;
      return id;
    }
  }

  listOfInputs(
    budgetInputListClientData,
    contentElement,
    preferences,
    payments,
    setID,
  );

  async function payments(element, preferences, id) {
    const response = await fetch(`/api/get_input_list_payment`);
    const responseJSON = await response.json();
    const pay = responseJSON.props.resultRows;

    element.innerHTML = "";

    const titleElement = document.getElementById("subTitleId");
    titleElement.textContent = "Adicione as informações do fianceiro:";

    const payOrder = pay.sort((a, b) => a.sequencia - b.sequencia);
    const ltInput = element_ListOfInputs1(payOrder, "pergunta", preferences);

    const advanceButton = element_Button1(
      "Avançar",
      preferences,
      checkPaymentsInfo,
      [payOrder, preferences, id, selectProduct],
    );
    const buttonDiv = element_Div1("", preferences);

    buttonDiv.appendChild(advanceButton);

    element.appendChild(ltInput);
    element.appendChild(buttonDiv);
  }

  async function selectProduct() {
    contentElement.innerHTML = "";

    const idValue = setID("");

    const titleElement = document.getElementById("subTitleId");
    titleElement.textContent = "Selecione o tipo do produto:";

    const responseC = await fetch("/api/get_chassis");
    const responseCJSON = await responseC.json();
    const chassis = responseCJSON.props.resultRows;

    const responseCX = await fetch("/api/get_caixa_carga");
    const responseCXJSON = await responseCX.json();
    const caixaCarga = responseCXJSON.props.resultRows;

    const responseV = await fetch("/api/get_wagon");
    const responseVJSON = await responseV.json();
    const vagao = responseVJSON.props.resultRows;

    select_ListOfOptions1(
      [chassis, caixaCarga, vagao],
      ["chassis", "family", "wagon"],
      contentElement,
      preferences,
      [caixaCarga, vagao, ""],
      idValue,
    );
  }
}

export async function budgetReportScript(contentRef) {
  async function getId() {
    const params = new URLSearchParams(window.location.search);
    let token = params.get("id");
    if (token) {
      token = token.replace(/ /g, "+");
    }

    if (!token) {
      console.warn(
        "ID não encontrado.\nPor gentileza, refaça o pedido.\n Se o problema percistir entre em contato com a infra.",
      );
    }
    try {
      const decryptedId = await decrypt(token);
      return decryptedId;
    }catch (err) {
      console.error("Erro ao descriptografar o token:", err);
      return null;
    }
  }

  const id = await getId();

  const clientData = await getData(id, "/api/get_client_data");
  const ctHeaders = Object.keys(clientData[0]);
  for (const ct of ctHeaders){
    const element = document.getElementById(ct);
    if(ct !== "id" && element !== null){
      element.textContent = clientData[0][ct];
    }
  }

  const configData = await getData(id, "/api/get_budget_configuration");
  configData.map((row)=>{
    const element = document.getElementById(row.variavel);
    if(element !== null){
      element.textContent = row.valor;
    }else{
      console.log(row.variavel)
    }
  });

  const paymentData = await getData(id, "/api/get_payment_data");
  await paymentData.map((row)=>{
    const element = document.getElementById(row.variavel);
    if(element !== null){
      element.textContent = row.valor;
    }else{
      console.log(row.variavel)
    }
  });

  const handleCapture = async (contentRef) => {
      if (!contentRef.current) return;
  
      try {
        const canvas = await html2canvas(contentRef.current, {scale: 3});
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("relatorio.pdf");
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
      }
    };

  handleCapture(contentRef);
}

async function GerarRelatorio(clientData, paymentData, productData, sizeData, id){
  let data =  {};
  data["id"] = id;

  for (const cd of clientData){
    const element = document.getElementById(cd.variavel);
    if (element !== null){
      data[cd.variavel] = element.value
      console.log(cd.variavel)
    };
  }
  for (const py of paymentData){
    const element = document.getElementById(py.variavel);
    if(element !== null){
      data[py.variavel] = element.value;
    }
  }
  for (const sz of sizeData){
    const element = document.getElementById(sz.variavel);
    if(element !== null){
      data[sz.variavel] = element.value;
    }
  }
  for (const cg of productData){
    const element = document.getElementById(cg.variavel);
    if(element !== null){
      data[cg.variavel] = element.textContent
    }
  }

  console.log(data)

  await fetch(`/api/template/${data.sigla}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio.pdf';
    link.click();
    URL.revokeObjectURL(url);
  });

};

export async function requestIdRevisionPage(preferences, contentBox) {
  const params = new URLSearchParams(window.location.search);
  let token = params.get("id");

  if (token) {
    token = token.replace(/ /g, "+");
  }

  if (!token) {
    console.warn(
      "ID não encontrado.\nPor gentileza, refaça o pedido.\n Se o problema percistir entre em contato com a infra.",
    );
  }
  try {
    const decryptedId = await decrypt(token);
    const clientData = await organizeClientData(decryptedId, contentBox, preferences);
    const productDimensions = await organizeProductDimensions(decryptedId, contentBox, preferences);
    const paymentData = await organizePaymentClientData(decryptedId, contentBox, preferences);
    const productData = await organizeProductData(preferences, decryptedId, contentBox);

    const divDownload = element_Div1("", preferences);
    const buttonDownload = element_Button1("Baixar pedido", preferences,GerarRelatorio,[clientData, paymentData, productData, productDimensions, decryptedId]);
    buttonDownload.style.width = "100%";
    divDownload.appendChild(buttonDownload);

    const divEnd = element_Div1("", preferences);
    const endButton = element_Button1(
      "Finalizar pedido",
      preferences,
      saveBudget,
      [decryptedId, preferences],
    );
    endButton.style.width = "100%";
    divEnd.appendChild(endButton);

    contentBox.appendChild(divDownload);
    contentBox.appendChild(divEnd);

    return decryptedId;
  } catch (err) {
    console.error("Erro ao descriptografar o token:", err);
    return null;
  }
}

export async function stockRoadmap(element, preferences) {
  const data = await getMPStock();

  const table = await element_table1(data, preferences);
  element.appendChild(table);
}

export async function mpControllerRoadmap(element, rightColumn, preferences) {
  const div = element_Div1("", preferences);

  const addMovimentDiv = element_Div1("", preferences);
  const addMovimentLabel = element_Label1(
    "Adicionar movimento de estoque:",
    preferences,
  );
  addMovimentLabel.style.alignItems = "center";
  addMovimentLabel.style.alignContent = "center";
  addMovimentLabel.style.justifyContent = "center";
  addMovimentLabel.style.justifyItems = "center";
  addMovimentLabel.style.textAlign = "center";

  const mpStock = await getMPStock();

  const addMovimentButton = element_Button1(
    "Adicionar",
    preferences,
    addMovimentStock,
    [rightColumn, mpStock, preferences],
  );
  addMovimentButton.style.margin = preferences.dimensions.defaultDivMargin;

  addMovimentDiv.appendChild(addMovimentLabel);
  addMovimentDiv.appendChild(addMovimentButton);

  //XDXDXDXDXD

  const searchMovimentDiv = element_Div1("", preferences);
  const searchMovimentLabel = element_Label1(
    "Consultar movimentos de estoque:",
    preferences,
  );
  searchMovimentLabel.style.alignItems = "center";
  searchMovimentLabel.style.alignContent = "center";
  searchMovimentLabel.style.justifyContent = "center";
  searchMovimentLabel.style.justifyItems = "center";
  searchMovimentLabel.style.textAlign = "center";

  const searchMovimentButton = element_Button1(
    "Procurar",
    preferences,
    searchMovimentsStock,
    [rightColumn, preferences],
  );
  searchMovimentButton.style.margin = preferences.dimensions.defaultDivMargin;

  searchMovimentDiv.appendChild(searchMovimentLabel);
  searchMovimentDiv.appendChild(searchMovimentButton);

  div.appendChild(addMovimentDiv);
  div.appendChild(searchMovimentDiv);

  element.appendChild(div);
}

export async function sHRoadmap(element, preferences) {
  const mainBox = element_Div1("", preferences);

  const modelLabel = element_Label1(
    "Selecione qual a versão da BOM:",
    preferences,
  );

  const option2024 = document.createElement("option");
  option2024.value = "2024";
  option2024.textContent = "Template - 2024";
  option2024.id = "mod_2024";

  const option2025 = document.createElement("option");
  option2025.value = "2024";
  option2025.textContent = "Template - 2025";
  option2025.id = "mod_2025";

  const selectModel = document.createElement("select");
  selectModel.style.padding = preferences.dimensions.smallDivPadding;
  selectModel.id = "model";
  selectModel.appendChild(option2024);
  selectModel.appendChild(option2025);

  const modelRow = element_Div1("", preferences);

  const exceptionLabel = element_Label1("", preferences);
  exceptionLabel.innerHTML =
    "Ignorar itens listados como <a href='SHException' style='color: white; font-weight: bold;'>exceções</a> ?";

  const checkBox = element_flagBox("exception", true, preferences);

  const ignoreExceptionsRow = element_Div1("", preferences);
  ignoreExceptionsRow.appendChild(exceptionLabel);
  ignoreExceptionsRow.appendChild(checkBox);

  const ignoreKits = element_Label1("", preferences);
  ignoreKits.innerHTML =
    "Aviso! Existem <a href='ignoredKits' style='color: white; font-weight: bold;'>Kits ignorados</a> durante a importação. ";

  const ignoredKitsRow = element_Div1("", preferences);
  ignoredKitsRow.appendChild(ignoreKits);

  const cutList = element_Label1("Gerar lista de corte plasma ?", preferences);
  const buildCutList = element_flagBox("cutList", true, preferences);

  const cutRow = element_Div1("", preferences);
  cutRow.appendChild(cutList);
  cutRow.appendChild(buildCutList);

  const checkList = element_Label1("Gerar check List de peças ?", preferences);
  const buildCheckList = element_flagBox("checkList", true, preferences);

  const checkListRow = element_Div1("", preferences);
  checkListRow.appendChild(checkList);
  checkListRow.appendChild(buildCheckList);

  const verifyFiles = element_Label1(
    "Verificar se os pdf's existem ?",
    preferences,
  );
  const verifyFilesFlag = element_flagBox("verifyFiles", true, preferences);

  const verifyFilesRow = element_Div1("", preferences);
  verifyFilesRow.appendChild(verifyFiles);
  verifyFilesRow.appendChild(verifyFilesFlag);

  const fatherCodeLabel = element_Label1("Informe o código pai:", preferences);
  const fatherCodeInput = element_Input1("fatherCodeInput");

  const fatherDescription = element_Label1(
    "Informe a descrição do item:",
    preferences,
  );
  const fatherDescriptionInput = element_Input1("fatherDescriptionInput");

  const fatherDescriptionRow = element_Div1("", preferences);
  fatherDescriptionRow.appendChild(fatherDescription);
  fatherDescriptionRow.appendChild(fatherDescriptionInput);

  const fatherCodeRows = element_Div1("", preferences);
  fatherCodeRows.appendChild(fatherCodeLabel);
  fatherCodeRows.appendChild(fatherCodeInput);

  const selectFile = element_Label1("Selecione o arquivo BOM:", preferences);
  const selectFileRow = element_Div1("", preferences);
  selectFileRow.appendChild(selectFile);

  element_InputFile1(selectFileRow, preferences);

  const startButton = element_Button1(
    "Gerar template de importação",
    preferences,
    makeBOMTemplate,
    [element, preferences],
  );
  startButton.style.width = "50%";

  const startRow = element_Div1("", preferences);
  startRow.appendChild(startButton);

  modelRow.appendChild(modelLabel);
  modelRow.appendChild(selectModel);

  mainBox.appendChild(modelRow);
  mainBox.appendChild(ignoreExceptionsRow);
  mainBox.appendChild(ignoredKitsRow);
  mainBox.appendChild(cutRow);
  mainBox.appendChild(checkListRow);
  mainBox.appendChild(verifyFilesRow);
  mainBox.appendChild(fatherCodeRows);
  mainBox.appendChild(fatherDescriptionRow);
  mainBox.appendChild(selectFileRow);
  mainBox.appendChild(startRow);
  element.appendChild(mainBox);
}

export async function SHExceptionRoadmap(element, preferences) {
  const mainDiv = element_Div1("", preferences);

  const addException = addExceptionTemplate(preferences);
  const removeException = removeExceptionTemplate(preferences);

  mainDiv.appendChild(addException);
  mainDiv.appendChild(removeException);
  element.appendChild(mainDiv);
}

export async function SHExceptionRoadmapRightColumn(element, preferences) {
  const mainDiv = element_Div1("", preferences);

  const response = await fetch("/api/get_exceptions");
  const responseJSON = await response.json();
  const data = responseJSON.props.resultRows;
  const table = element_table1(data, preferences);

  mainDiv.appendChild(table);

  element.appendChild(mainDiv);
}
