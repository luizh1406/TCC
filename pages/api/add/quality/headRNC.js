import pool from "../../database.js";

export default async function insertQuery(request, response) {
  if (request.method === "POST") {
    const data = request.body;

    console.table(data);

    let select = [
      "INSERT INTO headRNC (id, nr_op, ns, setor, data_ocorrencia, codigo_projeto, image, email, descricao ) values (",
      data[0].id,
      ",",
      data[0].op,
      ",",
      data[0].ns,
      ",'",
      data[0].setor,
      "','",
      data[0].data_ocorrido,
      "',",
      data[0].projeto,
      ",'",
      data[0].image,
      "','",
      data[0].email,
      "','",
      data[0].ocorrencia,
      "')",
    ].join("");

    console.log(select);

    try {
      const result = await pool.query(select);
      response.status(201).json({ success: true, data: result.rows[0] });
      console.log("Data inserted:", result.rows[0]);
    } catch (error) {
      console.error("Error inserting data:", error);
      response
        .status(500)
        .json({ success: false, error: "Failed to insert data" });
    }
  } else {
    response.status(405).json({ success: false, error: "Method not allowed" });
  }
}
