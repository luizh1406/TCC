/**
 @jest-environment jsdom
 */

require("@testing-library/jest-dom");

const {
  getServerSideProps,
  default: Login,
} = require("../../pages/login.jsx");

const {
  render,
  screen,
  fireEvent,
  waitFor, // ← IMPORTANTE
} = require("@testing-library/react");

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ done: true }),
  })
);

// Mock consistente do window.location
beforeAll(() => {
  delete global.window.location;
  global.window.location = {
    href: "",
    assign: jest.fn(),
    replace: jest.fn(),
  };
});

// Mock console
global.console.error = jest.fn();
global.console.log = jest.fn();

/**
 * @description Testes do getServerSideProps
 */
describe("getServerSideProps", () => {
  const mockContext = (userAgent, token) => ({
    req: {
      headers: { "user-agent": userAgent },
      cookies: token ? { token } : {},
    },
  });

  test("Caso 1: Detecta dispositivo mobile", async () => {
    const ctx = mockContext("Mozilla/5.0 (iPhone)", null);
    const result = await getServerSideProps(ctx);

    expect(result.props.isMobile).toBe(true);
    expect(result.props.userAgent).toBe("Mozilla/5.0 (iPhone)");
  });

  test("Caso 2: Detecta desktop", async () => {
    const ctx = mockContext("Windows NT", null);
    const result = await getServerSideProps(ctx);

    expect(result.props.isMobile).toBe(false);
    expect(result.props.userAgent).toBe("Windows NT");
  });
});

/**
 * @description Testes do componente Login.jsx
 */
describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = "";
  });

  test("Renderiza campos de email e senha", () => {
    render(<Login isMobile={false} />);

    expect(
      screen.getByPlaceholderText("seu.email@joinvilleimplementos.com")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
  });

  test("Digita email e senha corretamente", () => {
    render(<Login isMobile={false} />);

    const email = screen.getByPlaceholderText(
      "seu.email@joinvilleimplementos.com"
    );
    const senha = screen.getByPlaceholderText("Senha");

    fireEvent.change(email, { target: { value: "teste@jimp.com" } });
    fireEvent.change(senha, { target: { value: "123456" } });

    expect(email.value).toBe("teste@jimp.com");
    expect(senha.value).toBe("123456");
  });

  test("Clica no botão Entrar → chama fetch", () => {
    render(<Login isMobile={false} />);
    fireEvent.click(screen.getByText("Entrar"));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("Login com sucesso → redireciona para '/'", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<Login isMobile={false} />);
    fireEvent.click(screen.getByText("Entrar"));

    expect(window.location.href).toContain("/");
  });

  test("Erro no login → console.error é chamado", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "erro" }),
    });

    render(<Login isMobile={false} />);
    fireEvent.click(screen.getByText("Entrar"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Erro ao fazer login. Status:",
        401
      );
    });
  });

  test("Pressionar Enter no campo de senha dispara handleSubmit", () => {
    render(<Login isMobile={false} />);

    fireEvent.keyDown(screen.getByPlaceholderText("Senha"), {
      key: "Enter",
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("useEffect → altera título e insere favicon", () => {
    document.title = "";
    document.head.innerHTML = "";

    render(<Login isMobile={false} />);

    expect(document.title).toBe("CORE-JIMP");

    const linkIcon = document.head.querySelector("link[rel='icon']");
    expect(linkIcon).not.toBeNull();
    expect(linkIcon.href).toContain("/icons/icon1.png");
  });

  test("Renderiza layout Mobile", () => {
    render(<Login isMobile={true} />);
    const labelBemVindo = screen.getByText(/Bem vindo ao COREX/i);
    expect(labelBemVindo).toBeInTheDocument();
  });

  test("Renderiza layout Desktop", () => {
    render(<Login isMobile={false} />);
    const labelBemVindo = screen.getByText("Bem vindo ao COREX");
    expect(labelBemVindo).toBeInTheDocument();
  });
});
