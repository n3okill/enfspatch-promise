/**
 * @project enfspatch-promise
 * @filename readdir.js
 * @description tests for enfspatch-promise
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

/* global describe, require, before, after, it, __filename */

"use strict";


const fs = require("fs");
const enfspatch = require("enfspatch");

describe("enfspatch > readdir", function () {
    const readdir = fs.readdir;
    let enfs = require("../");
    before(function () {
        fs.readdir = function readdir(path, callback) {
            process.nextTick(function () {
                callback(null, ["c", "x", "b"]);
            });
        };
        enfs = enfs.promisify(enfspatch.mockEnfs(fs));
    });
    after(function () {
        fs.readdir = readdir;
    });
    it("should test readdir reorder", function () {
        return enfs.readdirP("anything").then(function (files) {
            files.should.be.eql(["b", "c", "x"]);
        });
    });
});
