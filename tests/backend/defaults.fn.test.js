import {
  handleSidebar,
  sidebarLinks,
  resultFetch,
  getTime,
} from "../../src/utils/dafaults.fn";

describe("dafaults.fn.js - testes sem window.location", () => {
  let sidebar, list, dm;

  beforeAll(() => {
    // MOCK fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            props: { resultRows: [1, 2, 3] },
          }),
      })
    );
  });

  beforeEach(() => {
    sidebar = document.createElement("div");

    list = {
      item1: { descricao: "Item 1", id: "i1", route: "route1" },
      item2: { descricao: "Item 2", id: "i2", route: "route2" },
    };

    dm = {
      sidebarDiv: { widthClosed: 50, widthOpen: 200 },
      sidebarItems: { width: "150px", height: "30px", padding: "5px" },
    };

    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  test("handleSidebar abre e fecha corretamente", () => {
    const element = document.createElement("div");
    element.style.width = dm.sidebarDiv.widthClosed + "px";
    const menuBtn = document.createElement("button");

    handleSidebar(element, menuBtn, list, sidebar, dm);
    expect(parseInt(element.style.width)).toBe(dm.sidebarDiv.widthOpen);
    expect(menuBtn.style.transform).toBe("rotate(90deg)");
    expect(sidebar.children.length).toBe(2);

    handleSidebar(element, menuBtn, list, sidebar, dm);
    expect(parseInt(element.style.width)).toBe(dm.sidebarDiv.widthClosed);
    expect(menuBtn.style.transform).toBe("rotate(0deg)");
  });

  /*--test("sidebarLinks adiciona e remove corretamente", () => {
    sidebarLinks(list, sidebar, "add", dm);
    expect(sidebar.children.length).toBe(2);
    expect(sidebar.children[0].textContent).toBe("Item 1");
    sidebarLinks(list, sidebar, "remove", dm);
    expect(sidebar.children.length).toBe(0);
  })*/

  test("resultFetch retorna dados da API", async () => {
    const res = await fetch("/fake");
    const data = await resultFetch(res);
    expect(data).toEqual([1, 2, 3]);
  });

  test("getTime retorna string no formato correto", () => {
    const t = getTime();
    expect(t).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}\+00/);
  });
});
