import { useEffect, useState } from "react";
import styles from "../../src/styles";
import { stylesColor } from "../../src/styles/colors/styles.color";
import jwt from "jsonwebtoken";
import { logout, resultFetch } from "../../src/utils/dafaults.fn";

// 🚀 Função para obter dados de inicialização no lado do servidor (Next.js)
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

// 💾 Função para enviar dados (Materiais, Serviços ou Planos) para a API
async function pushList(data, tabela) {
  let apiUrl;

  if (tabela === "materiais") {
    apiUrl = "/api/add/quality/materials";
  } else if (tabela === "servicos") {
    apiUrl = "/api/add/quality/services";
  } else if (tabela === "planos") {
    apiUrl = "/api/add/quality/plan";
  } else {
    return;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await response.json();
}

// ➕ Função para adicionar uma nova linha de serviço
function addServicos(setServicos, servicos) {
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

// ➕ Função para adicionar uma nova linha de material
function addMaterial(setMateriais, materiais) {
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

// ✏️ Função para editar um serviço e recalcular o valor total
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

  // Garante que a conversão para Number ocorra, exceto para string keys
  let editedLine = {
    ...baseLine,
    [key]: (key === "descricao" || key === "codigo") ? value : Number(value) || 0,
  };

  const tempo = Number(editedLine.tempo);
  const valorUnitario = Number(editedLine.valorUnitario);
  const novoValorTotal = tempo * valorUnitario;

  editedLine = {
    ...editedLine,
    valorTotal: novoValorTotal,
  };

  newServices[index] = editedLine;

  // Recálculo do total
  let soma = 0;
  newServices.forEach((item) => {
    soma += item.valorTotal; // Usa += para simplificar a soma
  });

  setTotalServicos(soma);
  setServicos(newServices);
}

// ✏️ Função para editar um material e recalcular o valor total
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

  // Garante que a conversão para Number ocorra, exceto para string keys
  let editedLine = {
    ...baseLine,
    [key]: (key === "descricao" || key === "codigo") ? value : Number(value) || 0,
  };

  const quantidade = Number(editedLine.quantidade);
  const valorUnitario = Number(editedLine.valorUnitario);
  const novoValorTotal = quantidade * valorUnitario;

  editedLine = {
    ...editedLine,
    valorTotal: novoValorTotal,
  };

  newMateriais[index] = editedLine;

  // Recálculo do total
  let soma = 0;
  newMateriais.forEach((item) => {
    soma += item.valorTotal; // Usa += para simplificar a soma
  });

  setTotalMateriais(soma);
  setMateriais(newMateriais);
}

// 💾 Função principal de salvamento (RNC, Materiais, Serviços, Plano e Sequência)
async function save(inforGeral, materiais, servicos, plano) {
  // 1. Obtém a próxima sequência/ID
  const sequenciaRes = await fetch(`/api/get/get_sequence?id=${6}`);
  const sequenciaJSON = await sequenciaRes.json();
  const sequencia = sequenciaJSON.props.resultRows;
  const id = sequencia[0].posicao;

  // 2. Prepara e envia o cabeçalho da RNC (headRNC)
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

  // 3. Envia os materiais
  materiais.forEach((item) => {
    data = [{ ...item, id: id }];
    pushList(data, "materiais");
  });

  // 4. Envia os serviços
  servicos.forEach((item) => {
    data = [{ ...item, id: id }];
    pushList(data, "servicos");
  });

  // 5. Envia o plano de ação
  data = [
    {
      id: id,
      codigo: 0,
      descricao: plano,
      ativo: true,
      solucao: "Em andamento",
    },
  ];
  pushList(data, "planos");

  // 6. Atualiza a próxima sequência
  let nextId = parseInt(id) + 1;
  let sequence = { id: 6, posicao: nextId };
  await fetch("/api/update/update_sequences", {
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

  // 7. Feedback e redirecionamento
  alert("RNC salva com sucesso!");
  window.location.href = "/";
}

// 🖥️ Componente Principal
export default function index(props) {
  // ⚙️ ESTADOS
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
  // O estado 'img' foi removido por ser redundante, usando apenas a estrutura de inforGeral para a imagem.
  const [plano, setPlano] = useState("");
  const [loading, setLoading] = useState(false);

  const styleObj = styles(props.isMobile);

  // 🖼️ FUNÇÃO DE UPLOAD DE IMAGEM
  // Função para lidar com o upload da imagem e atualizar o estado
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const fullResult = reader.result;
      const [meta, base64] = fullResult.split(",");
      const mimeType = meta.match(/data:(.*);base64/)[1];

      // Atualiza o estado com as informações da imagem
      setInforGeral((prev) =>
        prev.map((item, index) =>
          index === 0
            ? {
                ...item,
                image_base64: base64,
                image_type: mimeType,
              }
            : item
        )
      );
    };

    reader.onerror = (err) => console.error("Erro ao ler imagem:", err);

    reader.readAsDataURL(file);
  };

  // 📝 MANIPULADORES DE INFORMAÇÕES GERAIS (Extraídos para reduzir o aninhamento)

  // Função genérica para atualizar um campo numérico em inforGeral (op, ns, projeto)
  const handleGeneralInfoNumberBlur = (key) => (e) => {
    const value = e.currentTarget.value;
    // Converte o valor para Number na hora da atualização
    setInforGeral((prev) =>
      prev.map((item, index) =>
        index === 0 ? { ...item, [key]: Number(value) || 0 } : item
      )
    );
  };

  // Função genérica para atualizar um campo de texto/data/select em inforGeral (setor, data_ocorrido, ocorrencia)
  const handleGeneralInfoStringChange = (key) => (e) => {
    const value = e.currentTarget.value;
    setInforGeral((prev) =>
      prev.map((item, index) => (index === 0 ? { ...item, [key]: value } : item))
    );
  };

  // ⏳ useEffect: Configurações iniciais ao montar o componente
  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.width = "100%";
    document.body.style.display = "flex";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.title = "JIMP-CORE";
    
    // Configurações de links e ícones
    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";
    document.head.appendChild(fontLink);
    // ... (restante das configurações de links e ícones omitidas)
  }, []);

  // 🎨 ESTILOS DE COMPONENTES (Mantidos como estavam)
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

  // ⚛️ RENDERIZAÇÃO DO COMPONENTE
  return (
    <div style={{ ...styleObj.background }}>
      <div style={{ ...st_topDiv }}>
        {/* Botão Home */}
        <button
          style={{ ...st_homeBtn }}
          onClick={() => (window.location.href = "/")}
        ></button>
        {/* Título */}
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
        {/* Botão Logout */}
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
            {/* Título da Seção */}
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

            {/* Seção 1: Informações Gerais */}
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

              {/* Campo OP */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onBlur={handleGeneralInfoNumberBlur("op")}
                />
              </div>

              {/* Campo Nº de Série */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onBlur={handleGeneralInfoNumberBlur("ns")}
                />
              </div>

              {/* Campo Setor */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onChange={handleGeneralInfoStringChange("setor")}
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

              {/* Campo Data do ocorrido */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onChange={handleGeneralInfoStringChange("data_ocorrido")}
                />
              </div>

              {/* Campo Projeto/Peça */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onBlur={handleGeneralInfoNumberBlur("projeto")}
                />
              </div>

              {/* Campo Imagem */}
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  gap: "15px",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <label style={{ width: "50%" }}>Adicionar imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ ...styleObj.inputFile, width: "50%" }}
                  onChange={handleImageUpload} // Função já estava extraída
                />
              </div>

              {/* Campo Ocorrência (Descrição) */}
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
                  // 🎯 Refatoração: Uso do manipulador extraído
                  onBlur={handleGeneralInfoStringChange("ocorrencia")}
                />
              </div>
            </div>

            {/* Seção 2: Materiais */}
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
                        // 📝 Funções de edição de Material no corpo do Map (ainda 4 níveis, mas limpo)
                        const handleMaterialEdit = (key) => (e) =>
                          editMaterial(
                            setMateriais,
                            materiais,
                            index,
                            key,
                            e.currentTarget.value,
                            setTotalMateriais
                          );

                        return (
                          <tr key={item.id}>
                            <td>
                              <input
                                defaultValue={item.codigo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleMaterialEdit("codigo")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.descricao}
                                style={styleObj.tableInput}
                                type="text"
                                onBlur={handleMaterialEdit("descricao")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.quantidade}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleMaterialEdit("quantidade")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.valorUnitario}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleMaterialEdit("valorUnitario")}
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

            {/* Seção 3: Serviços */}
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
                        // 📝 Funções de edição de Serviço no corpo do Map (ainda 4 níveis, mas limpo)
                        const handleServiceEdit = (key) => (e) =>
                          editServices(
                            setServicos,
                            servicos,
                            index,
                            key,
                            e.currentTarget.value,
                            setTotalServicos
                          );

                        return (
                          <tr key={item.id}>
                            <td>
                              <input
                                defaultValue={item.codigo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleServiceEdit("codigo")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.descricao}
                                style={styleObj.tableInput}
                                type="text"
                                onBlur={handleServiceEdit("descricao")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.tempo}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleServiceEdit("tempo")}
                              />
                            </td>
                            <td>
                              <input
                                defaultValue={item.valorUnitario}
                                style={styleObj.tableInput}
                                type="number"
                                onBlur={handleServiceEdit("valorUnitario")}
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

            {/* Seção 4: Plano de Ação */}
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

            {/* Botão Salvar */}
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