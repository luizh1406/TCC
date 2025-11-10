import { useState, useEffect } from "react";
import {
  topDiv,
  translucentContainer,
  loadingBox,
  loadingLabel,
} from "../../src/styles/containers/containers";
import setDimensions from "../../src/dimensions/default.dimensions";
import { logout, resultFetch } from "../../src/utils/dafaults.fn";
import jwt from "jsonwebtoken";

async function printTicket(setLoading, ticket, comments) {
  setLoading(true);

  try {
    const res = await fetch("/api/template/tickets/template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket, comments }),
    });

    if (!res.ok) throw new Error("Falha ao gerar PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Erro ao gerar PDF. Verifique o servidor.");
  } finally {
    setLoading(false);
  }
}

async function decodeID(params, setID) {
  const encoded = params.get("id");
  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) {
    b64 += "="; // repõe padding se faltar
  }
  setID(Buffer.from(b64, "base64").toString("utf8"));
}

async function updateStatus(setLoading, id, status) {
  setLoading(true);

  const data = { id: id, situacao: status };

  await fetch(`/api/update/tickets/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  setLoading(false);
}

async function getTicket(setLoading, id, setTicket) {
  setLoading(true);

  const res = await fetch(`/api/get/infra/ticket?id=${id}`);
  const data = await resultFetch(res);
  setTicket(data);
  setLoading(false);
}

async function getComments(setLoading, id, setComments) {
  setLoading(true);
  const res = await fetch(`/api/get/infra/tkComments?id=${id}`);
  const data = await resultFetch(res);
  setComments(data);
  setLoading(false);
}

async function addComment(setLoading, id, userProps) {
  setLoading(true);

  let resultData;

  const data = {
    id: id,
    nome: userProps.name,
    email: userProps.email,
    descricao: "",
  };

  try {
    const response = await fetch("/api/add/tickets/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json(); // <-- aqui você pega o JSON de fato
    resultData = await result.props.line; // <-- aqui você acessa a linha inserida

    return result.line; // se quiser retornar a linha para uso posterior
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    alert(
      "Ocorreu um erro inesperado com seu pedido. Por favor contate os administradores do sistema. \n :|"
    );
  } finally {
    const tr = document.createElement("tr");
    tr.index = resultData.comment_id;

    const tdDate = document.createElement("td");
    tdDate.style.padding = "10px";
    tdDate.style.border = "2pt solid white";
    tdDate.innerText = new Date(resultData.created_at).toLocaleDateString(
      "pt-BR"
    );

    const tdUser = document.createElement("td");
    tdUser.style.padding = "10px";
    tdUser.style.borderBottom = "2pt solid white";
    tdUser.innerText = resultData.nome;

    const tdComment = document.createElement("td");
    tdComment.style.padding = "10px";
    tdComment.style.border = "2pt solid white";

    const input = document.createElement("textarea");
    input.id = resultData.comment_id;
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    tdComment.appendChild(input);

    tr.appendChild(tdDate);
    tr.appendChild(tdUser);
    tr.appendChild(tdComment);

    const tbody = document.getElementById("commentsBody");
    tbody.prepend(tr);

    setLoading(false);
  }
}

async function saveTicket(setLoading, id, ticket, tkDate) {
  setLoading(true);

  const headers = Object.keys(ticket[0]);
  const data = headers.map((header) => {
    if (header === "situacao") {
      return { header: header, value: ticket[0][header] };
    } else if (header === "id") {
      return { header: header, value: id };
    } else if (header === "created_at") {
      return { header: header, value: tkDate };
    } else {
      const element = document.getElementById(header);
      return { header: header, value: element ? element.value : "" };
    }
  });

  console.table(data);

  const res = await fetch("/api/update/tickets/ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const comments = await fetch(`/api/get/infra/tkComments?id=${id}`);
  const commentsData = await resultFetch(comments);

  for (const comment of commentsData) {
    const element = document.getElementById(comment.comment_id);
    console.log(comment["comment_id"]);
    console.table(comment);
    if (element) {
      const data = {
        id: id,
        comment_id: comment.comment_id,
        descricao: element.value,
      };
      console.table(data);
      await fetch("/api/update/tickets/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
  }

  setLoading(false);
  location.reload();
}

export async function getServerSideProps(context) {
  const req = context.req;

  // 1. Coleta o User-Agent
  const userAgent = req.headers["user-agent"] || "indisponível";
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  // 2. Recupera o token do cookie
  const cookies = req.headers.cookie || "";
  const token = cookies
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  let user = null;

  if (token) {
    try {
      // 3. Decodifica/verifica o token
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Token inválido ou expirado:", err);
    }
  }

  // 4. Retorna para o componente como props
  return {
    props: {
      isMobile,
      userAgent,
      user, // agora você pode acessar { id, email, role, name } no componente
    },
  };
}

export default function currentTicket(props) {
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState("");
  const [ticket, setTicket] = useState([]);
  const [comments, setComments] = useState([]);
  const [tkDate, setTkDate] = useState("");

  const dimensions = setDimensions(props.isMobile);
  const trContainer = translucentContainer(dimensions);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.display = "block";

    console.log(props.user.role, "User Agent");

    document.title = "CORE-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";

    const params = new URLSearchParams(window.location.search);
    decodeID(params, setID);

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);

    if (id !== "" && ticket.length === 0) {
      getTicket(setLoading, id, setTicket);
      getComments(setLoading, id, setComments);
    } else if (id !== "" && ticket.length !== 0) {
      console.table(ticket);
      console.log(ticket);
      console.table(comments);
      console.log(comments);
      ticket.forEach((element) => {
        console.log(element, "Ticket");
        document.getElementById("nome").value = element.nome;
        document.getElementById("email").value = element.email;
        document.getElementById("created_at").value = new Date(
          element.created_at
        ).toLocaleDateString("pt-BR");
        setTkDate(element.created_at);
        document.getElementById("tipo").value = element.tipo;
        document.getElementById("prioridade").value = element.prioridade;
        document.getElementById("assunto").value = element.assunto;
        document.getElementById("descricao").value = element.descricao;
        document.getElementById("motivo").value = element.motivo;
        document.getElementById("situacao").textContent = element.situacao;
        document.getElementById("responsavel").value = element.responsavel;
        document.getElementById("prioridade_ti").value = element.prioridade_ti;
      });
    }
  }, [id, ticket]);

  const tpDiv = topDiv(dimensions);

  const logoutImg = {
    backgroundImage: "url('/icons/logout.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const homeImg = {
    backgroundImage: "url('/icons/icon1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const mainBkgImage = {
    backgroundImage: "url('/images/background/model6.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
  };

  const approved = {
    backgroundImage: "url('/icons/approved.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const reject = {
    backgroundImage: "url('/icons/reject.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const printImg = {
    backgroundImage: "url('/icons/print.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const saveImage = {
    backgroundImage: "url('/icons/salvar.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
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
        <div
          style={{
            ...tpDiv,
            padding: "10px",
            flexShrink: 0,
            height: dimensions.topDiv.height,
          }}
        >
          <button
            style={{
              ...homeImg,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
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
            style={{
              ...logoutImg,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => logout(setLoading)}
          ></button>
        </div>
        <div
          style={{
            ...mainBkgImage,
            flex: 1,
            display: "flex",
            boxSizing: "border-box",
            padding: "20px",
          }}
        >
          <div
            style={{
              ...trContainer,
              padding: "20px",
              width: "100%",
              flexDirection: "row",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                width: "100%",
                height: "50px",
                fontSize: 30,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "10px 5px",
              }}
            >
              Chamado Nº {id} -
              <label style={{ paddingLeft: "10px" }} id="situacao" />
            </label>

            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  ...trContainer,
                  padding: "20px",
                  width: "100%",
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Resumo do chamado
                </label>
                <br />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Solicitante
                  </label>
                  <input id="nome" style={{ width: "100%" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    E-mail
                  </label>
                  <input id="email" style={{ width: "100%" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Data do cadastro
                  </label>
                  <input id="created_at" style={{ width: "100%" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "50%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Tipo do chamado
                  </label>
                  <select id="tipo" style={{ width: "50%" }}>
                    <option value={"Erros/Bugs"}>Erros/Bugs</option>
                    <option value={"Dúvidas"}>Dúvidas</option>
                    <option value={"Elogio"}>Elogio</option>
                    <option value={"Sugestão"}>Sugestão</option>
                    <option value={"Reclamação"}>Reclamação</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "50%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Prioridade
                  </label>
                  <select id="prioridade" style={{ width: "50%" }}>
                    <option value={"Normal"}>Normal</option>
                    <option value={"Prioridade"}>Prioridade</option>
                    <option value={"Urgênte"}>Urgênte</option>
                  </select>
                </div>
                <br />
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Análise da TI
                </label>
                <br />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "50%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Prioridade
                  </label>
                  <select id="prioridade_ti" style={{ width: "50%" }}>
                    <option value={"Normal"}>Normal</option>
                    <option value={"Prioridade"}>Prioridade</option>
                    <option value={"Urgênte"}>Urgênte</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "50%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Análista responsável
                  </label>
                  <select id="responsavel" style={{ width: "50%" }}>
                    <option value={"Eduardo"}>Eduardo</option>
                    <option value={"Luiz"}>Luiz</option>
                    <option value={"Gustavo"}>Gustavo</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  ...trContainer,
                  padding: "20px",
                  width: "100%",
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Descrição do chamado
                </label>
                <br />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      height: "30px",
                      width: "100%",
                      textAlign: "center",
                      justifyContent: "left",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                  >
                    Assunto
                  </label>
                  <input id="assunto" style={{ width: "100%" }} />
                </div>
                <br />
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                    fontWeight: "bold",
                  }}
                >
                  Descricao
                </label>
                <textarea
                  id="descricao"
                  style={{ width: "100%", height: "100px" }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  ...trContainer,
                  display: "flex",
                  width: "50%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Motivo da urgência do chamado
                </label>
                <textarea
                  id="motivo"
                  style={{ width: "100%", height: "100px" }}
                />
              </div>
              <div
                style={{
                  ...trContainer,
                  display: "flex",
                  width: "50%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Atalhos
                </label>
                <div
                  style={{
                    ...trContainer,
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    height: "150px",
                  }}
                >
                  {(props.user.role === "adm" ||
                    props.user.role === "Supervisor") && (
                    <div
                      style={{
                        display: "flex",
                        width: "20%",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "rgba(40, 167, 69, 0.5)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => updateStatus(setLoading, id, "FINALIZADO")}
                    >
                      <a
                        style={{ ...approved, width: "50px", height: "50px" }}
                      />
                      <label style={{ marginTop: "15px" }}>
                        Finalizar chamado
                      </label>
                    </div>
                  )}
                  {(props.user.role === "adm" ||
                    props.user.role === "Supervisor") && (
                    <div
                      style={{
                        display: "flex",
                        width: "20%",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: "2pt solid white",
                        borderRight: "2pt solid white",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          " rgba(160, 82, 45, 0.5)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => updateStatus(setLoading, id, "CANCELADO")}
                    >
                      <a style={{ ...reject, width: "50px", height: "50px" }} />
                      <label style={{ marginTop: "15px" }}>
                        Cancelar chamado
                      </label>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      width: "20%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "10px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        " rgba(40, 167, 69, 0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => {
                      saveTicket(setLoading, id, ticket, tkDate);
                    }}
                  >
                    {/*Corrigir pedido aqui*/}
                    <a
                      style={{
                        ...saveImage,
                        width: "50px",
                        height: "50px",
                      }}
                    />
                    <label style={{ marginTop: "15px" }}>Salvar chamado</label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "20%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "10px",
                      borderLeft: "2pt solid white",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        " rgba(40, 167, 69, 0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => printTicket(setLoading, ticket, comments)}
                  >
                    <a
                      style={{
                        ...printImg,
                        width: "50px",
                        height: "50px",
                      }}
                    />
                    <label
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Imprimir chamado
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  ...trContainer,
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <label
                  style={{
                    height: "30px",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Observações/ Comentários da TI
                </label>
                <button
                  style={{ ...st_button }}
                  onClick={() => addComment(setLoading, id, props.user)}
                >
                  Adicionar comentário
                </button>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  <thead>
                    <tr style={{ border: "2pt solid white" }}>
                      <th style={{ padding: "10px" }}>Data</th>
                      <th style={{ padding: "10px" }}>Usuário</th>
                      <th style={{ padding: "10px" }}>Comentário</th>
                    </tr>
                  </thead>
                  <tbody id="commentsBody">
                    {comments.length > 0 &&
                      comments.map((comment, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "10px",
                              border: "2pt solid white",
                            }}
                          >
                            {new Date(comment.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              borderBottom: "2pt solid white",
                            }}
                          >
                            {comment.nome}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "2pt solid white",
                            }}
                          >
                            {comment.descricao}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
