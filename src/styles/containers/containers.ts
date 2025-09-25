import {stylesColor} from "../colors/styles.color"

export function loginContainer(dm){
  return {
    width: dm.loginContainer.width,
    height: dm.loginContainer.height,
    boxShadow: "15px 10px 35px rgba(0, 0, 0, 0.8)",
  }
}

export function labelModel1(dm){
  return{
    width: dm.labelModel1.width,
    height: dm.labelModel1.height,
    marginTop: dm.labelModel1.margin,
    fontSize: dm.labelModel1.fontSize,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: stylesColor.dark.orange0,
    boxShadow: "5px 3px 7px rgba(0, 0, 0, 0.8)",
    color: "white"
  }
}

export function inputModel1(dm){
  return{
    width: dm.inputModel1.width,
    height: dm.inputModel1.height,
    marginTop: dm.inputModel1.margin,
    fontSize: dm.inputModel1.fontSize,
  }
}

export function containerModel1(dm, bkColor){
  return{
    fontSize: dm.containerModel1.fontSize,
    display: "flex",
    backgroundColor: bkColor
  }
}

export function buttonModel1(dm){
  return{
    width: "35%",
    height: dm.buttonModel1.height,
    padding: dm.buttonModel1.padding,
    marginTop: dm.buttonModel1.margin,
    fontSize: dm.buttonModel1.fontSize,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: stylesColor.dark.blue0,
    color: "white"
  }
}

export function loadingBox(dm){
  return{
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    zIndex: 999,
    top: "0",
    left: "0",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  }
}

export function loadingLabel(dm){
  return{
    width: dm.loadingLabel.width,
    height: dm.loadingLabel.height,
    borderRadius: '5px',
    backgroundColor: stylesColor.dark.blue0,
    backdropFilter: "blur(10px)",
    zIndex: 999,
    top: "0",
    left: "0",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    color: "white"
  }
}

export function topDiv(dm){
  return{
    display: "flex",
    color: "white",
    backgroundColor: stylesColor.dark.blue1,
    height: dm.topDiv.height,
    justifyContent: "center",
    alignItems: "center",
  }
}

export function sidebarDiv(dm){
  return{
    display: "flex",
    height: dm.sidebarDiv.height,
    width: dm.sidebarDiv.widthClosed,
    color: "white",
    backgroundColor: stylesColor.dark.blue1,
    border: "2pt solid gray",
  }
}

export function sidebarItems(dm){
  return{
    fontWeight: "bold",
    width: dm.sidebarItems.width,
    heigth: dm.sidebarItems.height,
    padding: dm.sidebarItems.padding,
  }
}

export function textLabel(dm){
  return{
    padding: dm.textDiv.padding,
    width: '100%',
    display: 'flex',
    fontSize: dm.textDiv.fontSize,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(3px)",
    color: "white",
  }
}

export function titleLabel(dm){
  return{
    height: dm.textDiv.height,
    width: dm.textDiv.width,
    padding: dm.textDiv.padding,
    fontSize: dm.textDiv.fontSize,
    marginBottom: "10px",
    backgroundColor:  "rgba(12, 21, 57, 0.8)",
    backdropFilter: "blur(3px)",
    color: "white",
    fontFamily: "'Montserrat', sans-serif",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  }
}

export function logoutButton(dm){
  return{
    height: "100%",
    width: dm.logoutButton.width,
    border: "",
    fontSize: dm.logoutButton.fontSize,
    backgroundColor: stylesColor.dark.orange0,
    color: "white"
  }
}

export function titleGroup1(dm){
  return{
    width: dm.titleGroup1.width,
    height: dm.titleGroup1.height,
    padding: dm.titleGroup1.padding,
    fontSize: dm.titleGroup1.fontSize,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: stylesColor.dark.orange0,
    color: "white"
  }
}

export function clientDataInputDiv(dm){
  return{
    width: "100%",
    height: dm.clientDataDiv.height,
    marginBottom: dm.clientDataDiv.margin,
    fontSize: dm.clientDataDiv.fontSize,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    color: "white"
  }
}

export function cancelButton(dm){
  return{
    height: "100%",
    width: "100%",
    border: "",
    fontSize: dm.cancelButton.fontSize,
    fontWeight: "bold",
    backgroundColor: "red",
    color: "white"
  }
}

export function nextButton(dm){
  return{
    height: "100%",
    width: "100%",
    border: "",
    fontSize: dm.cancelButton.fontSize,
    fontWeight: "bold",
    backgroundColor: stylesColor.dark.blue0,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    cursor: 'pointer'
  }
}

export function configuratorButton(dm){
  return{
    width: dm.configuratorButton.width,
    height: dm.configuratorButton.height,
    margin: dm.configuratorButton.margin,
    fontSize: dm.configuratorButton.fontSize,
    padding: dm.configuratorButton.padding,
    justifyContent: "left",
    alignItems: "center",
    display: "flex",
    backgroundColor:  stylesColor.dark.blue0,
    color: "white",
    cursor: 'pointer'
  }
}

export function popContainer(dm){
  return {
    width: dm.popContainer.width,
    height: dm.popContainer.height,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor:  "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(3px)",
    boxShadow: "7px 5px 10px rgba(0, 0, 0, 0.8)",
    color: "white",
    flexDirection: "column",
    boxSizing:"border-box"
  }
}

export function translucentContainer(dm){
    return {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    backgroundColor:  "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing:"border-box",
    padding:"30px",
    borderRadius: '15px',
    marginBottom: dm.trContainer.marginBottom,
    marginTop: dm.trContainer.marginTop
  }
}

export function translucentBox(dm){
    return {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    backgroundColor:  "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(3px)",
    color: "white",
    boxSizing:"border-box",
    borderRadius: '10px',
    height: dm.trBox.height,
    cursor: "pointer",
    margin: dm.trBox.margin,
    fontSize:  dm.trBox.fontSize
  }
}

export function menuItem(dm){
  return {
    padding: '10px',
    alignItems: 'center',
    display: 'flex',
    height: dm.containerModel1.height,
    color: 'white',
    fontSize: '15px',
  }
}