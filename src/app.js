import express from 'express';

const PORT = 3000;

const app = express();

app.use(express.json());

let usuarios = [
  {
    id: 1,
    nome: 'João',
    email: 'joao@gmail.com',
    data_nascimento: '25/08/1995',
  },
  {
    id: 2,
    nome: 'Maria',
    email: 'maria@gmail.com',
    data_nascimento: '10/01/2001',
  },
];

app.get('/usuario', (req, res) => {
  res.status(200).json(usuarios);
});

app.post('/usuario', (req, res) => {
  const { nome, email, data_nascimento } = req.body;

  if (!nome || !email || !data_nascimento) {
    return res.status(400).json({
      mensagem:
        'Os seguintes campos são obrigatórios: nome, email e data_nascimento',
    });
  }

  const novoUsuario = {
    nome,
    email,
    data_nascimento,
  };

  usuarios.push(novoUsuario);

  res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
