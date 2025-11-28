import { useState, useEffect } from "react";
import { logout, resultFetch } from "../../src/utils/dafaults.fn";
import {
  loadingBox,
  loadingLabel,
} from "../../src/styles/containers/containers";
import setDimensions from "../../src/dimensions/default.dimensions";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";
  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );
  return { props: { isMobile, userAgent } };
}

async function saveCk(
  ckGroup,
  ckFamily,
  ckName,
  ckSetor,
  questionCont,
  setLoading,
  setQuestionCont
) {
  setLoading(true);

  let questions = [];
  let block = false;

  if (ckGroup === "" || ckFamily === "" || ckName === "" || ckSetor === "") {
    alert("Preencha todas as informações necessárias");
    block = true;
  } else {
    let cont = 1;
    while (cont < questionCont) {
      if (document.getElementById(`d-${cont}`)) {
        const sequencia = document.getElementById(`s-${cont}`).value;
        const descricao = document.getElementById(`d-${cont}`).value;
        const preenchimento = document.getElementById(`p-${cont}`).value;
        if (sequencia === "" || descricao === "" || preenchimento === "") {
          block = true;
        }
        questions.push({
          nome: ckName,
          linha: ckGroup,
          familia: ckFamily,
          setor: ckSetor,
          sequencia: sequencia,
          descricao: descricao,
          preenchimento: preenchimento,
          codigo_pergunta: `d-${cont}`,
        });
      }
      cont++;
    }
  }

  if (block) {
    alert("Preencha todas as informações necessárias");
  } else {
    await fetch("/api/add/quality/addCk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questions),
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

    location.reload();
  }

  setLoading(false);
}

export default function sh(props) {
  const [loading, setLoading] = useState(false);
  const [ckGroup, setCkGroup] = useState("Semirreboque");
  const [ckFamily, setckFamily] = useState("Furgão");
  const [ckName, setCkName] = useState("");
  const [ckSetor, setCkSetor] = useState("");
  const [questionCont, setQuestionCont] = useState(1);

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

  const st_rowDiv = {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignContent: "center",
    padding: "15px",
  };

  const st_button = {
    width: "200px",
    height: "50px",
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "10px 5px",
    cursor: "pointer",
  };

  const trash = {
    backgroundImage: "url('/icons/trash.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    backgroundColor: "red",
    borderRadius: "5px",
  };

  function addQuestion() {
    const table = document.getElementById("questions-table");

    const row = document.createElement("div");
    for (const prop in st_rowDiv) {
      if (st_rowDiv.hasOwnProperty(prop)) {
        row.style[prop] = st_rowDiv[prop];
      }
    }
    row.style.padding = "0";
    row.style.paddingLeft = "15px";
    row.id = questionCont;

    const sequencia = document.createElement("input");
    sequencia.id = `s-${questionCont}`;
    sequencia.type = "number";
    sequencia.style.width = "30%";
    sequencia.style.textAlign = "center";

    const descricao = document.createElement("input");
    descricao.id = `d-${questionCont}`;
    descricao.type = "text";
    descricao.style.width = "30%";

    const preenchimento = document.createElement("select");
    preenchimento.id = `p-${questionCont}`;
    preenchimento.style.width = "30%";
    preenchimento.style.marginRight = "15px";

    const opNumber = document.createElement("option");
    opNumber.value = "Numérico";
    opNumber.textContent = "Numérico";

    const opText = document.createElement("option");
    opText.value = "Texto";
    opText.textContent = "Texto";

    const opCheck = document.createElement("option");
    opCheck.value = "Verdadeiro ou falso";
    opCheck.textContent = "Verdadeiro ou falso";

    const divDelete = document.createElement("div");
    for (const prop in trash) {
      if (trash.hasOwnProperty(prop)) {
        divDelete.style[prop] = trash[prop];
      }
    }
    divDelete.addEventListener("click", () => {
      removeQuestion(questionCont);
    });

    preenchimento.appendChild(opNumber);
    preenchimento.appendChild(opText);
    preenchimento.appendChild(opCheck);

    row.appendChild(sequencia);
    row.appendChild(descricao);
    row.appendChild(preenchimento);
    row.appendChild(divDelete);

    table.appendChild(row);

    setQuestionCont(questionCont + 1);
  }

  function removeQuestion(id) {
    document.getElementById(id).remove();
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
          <div style={{ ...st_translucedDiv }}>
            <label style={{ ...st_moduleTitle }}>
              Parâmetros do módulo de qualidade
            </label>
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
                Cadastro de checklist
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                  marginTop: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div style={{ ...st_rowDiv }}>
                    <label style={{ width: "100%" }}>
                      Informe para qual linha de produto:
                    </label>
                    <select
                      id="ck-group"
                      style={{ width: "100%" }}
                      onChange={() =>
                        setCkGroup(document.getElementById("ck-group").value)
                      }
                    >
                      <option>Semirreboque</option>
                      <option>Sobrechassi</option>
                    </select>
                  </div>
                  <div style={{ ...st_rowDiv }}>
                    <label style={{ width: "100%" }}>
                      Informe a familia de produto:
                    </label>
                    <select
                      id="ck-family"
                      style={{ width: "100%" }}
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
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    marginRight: "15px",
                  }}
                >
                  <div style={{ ...st_rowDiv }}>
                    <label
                      style={{
                        width: "100%",
                        paddingLeft: "10px",
                        textAlign: "right",
                        paddingRight: "15px",
                      }}
                    >
                      Nome do checklist:
                    </label>
                    <input
                      id="ck-name"
                      style={{ width: "100%" }}
                      onChange={() =>
                        setCkName(document.getElementById("ck-name").value)
                      }
                    />
                  </div>
                  <div style={{ ...st_rowDiv }}>
                    <label
                      style={{
                        width: "100%",
                        paddingLeft: "10px",
                        textAlign: "right",
                        paddingRight: "15px",
                      }}
                    >
                      Setor:
                    </label>
                    <input
                      id="ck-setor"
                      style={{ width: "100%" }}
                      onChange={() =>
                        setCkSetor(document.getElementById("ck-setor").value)
                      }
                    />
                  </div>
                </div>
              </div>
              <label
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "10px",
                  borderTop: "2px solid white",
                  borderBottom: "2px solid white",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Cadastro de checklist
              </label>
              <div
                id="questions-table"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div style={{ ...st_rowDiv }}>
                  <button
                    style={{ ...st_button }}
                    onClick={() => addQuestion()}
                  >
                    Adicionar perguntas
                  </button>
                </div>
                <div style={{ ...st_rowDiv }}>
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      justifyContent: "center",
                      backgroundColor: "#010B40",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Sequência das perguntas
                  </label>
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      justifyContent: "center",
                      backgroundColor: "#010B40",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Descrição da revisão
                  </label>
                  <label
                    style={{
                      width: "100%",
                      height: "30px",
                      justifyContent: "center",
                      backgroundColor: "#010B40",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Preenchimento
                  </label>
                  <label
                    style={{
                      width: "10%",
                      height: "30px",
                      justifyContent: "center",
                      backgroundColor: "#010B40",
                      display: "flex",
                      alignItems: "center",
                      marginRight: "15px",
                    }}
                  ></label>
                </div>
              </div>
              {questionCont > 1 && (
                <>
                  <div style={{ ...st_rowDiv }}>
                    <button
                      style={{ ...st_button }}
                      onClick={() =>
                        saveCk(
                          ckGroup,
                          ckFamily,
                          ckName,
                          ckSetor,
                          questionCont,
                          setLoading,
                          setQuestionCont
                        )
                      }
                    >
                      Gravar
                    </button>
                  </div>
                </>
              )}
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
