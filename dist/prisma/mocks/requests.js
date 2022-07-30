"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var zod_mock_1 = require("./zod-mock");
var lodash_1 = require("lodash");
var zodModels = __importStar(require("../zod"));
var mockGetRequest = function (model, config) {
    var _a = config !== null && config !== void 0 ? config : {}, _b = _a.maxDepth, maxDepth = _b === void 0 ? 6 : _b, stringMap = _a.stringMap;
    var mock = (0, zod_mock_1.generateMock)(model, {
        maxDepth: maxDepth,
        stringMap: stringMap
    });
    return mock;
};
var mockListRequest = function (model, config) {
    var _a, _b;
    var _c = config !== null && config !== void 0 ? config : {}, _d = _c.maxDepth, maxDepth = _d === void 0 ? 6 : _d, stringMap = _c.stringMap, range = _c.range;
    var count = (0, lodash_1.random)((_a = range === null || range === void 0 ? void 0 : range.from) !== null && _a !== void 0 ? _a : 1, (_b = range === null || range === void 0 ? void 0 : range.to) !== null && _b !== void 0 ? _b : 10);
    var mocks = Array(count)
        .fill(null)
        .map(function () {
        return (0, zod_mock_1.generateMock)(model, {
            stringMap: stringMap,
            maxDepth: maxDepth
        });
    });
    return mocks;
};
var mockPostRequest = function (model) {
    var mutation = function (data) {
        return {
            data: data
        };
    };
    return mutation;
};
var mock = mockListRequest(zodModels.PuppetMasterModel);
console.log(mock);
var mutation = mockPostRequest(zodModels.PuppetMasterModel);
//# sourceMappingURL=requests.js.map