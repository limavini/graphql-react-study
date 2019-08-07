// Schema descreve os dados, tipos, relacionamentos...
// 1 - Define tipos
// 2 - Define relacionamentos entre tipos
// 3 - Define rootqueries

// Rootquery = como o usuário entra no grafo e busca algo
const _ = require('lodash');
const graphql = require('graphql');
const { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;
const Book = require('../models/book');
const Author = require('../models/author');

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                                        // Campo que se relaciona
                // return _.find(authors, { id: parent.authorId });
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id });
                return Book.find({ authorId: parent.id })
            }
        }
    })
});


// Cada field é uma "entrada"
///////////////////////// 2:04:26
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType, // O tipo que retorna
            args: { id: { type: GraphQLID } }, // O que vai usar pra buscar
            resolve(parent, args) {
                // parent = relacionamento               
                // Onde pego informações do bd
               // return _.find(books, { id: args.id });

               return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                
               // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
               // return books;
               return Book.find({});
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
               // return authors;
               return Author.find({});
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve (parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
                
            }
        }    
   } 
})

 module.exports = new GraphQLSchema({
     query: RootQuery,
     mutation: Mutations
 });






