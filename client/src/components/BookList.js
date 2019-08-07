import React, { useState } from 'react';
import { graphql } from "react-apollo";
import { getBooksQuery } from "../queries/queries";
import BookDetails from "./BookDetails";
// 1 - Criar a query
// 2 - Associar ao componente

/////////////////////// 2:49:40
const BookList = (props) => {

  const [state, setState] = useState({
    selected: null
  });

    const displayBooks = () => {
        var data = props.data;
        if (data.loading) {
            return(<div>Loading books...</div>);
        } else {
            return data.books.map(book => {
                return(
                    <li onClick={ e => setState({ selected: book.id}) } key={book.id}>{book.name}</li>
                );
            })
        }
    };

  return (
    <div>
      <ul id="book-list">
         {displayBooks()}
      </ul>
      <BookDetails bookId={state.selected}></BookDetails>
    </div>
  );
}

export default graphql(getBooksQuery)(BookList);
