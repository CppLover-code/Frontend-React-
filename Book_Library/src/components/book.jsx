// props - параметры
/*function Book(props) {
    return (
        <div>
            <h3>{props.title}</h3>
            <p>Автор: {props.author}</p>
        </div>
    );
}

export default Book;
*/

function Book({title, author}) 
{
    return (
        <div>
            <h3>{title}</h3>
            <p>Автор: {author}</p>
        </div>
    );
}

export default Book;
