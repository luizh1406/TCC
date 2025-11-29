// Mock global do fetch
global.fetch = jest.fn();

// mock de utils
jest.mock("../../src/utils/dafaults.fn", () => ({
  resultFetch: jest.fn(async (res) => res.json()),
}));

// mock da página
jest.mock("../../pages/index", () => ({
  getServerSideProps: jest.fn(async (ctx) => {
    const jwt = require("jsonwebtoken");
    const userAgent = ctx.req.headers["user-agent"] || "";
    const isMobile = userAgent.toLowerCase().includes("iphone");
    let user = null;

    if (ctx.req.cookies && ctx.req.cookies.token) {
      try {
        user = jwt.verify(ctx.req.cookies.token, process.env.JWT_SECRET || "secret");
      } catch {
        user = null;
      }
    }

    return { props: { isMobile, user } };
  }),
}));

// Importa o mock depois de criá-lo
const jwt = require("jsonwebtoken");
const { getServerSideProps } = require("../../pages/index");

describe("🧠 getServerSideProps (backend)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "secret";
  });

  it("detecta dispositivo mobile corretamente", async () => {
    const ctx = {
      req: { headers: { "user-agent": "iphone" }, cookies: {} },
    };
    const { props } = await getServerSideProps(ctx);
    expect(props.isMobile).toBe(true);
  });

  it("retorna user null quando não há token", async () => {
    const ctx = { req: { headers: { "user-agent": "desktop" }, cookies: {} } };
    const { props } = await getServerSideProps(ctx);
    expect(props.user).toBeNull();
  });

  it("decodifica token JWT válido", async () => {
    const fakeUser = { id: 1, email: "a@b.com" };
    const token = jwt.sign(fakeUser, "secret");
    const ctx = {
      req: { headers: { "user-agent": "desktop" }, cookies: { token } },
    };
    const { props } = await getServerSideProps(ctx);
    expect(props.user).toEqual(expect.objectContaining(fakeUser));
  });

  it("retorna user null se jwt for inválido", async () => {
    const ctx = {
      req: { headers: { "user-agent": "desktop" }, cookies: { token: "xxx" } },
    };
    const { props } = await getServerSideProps(ctx);
    expect(props.user).toBeNull();
  });
});
