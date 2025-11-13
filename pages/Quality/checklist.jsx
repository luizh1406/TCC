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

async function listOfChecklist(setLoading, setLtCheckList, setChecklists) {
  setLoading(true);

  const res = await fetch("/api/get/quality/list_of_checklist");
  const data = await resultFetch(res);

  const resCk = await fetch("/api/get/quality/checklists");
  const dataCk = await resultFetch(resCk);

  await setLtCheckList(data);
  await setChecklists(dataCk);

  setLoading(false);
}

function printCkSelected(
  setLoading,
  checklists,
  ckGroup,
  ckFamily,
  setor,
  nome,
  setSelectedCk,
  selectedCk,
  setSelectCk
) {
  setLoading(true);

  const filteredChecklist = checklists.filter(
    (ft) =>
      ft.linha === ckGroup &&
      ft.familia === ckFamily &&
      ft.setor === setor &&
      ft.nome === nome
  );
  console.log(filteredChecklist);
  setSelectedCk(filteredChecklist);
  setSelectCk(false);

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
        formData.append(line.codigo_pergunta, "SEM FOTO");
      }
      // 🔹 sempre envie o _info também!
      formData.append(`${line.codigo_pergunta}_info`, JSON.stringify(line));
    } else {
      let resposta;
      if (line.preenchimento === "Verdadeiro ou falso") {
        resposta = document.getElementById(line.codigo_pergunta).checked
          ? "Verdadeiro"
          : "Falso";
      } else {
        resposta = document.getElementById(line.codigo_pergunta).value;
      }
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
  const [ckGroup, setCkGroup] = useState("Semirreboque");
  const [selectCk, setSelectCk] = useState(true);
  const [ckFamily, setckFamily] = useState("Furgão");
  const [ltCheckList, setLtCheckList] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [selectedCk, setSelectedCk] = useState([]);
  const [nsProduto, setNsProduto] = useState("");

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

    console.log("User Agent:", props.user);

    listOfChecklist(setLoading, setLtCheckList, setChecklists);
  }, []);

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

  const selectInputStyles = {
    selectBase: {
      width: "100%",
      padding: "10px 15px",
      marginBottom: "20px",
      marginTop: "20px",
      fontSize: "16px",
      color: "#FFFFFF",
      backgroundColor: "rgba(12, 21, 57, 0.8)",
      border: "1px solid #5A5A5A",
      borderRadius: "4px",
      outline: "none",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      cursor: "pointer",
      backgroundImage:
        'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M5.9%2C8.8L1.6%2C4.5c-0.1-0.1-0.1-0.3%2C0-0.4l0.4-0.4c0.1-0.1%2C0.3-0.1%2C0.4%2C0L6%2C7.6l3.6-3.6c0.1-0.1%2C0.3-0.1%2C0.4%2C0l0.4%2C0.4c0.1%2C0.1%2C0.1%2C0.3%2C0%2C0.4L6.1%2C8.8C6%2C8.9%2C5.9%2C8.9%2C5.9%2C8.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "12px",
    },
    optionItem: {
      color: "#333333",
      backgroundColor: "#FFFFFF",
    },
    placeholderOption: {
      color: "#A0A0A0",
    },
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
          <div style={{ ...st_translucedDiv }}>
            <label style={{ ...st_moduleTitle }}>
              Parâmetros do módulo de qualidade
            </label>
            {selectCk && (
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
                    Escolha a linha do produto
                  </label>
                  <select
                    id="ck-group"
                    style={selectInputStyles.selectBase}
                    onChange={() =>
                      setCkGroup(document.getElementById("ck-group").value)
                    }
                  >
                    <option>Semirreboque</option>
                    <option>Sobrechassi</option>
                  </select>
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
                    Escolha a familia do produto
                  </label>
                  <select
                    id="ck-family"
                    style={selectInputStyles.selectBase}
                    onChange={() =>
                      setckFamily(document.getElementById("ck-family").value)
                    }
                  >
                    {ckGroup === "Semirreboque" && (
                      <>
                        <option>Furgão</option>
                        <option>Lonado</option>
                        <option>Carga seca</option>
                        <option>Graneleiro</option>
                        <option>Bobineiro</option>
                      </>
                    )}
                    {ckGroup === "Sobrechassi" && (
                      <>
                        <option>Furgão</option>
                        <option>Lonado</option>
                        <option>Carga seca</option>
                        <option>Basculante</option>
                      </>
                    )}
                  </select>
                </div>
              </>
            )}
            {selectCk && ltCheckList && (
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
                    Escolha o checklist a ser preenchido
                  </label>
                </div>
              </>
            )}
            {selectCk &&
              ltCheckList &&
              ltCheckList
                .filter((ft) => ft.linha === ckGroup && ft.familia === ckFamily)
                .map((line) => {
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
                          printCkSelected(
                            setLoading,
                            checklists,
                            ckGroup,
                            ckFamily,
                            line.setor,
                            line.nome,
                            setSelectedCk,
                            selectedCk,
                            setSelectCk
                          )
                        }
                      >
                        Nome: {line.nome} / Setor: {line.setor}
                      </label>
                    </div>
                  );
                })}
            {selectedCk && selectedCk.length > 0 && (
              <div
                style={{
                  ...st_translucedBox,
                  marginTop: "10px",
                  flexDirection: "row",
                }}
              >
                <label>Informe a NS do produto</label>
                <input
                  id="ns-produto"
                  style={{ ...inputStyle, marginLeft: "10px" }}
                  type="number"
                  inputMode="numeric"
                  onChange={() =>
                    setNsProduto(document.getElementById("ns-produto").value)
                  }
                />
              </div>
            )}
            {selectedCk &&
              selectedCk
                .sort((a, b) => a.sequencia - b.sequencia)
                .map((line) => {
                  if (line.preenchimento === "Numérico") {
                    return (
                      <div
                        key={line.codigo_pergunta}
                        style={{
                          ...st_translucedBox,
                          marginTop: "10px",
                          flexDirection: "column",
                        }}
                      >
                        <label style={{ width: "100%" }}>
                          {line.descricao}
                        </label>
                        <input
                          id={line.codigo_pergunta}
                          style={inputStyle}
                          type="number"
                          inputmode="numeric"
                        />
                      </div>
                    );
                  } else if (line.preenchimento === "Texto") {
                    return (
                      <div
                        key={line.codigo_pergunta}
                        style={{
                          ...st_translucedBox,
                          marginTop: "10px",
                          flexDirection: "column",
                        }}
                      >
                        <label>{line.descricao}</label>
                        <input
                          id={line.codigo_pergunta}
                          style={inputStyle}
                          type="text"
                        />
                      </div>
                    );
                  } else if (line.preenchimento === "Foto") {
                    return (
                      <div
                        key={line.codigo_pergunta}
                        style={{
                          ...st_translucedBox,
                          marginTop: "10px",
                          flexDirection: "column",
                        }}
                      >
                        <label style={{ width: "100%" }}>
                          {line.descricao}
                        </label>
                        <input
                          id={line.codigo_pergunta}
                          style={inputStyle}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setInputfoto(e, `foto-${line.codigo_pergunta}`)
                          }
                        />
                      </div>
                    );
                  } else if (line.preenchimento === "Verdadeiro ou falso") {
                    return (
                      <div
                        key={line.codigo_pergunta}
                        style={{
                          ...st_translucedBox,
                          marginTop: "10px",
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
                        />
                      </div>
                    );
                  }
                })}
            {selectedCk && selectedCk.length > 0 && (
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
export { listOfChecklist, printCkSelected, saveChecklist };
