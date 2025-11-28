import { useEffect, useState } from "react";
import styles from "../../src/styles";
import { stylesColor } from "../../src/styles/colors/styles.color";
import jwt from "jsonwebtoken";
import { logout, resultFetch } from "../../src/utils/dafaults.fn";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  const token = context.req.cookies?.token || null;
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  return { props: { isMobile, userAgent, user } };
}

async function pushList(data, tabela) {
  if (tabela === "materiais") {
    const response = await fetch("/api/add/quality/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
  } else if (tabela === "servicos") {
    const response = await fetch("/api/add/quality/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
  } else if (tabela === "planos") {
    const response = await fetch("/api/add/quality/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
  }
}

async function addServicos(setServicos, servicos) {
  const newId = servicos.length > 0 ? servicos[servicos.length - 1].id + 1 : 0;

  const newLine = {
    id: newId,
    codigo: 0,
    descricao: "",
    tempo: 0,
    valorUnitario: 0,
    valorTotal: 0,
  };

  setServicos([...servicos, newLine]);
}

async function addMaterial(setMateriais, materiais) {
  const newId =
    materiais.length > 0 ? materiais[materiais.length - 1].id + 1 : 0;

  const newLine = {
    id: newId,
    codigo: 0,
    descricao: "",
    quantidade: 0,
    valorUnitario: 0,
    valorTotal: 0,
  };

  setMateriais([...materiais, newLine]);
}

function editServices(
  setServicos,
  servicos,
  index,
  key,
  value,
  setTotalServicos
) {
  const newServices = [...servicos];

  const baseLine = newServices[index];
  let editedLine = {
    ...baseLine,
    [key]: value,
  };

  const tempo = Number(editedLine.tempo);
  const valorUnitario = Number(editedLine.valorUnitario);

  const novoValorTotal = tempo * valorUnitario;

  editedLine = {
    ...editedLine,
    valorTotal: novoValorTotal,
  };

  newServices[index] = editedLine;

  let soma = 0;
  newServices.map((item) => {
    soma = item.valorTotal + soma;
  });

  setTotalServicos(soma);
  setServicos(newServices);
}

function editMaterial(
  setMateriais,
  materiais,
  index,
  key,
  value,
  setTotalMateriais
) {
  const newMateriais = [...materiais];

  const baseLine = newMateriais[index];
  let editedLine = {
    ...baseLine,
    [key]: value,
  };

  const quantidade = Number(editedLine.quantidade);
  const valorUnitario = Number(editedLine.valorUnitario);

  const novoValorTotal = quantidade * valorUnitario;

  editedLine = {
    ...editedLine,
    valorTotal: novoValorTotal,
  };

  newMateriais[index] = editedLine;

  let soma = 0;
  newMateriais.map((item) => {
    soma = item.valorTotal + soma;
  });

  setTotalMateriais(soma);
  setMateriais(newMateriais);
}

async function save(inforGeral, materiais, servicos, plano) {
  const sequenciaRes = await fetch(`/api/get/get_sequence?id=${6}`);
  const sequenciaJSON = await sequenciaRes.json();
  const sequencia = await sequenciaJSON.props.resultRows;
  const id = sequencia[0].posicao;

  let data = inforGeral;
  data[0] = {
    ...data[0],
    id: id,
  };
  await fetch("/api/add/quality/headRNC", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Inserção bem-sucedida:", result);
    })
    .catch((error) => {
      console.error("Erro ao inserir dados:", error);
    });

  materiais.map((item) => {
    data = [{ ...item, id: id }];
    pushList(data, "materiais");
  });

  servicos.map((item) => {
    data = [{ ...item, id: id }];
    pushList(data, "servicos");
  });

  data = [
    {
      id: id,
      codigo: 0,
      descricao: plano,
      ativo: true,
      solucao: "em andamento",
    },
  ];
  pushList(data, "planos");

  let nextId = parseInt(id) + 1;
  let sequence = [{ id: 6, posicao: nextId }];

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
    });

  alert("RNC salva com sucesso!");
  window.location.href = "/";
}

export default function index(props) {
  const [inforGeral, setInforGeral] = useState([
    {
      id: "",
      op: 0,
      ns: 0,
      setor: "corte/dobra",
      data_ocorrido: "",
      projeto: 0,
      image: "",
      ocorrencia: "",
      email: props.user.email,
    },
  ]);
  const [materiais, setMateriais] = useState([]);
  const [totalMateriais, setTotalMateriais] = useState(0);
  const [servicos, setServicos] = useState([]);
  const [totalServicos, setTotalServicos] = useState(0);
  const [img, setImg] = useState("");
  const [plano, setPlano] = useState("");
  const [loading, setLoading] = useState(false);

  const styleObj = styles(props.isMobile);

  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.width = "100%";
    document.body.style.display = "flex";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.title = "JIMP-CORE";
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";
    document.head.appendChild(fontLink);

  }, [inforGeral]);

  const st_topDiv = {
    display: "flex",
    color: "white",
    backgroundColor: stylesColor.dark.blue1,
    height: props.isMobile ? "50px" : "60px",
    justifyContent: "center",
    alignItems: "center",
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

  const st_homeBtn = {
    ...homeImg,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const logoutImg = {
    backgroundImage: "url('/icons/logout.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    marginRight: props.isMobile ? "10px" : "20px",
  };

  const st_logoutBtn = {
    ...logoutImg,
    width: "40px",
    height: "40px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ ...styleObj.background }}>
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
      <div style={styleObj.contents}>
        <div style={styleObj.backgroundImage}>
          <div
            style={{
              ...styleObj.translucedContainer,
              alignContent: "flex-start",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "50px",
                gap: "15px",
                alignItems: "center",
                backgroundColor: "#061242",
                border: "3px solid white",
              }}
            >
              <label style={{ width: "100%" }}>Cadastro de RNC</label>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                border: "3px solid white",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "50px",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "#061242",
                }}
              >
                <label style={{ width: "100%" }}>Informações gerais</label>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>Informe o número da OP</label>
                <input
                  style={{ ...styleObj.tableInput, width: "50%" }}
                  type="number"
                  onBlur={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, op: value } : item
                      )
                    );
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>
                  Informe o Nº de série de produto
                </label>
                <input
                  style={{ ...styleObj.tableInput, width: "50%" }}
                  type="number"
                  onBlur={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, ns: value } : item
                      )
                    );
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>
                  Selecione o setor da ocorrência
                </label>
                <select
                  style={{ ...styleObj.tableSelect, width: "50%" }}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, setor: value } : item
                      )
                    );
                  }}
                >
                  <option value={"corte/dobra"} style={styleObj.tableOption}>
                    Corte e Dobra
                  </option>
                  <option value={"base"} style={styleObj.tableOption}>
                    Base
                  </option>
                  <option value={"montagem"} style={styleObj.tableOption}>
                    Montagem
                  </option>
                  <option value={"pintura"} style={styleObj.tableOption}>
                    Pintura
                  </option>
                  <option value={"chapeacao"} style={styleObj.tableOption}>
                    Chapeação
                  </option>
                  <option value={"portas"} style={styleObj.tableOption}>
                    Portas
                  </option>
                  <option value={"instalacao"} style={styleObj.tableOption}>
                    Instalação
                  </option>
                  <option value={"eletrica"} style={styleObj.tableOption}>
                    Elétrica
                  </option>
                  <option value={"abs/ebs"} style={styleObj.tableOption}>
                    ABS/EBS
                  </option>
                  <option value={"mecanica"} style={styleObj.tableOption}>
                    Mecânica
                  </option>
                  <option value={"borracharia"} style={styleObj.tableOption}>
                    Borracharia
                  </option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>Data do ocorrido</label>
                <input
                  style={{ ...styleObj.tableInput, width: "50%" }}
                  type="date"
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, data_ocorrido: value } : item
                      )
                    );
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>
                  Informe o código do projeto/ peça
                </label>
                <input
                  style={{ ...styleObj.tableInput, width: "50%" }}
                  type="number"
                  onBlur={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, projeto: value } : item
                      )
                    );
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "25%" }}>
                  Descreva a não conformidade
                </label>
                <textarea
                  style={{ ...styleObj.tableInput, width: "75%" }}
                  type="text"
                  onBlur={(e) => {
                    const value = e.currentTarget.value;
                    setInforGeral((prev) =>
                      prev.map((item, index) =>
                        index === 0 ? { ...item, ocorrencia: value } : item
                      )
                    );
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                border: "3px solid white",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "50px",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "#061242",
                }}
              >
                <label style={{ width: "100%" }}>
                  Materiais perdidos pela não conformidade
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "25%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(40, 167, 69, 0.7)",
                    border: "rgba(40, 167, 69, 0.7)",
                    padding: "15px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => addMaterial(setMateriais, materiais)}
                >
                  Adicionar materiais
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <table style={styleObj.table}>
                  <thead>
                    <tr>
                      <th style={styleObj.th}>Código</th>
                      <th style={styleObj.th}>Descrição</th>
                      <th style={styleObj.th}>Quantidade</th>
                      <th style={styleObj.th}>Valor unitário</th>
                      <th style={styleObj.th}>Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiais.length > 0 &&
                      materiais.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <input
                                defaultValue={item.codigo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editMaterial(
                                    setMateriais,
                                    materiais,
                                    index,
                                    "codigo",
                                    e.currentTarget.value,
                                    setTotalMateriais
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.descricao}
                                style={styleObj.tableInput}
                                type="text"
                                onBlur={(e) =>
                                  editMaterial(
                                    setMateriais,
                                    materiais,
                                    index,
                                    "descricao",
                                    e.currentTarget.value,
                                    setTotalMateriais
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.quantidade}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editMaterial(
                                    setMateriais,
                                    materiais,
                                    index,
                                    "quantidade",
                                    e.currentTarget.value,
                                    setTotalMateriais
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.valorUnitario}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editMaterial(
                                    setMateriais,
                                    materiais,
                                    index,
                                    "valorUnitario",
                                    e.currentTarget.value,
                                    setTotalMateriais
                                  )
                                }
                              />
                            </td>
                            <td style={{ ...styleObj.td, height: "20px" }}>
                              {item.valorTotal}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>
                  Valor total de materiais perdidos
                </label>
                <label
                  style={{
                    width: "50%",
                    padding: "8px",
                    height: "35px",
                    boxSizing: "border-box",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    border: "1px solid #4C61A7",
                    borderRadius: "4px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {totalMateriais}
                </label>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                border: "3px solid white",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "50px",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "#061242",
                }}
              >
                <label style={{ width: "100%" }}>Serviços corretivos</label>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "25%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(40, 167, 69, 0.7)",
                    border: "rgba(40, 167, 69, 0.7)",
                    padding: "15px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => addServicos(setServicos, servicos)}
                >
                  Adicionar serviço
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <table style={styleObj.table}>
                  <thead>
                    <tr>
                      <th style={styleObj.th}>Código</th>
                      <th style={styleObj.th}>Descrição</th>
                      <th style={styleObj.th}>Tempo de execução</th>
                      <th style={styleObj.th}>Valor unitário</th>
                      <th style={styleObj.th}>Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.length > 0 &&
                      servicos.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <input
                                defaultValue={item.codigo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editServices(
                                    setServicos,
                                    servicos,
                                    index,
                                    "codigo",
                                    e.currentTarget.value,
                                    setTotalServicos
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.descricao}
                                style={styleObj.tableInput}
                                type="text"
                                onBlur={(e) =>
                                  editServices(
                                    setServicos,
                                    servicos,
                                    index,
                                    "descricao",
                                    e.currentTarget.value,
                                    setTotalServicos
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.tempo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editServices(
                                    setServicos,
                                    servicos,
                                    index,
                                    "tempo",
                                    e.currentTarget.value,
                                    setTotalServicos
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.valorUnitario}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={(e) =>
                                  editServices(
                                    setServicos,
                                    servicos,
                                    index,
                                    "valorUnitario",
                                    e.currentTarget.value,
                                    setTotalServicos
                                  )
                                }
                              />
                            </td>
                            <td style={{ ...styleObj.td, height: "20px" }}>
                              {item.valorTotal}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>
                  Valor total de serviços executados
                </label>
                <label
                  style={{
                    width: "50%",
                    padding: "8px",
                    height: "35px",
                    boxSizing: "border-box",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                    border: "1px solid #4C61A7",
                    borderRadius: "4px",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                  type="number"
                >
                  {totalServicos}
                </label>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                border: "3px solid white",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "50px",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "#061242",
                }}
              >
                <label style={{ width: "100%" }}>Plano de ação</label>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <textarea
                  style={{ width: "100%", height: "200px" }}
                  onBlur={(e) => setPlano(e.currentTarget.value)}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "25%",
                gap: "15px",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <button
                style={{
                  width: "100%",
                  backgroundColor: "rgba(40, 167, 69, 0.7)",
                  border: "rgba(40, 167, 69, 0.7)",
                  padding: "15px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => save(inforGeral, materiais, servicos, plano)}
              >
                Salvar RNC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
