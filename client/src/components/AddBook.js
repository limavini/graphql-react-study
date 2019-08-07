import React, { useState } from 'react';
import { graphql, compose } from "react-apollo";
import { getAuthorsQuery, addBookMutation, getBooksQuery } from "../queries/queries";

const AddBook = props => {

    const [state, setState] = useState({genre: '', name: '', authorId: ''});

    const displayAuthors = () => {
        
        // Pegando resultados da query dos autores
        var data = props.getAuthorsQuery;
        if (data.loading) {
            return <option>Loading authors...</option>;
        } else {
            return data.authors.map(author => {
                return <option value={author.id} key={author.id}>{author.name}</option>
            })
        }
    };

    const submitForm = e => {
        e.preventDefault();

        // Inserindo novo livro
        // É preciso ajustar as variveis no arquivo queries
        props.addBookMutation({
            variables: {
                name: state.name,
                genre: state.genre,
                authorId: state.authorId
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
    };

    return (
        <form id="add-book" onSubmit={submitForm}>
            <div className="field">
                <label>Book name:</label>
                <input type="text" onChange={e => setState({ ...state, name: e.target.value })}/>
            </div>
            <div className="field">
                <label>Genre:</label>
                <input type="text" onChange={e => setState({ ...state, genre: e.target.value })}/>
            </div>
            <div className="field">
                <label>Author:</label>
                <select onChange={e => setState({ ...state, authorId: e.target.value })}>
                    <option>Select an author</option>
                    {displayAuthors()}
                </select>
            </div>
            <button>
                +
            </button>
        </form> 
    )

}


// Utilizando o compose para colocar + de 1 query

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" })
)(AddBook);
