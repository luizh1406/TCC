import React, { useEffect, useState } from "react"; // Adicione o import do React
import { useRouter } from "next/router";
import setDimensions from "../src/dimensions/default.dimensions";
import { containerModel1, loadingBox, loadingLabel} from "../src/styles/containers/containers";
import { FiEye, FiEyeOff } from "react-icons/fi";
import stylesColor from "../src/styles/colors/styles.color";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase(),
    );

  return { props: { isMobile, userAgent } };
}

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dimensions = setDimensions(props.isMobile);
  const ctModel1 = containerModel1(dimensions, "white");
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);

  const mainBkgStyle: React.CSSProperties = {
    height: '100vh',
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: stylesColor.dark.blue1
  };

  const lgImage = {
    height: '300px',
    width: '100%',
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/images/background/model1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";

    document.title = "NEXOS-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "icon";
    iconLink.href = "/icons/icon1.png";
    document.head.appendChild(iconLink);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/");
      setLoading(false);
    } else {
      alert("Erro ao fazer login");
      setLoading(false);
    }
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: dimensions?.inputModel1?.width || '100%',
  };

  const inputIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    marginRight: '10px',
    flexShrink: 0,
  };

  const inputFieldBaseStyle: React.CSSProperties = { // Renomeado para base
    flexGrow: 1,
    border: 'none',
    borderBottom: '1px solid #FFFFFF',
    backgroundColor: 'transparent',
    outline: 'none',
    color: '#FFFFFF',
    paddingBottom: '5px',
    fontSize: dimensions?.ipModel1?.fontSize || '16px',
    // Adicione o pseudo-elemento para placeholder via classe CSS se possível,
    // ou considere um arquivo CSS externo para isso.
    // Para inline, não é possível fazer ::placeholder
  };

  // Estilo do contêiner do formulário (o div com backdropFilter e background semi-transparente)
  const formContainerCustomStyle: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing: "border-box",
    borderRadius: '10px',
    height: "600px",
    cursor: "pointer",
    fontSize: dimensions.trBox.fontSize,
    width: "700px", // Ajustado para usar a largura do loginContainer
    padding: '20px', // Adicione um padding para o conteúdo interno
  };

  // Botão de "Entrar" - Se ele vinha de `buttonModel1`
  const buttonLoginStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0070f3', // Exemplo de cor
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: dimensions?.btModel1?.fontSize || '18px', // Usar do btModel1 se existir
  };

  const labelStyle: React.CSSProperties = { // Estilo para os labels "Bem vindo!"
    fontSize: dimensions?.lbModel1?.fontSize || '24px', // Exemplo de tamanho
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
  }

  return (
    <>
      <div style={{...mainBkgStyle, boxSizing: "border-box"}}>
        <div style={formContainerCustomStyle}>
          <a style={{...lgImage}}/>
          <div style={{display:'flex', height: '100px', width: 'auto'}}/>
          <form style={{ flexDirection: "column", width: '100%'}} onSubmit={handleSubmit}>
            <label style={{...labelStyle, marginBottom: '20px'}}>Bem vindo!</label>
            <div style={{...inputGroupStyle, flexDirection: 'row', width: '100%'}}>
              <img src="/icons/e_mail.png" alt="Email Icon" style={inputIconStyle} />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputFieldBaseStyle}
                required
              />
            </div>
            <div style={{...inputGroupStyle, flexDirection: 'row', width: '100%'}}>
              <img src="/icons/cadeado.png" alt="Lock Icon" style={inputIconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputFieldBaseStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: '0 5px', // Ajuste o padding para não colidir
                  fontSize: 20,
                  color: 'white', // Cor do ícone FiEye/FiEyeOff
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: '-30px', // Puxa o botão para dentro do input
                  zIndex: 1, // Garante que o ícone esteja acima do input
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
              <div style={{...inputGroupStyle, flexDirection: 'row', width: '100%'}}>
                <button style={buttonLoginStyle} type="submit">Entrar</button>
              </div>
            {loading && <p style={{color: 'white', textAlign: 'center', marginTop: '10px'}}>Hackeando...</p>}
          </form>
        </div>
      </div>
      {loading && <div style={{...lgBox, position:"fixed"}}><label style={lgLabel}>Carregando...</label></div>}
    </>
  );
}