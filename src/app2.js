import express from 'express';
import db from './db/index.js';
import swagger from './swagger.js';

const PORT = 3000;
const app = express();

app.use(express.json());

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Retorna todos os usuários cadastrados
 *     description: Recupera todos os registros da tabela `usuario` do banco de dados.
 *     tags:
 *       - Usuários
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   email:
 *                     type: string
 *                     example: joao@example.com
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'  # Alterado aqui
 */
app.get('/usuario', (req, res) => {
  const sql = 'SELECT * FROM usuario';

  db.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ mensagem: `Erro interno no servidor: ${err}` });

    res.status(200).json(result);
  });
});


/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Retorna um usuário específico
 *     description: Recupera um registro da tabela `usuario` do banco de dados através do id.
 *     tags:
 *       - Usuários
 *     parameters: 
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID numérico do usuário a ser encontrado
 *          schema:
 *              type: integer
 *              example: 1
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: João Silva
 *                   email:
 *                     type: string
 *                     example: joao@example.com
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Nenhum usuário encontrado'
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'
 */
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

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Cria um novo registro na tabela `usuario` com os dados fornecidos
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - data_nascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Souza
 *               email:
 *                 type: string
 *                 example: maria@example.com
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: '1990-01-15'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário cadastrado com sucesso!
 *       400:
 *         description: Campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Os seguintes campos são obrigatórios: nome, email e data_nascimento'
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'
 */
app.post('/usuario', (req, res) => {
  const { nome, email, data_nascimento } = req.body;

  if (!nome || !email || !data_nascimento) {
    return res.status(400).json({
      mensagem:
        'Os seguintes campos são obrigatórios: nome, email e data_nascimento',
    });
  }

  const sql =
    'INSERT INTO usuario (nome, email, data_nascimento) VALUES (?, ?, ?)';

  db.query(sql, [nome, email, data_nascimento], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ mensagem: `Erro interno no servidor: ${err}` });

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     description: Atualiza os dados de um usuário específico pelo ID
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - data_nascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Souza
 *               email:
 *                 type: string
 *                 example: maria.nova@example.com
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: '1990-01-20'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário atualizado com sucesso!
 *       400:
 *         description: Campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Os seguintes campos são obrigatórios: nome, email e data_nascimento'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'
 */
app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, data_nascimento } = req.body;

  if (!nome || !email || !data_nascimento) {
    return res.status(400).json({
      mensagem:
        'Os seguintes campos são obrigatórios: nome, email e data_nascimento',
    });
  }

  const sql =
    'UPDATE usuario SET nome = ?, email = ?, data_nascimento = ? WHERE id = ?';

  db.query(sql, [nome, email, data_nascimento, id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ mensagem: `Erro interno no servidor: ${err}` });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' });
  });
});

/**
 * @swagger
 * /usuario/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um usuário
 *     description: Atualiza campos específicos de um usuário existente pelo ID
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Souza Alterado
 *               email:
 *                 type: string
 *                 example: maria.alterada@example.com
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: '1990-02-20'
 *             minProperties: 1  # Garante que pelo menos um campo seja enviado
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário atualizado com sucesso!
 *       400:
 *         description: Nenhum campo válido fornecido para atualização
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Pelo menos um campo deve ser fornecido para atualização
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'
 */
app.patch('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  const keys = Object.keys(dadosAtualizados);
  const values = Object.values(dadosAtualizados);

  const setClause = keys.map((key) => `${key} = ?`).join(', ');
  const sql = `UPDATE usuario SET ${setClause} WHERE id = ?`;

  db.query(sql, [...values, id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ mensagem: `Erro interno no servidor: ${err}` });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res
      .status(200)
      .json({ mensagem: 'Usuário atualizado com sucesso!' });
  });
});

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Exclui permanentemente um usuário específico pelo ID
 *     tags:
 *       - Usuários
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário removido com sucesso!
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Usuário não encontrado.
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: 'Erro interno no servidor: <mensagem de erro>'
 */
app.delete('/usuario/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM usuario WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ mensagem: `Erro interno no servidor: ${err}` });

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Usuário removido com sucesso!' });
  });
});

// Inicializa o Swagger
// O Swagger irá gerar a documentação da API com base nas anotações nos arquivos .js
swagger(app);

// Inicia o servidor
// O servidor irá escutar na porta definida na variável PORT
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
