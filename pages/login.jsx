import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  return { props: { isMobile, userAgent } };
}

export default function login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.title = "CORE-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    iconLink.href = "/icons/icon1.png";
    document.head.appendChild(iconLink);
  }, []);

  const mainBackground = {
    height: props.isMobile ? "100vh" : "calc(100vh - 30px)",
    width: props.isMobile ? "100%" : "50%",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/images/background/model7.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#59839B",
    boxSizing: "border-box",
    marginTop: props.isMobile ? "0" : "15px",
    marginBottom: props.isMobile ? "0" : "15px",
    borderRadius: "50px 0px 0px 50px",
    boxShadow: "15px 15px 50px rgb(0,0,0,1)",
  };

  const mainDiv = {
    height: "100vh",
    width: "50%",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59839B",
  };

  const emailIMG = {
    width: "30px",
    height: "30px",
    marginRight: "10px",
    flexShrink: 0,
  };

  const emailInput = {
    // --- Dimensões e Espaçamento ---
    width: "60%", // Ocupa 80% do container pai (a mainDiv de 50%)
    padding: "15px", // Espaçamento interno para o texto não ficar colado nas bordas

    // --- Aparência e Bordas ---
    border: "1px solid #D1D5DB", // Borda sutil em cinza claro
    borderRadius: "8px", // Cantos arredondados para um visual moderno
    backgroundColor: "#FFFFFF", // Fundo branco para bom contraste

    // --- Tipografia ---
    fontSize: "16px", // Tamanho de fonte legível (evita zoom em mobile)
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Fonte limpa e padrão
    color: "#111827", // Cor do texto escura (um pouco mais suave que preto puro)

    // --- Efeitos e Transições ---
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)", // Sombra muito sutil para dar profundidade
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Animação suave para o foco

    // --- Outros ---
    outline: "none", // Remove a borda de foco padrão do navegador (vamos criar uma customizada)
  };

  const loginButton = {
    // --- Aparência e Cores ---
    backgroundColor: "#151A46", // Um azul primário, consistente com o foco do input
    color: "#FFFFFF", // Texto branco para máximo contraste
    border: "none", // Sem bordas, o fundo sólido é suficiente
    borderRadius: "8px", // Consistente com os cantos do input

    // --- Dimensões e Espaçamento ---
    padding: "12px 24px", // Espaçamento interno generoso (vertical, horizontal)
    width: "80%", // Opcional: para ocupar o mesmo espaço do input

    // --- Tipografia ---
    fontSize: "16px",
    fontWeight: "bold", // Texto em negrito para dar ênfase
    letterSpacing: "0.5px", // Leve espaçamento entre as letras

    // --- UX (Experiência do Usuário) ---
    cursor: "pointer", // Muda o cursor para a "mãozinha", indicando que é clicável
    outline: "none", // Remove o contorno padrão do navegador
    transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out", // Animação suave
  };

  const cttDiv = {
    width: props.isMobile ? "calc(100% - 10px)" : "calc(80% - 50px)",
    minWidth: props.isMobile ? "100px" : "300px",
    height: props.isMobile ? "calc(100% - 10px)" : "calc(90% - 50px)",
    minHeight: props.isMobile ? "100px" : "650px",
    backgroundColor: "rgb(0,0,0,0.45)",
    boxSizing: "border-box",
    margin: props.isMobile ? "10px" : "50px",
    borderRadius: props.isMobile ? "10px" : "30px",
    padding: props.isMobile ? "10px" : "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "15px 15px 50px rgb(0,0,0,1)",
    flexDirection: "column",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/";
      setLoading(false);
    } else {
      alert("Erro ao fazer login");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          ...mainDiv,
          width: "100%",
          display: "",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {props.isMobile ? (
          <div style={{ ...mainBackground }}>
            <div style={{ ...cttDiv }}>
              <img
                src="/images/background/model1.png"
                style={{
                  width: "100%",
                  height: "auto",
                  flexShrink: 0,
                  marginBottom: "50px",
                  borderRadius: "10px",
                }}
              />
              <label
                style={{
                  fontSize: "16pt",
                  display: "flex",
                  justifyContent: "center",
                  padding: props.isMobile ? "10px" : "15px",
                  boxSizing: "border-box",
                  backgroundColor: "#151A46",
                  border: "none", // Sem bordas, o fundo sólido é suficiente
                  borderRadius: "8px", // Consistente com os cantos do input
                  marginBottom: "15px",
                  width: "80%",
                }}
              >
                Bem vindo ao COREX!
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "15px",
                  justifyContent: "center",
                }}
              >
                <img src="/icons/e_mail.png" style={{ ...emailIMG }} />
                <input
                  style={{ ...emailInput }}
                  type="email"
                  placeholder="seu.email@joinvilleimplementos.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "15px",
                  justifyContent: "center",
                }}
              >
                <img src="/icons/cadeado.png" style={{ ...emailIMG }} />
                <input
                  style={{ ...emailInput }}
                  type="password"
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                style={{ ...loginButton }}
                onClick={(e) => handleSubmit(e)}
              >
                Entrar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ ...mainDiv }}>
              <div style={{ ...cttDiv }}>
                <img
                  src="/images/background/model1.png"
                  style={{
                    width: "100%",
                    height: "auto",
                    flexShrink: 0,
                    marginBottom: "50px",
                  }}
                />
                <label
                  style={{
                    fontSize: "16pt",
                    display: "flex",
                    justifyContent: "center",
                    padding: props.isMobile ? "10px" : "15px",
                    boxSizing: "border-box",
                    backgroundColor: "#151A46",
                    border: "none", // Sem bordas, o fundo sólido é suficiente
                    borderRadius: "8px", // Consistente com os cantos do input
                    marginBottom: "15px",
                    width: "80%",
                  }}
                >
                  Bem vindo ao COREX
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "15px",
                    justifyContent: "center",
                  }}
                >
                  <img src="/icons/e_mail.png" style={{ ...emailIMG }} />
                  <input
                    style={{ ...emailInput }}
                    type="email"
                    placeholder="seu.email@joinvilleimplementos.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "15px",
                    justifyContent: "center",
                  }}
                >
                  <img src="/icons/cadeado.png" style={{ ...emailIMG }} />
                  <input
                    style={{ ...emailInput }}
                    type="password"
                    placeholder="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  />
                </div>
                <button
                  style={{ ...loginButton }}
                  onClick={(e) => handleSubmit(e)}
                >
                  Entrar
                </button>
              </div>
            </div>
            <div style={{ ...mainBackground }}></div>
          </div>
        )}
      </div>
    </>
  );
}
