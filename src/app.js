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

app.put('/usuario/:id', (req, res) => {
  const { id } = req.params;

  const { nome, email, data_nascimento } = req.body;

  if(!nome || !email || !data_nascimento) {
    return res.status(400).json({mensagem: "Os seguintes campos são obrigatórios: nome, email e data_nascimento."})
  }

  const indexUsuario = usuarios.findIndex(u => u.id === Number(id));

  if(indexUsuario === -1) {
    return res.status(404).json({mensagem: "Usuário não encontrado."})
  }

  usuarios[indexUsuario].nome = nome;
  usuarios[indexUsuario].email = email;
  usuarios[indexUsuario].data_nascimento = data_nascimento;

 res.status(200).json({mensagem: "Dado alterado com sucesso!"});
})

app.patch('/usuario/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  const usuario = usuarios.find(u => u.id === Number(id));

  if (!usuario) {
    return res.status(404).json({mensagem: "Usuário não encontrado."})
  }

  Object.assign(usuario, dadosAtualizados);

  res.status(200).json({mensagem: "Dado alterado com sucesso!"});
})

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const indexUsuario = usuarios.findIndex(u => u.id === Number(id));

  if(indexUsuario === -1) {
    return res.status(404).json({mensagem: "Usuário não encontrado."})
  }

  usuarios.splice(indexUsuario, 1);

  res.status(200).json({mensagem: "Usuário removido com sucesso."})
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
