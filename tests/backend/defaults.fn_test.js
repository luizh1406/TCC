import { handleSidebar, sidebarLinks, logout, resultFetch, getTime } from "../../src/utils/dafaults.fn";

describe("dafaults.fn.js - testes completos", () => {
  let sidebar, list, dm;

  beforeAll(() => {
    // Mock window.location
    const assignMock = jest.fn();
    delete window.location;
    window.location = {
      _href: "",
      get href() { return this._href; },
      set href(val) {
        this._href = val;
        assignMock(val);
      },
      assign: assignMock,
    };

    // Mock fetch global
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ props: { resultRows: [1, 2, 3] } }) })
    );

    // Mock getElementById e querySelector
    document.getElementById = jest.fn((id) => {
      const el = document.createElement("div");
      el.id = id;
      el.remove = jest.fn();
      el.addEventListener = jest.fn();
      document.body.appendChild(el);
      return el;
    });

    document.querySelector = jest.fn((sel) => {
      const el = document.createElement("div");
      el.remove = jest.fn();
      el.addEventListener = jest.fn();
      document.body.appendChild(el);
      return el;
    });
  });

  beforeEach(() => {
    sidebar = document.createElement("div");
    list = {
      item1: { descricao: "Item 1", id: "i1", route: "route1" },
      item2: { descricao: "Item 2", id: "i2", route: "route2" }
    };
    dm = {
      sidebarDiv: { widthClosed: 50, widthOpen: 200 },
      sidebarItems: { width: 100, height: 30, padding: "5px" }
    };

    // Limpa DOM antes de cada teste
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  // ---------------- handleSidebar ----------------
  test("handleSidebar abre e fecha sidebar", () => {
    const element = document.createElement("div");
    element.style.width = dm.sidebarDiv.widthClosed + "px";
    const menuBtn = document.createElement("button");

    // Abre
    handleSidebar(element, menuBtn, list, sidebar, dm);
    expect(parseInt(element.style.width)).toBe(dm.sidebarDiv.widthOpen);
    expect(menuBtn.style.transform).toBe("rotate(90deg)");

    // Fecha
    handleSidebar(element, menuBtn, list, sidebar, dm);
    expect(parseInt(element.style.width)).toBe(dm.sidebarDiv.widthClosed);
    expect(menuBtn.style.transform).toBe("rotate(0deg)");
  });

  // ---------------- sidebarLinks ----------------
  test("sidebarLinks adiciona e remove links corretamente", () => {
    sidebarLinks(list, sidebar, "add", dm);
    expect(sidebar.children.length).toBe(2);
    expect(sidebar.children[0].textContent).toBe("Item 1");
    expect(sidebar.children[0].style.fontWeight).toBe("bold");

    sidebarLinks(list, sidebar, "remove", dm);
    expect(sidebar.children.length).toBe(0);
  });

  // ---------------- logout ----------------
  test("logout chama fetch e redireciona", async () => {
    const setLoad = jest.fn();
    await logout(setLoad);

    expect(setLoad).toHaveBeenCalledWith(true);
    expect(fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

  // ---------------- resultFetch ----------------
  test("resultFetch retorna dados corretamente", async () => {
    const res = await fetch("/fake");
    const data = await resultFetch(res);

    expect(data).toEqual([1, 2, 3]);
  });

  // ---------------- getTime ----------------
  test("getTime retorna string no formato correto", () => {
    const timeStr = getTime();
    expect(timeStr).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}\+00/);
  });
});
