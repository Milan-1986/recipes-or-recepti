// u ovaj fajl smeštamo sve pomoćne funkcije 

// import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./configuration";

const timeOut = function (sec) {
    return new Promise(function (_, reject) {
        setTimeout(() => {
            reject(new Error('Too long time(' + sec + ') to fetch the data'))
        }, sec * 1000)
    });
}

export const AJAX = async function (url, uploadNewRecipe = undefined) {
    try {
        const fetchPro = uploadNewRecipe ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // podaci se šalju u json formatu
            },
            body: JSON.stringify(uploadNewRecipe)

        }) : fetch(url);
        const response = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);

        const data = await response.json();

        if (!response.ok) throw new Error(`${data.message} (${response.status})`);
        return data;

    }
    catch (err) {
        console.log(`helper ${err}`);
        throw err;
    }
}
/*
    export const getJSON = async function (url) {
        try {
            const fetchPro = fetch(url);
            const response = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);

            const data = await response.json();

            if (!response.ok) throw new Error(`${data.message} (${response.status})`);
            return data;

        }
        catch (err) {
            console.log(`helper ${err}`);
            throw err;
        }
    }

    export const sendJSON = async function (url, uploadNewRecipe) {
        try {
            const fetchPro = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // podaci se šalju u json formatu
                },
                body: JSON.stringify(uploadNewRecipe)

            });
            const response = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);

            const data = await response.json();

            if (!response.ok) throw new Error(`${data.message} (${response.status})`);
            return data;

        }
        catch (err) {
            console.log(`helper ${err}`);
            throw err;
        }
    }*/