/**
 * @project enfspatch-promise
 * @filename rename.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2017 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 13-02-2017
 * @version 0.1.1
 * @description tests for enfspatch-promise [rename]
 */

/* global describe, it, before, after*/

"use strict";

const nodePath = require("path");
const nodeOs = require("os");
const rimraf = require("rimraf");
const cwd = process.cwd();
const enFs = require("../");

describe("enfsPatch-promise > rename", function () {
    const tmpPath = nodePath.join(nodeOs.tmpdir(), "enfspatchpromiserenamefile");
    before(function () {
        try {
            enFs.mkdirSync(tmpPath);
            process.chdir(tmpPath);
        } catch (err) {
            if (err.code === "EXIST") {
                rimraf.sync(tmpPath);
                enFs.mkdirSync(tmpPath);
            }
        }
    });
    after(function () {
        process.chdir(cwd);
        rimraf.sync(tmpPath);
    });
    describe("> async", function () {
        describe("try one file", function () {
            let fileALock;
            let fileA, fileB, fileARenamed, fileBRenamed, fsRename, fsRenameP;
            before(function () {
                fsRename = enFs.rename;
                enFs.rename = ((function (rename) {
                    return function (from, to, callback) {
                        if (fileALock === from) {
                            let err = new Error("File Locked by system.");
                            err.code = "EPERM";
                            return callback(err);
                        }
                        rename(from, to, callback);
                    };
                })(enFs.rename));
                fsRenameP = enFs.renameP;
                enFs.renameP = ((function () {
                    return function (from, to) {
                        return new Promise(function (resolve, reject) {
                            enFs.rename(from, to, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    };
                })(enFs.renameP));
                fileA = nodePath.join(tmpPath, "a.txt");
                fileARenamed = nodePath.join(tmpPath, "aRename.txt");
                fileB = nodePath.join(tmpPath, "b.txt");
                fileBRenamed = nodePath.join(tmpPath, "bRenamed.txt");
            });
            after(function () {
                enFs.rename = fsRename;
                enFs.renameP = fsRenameP;
            });
            it("should write files and lock fileA", function () {
                return enFs.writeFileP(fileA, "data", "utf8")
                    .then(function () {
                        fileALock = fileA;
                        return enFs.writeFileP(fileB, "data", "utf8");
                    }).should.be.fulfilled();
            });
            it("should rename fileB and fail on fileA", function () {
                return enFs.renameP(fileB, fileBRenamed)
                    .then(function () {
                        return enFs.statP(fileBRenamed);
                    })
                    .then(function (stats) {
                        stats.isFile().should.be.equal(true);
                        return enFs.renameP(fileA, fileARenamed);
                    }).should.be.rejectedWith(Error, {code: "EPERM"});
            });
            it("should rename fileA only after unlocked", function () {
                return enFs.renameP(fileA, fileARenamed)
                    .catch(function (err) {
                        err.code.should.be.equal("EPERM");
                        fileALock = null;
                        return enFs.renameP(fileA, fileARenamed);
                    })
                    .then(function () {
                        return enFs.statP(fileARenamed);
                    })
                    .then(function (stats) {
                        stats.isFile().should.be.equal(true);
                    });
            });
        });
        describe("a lot of files", function () {
            const locks = [];
            let fsRename = enFs.rename;
            const fsRenameP = enFs.renameP;
            let num, paths;
            before(function () {
                num = 500;
                paths = new Array(num);
                fsRename = enFs.rename;
                enFs.rename = ((function (rename) {
                    return function (from, to, callback) {
                        if (locks.indexOf(from) !== -1) {
                            let err = new Error("File Locked by system.");
                            err.code = "EPERM";
                            return callback(err);
                        }
                        rename(from, to, callback);
                    };
                })(enFs.rename));
                enFs.renameP = ((function () {
                    return function (from, to) {
                        return new Promise(function (resolve, reject) {
                            enFs.rename(from, to, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    };
                })(enFs.renameP));
            });
            after(function () {
                enFs.rename = fsRename;
                enFs.renameP = fsRenameP;
            });

            function randomIntInc(low, high) {
                return Math.floor(Math.random() * (high - low + 1) + low);
            }

            function getRandomArray(low, high, size) {
                let numbers = [];
                for (let i = 0; i < size; i++) {
                    numbers.push(randomIntInc(low, high));
                }
                return numbers.filter((v, i, a) => a.indexOf(v) === i);
            }


            it("should write files and lock some", function () {
                let ps = [];
                this.timeout(10000);
                for (let i = 0; i <= num; i++) {
                    paths[i] = nodePath.join(tmpPath,"file-" + i.toString());
                    ps.push(enFs.writeFileP(paths[i], "data", "utf8"));
                }
                return Promise.all(ps).then(function () {
                    let numbers = getRandomArray(0, num, randomIntInc(1, num));
                    while (numbers.length) {
                        locks.push(paths[numbers.shift()]);
                    }
                });
            });
            it("should rename not locked files", function () {
                let renamed = 0, notRenamed = 0;
                let locked = locks.length;
                let ps = paths.map((path) =>
                    enFs.renameP(path, path + ".renamed")
                        .then(function () {
                            renamed++;
                        })
                        .catch(function (err) {
                            err.code.should.be.equal("EPERM");
                            notRenamed++;
                        })
                );
                return Promise.all(ps).then(function () {
                    notRenamed.should.be.equal(locked);
                    renamed.should.be.equal(paths.length - locked);
                });
            });
            it("should rename locked files after unlock", function () {
                let locked = locks.length;
                let renamed = 0;
                let tmpLocks = [];
                for (let i = 0; i < locked; i++) {
                    tmpLocks[i] = locks[i];
                }
                let ps = locks.map((path) =>
                    enFs.renameP(path, path + ".renamed")
                        .catch(function (err) {
                            err.code.should.be.equal("EPERM");
                        })
                );
                return Promise.all(ps).then(function () {
                    renamed.should.be.equal(0);
                    while (locks.length) {
                        locks.shift();
                    }
                    let ps1 = tmpLocks.map((path) =>
                        enFs.renameP(path, path + ".renamed")
                            .then(function () {
                                renamed++;
                            })
                    );
                    Promise.all(ps1).then(function () {
                        renamed.should.be.equal(locked);
                    })
                })
            });
        });
    });
});
