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

export default function home(props) {
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState(3);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [saleZoom, setSaleZoom] = useState(false);
  const [saleId, setSaleId] = useState("");

  const dimensions = setDimensions(props.isMobile);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);
  const mnItem = menuItem(dimensions);

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
    backgroundImage: "url('/images/background/model8.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  };

  const settings = {
    backgroundImage: "url('/icons/setings.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    boxSizing: "border-box",
  };

  const problem = {
    backgroundImage: "url('/icons/Problema.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    boxSizing: "border-box",
  };

  const scImage = {
    backgroundImage: "url('/icons/structure_handler.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "40px" : "50px",
    height: props.isMobile ? "40px" : "50px",
    boxSizing: "border-box",
  };

  const userImage = {
    backgroundImage: "url('/icons/user.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "40px" : "50px",
    height: props.isMobile ? "40px" : "50px",
    boxSizing: "border-box",
  };

  const quality = {
    backgroundImage: "url('/icons/quality.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    boxSizing: "border-box",
  };

  const infra = {
    backgroundImage: "url('/icons/infra.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    boxSizing: "border-box",
  };

  const support = {
    backgroundImage: "url('/icons/support.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "30px" : "50px",
    height: props.isMobile ? "30px" : "50px",
    boxSizing: "border-box",
  };

  const editImg = {
    backgroundImage: "url('/icons/editar.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
    width: props.isMobile ? "40px" : "50px",
    height: props.isMobile ? "40px" : "50px",
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
    width: "40px",
    height: "40px",
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
    justifyContent: props.isMobile ? "flex-start" : "center",
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
    width: props.isMobile ? "100%" : "",
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.display = "block";
    document.documentElement.style.display = "block";

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

    if (module === 1.1) {
      resumeSales(setSales, setLastSales, setAllSales, setFilteredSale);
    }

    if (saleId !== "") {
      const url = `/Sales/openBudget?sid=${encodeURIComponent(saleId)}`;
      setSaleId("");
      window.open(url);
    }
  }, [module, saleId]);

  const getMenuItemStyle = (itemModule) => {
    let backgroundColor = "";

    const currentMainModule = Math.floor(module);

    if (itemModule === currentMainModule) {
      backgroundColor = stylesColor.dark.orange0;
    } else if (hoveredItem === itemModule) {
      backgroundColor = "gray";
    }
    return { ...mnItem, backgroundColor };
  };

  if (props.isMobile) {
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
          <div style={{ display: "flex", width: "100%", height: "800px" }}>
            <div style={{ ...st_sidebarDiv }}>
              <label
                id="quality"
                style={getMenuItemStyle(3)}
                onClick={() => setModule(3)}
                onMouseEnter={() => setHoveredItem(3)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a style={{ ...quality }} />
                {!props.isMobile && "Qualidade"}
              </label>
              <label
                id="infra"
                style={getMenuItemStyle(4)}
                onClick={() => setModule(4)}
                onMouseEnter={() => setHoveredItem(4)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a style={{ ...infra }} />
                {!props.isMobile && "Infra"}
              </label>
            </div>
            <div style={{ ...mainBkgImage }}>
              {module === 3 && (
                <div style={{ ...st_translucedDiv }}>
                  <div
                    style={{ ...st_translucedBox }}
                    id="addCheckList"
                    onMouseEnter={() =>
                      (document.getElementById("addCheckList").style.border =
                        "2px solid orange")
                    }
                    onMouseLeave={() =>
                      (document.getElementById("addCheckList").style.border =
                        "")
                    }
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/checklist";
                    }}
                  >
                    <a style={{ ...scImage }} />
                    <label style={{ padding: "10px" }}>
                      Preencher novo checklist
                    </label>
                  </div>
                  <div
                    style={{ ...st_translucedBox }}
                    id="checkListSt"
                    onMouseEnter={() =>
                      (document.getElementById("checkListSt").style.border =
                        "2px solid orange")
                    }
                    onMouseLeave={() =>
                      (document.getElementById("checkListSt").style.border = "")
                    }
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/editChecklist";
                    }}
                  >
                    <a style={{ ...editImg }} />
                    <label style={{ padding: "10px" }}>
                      Completar checklists pendentes
                    </label>
                  </div>
                </div>
              )}
              {module === 4 && (
                <div style={{ ...st_translucedDiv }}>
                  <div
                    style={{ ...st_translucedBox }}
                    id="addSales"
                    onMouseEnter={() =>
                      (document.getElementById("addSales").style.border =
                        "2px solid orange")
                    }
                    onMouseLeave={() =>
                      (document.getElementById("addSales").style.border = "")
                    }
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Infra/users";
                    }}
                  >
                    <a style={{ ...userImage }} />
                    <label style={{ padding: "10px" }}>
                      Cadastro de usuários
                    </label>
                  </div>
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
        {saleZoom}
      </>
    );
  } else {
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
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ ...st_sidebarDiv }}>
              <label
                id="quality"
                style={getMenuItemStyle(3)}
                onClick={() => setModule(3)}
                onMouseEnter={() => setHoveredItem(3)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a style={{ ...quality }} />
                <label style={{ paddingLeft: "10px" }}>
                  {!props.isMobile && "Qualidade"}
                </label>
              </label>
              <label
                id="infra"
                style={getMenuItemStyle(4)}
                onClick={() => setModule(4)}
                onMouseEnter={() => setHoveredItem(4)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <a style={{ ...infra }} />
                <label style={{ paddingLeft: "10px" }}>
                  {!props.isMobile && "Infra"}
                </label>
              </label>
            </div>
            <div style={{ ...mainBkgImage }}>
              {module === 3 && (
                <div
                  style={{
                    ...st_translucedDiv,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{ ...st_translucedBox }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid orange")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.border = "")}
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/checklist";
                    }}
                  >
                    <a style={{ ...scImage }} />
                    <label style={{ padding: "10px" }}>
                      Preencher novo checklist
                    </label>
                  </div>
                  <div
                    style={{ ...st_translucedBox }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid orange")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.border = "")}
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/editChecklist";
                    }}
                  >
                    <a style={{ ...editImg }} />
                    <label style={{ padding: "10px" }}>
                      Consultar Checklist
                    </label>
                  </div>
                  <div
                    style={{ ...st_translucedBox }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid orange")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.border = "")}
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/quality";
                    }}
                  >
                    <a style={{ ...settings }} />
                    <label style={{ padding: "10px" }}>
                      Parâmetros do checklist
                    </label>
                  </div>
                  <div
                    style={{ ...st_translucedBox }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid orange")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.border = "")}
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/rnc";
                    }}
                  >
                    <a style={{ ...problem }} />
                    <label style={{ padding: "10px" }}>Abrir nova RNC</label>
                  </div>
                  <div
                    style={{ ...st_translucedBox }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.border = "2px solid orange")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.border = "")}
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Quality/openRNC";
                    }}
                  >
                    <a style={{ ...editImg }} />
                    <label style={{ padding: "10px" }}>Consultar RNC</label>
                  </div>
                </div>
              )}
              {module === 4 && (
                <div style={{ ...st_translucedDiv }}>
                  <div
                    style={{ ...st_translucedBox }}
                    id="addSales"
                    onMouseEnter={() =>
                      (document.getElementById("addSales").style.border =
                        "2px solid orange")
                    }
                    onMouseLeave={() =>
                      (document.getElementById("addSales").style.border = "")
                    }
                    onClick={() => {
                      setLoading(true);
                      window.location.href = "/Infra/users";
                    }}
                  >
                    <a style={{ ...userImage }} />
                    <label style={{ padding: "10px" }}>
                      Cadastro de usuários
                    </label>
                  </div>
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
        {saleZoom}
      </>
    );
  }
}
