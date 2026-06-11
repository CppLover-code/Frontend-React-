// Promise
const promise = new Promise((resolve, reject) => {
    resolve("Done");
});

promise.then(result => {
    console.log(result);
});

// then()
Promise.resolve("Hello")
    .then(data => {
        console.log(data);
    });

// catch()
Promise.reject("Error")
    .catch(error => {
        console.log(error);
    });

// async/await
async function getData() {
    const result = await Promise.resolve("Data");
    console.log(result)
}
getData();

// try/catch
async function test() {
    try {
        const result = await Promise.resolve("Success");
        console.log(result);
    } catch (error) {
        console.log(error)
    }
}
test()

// fetch
// fetch + then
fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });

// fetch + async/await
async function getUsers() {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    const data = await response.json();

    console.log(data);
}
getUsers();

// Обработка ошибок
async function getUsers() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log("Error:", error);
    }
}