import { useState, useEffect } from "react";
import {
  menuItem,
  loadingBox,
  loadingLabel,
} from "../src/styles/containers/containers";
import setDimensions from "../src/dimensions/default.dimensions";
import { stylesColor } from "../src/styles/colors/styles.color";
import { logout, resultFetch } from "../src/utils/dafaults.fn";
import jwt from "jsonwebtoken";


// =======================================================
// 1. FUNÇÃO AUXILIAR PARA ESTILOS DE ÍCONES (CORRIGIDA E NO TOPO)
// =======================================================
/**
 * Constrói o objeto de estilo CSS para ícones, lidando com a lógica Mobile/Desktop.
 */
const getIconStyle = (url, isMobile, baseSize = "50px", mobileSize = "30px", margin = 0) => {
    // Lógica para tamanhos especiais (como user/structure)
    const size = url.includes('structure_handler') || url.includes('user') || url.includes('editar')
        ? (isMobile ? "40px" : baseSize)
        : (isMobile ? mobileSize : baseSize);

    let marginStyle = {};
    if (margin !== 0) {
        marginStyle = url.includes('logout') ? { marginRight: margin } : { marginLeft: margin };
    }

    return {
        backgroundImage: `url('${url}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
        width: size,
        height: size,
        boxSizing: "border-box",
        ...marginStyle,
    };
};

// =======================================================
// 2. FUNÇÃO AUXILIAR PARA O CONTEÚDO DO MÓDULO (CORRIGIDA E NO TOPO)
// =======================================================
const ModuleContent = (props) => {
    const { module, st_translucedDiv, st_translucedBox, scImage, editImg, userImage, settings, problem, setLoading, isMobile } = props;

    const createBoxProps = (url, label, path) => ({
        style: st_translucedBox,
        onMouseEnter: (e) => (e.currentTarget.style.border = "2px solid orange"),
        onMouseLeave: (e) => (e.currentTarget.style.border = ""),
        onClick: () => {
            setLoading(true);
            window.location.href = path;
        },
        children: (
            <>
                <a style={url} />
                <label style={{ padding: "10px" }}>{label}</label>
            </>
        ),
    });

    if (module === 3) {
        return (
            <div style={{ ...st_translucedDiv, justifyContent: "flex-start", alignItems: "flex-start", }}>
                <div {...createBoxProps(scImage, "Preencher novo checklist", "/Quality/checklist")} />
                <div {...createBoxProps(editImg, "Consultar checklists", "/Quality/editChecklist")} />
                <div {...createBoxProps(settings, "Parâmetros do checklist", "/Quality/quality")} />
                <div {...createBoxProps(problem, "Abrir nova RNC", "/Quality/rnc")} />
                <div {...createBoxProps(editImg, "Consultar RNC", "/Quality/openRNC")} />
            </div>
        );
    }
    if (module === 4) {
        return (
            <div style={st_translucedDiv}>
                <div {...createBoxProps(userImage, "Cadastro de usuários", "/Infra/users")} />
            </div>
        );
    }
    return <div style={st_translucedDiv}>Selecione um módulo no menu lateral.</div>;
};


// =======================================================
// 3. COMPONENTE AUXILIAR PARA O LAYOUT PRINCIPAL (CORRIGIDO E NO TOPO)
// Nota: MainLayout não é estritamente necessário se não for chamado em Home
// Porém, para manter a consistência da refatoração anterior, ela foi mantida como parte do escopo resolvido.
// =======================================================
const MainLayout = ({ props, children, st_topDiv, st_homeBtn, st_logoutBtn }) => {
    return (
        <div
            style={{
                flexDirection: "column",
                display: "flex",
                height: "100vh",
                width: "100%",
            }}
        >
            <div style={{ ...st_topDiv }}>
                <button
                    style={st_homeBtn}
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
                    onClick={() => logout(props.setLoading)}
                ></button>
            </div>
            {children}
        </div>
    );
};
// --- FIM DAS FUNÇÕES AUXILIARES ---

// =======================================================
// GETSERVERSIDEPROPS (MANTIDO)
// =======================================================
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

// =======================================================
// COMPONENTE HOME (CORPO CORRIGIDO)
// =======================================================
export default function Home(props) {
  // 1. Definição de Estado (Mantida)
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState(3);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [saleZoom, setSaleZoom] = useState(false);
  const [saleId, setSaleId] = useState("");

  // 2. Helpers/Dimensions (Mantidos)
  const dimensions = setDimensions(props.isMobile);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);
  const mnItem = menuItem(dimensions);

  // --- 3. Declaração de Estilos (REFACTOR PARA COMPLEXIDADE BAIXA) ---
  // Esta seção AGORA TEM ACESSO a getIconStyle, resolvendo o erro.
  const iconBaseSize = "50px";
  const iconMobileSize = "30px";
  const margin = props.isMobile ? "10px" : "20px";

  // Usando a função auxiliar getIconStyle para simplificar a lógica
  const logoutImg = getIconStyle('/icons/logout.png', props.isMobile, iconBaseSize, iconMobileSize, margin);
  const homeImg = getIconStyle('/icons/icon1.png', props.isMobile, iconBaseSize, iconMobileSize, margin);
  
  // Estilos de Ícones de Módulo
  const settings = getIconStyle('/icons/setings.png', props.isMobile, iconBaseSize, iconMobileSize);
  const problem = getIconStyle('/icons/Problema.png', props.isMobile, iconBaseSize, iconMobileSize);
  const scImage = getIconStyle('/icons/structure_handler.png', props.isMobile, iconBaseSize, iconMobileSize);
  const userImage = getIconStyle('/icons/user.png', props.isMobile, iconBaseSize, iconMobileSize);
  const quality = getIconStyle('/icons/quality.png', props.isMobile, iconBaseSize, iconMobileSize);
  const infra = getIconStyle('/icons/infra.png', props.isMobile, iconBaseSize, iconMobileSize);
  const support = getIconStyle('/icons/support.png', props.isMobile, iconBaseSize, iconMobileSize);
  const editImg = getIconStyle('/icons/editar.png', props.isMobile, iconBaseSize, iconMobileSize); // Usa 40px/50px internamente

  // Estilos de Layout (Mantidos)
  const mainBkgImage = {
    backgroundImage: "url('/images/background/model8.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  };

  const st_topDiv = {
    display: "flex",
    color: "white",
    backgroundColor: stylesColor.dark.blue1,
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
    width: props.isMobile ? "30px" : "40px", 
    height: props.isMobile ? "30px" : "40px", 
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };


  const st_sidebarDiv = {
    display: "flex",
    width: props.isMobile ? "70px" : "250px",
    backgroundColor: "#010B40",
    flexDirection: "column",
  };

  const st_translucedDiv = {
    justifyContent: props.isMobile ? "flex-start" : "flex-start",
    alignItems: "top",
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

  const st_translucedBox = {
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing: "border-box",
    borderRadius: "10px",
    height: props.isMobile ? "50px" : "100px",
    cursor: "pointer",
    margin: props.isMobile ? "15px" : "30px",
    fontSize: props.isMobile ? "12px" : "15px",
    padding: props.isMobile ? "5px" : "15px",
    width: props.isMobile ? "100%" : "300px",
    marginRight: props.isMobile ? "0px" : "20px",
  };


  // --- 4. Efeitos (Mantidos) ---
  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.display = "block";
    document.documentElement.style.display = "block";

    document.title = "CORE-JIMP";
    // Nota: A manipulação direta de DOM (document.createElement) deve ser
    // evitada em useEffect no React, mas foi mantida para replicar o original.
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);

    if (module === 1.1) {
      // resumeSales(setSales, setLastSales, setAllSales, setFilteredSale); // Funções internas removidas
    }

    if (saleId !== "") {
      const url = `/Sales/openBudget?sid=${encodeURIComponent(saleId)}`;
      setSaleId("");
      window.open(url);
    }
  }, [module, saleId]);

  // --- 5. Função Dinâmica de Estilo de Menu (Mantida) ---
  const getMenuItemStyle = (itemModule) => {
    let backgroundColor = "";

    const currentMainModule = Math.floor(module);

    if (itemModule === currentMainModule) {
      backgroundColor = stylesColor.dark.orange0;
    } else if (hoveredItem === itemModule) {
      backgroundColor = "gray";
    }
    // Retorna o estilo base (mnItem) mais a cor de fundo e alinhamento
    return { ...mnItem, backgroundColor, display: "flex", alignItems: "center", padding: props.isMobile ? "10px" : "15px" };
  };

  // --- 6. Renderização (Refatorada para usar o ModuleContent) ---
  return (
    <>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100vh",
          width: "100%",
        }}
      >
        {/* TOP BAR */}
        <div style={{ ...st_topDiv }}>
          <button
            style={st_homeBtn}
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

        {/* SIDEBAR AND MAIN CONTENT WRAPPER */}
        <div style={{ display: "flex", width: "100%", flex: 1, flexDirection: props.isMobile ? "column" : "row" }}>
          
          {/* SIDEBAR */}
          <div style={{ ...st_sidebarDiv }}>
            {[
                { id: 3, label: 'Qualidade', style: quality },
                { id: 4, label: 'Infra', style: infra },
            ].map(({ id, label, style }) => (
                <label
                    key={id}
                    style={getMenuItemStyle(id)}
                    onClick={() => setModule(id)}
                    onMouseEnter={() => setHoveredItem(id)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <a style={style} />
                    <label style={{ paddingLeft: "10px", display: props.isMobile ? 'none' : 'block' }}>{label}</label>
                </label>
            ))}
            {/* Adicionar outros itens de menu aqui, se necessário */}
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ ...mainBkgImage, flex: 1, overflowY: 'auto' }}>
            <ModuleContent
                module={module}
                isMobile={props.isMobile}
                st_translucedDiv={st_translucedDiv}
                st_translucedBox={st_translucedBox}
                scImage={scImage}
                editImg={editImg}
                userImage={userImage}
                settings={settings}
                problem={problem}
                setLoading={setLoading}
            />
          </div>
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div style={{ ...lgBox, position: "fixed" }}>
          <label style={lgLabel}>Carregando...</label>
        </div>
      )}
      {saleZoom}
    </>
  );
}