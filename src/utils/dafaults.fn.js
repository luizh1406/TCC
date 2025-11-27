import { sidebarItems } from "../styles/containers/containers";
import { stylesColor } from "../styles/colors/styles.color";

export function handleSidebar(element, menuBtn, list, sidebar, dm){
  if(element !== ""){
    if(parseInt(element.style.width) === dm.sidebarDiv.widthClosed){
      element.style.width = dm.sidebarDiv.widthOpen + "px";
      element.style.transition = "width 0.5s ease-in-out";
      menuBtn.style.transition = "transform 0.5s ease-in-out";
      menuBtn.style.transform = "rotate(90deg)";
      sidebarLinks(list, sidebar, "add", dm);
    }else{
      element.style.width = dm.sidebarDiv.widthClosed + "px";
      element.style.transition = "width 0.5s ease-in-out";
      menuBtn.style.transition = "transform 0.5s ease-in-out";
      menuBtn.style.transform = "rotate(0deg)";
      const sbItems = sidebarItems(dm);
      sidebarLinks(list, sidebar, "remove", sbItems);
    }
  }else{
    console.error("O elemento da sidebar não foi encontrado")
  }
}

export function sidebarLinks(list, sidebar, fn, sbItemsStyle){
  const headers = Object.keys(list);

  if(fn === "add"){
    headers.forEach((hd) => {
      const label = document.createElement("label");
      label.textContent = list[hd]["descricao"];
      label.id = list[hd]["id"];
      label.style.cursor = "pointer";
      label.style.fontWeight = "bold";
      label.onclick = () => window.location.href = '/' + list[hd].route.replace(/^\/?/, '');
      label.onmouseenter = (e) => {
        e.target.style.color = stylesColor.dark.orange0;
      };
      label.onmouseleave = (e) => {
        e.target.style.color = "white";
      };
      Object.assign(label.style, sbItemsStyle.sidebarItems);

      sidebar.appendChild(label);
    });
  } else if(fn === "remove"){
    headers.forEach((hd) => {
      const label = document.getElementById(list[hd]["id"]);
      if(label) label.remove(); // ✅ protege contra null
    });
  }
}

export async function logout(setLoad) {
  const page = ["/login"];

  setLoad(true);

  await fetch("/api/logout", { method: 'POST' });

  // Para testes com Jest / jsdom, podemos proteger contra erro de navegação:
  if(typeof window !== 'undefined' && window.location) {
    window.location.href = page[0];
  }
}

export async function resultFetch(res) {
  const dataJSON = await res.json();
  const data = dataJSON.props.resultRows;
  return data;
}

export function getTime(){
  const now = new Date();

  const pad = (num, size = 2) => String(num).padStart(size, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const milliseconds = now.getMilliseconds();
  const microsecondsPart = pad(milliseconds, 3) + pad(Math.floor(Math.random() * 1000), 3); // Simula 6 dígitos

  const timezone = '+00';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microsecondsPart}${timezone}`;
}
