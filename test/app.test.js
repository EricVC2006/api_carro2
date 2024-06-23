require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Caminho para o app.js, ajuste conforme necessário

let server;

beforeAll(done => {
  if (process.env.NODE_ENV === 'test') {
    server = app.listen(3002, () => {
      global.agent = request(app); // Remova .agent(server)
      done();
    });
  } else {
    done();
  }
});

afterAll(async () => {
  await mongoose.connection.close(); // Fechar conexão com o MongoDB
  await new Promise(resolve => server.close(resolve)); // Fechar o servidor Express
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('Testes de Rotas de carros', () => {
  it('Deve listar todos os carros (GET /carros)', async () => {
    const response = await request(app).get('/carros');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('Deve criar um novo carro com campos válidos (POST /carros)', async () => {
    const newCarro = {
      nome: 'Corsa',
      marca: 'Opel',
      modelo: 'duas portas',
      ano: 2011,
      foto: 'corsa.jpg'
    };

    const response = await request(app)
      .post('/carros')
      .send(newCarro);

    console.log(response.body); // Adiciona log para depuração

    expect(response.statusCode).toEqual(201); // Verifique se o status é 201 Created
    expect(response.body).toHaveProperty('_id'); // Verifique se o ID foi criado
  });

  it('Deve retornar erro ao criar um novo carro com campos inválidos (POST /carros)', async () => {
    const invalidCarro = {
      nome: '',
      marca: '',
      modelo: '',
      ano: 0,
      foto: ''
    };

    const response = await request(app)
      .post('/carros')
      .send(invalidCarro);

    console.log(response.body); // Adiciona log para depuração

    expect(response.statusCode).toEqual(400);
    expect(response.body).toHaveProperty('message');
  });

  it('Deve retornar erro ao acessar uma rota inexistente (GET /rota-inexistente)', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({});
  });
});