"use strict";

function loadData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Данные загружены");
        }, 2000)
    })
}

loadData().then((result) => {
    console.log(result)
})

async function start() {
    const result = await loadData();
    console.log(result);
}

start();

async function getUsers() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    const users = await response.json();
    console.log(users);
}

//getUsers();

async function getUsersEmail() {
    try {

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        const users = await response.json();

        users.forEach(user => {
            console.log(`Name: ${user.name}\nEmail: ${user.email}\n`);
        });
    } catch(error) {

        console.log("Error: ", error);
    }
}
getUsersEmail();