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

async function getTickets(setLoading, setTickets, setFilteredTickets) {
  setLoading(true);

  const res = await fetch("/api/get/infra/tickets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const fetchedTickets = await resultFetch(res);
  setTickets(fetchedTickets);
  setFilteredTickets(fetchedTickets);
  console.log("Fetching tickets...");
  console.log(fetchedTickets);

  setLoading(false);
}

async function encodeId(id, setId) {
  const hashID = Buffer.from(String(id))
    .toString("base64") // base64 padrão
    .replace(/\+/g, "-") // troca + por -
    .replace(/\//g, "_") // troca / por _
    .replace(/=+$/, ""); // remove padding (=)
  setId(hashID);
  console.log("ID codificado:", hashID);
}

export default function sh(props) {
  const [loading, setLoading] = useState(false);
  const [typeTicket, setTypeTicket] = useState("Erros/Bugs");
  const [subject, setSubject] = useState("");
  const [problem, setProblem] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [priorityReason, setPriorityReason] = useState("");
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [id, setId] = useState("");

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

    if (tickets.length === 0) {
      getTickets(setLoading, setTickets, setFilteredTickets);
    }

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);

    if (id !== "") {
      window.open(`/Infra/currentTicket?id=${id}`, "_blank");
    }
  }, [id]);

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
            JIMP - CORE
          </label>
          <button
            style={st_logoutBtn}
            onClick={() => logout(setLoading)}
          ></button>
        </div>
        <div style={{ ...mainBkgImage }}>
          <div id="mainData" style={{ ...st_translucedDiv }}>
            <label style={{ ...st_moduleTitle }}>Histórico de chamados</label>
            <div
              style={{
                ...st_translucedDiv,
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <label style={{ ...st_moduleTitle, width: "100%" }}>
                Histórico de chamados
              </label>
              <div
                style={{
                  width: "100%",
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "20%",
                    flexDirection: "column",
                  }}
                >
                  <label>Selecione o tipo do chamado</label>
                  <select
                    style={{ ...st_select }}
                    value={typeTicket}
                    onChange={(e) => setTypeTicket(e.target.value)}
                  >
                    <option value={"Erros/Bugs"}>Erros/Bugs</option>
                    <option value={"Dúvidas"}>Dúvidas</option>
                    <option value={"Elogio"}>Elogio</option>
                    <option value={"Sugestão"}>Sugestão</option>
                    <option value={"Reclamação"}>Reclamação</option>
                  </select>
                </div>
                <div style={{ width: "20%", flexDirection: "row" }}>
                  <label>Assunto:</label>
                  <input
                    style={{ ...inputStyle }}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div style={{ width: "20%" }}>
                  <label>Prioridade do chamado</label>
                  <select
                    style={{ ...st_select }}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value={"Normal"}>Normal</option>
                    <option value={"Prioridade"}>Prioridade</option>
                    <option value={"Urgênte"}>Urgênte</option>
                  </select>
                </div>
                <div style={{ width: "20%" }}>
                  <button
                    style={{ ...st_button }}
                    onClick={() => {
                      setTypeTicket("Erros/Bugs");
                      setSubject("");
                      setPriority("Normal");
                    }}
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
              <label
                style={{
                  borderBottom: "2pt solid white",
                  width: "100%",
                  padding: "10px",
                }}
              >
                CHAMADOS
              </label>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2pt solid white" }}>
                    <th style={{ padding: "10px" }}>Codigo</th>
                    <th style={{ padding: "10px" }}>Data</th>
                    <th style={{ padding: "10px" }}>Prioridade TI</th>
                    <th style={{ padding: "10px" }}>Análista</th>
                    <th style={{ padding: "10px" }}>Usuário</th>
                    <th style={{ padding: "10px" }}>Tipo</th>
                    <th style={{ padding: "10px" }}>Prioridade</th>
                    <th style={{ padding: "10px" }}>Assunto</th>
                    <th style={{ padding: "10px" }}>Situação</th>
                    <th style={{ padding: "10px" }}>Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        Nenhum chamado encontrado.
                      </td>
                    </tr>
                  )}

                  {filteredTickets.length > 0 &&
                    tickets.map((line) => (
                      <tr
                        key={line.id}
                        style={{
                          borderBottom: "1pt solid white",
                        }}
                      >
                        <td style={{ padding: "10px" }}>{line.id}</td>
                        <td style={{ padding: "10px" }}>
                          {new Date(line.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor:
                              line.prioridade_ti === "Urgênte"
                                ? "rgba(255, 0, 0, 0.2)"
                                : line.prioridade_ti === "Normal"
                                ? "rgba(40, 167, 69, 0.7)"
                                : "rgba(137, 137, 137, 0.7)",
                            borderRadius:
                              line.situacao === "PENDENTE" ? "4px" : "0",
                          }}
                        >
                          {line.prioridade_ti}
                        </td>
                        <td style={{ padding: "10px" }}>{line.responsavel}</td>
                        <td style={{ padding: "10px" }}>{line.nome}</td>
                        <td style={{ padding: "10px" }}>{line.tipo}</td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor:
                              line.prioridade === "Urgênte"
                                ? "rgba(255, 0, 0, 0.2)"
                                : line.prioridade === "Normal"
                                ? "rgba(40, 167, 69, 0.7)"
                                : "rgba(137, 137, 137, 0.7)",
                            borderRadius:
                              line.situacao === "PENDENTE" ? "4px" : "0",
                          }}
                        >
                          {line.prioridade}
                        </td>
                        <td style={{ padding: "10px" }}>{line.assunto}</td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor:
                              line.situacao === "PENDENTE"
                                ? "rgba(255, 0, 0, 0.2)"
                                : line.situacao === "FINALIZADO"
                                ? "rgba(40, 167, 69, 0.7)"
                                : "",
                            borderRadius:
                              line.situacao === "PENDENTE" ? "4px" : "0",
                          }}
                        >
                          {line.situacao}
                        </td>
                        <td style={{ padding: 0 }}>
                          <button
                            style={{
                              width: "100%",
                              height: "100%",
                              padding: "10px",
                              border: "none",
                              backgroundColor: "#ff9800",
                              color: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => encodeId(line.id, setId)}
                          >
                            Abrir
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
