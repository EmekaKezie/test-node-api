const express = require("express");
const app = express();
const port = 4000;

const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "testdb",
  })
  .promise();

app.use(express.json());

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get("/api/users", async (req, res) => {
  try {
    const qry = "select * from user_test";
    const data = await pool.execute(qry);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const qry = `select * from user_test where id = ?`;
    const data = await pool.execute(qry, [id]);

    const rows = data[0];
    if (rows.length === 0) {
      res.status(404).json();
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;

    if (!user.firstname) {
      res.status(400).json("firstname is required");
    }

    if (!user.lastname) {
      res.status(400).json("lastname is required");
    }

    const qry =
      "insert into user_test (id, firstname, lastname) values (?, ?, ?)";
    const data = await pool.execute(qry, [3, user.firstname, user.lastname]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const user = req.body;
    const id = req.params.id;

    const qry = `select * from user_test where id = ?`;
    const data = await pool.execute(qry, [id]);

    const rows = data[0];
    if (rows.length === 0) {
      res.status(404).json();
    } else {
      const qry2 =
        "update user_test set firstname = ?, lastname = ?  where id = ?";
      const data2 = await pool.execute(qry2, [
        user.firstname,
        user.lastname,
        id,
      ]);
      res.status(200).json(data2);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  try {
    const qry = "delete from user_test where id = ?";
    const data = pool.execute(qry, [id]);
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
