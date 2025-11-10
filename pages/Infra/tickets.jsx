import { useState, useEffect } from "react";
import { logout, resultFetch } from "../../src/utils/dafaults.fn";
import {
  loadingBox,
  loadingLabel,
} from "../../src/styles/containers/containers";
import setDimensions from "../../src/dimensions/default.dimensions";
import jwt from "jsonwebtoken";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  // Get token from cookies
  const token = context.req.cookies?.token || null;
  let user = null;

  if (token) {
    try {
      // This will give you: { id, email, role, name }
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  return { props: { isMobile, userAgent, user } };
}

async function saveTicket(
  setLoading,
  typeTicket,
  subject,
  problem,
  priority,
  priorityReason,
  user
) {
  setLoading(true);

  if (subject === "") {
    alert("Informe o assunto do chamado");
    setLoading(false);
    return;
  } else if (problem === "") {
    alert("Descreva o problema/ assunto do chamado");
    setLoading(false);
    return;
  } else if (priority === "Prioridade" || priority === "Urgência") {
    if (priorityReason === "") {
      alert(
        "Informe o motivo da prioridade ou altere a prioridade para normal"
      );
      setLoading(false);
      return;
    }
  }

  const seqRes = await fetch(`/api/get/get_sequence?id=${5}`);
  const seq = await resultFetch(seqRes);

  const data = {
    id: seq[0].posicao,
    nome: user.name,
    email: user.email,
    tipo: typeTicket,
    assunto: subject,
    descricao: problem,
    prioridade: priority,
    motivo: priorityReason,
    situacao: "PENDENTE",
  };

  await fetch("/api/add/tickets/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
      alert("Checklist cadastrado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
      alert(
        "Ocorreu um erro inesperado com seu pedido. Por favor contate os administradores do sistema. \n :|"
      );
    });

  const sequence = [
    {
      id: "5",
      posicao: parseInt(seq[0].posicao) + 1,
    },
  ];

  await fetch("/api/update_vl/update_sequences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sequence),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
      alert(
        "Ocorreu um erro inesperado com seu pedido. Por favor contate os administradores do sistema. \n :|"
      );
    });

  async function enviarEmails() {
    const data = [
      {
        nome: "Gustavo",
        email: user.email,
        mensagem: "Oi!",
        assunto: subject,
      },
    ];

    const res = await fetch("/api/email/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // envia cookies do site junto
    });

    const result = await res.json();
    console.log(result);
  }

  enviarEmails();

  setLoading(false);
  window.location.href = "/";
}

export default function sh(props) {
  const [loading, setLoading] = useState(false);
  const [typeTicket, setTypeTicket] = useState("Erros/Bugs");
  const [subject, setSubject] = useState("");
  const [problem, setProblem] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [priorityReason, setPriorityReason] = useState("");

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.display = "block";

    document.title = "CORE-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);

    console.log(priority);
  }, [priority]);

  const dimensions = setDimensions(props.isMobile);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);
  const user = props.user;

  const logoutImg = {
    backgroundImage: "url('/icons/logout.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    marginRight: props.isMobile ? "10px" : "20px",
  };

  const homeImg = {
    backgroundImage: "url('/icons/icon1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    marginLeft: props.isMobile ? "10px" : "20px",
  };

  const mainBkgImage = {
    backgroundImage: "url('/images/background/model6.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  };

  const st_topDiv = {
    display: "flex",
    color: "white",
    backgroundColor: "#010B40",
    height: props.isMobile ? "50px" : "60px",
    justifyContent: "center",
    alignItems: "center",
  };

  const st_homeBtn = {
    ...homeImg,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const st_logoutBtn = {
    ...logoutImg,
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const st_translucedDiv = {
    justifyContent: props.isMobile ? "flex-start" : "center",
    alignItems: "top",
    alignContent: "flex-start",
    display: "flex",
    flexDirection: props.isMobile ? "column" : "row",
    flexWrap: "wrap",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing: "border-box",
    borderRadius: "20px",
    margin: props.isMobile ? "15px" : "30px",
    padding: props.isMobile ? "15px" : "30px",
    flex: 1,
  };

  const st_moduleTitle = {
    width: "100%",
    height: props.isMobile ? "30px" : "50px",
    fontSize: props.isMobile ? "12px" : "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010B40",
    borderRadius: "10px",
  };

  const st_translucedBox = {
    justifyContent: "flex-start",
    alignContent: "flex-start",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing: "border-box",
    borderRadius: "10px",
    fontSize: props.isMobile ? "12px" : "15px",
    padding: "15px",
    width: "100%",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    boxSizing: "border-box",
  };

  const st_select = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "14px",
    color: "#333",
    appearance: "none", // remove o estilo padrão do sistema
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage:
      'url(\'data:image/svg+xml;charset=UTF-8,<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l5 5 5-5" stroke="%23666" stroke-width="2" fill="none" stroke-linecap="round"/></svg>\')',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "12px 8px",
  };

  const st_button = {
    height: dimensions.textDiv.height,
    width: props.isMobile ? "100%" : "200px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
    borderRadius: "10px 7px",
    backgroundColor: "rgba(40, 167, 69, 1)",
  };

  return (
    <>
      <div
        style={{ flexDirection: "column", display: "flex", height: "100vh" }}
      >
        <div style={{ ...st_topDiv }}>
          <button
            style={{ ...st_homeBtn }}
            onClick={() => (window.location.href = "/")}
          ></button>
          <label
            style={{
              display: "flex",
              fontSize: 25,
              fontFamily: "'Montserrat', sans-serif",
              color: "white",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            CORE - JIMP
          </label>
          <button
            style={st_logoutBtn}
            onClick={() => logout(setLoading)}
          ></button>
        </div>
        <div style={{ ...mainBkgImage }}>
          <div id="mainData" style={{ ...st_translucedDiv }}>
            <label style={{ ...st_moduleTitle }}>
              Abertura de chamados - TI
            </label>
            <div
              style={{
                ...st_translucedDiv,
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div style={{ width: "100%" }}>
                <label>Tipo do chamado</label>
                <select
                  style={{ ...st_select }}
                  onChange={(e) => setTypeTicket(e.target.value)}
                >
                  <option value={"Erros/Bugs"}>Erros/Bugs</option>
                  <option value={"Dúvidas"}>Dúvidas</option>
                  <option value={"Elogio"}>Elogio</option>
                  <option value={"Sugestão"}>Sugestão</option>
                  <option value={"Reclamação"}>Reclamação</option>
                </select>
              </div>
              <div>
                <label>Assunto:</label>
                <input
                  style={{ ...inputStyle }}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div style={{ flexDirection: "column" }}>
                <label>Descrição do problema</label>
                <textarea
                  style={{ width: "100%" }}
                  onChange={(e) => setProblem(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label>Prioridade do chamado</label>
                <select
                  style={{ ...st_select }}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value={"Normal"}>Normal</option>
                  <option value={"Prioridade"}>Prioridade</option>
                  <option value={"Urgênte"}>Urgênte</option>
                </select>
              </div>
              {(priority === "Prioridade" || priority === "Urgênte") && (
                <>
                  <div style={{ flexDirection: "column" }}>
                    <label>
                      Motivo da {priority === "Urgênte" ? "Urgência" : priority}
                    </label>
                    <textarea
                      style={{ width: "100%" }}
                      onChange={(e) => setPriorityReason(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div style={{ flexDirection: "column" }}>
                <button
                  style={{ ...st_button }}
                  onClick={() =>
                    saveTicket(
                      setLoading,
                      typeTicket,
                      subject,
                      problem,
                      priority,
                      priorityReason,
                      user
                    )
                  }
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div style={{ ...lgBox, position: "fixed" }}>
          <label style={lgLabel}>Carregando...</label>
        </div>
      )}
    </>
  );
}
