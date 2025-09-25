import {useState, useEffect} from "react";
import {topDiv, sidebarDiv, textLabel, titleLabel, logoutButton, loadingBox, loadingLabel, translucentContainer} from "../src/styles/containers/containers";
import setDimensions from "../src/dimensions/default.dimensions";
import linksList from "../src/utils/linksList";
import { handleSidebar, logout} from "../src/utils/dafaults.fn";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase(),
    );

  return { props: { isMobile, userAgent } };
}

function defaultText(el, dm){
  const homeTexts = [
    "NEXOS - JIMP, um portal dedicado a mostrar as soluções automatizadas desenvolvidas para a nossa empresa. Nosso objetivo é criar ferramentas inovadoras que automatizem processos manuais, facilitando o dia a dia dos nossos colaboradores e tornando a empresa mais eficiente.",
    "NEXOS é projetada para resolver um problema específico ou otimizar um processo manual. Através de uma interface simple e intuitiva, os usuários podem navegar pelas ferramentas que ficam no lado esquedo da tela, no ícone que simboliza o menu, e aplicar automações que economizam tempo e recursos",
    "O NEXOS é um projeto criado com a missão de centralizar as ferramentas que otimizam os processo internos da nossa organização. Ele é a porta de entrada para uma série de ferramentas desenvolvidas para facilitar as operações e promover uma cultura de automação dentro da empresa.",
    "Structure Handler - Uma página já disponível que oferece a solução para reorganizar projetos para importação no ERP. Aqui, o usuário entrega seu arquivo e rearranjamos ele pra você. Por agora sua tarefa seria somente baixar e importar pro sistema, mas no futuro pretendemos linkar com o ERP e o sistema de importação ser automático.",
    "Sale Order (Em construção ): Uma ferramenta inteligente para preencher pedidos de venda, projetada para minimizar erros e melhorar a qualidade do processo. Por meio de um questionário dinâmico, onde cada resposta ajusta automaticamente a próxima pergunta, o sistema guia o usuário de forma prática e eficiente. Com isso, garantimos um preenchimento preciso e alinhado às necessidades do cliente, otimizando o tempo e reduzindo retrabalhos.",
    "Ferramentas Futuras: Estamos constantemente desenvolvendo novas ferramentas para atender às necessidades da nossa empresa. Fique de olho nas atualizações!",
    "Próximos Passos Novas ferramentas: Continuamos o desenvolvimento de novas ferramentas que ajudarão ainda mais na automação de tarefas.",
    "Melhorias de Usabilidade: A interface e a navegação estão sendo aprimoradas para garantir uma experiência ainda melhor para os usuários.",
    "Fique atualizado! Caso tenha sugestões ou queira compartilhar sua experiência, entre em contato conosco. Valorizamos o seu retorno!",
  ];

  console.log("adentrei")

  homeTexts.forEach((text)=>{
    const label = document.createElement("label");
    label.textContent = text;

    const lbStyle = textLabel(dm);
    console.log(lbStyle);
    Object.assign(label.style, lbStyle);
    label.style.boxSizing = "border-box";

    el.appendChild(label);
  });
}

export default function home(props){
  const [sidebar, setSidebar] = useState("");
  const [menuButton, setMenuButton] = useState("");
  const [loading, setLoading] = useState(false);

  const dimensions = setDimensions(props.isMobile);
  const tpDiv = topDiv(dimensions);
  const sbDiv = sidebarDiv(dimensions);
  const ttStyle = titleLabel(dimensions);
  const logoutBtn = logoutButton(dimensions);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions);
  const trContainer = translucentContainer(dimensions);

  const sbOptions = linksList.sidebarOptions;

  const menuIcon = {
    height: dimensions.menuIcon.height,
    width: dimensions.menuIcon.width,
    margin: dimensions.menuIcon.margin,
    padding: dimensions.menuIcon.padding,
    backgroundImage: "url('/icons/menu.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    cursor: "pointer",
  }

  const mainBkgImage = {
    backgroundImage: "url('/images/background/model5.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif"
    document.body.style.overflow = "hidden"

    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    document.body.style.display = "block";
    document.documentElement.style.display = "block";

    const nextElement = document.getElementById("__next");
    if (nextElement) {
      nextElement.style.height = "100vh";
      const mainContent = document.getElementById("devComents")
      defaultText(mainContent, dimensions);
    }

    document.title = "NEXOS-JIMP";
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);

    const sb = document.getElementById("sidebar");
    setSidebar(sb);
    const menuBtn = document.getElementById("menuButton");
    setMenuButton(menuBtn);
  }, []);

  return (
    <>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{...tpDiv}}>
          <label style={{fontSize:25, fontFamily: "'Montserrat', sans-serif", flex:1, textAlign:"center"}}>NEXOS - JIMP</label>
          <button style={{...logoutBtn}} onClick={() => logout(setLoading)}>Sair</button>
        </div>
        <div style={{ display: 'flex', height:'100%', overflow: 'auto'}}>
          <div style={{...sbDiv, flexDirection:"column", boxSizing: "border-box"}} id="sidebar">
            <label style={menuIcon} id="menuButton" onClick={() => handleSidebar(sidebar, menuButton, sbOptions, sidebar, dimensions)}/>
          </div>
          <div style={{...mainBkgImage, width: '100%', height: '100%', flexDirection: "column", display:"flex", boxSizing:"border-box", overflowY:'auto', padding: '10px'}} id="mainBox">
            <label style={ttStyle}>Bem vindo ao NEXOS - JIMP!</label>
            <div style={{...trContainer, width: '100%', height: '100%', boxSizing:"border-box", overflowY:'auto'}} id="devComents">
            </div>
          </div>
        </div>
      </div>
      {loading && <div style={{...lgBox, position:"fixed"}}><label style={lgLabel}>Carregando...</label></div>}
    </>
  );
}