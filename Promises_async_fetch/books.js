"use strict";

const source = "https://openlibrary.org/search.json?q=python";

async function getBooks() {
    
    try {

        const response = await fetch(source);

        if(!response.ok) {
            throw new Error("Ошибка загрузки данных!");
        }

        const data = await response.json();

        const books = data.docs.slice(0,10);

        books.forEach(book => {
        console.log(`Title: ${book.title}`);
        console.log(`Author: ${book.author_name?.join(", ") || "Unknown"}`);
        console.log(`Year: ${book.first_publish_year || "Unknown"}\n`);
        });

    } catch(error) {

        console.log("Error: ", error);
    }
}

getBooks();