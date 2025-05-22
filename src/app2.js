import express from 'express';
import db from './db/index.js'
import setupSwagger from './swagger.js';

const PORT = 3000;

const app = express();

app.use(express.json());

/**
 * @swagger
 * /usuario:
 *    get:
 *      summary: Retorna todos os usuários
 *      description: Recupera todos os registros de usuários da tabela 'usuário' do banco de dados
 *      tags:
 *        - Usuários
 *      responses:
 *        200:
 *          description: Lista de usuários retornada com sucesso
 *          content:
 *            aplication/json:
 *              schema:
 *                type: array
 *                items: object
 *                properties: 
 *                  id:
 *                    type: integer
 *                    example: 2
 *                  nome:
 *                    type: string
 *                    example: Maria da Silva
 *                  email:
 *                    type: string
 *                    example: maria_silva@email.com
 *        500:
 *          description: Erro interno no servidor
 *          content:
 *            aplication/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  mensagem:
 *                    type: string
 *                    example: 'Erro interno no servidor: <mensagem de erro>' 
 *                  
 *          
 *    
 * 
 */
app.get('/usuario', (req, res) => {
  const sql = "SELECT * FROM usuario;"

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    res.status(200).json(result)
  })
});

app.get('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM usuario WHERE id = ?;"

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    if (result.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum usuário encontrado" })
    }
    res.status(200).json(result)
  })
});

app.post('/usuario', (req, res) => {
  const { nome, email, data_nascimento } = req.body;

  if (!nome || !email || !data_nascimento) {
    return res.status(400).json({
      mensagem:
        'Os seguintes campos são obrigatórios: nome, email e data_nascimento',
    });
  }

  const sql = "INSERT INTO usuario (nome, email, data_nascimento) VALUES (?, ?, ?);"

  db.query(sql, [nome, email, data_nascimento], (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' })
  })
});

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;

  const { nome, email, data_nascimento } = req.body;

  if (!nome || !email || !data_nascimento) {
    return res.status(400).json({ mensagem: "Os seguintes campos são obrigatórios: nome, email e data_nascimento." })
  }

  const sql = "UPDATE usuario SET nome = ?, email = ?, data_nascimento = ? WHERE id = ?";

  db.query(sql, [nome, email, data_nascimento, id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
    }

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' })
  })
})

app.patch('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  const keys = Object.key(dadosAtualizados);
  const values = Object.values(dadosAtualizados);

  const setClause = keys.map((key) => `${key} = ?`).join(',');
  const sql = `UPDATE usuario SET ${setClause} WHERE id = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
    }

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' })
  })
})

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM usuario WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ mensagem: `Erro interno no servidor: ${err}` })

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
    }

    res.status(200).json({ mensagem: "Usuário removido com sucesso!" })
  })
});

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
