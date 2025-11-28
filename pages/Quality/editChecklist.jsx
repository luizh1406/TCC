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

async function listOfChecklist(setLoading, setLtCheckList, setClChecklistIMG) {
  setLoading(true);

  const res = await fetch("/api/get/quality/editChecklist");
  const data = await resultFetch(res);

  const resIMG = await fetch("/api/get/quality/checklistIMG");
  const dataIMG = await resultFetch(resIMG);
  await setClChecklistIMG(dataIMG);
  await setLtCheckList(data);

  setLoading(false);
}

function filterChecklist(
  setLoading,
  ltCheckList,
  nsProduto,
  setSelectedCk,
  setIdList
) {
  // Função para filtrar o checklist com base na nsProduto

  setLoading(true);
  const filteredCk = ltCheckList.filter((ft) =>
    String(ft.ns ?? "").includes(String(nsProduto ?? ""))
  );
  // A Map garante que cada chave (nossa 'ns') seja única.
  const uniqueMap = new Map();

  filteredCk.forEach((item) => {
    // Se a chave (item.ns) ainda não existir no mapa, nós a adicionamos.
    // Se já existir, nada acontece, e o valor antigo é mantido.
    if (!uniqueMap.has(item.ns)) {
      uniqueMap.set(item.ns, {
        ns: item.ns,
        nome: item.nome,
        setor: item.setor,
      });
    }
  });

  // Por fim, convertemos os valores do mapa de volta para um array.
  const list = Array.from(uniqueMap.values());

  setIdList(list);
  setSelectedCk(filteredCk);
  setLoading(false);
}

function selectChecklist(
  setLoading,
  ltCheckList,
  ns,
  setSelectedCk,
  setReady,
  setNsProduto,
  mixed,
  clChecklistIMG
) {
  setLoading(true);
  setNsProduto(ns);
  const filteredCk = ltCheckList.filter((ft) => String(ft.ns) === String(ns));
  const filteredMixed = clChecklistIMG.filter(
    (ft) => String(ft.ns) === String(ns)
  );

  setSelectedCk([...filteredCk, ...filteredMixed]);
  setReady(true);
  setLoading(false);
}

async function saveChecklist(setLoading, selectedCk, nsProduto, user) {
  setLoading(true);

  if (!nsProduto || nsProduto.trim() === "") {
    alert("Por favor, insira a NS do produto.");
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append("nsProduto", nsProduto);
  formData.append("userEmail", user.email);

  for (const line of selectedCk) {
    if (line.preenchimento === "Foto") {
      const input = document.getElementById(line.codigo_pergunta);
      const file = input && input.files && input.files[0];
      if (file) {
        formData.append(line.codigo_pergunta, file);
      } else {
        // Se não houver foto, envie uma flag para o backend.
        formData.append(line.codigo_pergunta, "SEM FOTO");
      }
    } else {
      let resposta;
      if (line.preenchimento === "Verdadeiro ou falso") {
        resposta = document.getElementById(line.codigo_pergunta).checked
          ? "Verdadeiro"
          : "Falso";
      } else {
        resposta = document.getElementById(line.codigo_pergunta).value;
      }
      // Anexe todos os dados do checklist ao FormData
      formData.append(line.codigo_pergunta, resposta);
      formData.append(`${line.codigo_pergunta}_info`, JSON.stringify(line));
    }
  }

  try {
    const response = await fetch("/api/add/quality/clChecklist", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      alert("Checklist salvo com sucesso!");
      window.location.reload();
    } else {
      alert("Erro ao salvar o checklist. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro na requisição. Verifique a conexão.");
  }

  setLoading(false);
}

export default function sh(props) {
  const [loading, setLoading] = useState(false);
  const [selectCk, setSelectCk] = useState(true);
  const [ltCheckList, setLtCheckList] = useState([]);
  const [selectedCk, setSelectedCk] = useState([]);
  const [nsProduto, setNsProduto] = useState("");
  const [idsList, setIdList] = useState([]);
  const [ready, setReady] = useState(false);
  const [clChecklistIMG, setClChecklistIMG] = useState([]);
  const [mixed, setMixed] = useState([]);

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

    if (nsProduto === "" || nsProduto === null) {
      listOfChecklist(setLoading, setLtCheckList, setClChecklistIMG, setMixed);
    } else {
      filterChecklist(
        setLoading,
        ltCheckList,
        nsProduto,
        setSelectedCk,
        setIdList
      );
    }
  }, [nsProduto]);

  const dimensions = setDimensions(props.isMobile);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);

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

  function setInputfoto(e, ref) {
    const file = e.target.files[0];
    if (file && ref.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        ref.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    boxSizing: "border-box",
  };

  function bufferParaBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // evita estouro de memória
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
  }

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
              Edição de checklist {nsProduto && `- NS: ${nsProduto}`}
            </label>
            {selectCk && !ready && (
              <>
                <div
                  style={{
                    ...st_translucedBox,
                    marginTop: "10px",
                    flexDirection: "column",
                  }}
                >
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      padding: "10px",
                      borderBottom: "2px solid white",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Escolha o checklist a ser preenchido
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      height: "100%",
                      marginTop: "15px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    ...st_translucedBox,
                    marginTop: "10px",
                    flexDirection: "column",
                  }}
                >
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      padding: "10px",
                      borderBottom: "2px solid white",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Informe a NS do produto
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    inputMode="numeric"
                    onChange={(e) => {
                      setIdList([]);
                      setNsProduto(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
            {selectCk && !ready && (
              <>
                <div
                  style={{
                    ...st_translucedBox,
                    marginTop: "10px",
                    flexDirection: "column",
                  }}
                >
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      padding: "10px",
                      borderBottom: "2px solid white",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#010B40",
                    }}
                  >
                    Escolha o checklist a ser editado
                  </label>
                </div>
              </>
            )}
            {idsList.length > 0 &&
              !ready &&
              idsList.map((line) => {
                return (
                  <div
                    key={line.nome + line.setor}
                    style={{
                      ...st_translucedBox,
                      marginTop: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      onClick={() =>
                        selectChecklist(
                          setLoading,
                          ltCheckList,
                          line.ns,
                          setSelectedCk,
                          setReady,
                          setNsProduto,
                          mixed,
                          clChecklistIMG
                        )
                      }
                      id={line.ns}
                    >
                      Nome: {line.nome} / Setor: {line.setor} - NS: {line.ns}
                    </label>
                  </div>
                );
              })}
            {selectedCk &&
              ready &&
              selectedCk
                .sort((a, b) => a.sequencia - b.sequencia)
                .map((line) => {
                  const boxStyle = {
                    ...st_translucedBox,
                    marginTop: "10px",
                  };

                  switch (line.preenchimento) {
                    case "Numérico":
                      return (
                        <div
                          key={line.codigo_pergunta}
                          style={{ ...boxStyle, flexDirection: "column" }}
                        >
                          <label style={{ width: "100%" }}>
                            {line.descricao}
                          </label>
                          <input
                            id={line.codigo_pergunta}
                            style={inputStyle}
                            type="number"
                            inputMode="numeric"
                            value={line.value || ""}
                          />
                        </div>
                      );

                    case "Texto":
                      return (
                        <div
                          key={line.codigo_pergunta}
                          style={{ ...boxStyle, flexDirection: "column" }}
                        >
                          <label>{line.descricao}</label>
                          <input
                            id={line.codigo_pergunta}
                            style={inputStyle}
                            type="text"
                            value={line.value || ""}
                          />
                        </div>
                      );
                    case "Verdadeiro ou falso":
                      return (
                        <div
                          key={line.codigo_pergunta}
                          style={{
                            ...boxStyle,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <label
                            style={{
                              paddingRight: "5px",
                              borderRight: "2px solid white",
                              width: "100%",
                            }}
                          >
                            {line.descricao}
                          </label>
                          <input
                            id={line.codigo_pergunta}
                            style={{ paddingLeft: "5px", width: "50px" }}
                            type="checkbox"
                            checked={line.value === "Verdadeiro"}
                          />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
            {selectedCk && ready && selectedCk.length > 0 && (
              <div
                style={{
                  ...st_translucedBox,
                  marginTop: "10px",
                  flexDirection: "row",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    saveChecklist(setLoading, selectedCk, nsProduto, props.user)
                  }
                >
                  Enviar checklist
                </button>
              </div>
            )}
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
