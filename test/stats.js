/**
 * @project enfspatch
 * @filename stats.js
 * @description tests for enfspatch
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

/* global describe, require, it, __filename */

"use strict";

const enfs = require("../");

describe("enfspatch > Stats", function () {
    it("enfs should use the same stats constructor as fs module", function () {
        return enfs.statP(__filename).then(function (statFs) {
            statFs.isFile().should.be.equal(true);
        });
    });
});
