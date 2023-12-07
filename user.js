const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL
//insert your db config to test
const pool = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    database: 'users',
    port: 5432,
  });
  

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Routes
app.post('/users/create', async (req, res) => {
  try {
    const { id, name, username, nrc, email, phno, user_type, dob, gender, address } = req.body;
    const result = await pool.query('INSERT INTO users_tbl (id,name,username,nrc,email,phno,user_type,dob,gender,address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
                                            [id, name, username, nrc, email, phno, user_type, dob, gender, address]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

app.get('/users/getAllUsers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users_tbl');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get('/users/getUserById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users_tbl WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
// id,name,username,nrc,email,phno,user_type,dob,gender,address
app.patch('/users/updateUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name,username,nrc,email,phno,user_type,dob,gender,address } = req.body;
    const result = await pool.query('UPDATE users_tbl SET name = $1, username = $2, nrc = $3, email = $4, phno = $5, user_type = $6, dob = $7, gender = $8, address = $9 WHERE id = $10 RETURNING *',
                                         [name,username,nrc,email,phno,user_type,dob,gender,address,id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

app.delete('/users/deleteUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users_tbl WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
