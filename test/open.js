/**
 * @project enfspatch-promise
 * @filename open.js
 * @description tests for enfspatch-promise
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

/* global describe, require, it, __filename */

"use strict";

const enfs = require("../");

describe("enfspatch > Open", function () {
    it("should open an existing file async", function () {
        return enfs.openP(__filename, "r").then(function (fd) {
            (typeof fd === "undefined").should.be.equal(false);
            return enfs.closeP(fd);
        }).should.be.fulfilled();
    });
    it("should fail to open non-existing file async", function () {
        return enfs.openP("invalid file path", "r").catch(function (err) {
            err.should.be.instanceOf(Error);
            err.code.should.be.equal("ENOENT");
        });
    });
});
