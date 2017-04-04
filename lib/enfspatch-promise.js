/**
 * @project enfspatch-promise
 * @filename enfspatch-promise.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2017 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 21-02-2017
 * @version 0.0.1
 * @description
 */

"use strict";

const NodeAssert = require("assert");
const enfsAddins = require("enfsaddins-promise");

function promisify(fs) {
    const fns = Object.keys(fs);

    const result = fs;
    fns.forEach((key) => {
        if (key in fs && (key.length > 3 && (key.slice(-4) !== "Sync" && key.slice(-5) !== "Stream" && key !== "Stats")) && typeof fs[key] === "function") {
            result[`${key}P`] = createPromise(fs[key]);
        }
    });
    return result;
}

module.exports = enfsAddins(promisify(require("enfspatch")));
module.exports.promisify = promisify;


function createPromise(fn) {
    NodeAssert.strictEqual(typeof fn, "function", "fn should be a function.");
    NodeAssert.notStrictEqual(typeof fn, "undefined", "fn can't be undefined");
    NodeAssert.notStrictEqual(null, fn, "fn can't be null");
    return function () {
        const self = this;
        const args = Array.from(arguments);
        
        return new Promise(function (resolve, reject) {
            args.push(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
            fn.apply(self, args);
        });
    };
}

