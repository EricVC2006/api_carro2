const mongoose = require('mongoose');

// Definição do esquema para os carros
const carrosSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true, // Campo obrigatório
  },
  marca: {
    type: String,
    required: true, // Campo obrigatório
  },
  modelo: {
    type: String,
    required: true, // Campo obrigatório
  },
  ano: {
    type: Number,
    required: true, // Campo obrigatório
  },
  foto: {
    type: String,
    required: true, // Campo obrigatório
  },
});

// Criando o modelo 'carros' com base no esquema definido
const Carros = mongoose.model('carro', carrosSchema);

module.exports = Carros;