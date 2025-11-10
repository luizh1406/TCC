// pages/infra/users.jsx
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
  const [handleAddUser, setHandleAddUser] = useState(2); // 2 para iniciar fechado, 1 para abrir o formulário
  const [handleEditUser, setHandleEditUser] = useState(2); // 2 para iniciar fechado, 1 para abrir o formulário

  // Estados para o formulário de Cadastro de Novo Usuário
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("user"); // Valor padrão para privilégios
  const [ramal, setRamal] = useState("");
  const [message, setMessage] = useState(""); // Mensagens de sucesso ou erro do cadastro

  // Estados para o formulário de Edição de Usuário
  const [searchEmail, setSearchEmail] = useState(""); // Para a busca por email
  const [editUserId, setEditUserId] = useState(null); // ID do usuário que será editado
  const [editUserName, setEditUserName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState(""); // Senha nova (será hasheada se preenchida)
  const [editSector, setEditSector] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editRamal, setEditRamal] = useState("");
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

  // Função para lidar com o salvamento do novo usuário
  const handleSaveUser = async () => {
    setMessage(""); // Limpa mensagens anteriores
    setLoading(true);

    if (
      !userName ||
      !email ||
      !password ||
      !sector ||
      !position ||
      !role ||
      !ramal
    ) {
      setMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/registerUser", {
        // Endpoint da API para registrar usuários
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          sector,
          position,
          role,
          ramal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Usuário cadastrado com sucesso!");
        // Limpar formulário após sucesso
        setUserName("");
        setEmail("");
        setPassword("");
        setSector("");
        setPosition("");
        setRole("user");
        setRamal("");
        setHandleAddUser(2); // Fechar o formulário após o cadastro
      } else {
        setMessage(data.message || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados do usuário:", error);
      setMessage("Ocorreu um erro na rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar usuário pelo email
  const handleSearchUserByEmail = async () => {
    setEditMessage(""); // Limpa mensagens anteriores
    setLoading(true);
    setEditUserId(null); // Resetar ID do usuário editado
    setEditUserName(""); // Resetar campos de edição
    setEditEmail("");
    setEditPassword("");
    setEditSector("");
    setEditPosition("");
    setEditRole("user");
    setEditRamal("");

    if (!searchEmail) {
      setEditMessage("Por favor, insira um e-mail para buscar.");
      setLoading(false);
      return;
    }

    try {
      // Endpoint para buscar usuário por email
      const res = await fetch(
        `/api/get/resume/users_email?email=${encodeURIComponent(searchEmail)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (data.user) {
          // Preencher os estados de edição com os dados do usuário encontrado
          setEditUserId(data.user.id);
          setEditUserName(data.user.nome); // Assume 'nome' é a coluna do DB
          setEditEmail(data.user.email);
          // NUNCA preencher a senha hashada aqui. Deixe o campo de senha vazio.
          setEditSector(data.user.setor); // Assume 'setor' é a coluna do DB
          setEditPosition(data.user.cargo); // Assume 'cargo' é a coluna do DB
          setEditRole(data.user.role);
          setEditRamal(data.user.ramal); // Assume 'ramal' é a coluna do DB
          setEditMessage(
            "Usuário encontrado. Você pode editar os dados abaixo."
          );
        } else {
          setEditMessage("Usuário não encontrado com este e-mail.");
        }
      } else {
        setEditMessage(data.message || "Erro ao buscar usuário.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setEditMessage(
        "Ocorreu um erro na rede ao buscar usuário. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar usuário
  const handleUpdateUser = async () => {
    setEditMessage(""); // Limpa mensagens anteriores
    setLoading(true);

    if (!editUserId) {
      setEditMessage("Nenhum usuário selecionado para edição.");
      setLoading(false);
      return;
    }
    if (
      !editUserName ||
      !editEmail ||
      !editSector ||
      !editPosition ||
      !editRole ||
      !editRamal
    ) {
      setEditMessage(
        "Por favor, preencha todos os campos obrigatórios para atualização."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/users/${editUserId}`, {
        // Endpoint para atualizar usuário por ID
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: editUserName,
          email: editEmail,
          password: editPassword, // Envia nova senha se preenchida
          sector: editSector,
          position: editPosition,
          role: editRole,
          ramal: editRamal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditMessage("Usuário atualizado com sucesso!");
        // Opcional: Limpar formulário de edição ou resetar estados após sucesso
        setEditUserId(null);
        setSearchEmail("");
        setEditUserName("");
        setEditEmail("");
        setEditPassword("");
        setEditSector("");
        setEditPosition("");
        setEditRole("user");
        setEditRamal("");
        setHandleEditUser(2); // Fechar o formulário de edição
      } else {
        setEditMessage(data.message || "Erro ao atualizar usuário.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados do usuário para atualização:", error);
      setEditMessage(
        "Ocorreu um erro na rede ao atualizar usuário. Tente novamente."
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
              CORE - JIMP/ GERENCIAMENTO DE USUÁRIOS
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
              {handleAddUser === 1 && (
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
                        onClick={() => setHandleAddUser(2)}
                      >
                        Cadastrar um novo usuário
                      </label>
                      <a
                        style={{
                          ...openList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleAddUser(2)}
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
                          Nome do usuário
                        </label>
                        <input
                          id="nome"
                          style={{ width: "100%" }}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
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
                          Ramal
                        </label>
                        <input
                          id="ramal"
                          style={{ width: "100%" }}
                          type="ramal" // Use type="ramal" para validação básica
                          value={ramal}
                          onChange={(e) => setRamal(e.target.value)}
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
                          E-mail
                        </label>
                        <input
                          id="email"
                          style={{ width: "100%" }}
                          type="email" // Use type="email" para validação básica
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          Senha
                        </label>
                        <input
                          id="password_hash"
                          style={{ width: "100%" }}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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
                          Setor
                        </label>
                        <input
                          id="setor"
                          style={{ width: "100%" }}
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
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
                          Cargo
                        </label>
                        <input
                          id="cargo"
                          style={{ width: "100%" }}
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
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
                          Privilégios
                        </label>
                        <select
                          id="role"
                          style={{ width: "100%" }}
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value={"adm"}>ADM</option>
                          <option value={"infra"}>infra</option>
                          <option value={"supervisor"}>Supervisor</option>
                          <option value={"user"}>Comum</option>
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
                        ></label>
                        <button
                          style={{
                            width: "100%",
                            padding: dimensions.clientDataDiv.padding,
                            color: "white",
                            backgroundColor: "#4CAF50",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={handleSaveUser} // Chama a nova função
                          disabled={loading} // Desabilita o botão durante o carregamento
                        >
                          {loading ? "Salvando..." : "Salvar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {handleAddUser === 2 && (
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
                        onClick={() => setHandleAddUser(1)}
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        Cadastrar um novo usuário
                      </label>
                      <a
                        style={{
                          ...closeList,
                          width: "25px",
                          height: "25px",
                          cursor: "pointer",
                          marginLeft: dimensions.clientDataDiv.margin,
                        }}
                        onClick={() => setHandleAddUser(1)}
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
              {handleEditUser === 1 && (
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
                        onClick={() => setHandleEditUser(2)}
                      >
                        Editar Usuário
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
                        onClick={() => setHandleEditUser(2)}
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
                          Buscar por E-mail
                        </label>
                        <input
                          id="searchEmail"
                          style={{ width: "100%" }}
                          type="email"
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <button
                          style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#1E90FF",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          onClick={handleSearchUserByEmail}
                          disabled={loading}
                        >
                          Buscar
                        </button>
                      </div>

                      {/* Campos de edição só aparecem se um usuário for encontrado (editUserId não é null) */}
                      {editUserId && (
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
                              Nome do usuário
                            </label>
                            <input
                              id="nome"
                              style={{ width: "100%" }}
                              value={editUserName}
                              onChange={(e) => setEditUserName(e.target.value)}
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
                              Ramal
                            </label>
                            <input
                              id="ramal"
                              style={{ width: "100%" }}
                              type="ramal"
                              value={editRamal}
                              onChange={(e) => setEditRamal(e.target.value)}
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
                              E-mail
                            </label>
                            <input
                              id="email"
                              style={{ width: "100%" }}
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              disabled // E-mail geralmente não deve ser editável, ou exige lógica extra de verificação
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
                              Nova Senha
                            </label>
                            <input
                              id="password_hash_edit" // ID diferente para evitar conflito com o de cadastro
                              style={{ width: "100%" }}
                              type="password"
                              placeholder="Deixe em branco para manter a senha atual"
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
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
                              Setor
                            </label>
                            <input
                              id="setor"
                              style={{ width: "100%" }}
                              value={editSector}
                              onChange={(e) => setEditSector(e.target.value)}
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
                              Cargo
                            </label>
                            <input
                              id="cargo"
                              style={{ width: "100%" }}
                              value={editPosition}
                              onChange={(e) => setEditPosition(e.target.value)}
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
                              Privilégios
                            </label>
                            <select
                              id="role"
                              style={{ width: "100%" }}
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                            >
                              <option value={"adm"}>ADM</option>
                              <option value={"infra"}>infra</option>
                              <option value={"supervisor"}>Supervisor</option>
                              <option value={"user"}>Comum</option>
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
                              onClick={handleUpdateUser} // Chama a função de atualização
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
              {handleEditUser === 2 && (
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
                        onClick={() => setHandleEditUser(1)}
                        style={{ width: "100%", cursor: "pointer" }}
                      >
                        Editar Usuário
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
                        onClick={() => setHandleEditUser(1)}
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
