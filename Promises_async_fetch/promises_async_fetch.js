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

