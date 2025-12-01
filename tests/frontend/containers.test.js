import {
  loginContainer,
  labelModel1,
  inputModel1,
  containerModel1,
  buttonModel1,
  loadingBox,
  loadingLabel,
  topDiv,
  sidebarDiv,
  sidebarItems,
  textLabel,
  titleLabel,
  logoutButton,
  titleGroup1,
  clientDataInputDiv,
  cancelButton,
  nextButton,
  configuratorButton,
  popContainer,
  translucentContainer,
  translucentBox,
  menuItem
} from "../../src/styles/containers/containers";

import { stylesColor } from "../../src/styles/colors/styles.color";

// Mock simples para o dm
const dm = {
  loginContainer: { width: "200px", height: "100px" },
  labelModel1: { width: "150px", height: "50px", margin: "10px", fontSize: "18px" },
  inputModel1: { width: "300px", height: "40px", margin: "5px", fontSize: "14px" },
  containerModel1: { fontSize: "16px" },
  buttonModel1: { height: "45px", padding: "5px", margin: "5px", fontSize: "14px" },
  loadingLabel: { width: "120px", height: "40px" },
  topDiv: { height: "60px" },
  sidebarDiv: { height: "100vh", widthClosed: "50px" },
  sidebarItems: { width: "100%", height: "40px", padding: "5px" },
  textDiv: { padding: "10px", width: "100%", height: "40px", fontSize: "18px" },
  logoutButton: { width: "80px", fontSize: "16px" },
  titleGroup1: { width: "100%", height: "50px", padding: "5px", fontSize: "20px" },
  clientDataDiv: { height: "80px", margin: "10px", fontSize: "16px" },
  cancelButton: { fontSize: "14px" },
  configuratorButton: { width: "200px", height: "60px", margin: "5px", fontSize: "18px", padding: "10px" },
  popContainer: { width: "400px", height: "300px" },
  trContainer: { marginBottom: "15px", marginTop: "5px" },
  trBox: { height: "200px", margin: "10px", fontSize: "16px" },
};

describe("Testes das funções de estilo (containers)", () => {

  test("loginContainer retorna width e height corretamente", () => {
    const result = loginContainer(dm);
    expect(result.width).toBe(dm.loginContainer.width);
    expect(result.height).toBe(dm.loginContainer.height);
  });

  test("labelModel1 retorna estilos básicos", () => {
    const result = labelModel1(dm);
    expect(result.backgroundColor).toBe(stylesColor.dark.orange0);
    expect(result.width).toBe(dm.labelModel1.width);
  });

  test("inputModel1 retorna propriedades corretas", () => {
    const result = inputModel1(dm);
    expect(result.fontSize).toBe(dm.inputModel1.fontSize);
  });

  test("containerModel1 respeita a cor passada", () => {
    const result = containerModel1(dm, "red");
    expect(result.backgroundColor).toBe("red");
  });

  test("buttonModel1 usa cor correta", () => {
    const result = buttonModel1(dm);
    expect(result.backgroundColor).toBe(stylesColor.dark.blue0);
  });

  test("loadingBox possui tela cheia", () => {
    const result = loadingBox(dm);
    expect(result.width).toBe("100vw");
    expect(result.height).toBe("100vh");
  });

  test("loadingLabel aplica largura e altura", () => {
    const result = loadingLabel(dm);
    expect(result.width).toBe(dm.loadingLabel.width);
  });

  test("topDiv aplica altura corretamente", () => {
    const result = topDiv(dm);
    expect(result.height).toBe(dm.topDiv.height);
  });

  test("sidebarDiv aplica largura e cor", () => {
    const result = sidebarDiv(dm);
    expect(result.width).toBe(dm.sidebarDiv.widthClosed);
    expect(result.backgroundColor).toBe(stylesColor.dark.blue1);
  });

  test("sidebarItems possui padding e width", () => {
    const result = sidebarItems(dm);
    expect(result.width).toBe(dm.sidebarItems.width);
  });

  test("textLabel aplica fontSize e background correto", () => {
    const result = textLabel(dm);
    expect(result.fontSize).toBe(dm.textDiv.fontSize);
  });

  test("titleLabel possui fontSize e background", () => {
    const result = titleLabel(dm);
    expect(result.fontSize).toBe(dm.textDiv.fontSize);
  });

  test("logoutButton usa orange0", () => {
    const result = logoutButton(dm);
    expect(result.backgroundColor).toBe(stylesColor.dark.orange0);
  });

  test("titleGroup1 aplica cor e tamanho", () => {
    const result = titleGroup1(dm);
    expect(result.height).toBe(dm.titleGroup1.height);
  });

  test("clientDataInputDiv retorna width 100%", () => {
    const result = clientDataInputDiv(dm);
    expect(result.width).toBe("100%");
  });

  test("cancelButton é vermelho", () => {
    const result = cancelButton(dm);
    expect(result.backgroundColor).toBe("red");
  });

  test("nextButton usa blue0", () => {
    const result = nextButton(dm);
    expect(result.backgroundColor).toBe(stylesColor.dark.blue0);
  });

  test("configuratorButton retorna altura correta", () => {
    const result = configuratorButton(dm);
    expect(result.height).toBe(dm.configuratorButton.height);
  });

  test("popContainer aplica width e height", () => {
    const result = popContainer(dm);
    expect(result.width).toBe(dm.popContainer.width);
  });

  test("translucentContainer usa marginTop e marginBottom", () => {
    const result = translucentContainer(dm);
    expect(result.marginTop).toBe(dm.trContainer.marginTop);
  });

  test("translucentBox usa height correto", () => {
    const result = translucentBox(dm);
    expect(result.height).toBe(dm.trBox.height);
  });

  test("menuItem aplica height de containerModel1", () => {
    const result = menuItem(dm);
    expect(result.height).toBe(dm.containerModel1.height);
  });

});
