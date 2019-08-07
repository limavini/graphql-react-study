const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Não definimos um id do livro pq o MongoDB já cria um
const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
});

module.exports = mongoose.model('Book', bookSchema);