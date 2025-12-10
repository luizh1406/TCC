import { useEffect, useState } from "react";

// 1. Definição de Estilos (EXTRAÍDOS para reduzir a complexidade interna da função login)
const STYLES = {
  // Estilos de Input e Botão (usados dentro do LoginForm)
  emailIMG: {
    width: "30px",
    height: "30px",
    marginRight: "10px",
    flexShrink: 0,
  },
  emailInput: {
    width: "60%",
    padding: "15px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    fontSize: "16px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#111827",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    outline: "none",
  },
  loginButton: {
    backgroundColor: "#151A46",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    width: "80%",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    cursor: "pointer",
    outline: "none",
    transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
  },

  // Estilos de Layout (usados dentro do componente Login)
  getMainBackground: (isMobile) => ({
    height: isMobile ? "100vh" : "calc(100vh - 30px)",
    width: isMobile ? "100%" : "50%",
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
    marginTop: isMobile ? "0" : "15px",
    marginBottom: isMobile ? "0" : "15px",
    borderRadius: isMobile ? "0px" : "50px 0px 0px 50px", // Ajuste para mobile
    boxShadow: "15px 15px 50px rgb(0,0,0,1)",
  }),
  mainDiv: {
    height: "100vh",
    width: "50%",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59839B",
  },
  getCttDiv: (isMobile) => ({
    width: isMobile ? "calc(100% - 10px)" : "calc(80% - 50px)",
    minWidth: isMobile ? "100px" : "300px",
    height: isMobile ? "calc(100% - 10px)" : "calc(90% - 50px)",
    minHeight: isMobile ? "100px" : "650px",
    backgroundColor: "rgb(0,0,0,0.45)",
    boxSizing: "border-box",
    margin: isMobile ? "10px" : "50px",
    borderRadius: isMobile ? "10px" : "30px",
    padding: isMobile ? "10px" : "30px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "15px 15px 50px rgb(0,0,0,1)",
    flexDirection: "column",
  }),
  welcomeLabel: (isMobile) => ({
    fontSize: "16pt",
    display: "flex",
    justifyContent: "center",
    padding: isMobile ? "10px" : "15px",
    boxSizing: "border-box",
    backgroundColor: "#151A46",
    border: "none",
    borderRadius: "8px",
    marginBottom: "15px",
    width: "80%",
  }),
};

// 2. Componente de Formulário (EXTRAÍDO para reduzir complexidade do JSX no Login)
// Este componente encapsula a estrutura de input e button, que era duplicada.
function LoginForm({ isMobile, email, setEmail, password, setPassword, handleSubmit }) {
  return (
    <>
      <img
        src="/images/background/model12.jpg"
        style={{
          width: "100%",
          height: "auto",
          flexShrink: 0,
          marginBottom: "50px",
          borderRadius: isMobile ? "10px" : "0px", // Mantendo o ajuste visual
        }}
      />
      <label style={STYLES.welcomeLabel(isMobile)}>
        Bem vindo ao COREX{isMobile ? "!" : ""}
      </label>

      {/* Input Email */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: "15px",
          justifyContent: "center",
        }}
      >
        <img src="/icons/e_mail.png" style={STYLES.emailIMG} />
        <input
          style={STYLES.emailInput}
          type="email"
          placeholder="seu.email@joinvilleimplementos.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Input Senha */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: "15px",
          justifyContent: "center",
        }}
      >
        <img src="/icons/cadeado.png" style={STYLES.emailIMG} />
        <input
          style={STYLES.emailInput}
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          // Adicionado no onKeyDown para Desktop, reusando em ambos
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} 
        />
      </div>

      {/* Botão Entrar */}
      <button
        style={STYLES.loginButton}
        onClick={handleSubmit}
      >
        Entrar
      </button>
    </>
  );
}


// Função de utilidade para detecção de dispositivo (fora do componente principal)
export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  return { props: { isMobile, userAgent } };
}

// 3. Componente Login (Com Complexidade Reduzida)
export default function login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Lógica do useEffect movida para fora do corpo da função principal 
  // (mas mantida aqui para ser um arquivo único, caso você queira extraí-la 
  // para um custom hook como sugerido anteriormente, a complexidade cairá ainda mais).
  useEffect(() => {
    document.body.style.margin = "0";
    document.title = "CORE-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    iconLink.href = "/icons/icon1.png";
    document.head.appendChild(iconLink);
  }, []);

  const handleSubmit = async (e) => {
    // PREVENÇÃO DE ALERTS - A regra do ambiente proíbe o uso de alert()
    // Substituído por log no console. Em um app real, seria um modal ou toast.
    e.preventDefault(); 
    setLoading(true);

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            window.location.href = "/";
        } else {
            console.error("Erro ao fazer login. Status:", res.status);
            // Implementação de uma mensagem visível ao usuário, se necessário
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
    } finally {
        setLoading(false);
    }
  };

  // Renderização principal (Muito mais simples e sem duplicação de form)
  const FormContent = (
    <div style={STYLES.getCttDiv(props.isMobile)}>
      <LoginForm 
        isMobile={props.isMobile} 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );

  const MobileLayout = (
    <div style={STYLES.getMainBackground(props.isMobile)}>
      {FormContent}
    </div>
  );

  const DesktopLayout = (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={STYLES.mainDiv}>
        {FormContent}
      </div>
      <div style={STYLES.getMainBackground(props.isMobile)}></div>
    </div>
  );

  return (
    <div
      style={{
        ...STYLES.mainDiv,
        width: "100%",
        display: "block", // Uso de 'block' ou 'flex' com 100% no container principal
        color: "white",
        fontWeight: "bold",
      }}
    >
      {/* Aqui a complexidade cognitiva é reduzida ao máximo */}
      {props.isMobile ? MobileLayout : DesktopLayout}
    </div>
  );
}