/**
 * @project enfspatch-promise
 * @filename readfile.js
 * @description tests for enfspatch-promise
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

/* global describe, require, process, it, __filename */

"use strict";

const nodePath = require("path");
const nodeOs = require("os");
const rimraf = require("rimraf");
const enFs = require("../");
const cwd = process.cwd();

describe("enfspatch > readfile", function () {
    let tmpPath, num, paths;
    before(function (done) {
        tmpPath = nodePath.join(nodeOs.tmpdir(), "enfspatchreadfile");
        num = 4097;
        paths = new Array(num);
        enFs.mkdir(tmpPath, function () {
            process.chdir(tmpPath);
            done();
        });
    });
    after(function (done) {
        process.chdir(cwd);
        rimraf(tmpPath, done);
    });
    describe("a lot of files", function () {
        it("should write files", function () {
            this.timeout(5000);
            let pros = [];

            for (let i = 0; i < num; i++) {
                paths[i] = "file-" + i.toString();
                pros.push(enFs.writeFileP(paths[i], "data", "utf8"));
            }

            return Promise.all(pros).should.be.fulfilled();
        });
        it("should read files", function () {
            this.timeout(5000);
            let pros = [];

            for (let i = 0; i < num; i++) {
                pros.push(enFs.readFileP(paths[i], "utf8").then((content) => content.should.be.equal("data")));
            }
            return Promise.all(pros).should.be.fulfilled();
        });
        it("should clean the files", function (done) {
            this.timeout(5000);
            rimraf(tmpPath + nodePath.sep + "*",function(){
                enFs.readdirP(tmpPath).then(function (files) {
                    files.length.should.be.equal(0);
                    done();
                });
            });
        });
    });
});

