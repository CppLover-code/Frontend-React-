"use strict";

const source = "https://openlibrary.org/search.json?q=python";

async function getBooks() {
    
    try {

        const response = fetch(source);

        const books = await response.json().slice(0,10);

        books.forEach(book => {
            console.log(`Title: ${book.title}\n`);
            console.log(`Author: ${book.author}\n`);
            console.log(`Year: ${book.year}/n`)
        });

    } catch(error) {

        console.log("Error: ", error)
    }
    



}