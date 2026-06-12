"use strict";

const source = "https://openlibrary.org/search.json?q=python";

async function getBooks() {
    
    const response = fetch(source);

    const books = await response.json();

    
}