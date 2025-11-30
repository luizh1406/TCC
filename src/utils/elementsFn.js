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

function singinRoute(path) {
  window.location.href = path;
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


//FUNÇÕES INTERNAS ASSINCRONAS XDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXDXD


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
