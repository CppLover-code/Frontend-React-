// Promise

const promise = new Promise((resolve, reject) => {
    resolve("Готово");
});

promise.then(result => {
    console.log(result);
});