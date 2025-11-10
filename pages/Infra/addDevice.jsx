// pages/infra/addDevice.jsx
import { useState, useEffect } from "react";
import { logout, resultFetch, getTime } from "../../src/utils/dafaults.fn";
import setDimensions from "../../src/dimensions/default.dimensions";
import {
  topDiv,
  translucentContainer,
  titleLabel,
  loadingBox,
  loadingLabel,
} from "../../src/styles/containers/containers"; // Adicione loadingLabel

export async function getServerSideProps(context) {
  const userAgent = context.req.headers["user-agent"] || "indisponível";

  const isMobile =
    /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/i.test(
      userAgent.toLowerCase()
    );

  return { props: { isMobile, userAgent } };
}

export default function UsersApp(props) {
  // Renomeado para UsersApp para convenção de componentes
  const [loading, setLoading] = useState(false);
  const [handleAddDevice, setHandleAddDevice] = useState(2); // 2 para iniciar fechado, 1 para abrir o formulário
  const [handleEditDevice, setHandleEditDevice] = useState(2); // 2 para iniciar fechado, 1 para abrir o formulário

  // Estados para o formulário de Cadastro de Novo Dispositivo
  const [device_name, setDeviceName] = useState("");
  const [mac, setMac] = useState("");
  const [category, setCategory] = useState("device"); // Valor padrão para Dispositivo
  const [system, setSystem] = useState("");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [video_card, setVideoCard] = useState("");
  const [message, setMessage] = useState(""); // Mensagens de sucesso ou erro do cadastro

  // Estados para o formulário de Edição de Dispositivo
  const [searchMac, setSearchMac] = useState(""); // Para a busca por mac
  const [editDeviceId, setEditDeviceId] = useState(null); // ID do dispositivo que será editado
  const [editDeviceName, setEditDeviceName] = useState("");
  const [editMac, setEditMac] = useState("");
  const [editCategory, setEditCategory] = useState("device");
  const [editSystem, setEditSystem] = useState("");
  const [editProcessor, setEditProcessor] = useState("");
  const [editRam, setEditRam] = useState("");
  const [editStorage, setEditStorage] = useState("");
  const [editVideoCard, setEditVideoCard] = useState("");
  const [editMessage, setEditMessage] = useState(""); // Mensagens de sucesso ou erro da edição

  const dimensions = setDimensions(props.isMobile);
  const tpDiv = topDiv(dimensions);
  const trContainer = translucentContainer(dimensions);
  const ttStyle = titleLabel(dimensions);
  const lgBox = loadingBox(dimensions);
  const lgLabel = loadingLabel(dimensions); // Certifique-se que loadingLabel esteja importado

  useEffect(() => {
    document.body.style.margin = "0";
    document.documentElement.style.margin = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";

    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    document.body.style.display = "block";
    document.documentElement.style.display = "block";

    const nextElement = document.getElementById("__next");
    if (nextElement) {
      nextElement.style.height = "100vh";
    }

    document.title = "JIMP-CORE";
    const iconLink = document.createElement("link");
    iconLink.rel = "stylesheet";
    iconLink.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap";

    const fontLink = document.createElement("link");
    fontLink.rel = "icon";
    fontLink.href = "/icons/icon1.png";

    document.head.appendChild(fontLink);
    document.head.appendChild(iconLink);
  }, []); // [] para rodar apenas uma vez ao montar o componente

  const homeImg = {
    backgroundImage: "url('/icons/icon1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const logoutImg = {
    backgroundImage: "url('/icons/logout.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const mainBkgImage = {
    backgroundImage: "url('/images/background/model6.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const closeList = {
    backgroundImage: "url('/icons/close_list.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const openList = {
    backgroundImage: "url('/icons/open_list.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  // Função para lidar com o salvamento do novo dispositivo
  const handleSaveDevice = async () => {
    setMessage(""); // Limpa mensagens anteriores
    setLoading(true);

    if (
      !device_name ||
      !mac ||
      !category ||
      !system ||
      !ram ||
      !storage ||
      !processor ||
      !video_card
    ) {
      setMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/saveDevice", {
        // Endpoint da API para registrar dispositivos
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_name,
          mac,
          category,
          system,
          ram,
          storage,
          processor,
          video_card,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Dispositivo cadastrado com sucesso!");
        // Limpar formulário após sucesso
        setDeviceName("");
        setMac("");
        setCategory("device");
        setSystem("");
        setProcessor("");
        setRam("");
        setStorage("");
        setVideoCard("");
        setHandleAddDevice(2); // Fechar o formulário após o cadastro
      } else {
        setMessage(data.message || "Erro ao cadastrar dispositivo.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados do dispositivo:", error);
      setMessage("Ocorreu um erro na rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar dispositivo pelo MAC
  const handleSearchDeviceByMac = async () => {
    setEditMessage(""); // Limpa mensagens anteriores
    setLoading(true);
    setEditDeviceId(null); // Resetar ID do dispositivo editado
    setEditDeviceName(""); // Resetar campos de edição
    setEditMac("");
    setEditCategory("device");
    setEditSystem("");
    setEditProcessor("");
    setEditRam("");
    setEditStorage("");
    setEditVideoCard("");

    if (!searchMac) {
      setEditMessage("Por favor, insira um MAC para buscar.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint para buscar dispositivo por MAC
      const res = await fetch(
        `/api/get/resume/mac_devices?mac=${encodeURIComponent(searchMac)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (data.device) {
          // Preencher os estados de edição com os dados do dispositivo encontrado
          setEditDeviceId(data.device.id); // Assume 'id' é a coluna do DB
          setEditDeviceName(data.device.device_name); // Assume 'device_name' é a coluna do DB
          setEditMac(data.device.mac); // Assume 'mac' é a coluna do DB
          setEditCategory(data.device.category); // Assume 'category' é a coluna do DB
          setEditSystem(data.device.system); // Assume 'system' é a coluna do DB
          setEditProcessor(data.device.processor); // Assume 'processor' é a coluna do DB
          setEditRam(data.device.ram); // Assume 'ram' é a coluna do DB
          setEditStorage(data.device.storage); // Assume 'storage' é a coluna do DB
          setEditVideoCard(data.device.video_card); // Assume 'video_card' é a coluna do DB
          setEditMessage(
            "Dispositivo encontrado e disponível para edição de dados."
          );
        } else {
          setEditMessage("Dispositivo não encontrado com este MAC.");
        }
      } else {
        setEditMessage(data.message || "Erro ao buscar dispositivo.");
      }
    } catch (error) {
      console.error("Erro ao buscar dispositivo:", error);
      setEditMessage(
        "Ocorreu um erro na rede ao buscar dispositivo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dispositivo
  const handleUpdateDevice = async () => {
    setEditMessage(""); // Limpa mensagens anteriores
    setLoading(true);

    if (!editDeviceId) {
      setEditMessage("Nenhum dispositivo selecionado para edição.");
      setLoading(false);
      return;
    }
    if (
      !editDeviceName ||
      !editMac ||
      !editCategory ||
      !editSystem ||
      !editRam ||
      !editStorage ||
      !editProcessor ||
      !editVideoCard
    ) {
      setEditMessage(
        "Por favor, preencha todos os campos obrigatórios para atualização."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/device/${editDeviceId}`, {
        // Endpoint para atualizar dispositivo por MAC
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_name: editDeviceName,
          mac: editMac,
          category: editCategory,
          system: editSystem,
          processor: editProcessor,
          ram: editRam,
          storage: editStorage,
          video_card: editVideoCard,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage("Dipositivo atualizado com sucesso!");
        // Opcional: Limpar formulário de edição ou resetar estados após sucesso
        setEditDeviceId("");
        setEditDeviceName("");
        setSearchMac("");
        setEditMac("");
        setEditCategory("device");
        setEditSystem("");
        setEditProcessor("");
        setEditRam("");
        setEditStorage("");
        setEditVideoCard("");
        setHandleEditDevice(2); // Fechar o formulário de edição
      } else {
        setEditMessage(data.message || "Erro ao atualizar dispositivo.");
      }
    } catch (error) {
      console.error(
        "Erro ao enviar informações do dispositivo para atualização:",
        error
      );
      setEditMessage(
        "Ocorreu um erro na rede ao atualizar dispositivo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            ...tpDiv,
            padding: "10px",
            flexShrink: 0,
            height: dimensions.topDiv.height,
          }}
        >
          <button
            style={{
              ...homeImg,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
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
            style={{
              ...logoutImg,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => logout(setLoading)}
          ></button>
        </div>
        <div
          style={{
            ...mainBkgImage,
            flex: 1,
            flexDirection: "column",
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...trContainer,
              width: "90%",
              marginTop: dimensions.clientDataDiv.margin,
            }}
            id="mainBox"
          >
            <label
              style={{
                ...ttStyle,
                width: "100%",
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              CORE - JIMP/ GESTÃO DE DISPOSITIVOS
            </label>
          </div>
          <div style={{ ...trContainer, width: "90%" }} id="new_user_box">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {handleAddDevice === 1 && (
                <>
                  <div
                    style={{
                      ...trContainer,
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        borderBottom: "2px solid white",
                        marginBottom: dimensions.clientDataDiv.margin,
                        paddingBottom: dimensions.clientDataDiv.padding,
                      }}
                    >
                      <label
                        style={{ width: "100%", cursor: "pointer" }}
                        onClick={() => setHandleAddDevice(2)}
                      >
                        Cadastrar um novo dispositivo
                      </label>
                      <a
                        style={{
                          ...openList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleAddDevice(2)}
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        flexDirection: "column",
                        marginTop: dimensions.clientDataDiv.margin,
                      }}
                    >
                      {message && (
                        <p
                          style={{
                            color: message.includes("sucesso")
                              ? "lightgreen"
                              : "red",
                            textAlign: "center",
                            marginBottom: "15px",
                          }}
                        >
                          {message}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Nome do Dispositivo:
                        </label>
                        <input
                          id="device_name"
                          style={{ width: "100%" }}
                          value={device_name}
                          onChange={(e) => setDeviceName(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          MAC:
                        </label>
                        <input
                          id="mac"
                          style={{ width: "100%" }}
                          value={mac}
                          onChange={(e) => setMac(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Categoria
                        </label>
                        <select
                          id="category"
                          style={{ width: "100%" }}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value={"phone"}>Celular</option>
                          <option value={"computer"}>Computador</option>
                          <option value={"tablet"}>Tablet</option>
                        </select>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Sistema Operacional:
                        </label>
                        <input
                          id="system"
                          style={{ width: "100%" }}
                          value={system}
                          onChange={(e) => setSystem(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Processador:
                        </label>
                        <input
                          id="processor"
                          style={{ width: "100%" }}
                          type="processor" // Use type="email" para validação básica
                          value={processor}
                          onChange={(e) => setProcessor(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          RAM:
                        </label>
                        <input
                          id="ram"
                          style={{ width: "100%" }}
                          value={ram}
                          onChange={(e) => setRam(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Armazenamento:
                        </label>
                        <input
                          id="storage"
                          style={{ width: "100%" }}
                          value={storage}
                          onChange={(e) => setStorage(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Placa de vídeo:
                        </label>
                        <input
                          id="video_card"
                          style={{ width: "100%" }}
                          value={video_card}
                          onChange={(e) => setVideoCard(e.target.value)}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                          marginTop: dimensions.clientDataDiv.margin,
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        ></label>
                        <button
                          style={{
                            width: "100%",
                            padding: dimensions.clientDataDiv.padding,
                            color: "white",
                            backgroundColor: "#013578ff",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={handleSaveDevice} // Chama a nova função
                          disabled={loading} // Desabilita o botão durante o carregamento
                        >
                          {loading ? "Salvando..." : "Gravar Dispositivo"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {handleAddDevice === 2 && (
                <>
                  <div
                    style={{
                      ...trContainer,
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        borderBottom: "2px solid white",
                        marginBottom: dimensions.clientDataDiv.margin,
                        paddingBottom: dimensions.clientDataDiv.padding,
                      }}
                    >
                      <label
                        onClick={() => setHandleAddDevice(1)}
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        Cadastrar um novo dispositivo
                      </label>
                      <a
                        style={{
                          ...closeList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleAddDevice(1)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ ...trContainer, width: "90%" }} id="users_box">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {handleEditDevice === 1 && (
                <>
                  <div
                    style={{
                      ...trContainer,
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        borderBottom: "2px solid white",
                        marginBottom: dimensions.clientDataDiv.margin,
                        paddingBottom: dimensions.clientDataDiv.padding,
                      }}
                    >
                      <label
                        style={{ width: "100%", cursor: "pointer" }}
                        onClick={() => setHandleEditDevice(2)}
                      >
                        Editar dispositivo já cadastrado
                      </label>{" "}
                      {/* Título da aba de edição */}
                      <a
                        style={{
                          ...openList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleEditDevice(2)}
                      />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        flexDirection: "column",
                        marginTop: dimensions.clientDataDiv.margin,
                      }}
                    >
                      {editMessage && (
                        <p
                          style={{
                            color: editMessage.includes("sucesso")
                              ? "lightgreen"
                              : "red",
                            textAlign: "center",
                            marginBottom: "15px",
                          }}
                        >
                          {editMessage}
                        </p>
                      )}

                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "row",
                        }}
                      >
                        <label
                          style={{ width: dimensions.clientDataDiv.width }}
                        >
                          Buscar por MAC:
                        </label>
                        <input
                          id="searchMac"
                          style={{ width: "100%" }}
                          type="mac"
                          value={searchMac}
                          onChange={(e) => setSearchMac(e.target.value)}
                        />
                        <button
                          style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#f39121ff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={handleSearchDeviceByMac}
                          disabled={loading}
                        >
                          Buscar
                        </button>
                      </div>

                      {/* Campos de edição só aparecem se um dispositivo for encontrado (editDeviceId não é null) */}
                      {editDeviceId && (
                        <>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Nome do dispositivo:
                            </label>
                            <input
                              id="device_name"
                              style={{ width: "100%" }}
                              value={editDeviceName}
                              onChange={(e) =>
                                setEditDeviceName(e.target.value)
                              }
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Categoria:
                            </label>
                            <select
                              id="category"
                              style={{ width: "100%" }}
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                            >
                              <option value={"phone"}>Celular</option>
                              <option value={"computer"}>Computador</option>
                              <option value={"tablet"}>Tablet</option>
                            </select>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Sistema Operacional:
                            </label>
                            <input
                              id="system"
                              style={{ width: "100%" }}
                              value={editSystem}
                              onChange={(e) => setEditSystem(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Processador:
                            </label>
                            <input
                              id="processor"
                              style={{ width: "100%" }}
                              type="processor"
                              value={editProcessor}
                              onChange={(e) => setEditProcessor(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              RAM:
                            </label>
                            <input
                              id="ram"
                              style={{ width: "100%" }}
                              value={editRam}
                              onChange={(e) => setEditRam(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Armazenamento:
                            </label>
                            <input
                              id="storage"
                              style={{ width: "100%" }}
                              value={editStorage}
                              onChange={(e) => setEditStorage(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            >
                              Placa de vídeo:
                            </label>
                            <input
                              id="video_card"
                              style={{ width: "100%" }}
                              value={editVideoCard}
                              onChange={(e) => setEditVideoCard(e.target.value)}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              marginTop: dimensions.clientDataDiv.margin,
                            }}
                          >
                            <label
                              style={{ width: dimensions.clientDataDiv.width }}
                            ></label>
                            <button
                              style={{
                                width: "100%",
                                padding: dimensions.clientDataDiv.padding,
                                color: "white",
                                backgroundColor: "#FF8C00",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={handleUpdateDevice} // Chama a função de atualização
                              disabled={loading}
                            >
                              {loading ? "Atualizando..." : "Salvar Alterações"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {handleEditDevice === 2 && (
                <>
                  <div
                    style={{
                      ...trContainer,
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        borderBottom: "2px solid white",
                        marginBottom: dimensions.clientDataDiv.margin,
                        paddingBottom: dimensions.clientDataDiv.padding,
                      }}
                    >
                      <label
                        onClick={() => setHandleEditDevice(1)}
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        Editar dispositivo já cadastrado
                      </label>{" "}
                      {/* Título da aba de edição quando fechada */}
                      <a
                        style={{
                          ...closeList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleEditDevice(1)}
                      />
                    </div>
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
