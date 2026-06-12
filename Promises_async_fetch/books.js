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