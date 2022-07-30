"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.generateMock = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var faker_1 = require("@faker-js/faker");
var randExp = __importStar(require("randexp"));
function parseObject(zodRef, options, depth) {
    if (depth === void 0) { depth = 0; }
    return Object.keys(zodRef.shape).reduce(function (carry, key) {
        var _a;
        return (__assign(__assign({}, carry), (_a = {}, _a[key] = generateMock(zodRef.shape[key], __assign(__assign({}, options), { keyName: key }), depth + 1), _a)));
    }, {});
}
function parseRecord(zodRef, options, depth) {
    if (depth === void 0) { depth = 0; }
    var recordKeysLength = (options === null || options === void 0 ? void 0 : options.recordKeysLength) || 1;
    return new Array(recordKeysLength).fill(null).reduce(function (prev) {
        var _a;
        return __assign(__assign({}, prev), (_a = {}, _a[generateMock(zodRef.keySchema, options)] = generateMock(zodRef.valueSchema, options, depth), _a));
    }, {});
}
function findMatchingFaker(keyName) {
    var lowerCaseKeyName = keyName.toLowerCase();
    var withoutDashesUnderscores = lowerCaseKeyName.replace(/_|-/g, '');
    var fnName = undefined;
    var sectionName = Object.keys(faker_1.faker).find(function (sectionKey) {
        return Object.keys(faker_1.faker[sectionKey] || {}).find(function (fnKey) {
            var _a;
            var lower = fnKey.toLowerCase();
            fnName =
                lower === lowerCaseKeyName || lower === withoutDashesUnderscores
                    ? keyName
                    : undefined;
            // Skipping depreciated items
            var depreciated = {
                random: [
                    'image',
                    'number',
                    'float',
                    'uuid',
                    'boolean',
                    'hexaDecimal',
                ]
            };
            if (Object.keys(depreciated).find(function (key) {
                return key === sectionKey
                    ? depreciated[key].find(function (fn) { return fn === fnName; })
                    : false;
            })) {
                return undefined;
            }
            if (fnName) {
                // TODO: it would be good to clean up these type castings
                var fn = (_a = faker_1.faker[sectionKey]) === null || _a === void 0 ? void 0 : _a[fnName];
                if (typeof fn === 'function') {
                    try {
                        // some Faker functions, such as `faker.mersenne.seed`, are known to throw errors if called
                        // with incorrect parameters
                        var mock = fn();
                        return typeof mock === 'string' ||
                            typeof mock === 'number' ||
                            typeof mock === 'boolean' ||
                            mock instanceof Date
                            ? fnName
                            : undefined;
                    }
                    catch (_error) {
                        // do nothing. undefined will be returned eventually.
                    }
                }
            }
            return undefined;
        });
    });
    if (sectionName && fnName) {
        var section = faker_1.faker[sectionName];
        return section ? section[fnName] : undefined;
    }
}
function parseString(zodRef, options) {
    var _a;
    var _b = zodRef._def.checks, checks = _b === void 0 ? [] : _b;
    var regexCheck = checks.find(function (check) { return check.kind === 'regex'; });
    if (regexCheck && 'regex' in regexCheck) {
        // @ts-ignore
        var generator_1 = new randExp(regexCheck.regex);
        var max = checks.find(function (check) { return check.kind === 'max'; });
        if (max && 'value' in max && typeof max.value === 'number') {
            generator_1.max = max.value;
        }
        var genRegString = generator_1.gen();
        return genRegString;
    }
    var lowerCaseKeyName = (_a = options === null || options === void 0 ? void 0 : options.keyName) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    // Prioritize user provided generators.
    if ((options === null || options === void 0 ? void 0 : options.keyName) && options.stringMap) {
        // min/max length handling is not applied here
        var generator_2 = options.stringMap[options.keyName];
        if (generator_2) {
            return generator_2();
        }
    }
    var stringOptions = {};
    checks.forEach(function (item) {
        switch (item.kind) {
            case 'min':
                stringOptions.min = item.value;
                break;
            case 'max':
                stringOptions.max = item.value;
                break;
        }
    });
    var sortedStringOptions = __assign({}, stringOptions);
    // avoid Max {Max} should be greater than min {Min}
    if (sortedStringOptions.min &&
        sortedStringOptions.max &&
        sortedStringOptions.min > sortedStringOptions.max) {
        var temp = sortedStringOptions.min;
        sortedStringOptions.min = sortedStringOptions.max;
        sortedStringOptions.max = temp;
    }
    var targetStringLength = faker_1.faker.datatype.number(sortedStringOptions);
    /**
     * Returns a random lorem word using `faker.lorem.word(length)`.
     * This method can return undefined for large word lengths. If undefined is returned
     * when specifying a large word length, will return `faker.lorem.word()` instead.
     */
    var defaultGenerator = function () {
        return faker_1.faker.lorem.word(targetStringLength) || faker_1.faker.lorem.word();
    };
    var dateGenerator = function () { return faker_1.faker.date.recent().toISOString(); };
    var stringGenerators = {
        "default": defaultGenerator,
        email: faker_1.faker.internet.exampleEmail,
        uuid: faker_1.faker.datatype.uuid,
        uid: faker_1.faker.datatype.uuid,
        url: faker_1.faker.internet.url,
        name: faker_1.faker.name.findName,
        date: dateGenerator,
        dateTime: dateGenerator,
        colorHex: faker_1.faker.internet.color,
        color: faker_1.faker.internet.color,
        backgroundColor: faker_1.faker.internet.color,
        textShadow: faker_1.faker.internet.color,
        textColor: faker_1.faker.internet.color,
        textDecorationColor: faker_1.faker.internet.color,
        borderColor: faker_1.faker.internet.color,
        borderTopColor: faker_1.faker.internet.color,
        borderRightColor: faker_1.faker.internet.color,
        borderBottomColor: faker_1.faker.internet.color,
        borderLeftColor: faker_1.faker.internet.color,
        borderBlockStartColor: faker_1.faker.internet.color,
        borderBlockEndColor: faker_1.faker.internet.color,
        borderInlineStartColor: faker_1.faker.internet.color,
        borderInlineEndColor: faker_1.faker.internet.color,
        columnRuleColor: faker_1.faker.internet.color,
        outlineColor: faker_1.faker.internet.color,
        phoneNumber: faker_1.faker.phone.number,
        description: faker_1.faker.lorem.sentences
    };
    var stringType = Object.keys(stringGenerators).find(function (genKey) {
        return genKey.toLowerCase() === lowerCaseKeyName ||
            checks.find(function (item) { return item.kind === genKey; });
    }) || null;
    var generator = defaultGenerator;
    if (stringType) {
        generator = stringGenerators[stringType];
    }
    else {
        var foundFaker = (options === null || options === void 0 ? void 0 : options.keyName)
            ? findMatchingFaker(options === null || options === void 0 ? void 0 : options.keyName)
            : undefined;
        if (foundFaker) {
            generator = foundFaker;
        }
    }
    // it's possible for a zod schema to be defined with a
    // min that is greater than the max. While that schema
    // will never parse without producing errors, we will prioritize
    // the max value because exceeding it represents a potential security
    // vulnerability (buffer overflows).
    var val = generator().toString();
    var delta = targetStringLength - val.length;
    if (stringOptions.min != null && val.length < stringOptions.min) {
        val = val + faker_1.faker.random.alpha(delta);
    }
    return val.slice(0, stringOptions.max);
}
function parseNumber(zodRef) {
    var _a = zodRef._def.checks, checks = _a === void 0 ? [] : _a;
    var options = {};
    checks.forEach(function (item) {
        switch (item.kind) {
            case 'int':
                break;
            case 'min':
                options.min = item.value;
                break;
            case 'max':
                options.max = item.value;
                break;
        }
    });
    return faker_1.faker.datatype.number(options);
}
function parseOptional(zodRef, options) {
    return generateMock(zodRef.unwrap(), options);
}
function parseArray(zodRef, options, depth) {
    var _a, _b;
    if (depth === void 0) { depth = 0; }
    var min = ((_a = zodRef._def.minLength) === null || _a === void 0 ? void 0 : _a.value) != null ? zodRef._def.minLength.value : 1;
    var max = ((_b = zodRef._def.maxLength) === null || _b === void 0 ? void 0 : _b.value) != null ? zodRef._def.maxLength.value : 5;
    // prevents arrays from exceeding the max regardless of the min.
    if (min > max) {
        min = max;
    }
    var targetLength = faker_1.faker.datatype.number({ min: min, max: max });
    var results = [];
    for (var index = 0; index < targetLength; index++) {
        results.push(generateMock(zodRef._def.type, options, depth + 1));
    }
    return results;
}
function parseEnum(zodRef) {
    var values = zodRef._def.values;
    var pick = Math.floor(Math.random() * values.length);
    return values[pick];
}
function parseNativeEnum(zodRef) {
    var values = zodRef._def.values;
    var pick = Math.floor(Math.random() * Object.values(values).length);
    var key = Array.from(Object.keys(values))[pick];
    return values[values[key]];
}
function parseLiteral(zodRef) {
    return zodRef._def.value;
}
function parseTransform(zodRef, options) {
    var input = generateMock(zodRef._def.schema, options);
    var effect = zodRef._def.effect.type === 'transform'
        ? zodRef._def.effect
        : { transform: function () { return input; } };
    return effect.transform(input, { addIssue: function () { return undefined; }, path: [] }); // TODO : Discover if context is necessary here
}
function parseUnion(zodRef, options) {
    // Map the options to various possible mock values
    var mockOptions = zodRef._def.options.map(function (option) {
        return generateMock(option, options);
    });
    return faker_1.faker.helpers.arrayElement(mockOptions);
}
function parseLazy(zodRef, options, depth) {
    var _a, _b;
    var delazified = (_b = (_a = zodRef === null || zodRef === void 0 ? void 0 : zodRef._def) === null || _a === void 0 ? void 0 : _a.getter) === null || _b === void 0 ? void 0 : _b.call(_a);
    return generateMock(delazified, options, depth);
}
var workerMap = {
    ZodObject: parseObject,
    ZodRecord: parseRecord,
    ZodString: parseString,
    ZodNumber: parseNumber,
    ZodBigInt: parseNumber,
    ZodBoolean: function () { return faker_1.faker.datatype.boolean(); },
    ZodDate: function () { return faker_1.faker.date.soon(); },
    ZodOptional: parseOptional,
    ZodNullable: parseOptional,
    ZodArray: parseArray,
    ZodEnum: parseEnum,
    ZodNativeEnum: parseNativeEnum,
    ZodLiteral: parseLiteral,
    ZodTransformer: parseTransform,
    ZodEffects: parseTransform,
    ZodUnion: parseUnion,
    ZodLazy: parseLazy
};
function generateMock(zodRef, options, depth) {
    var _a;
    if (depth === void 0) { depth = 0; }
    if ((options === null || options === void 0 ? void 0 : options.maxDepth) && depth > options.maxDepth)
        return undefined;
    try {
        var typeName = zodRef._def.typeName;
        if (typeName in workerMap) {
            return workerMap[typeName](zodRef, options, depth);
        }
        else {
            // check for a generator match in the options.
            // workaround for unimplemented Zod types
            var generator = (_a = options === null || options === void 0 ? void 0 : options.backupMocks) === null || _a === void 0 ? void 0 : _a[typeName];
            if (generator) {
                return generator();
            }
        }
        return undefined;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
}
exports.generateMock = generateMock;
//# sourceMappingURL=zod-mock.js.map