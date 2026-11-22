// Generated from references/snapshot.schema.json with Ajv standalone code. See NOTICE.md.
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// snapshot-validator-source.mjs
var validate = validate10;
var snapshot_validator_source_default = validate10;
var schema11 = { "$schema": "http://json-schema.org/draft-07/schema#", "title": "vc-project snapshot", "type": "object", "additionalProperties": false, "required": ["schemaVersion", "fingerprint", "codeStandardsDigest", "inventory", "checked", "skipped", "researchStatus"], "properties": { "schemaVersion": { "const": 4 }, "fingerprint": { "type": ["string", "null"], "pattern": "^[0-9a-f]{64}$" }, "codeStandardsDigest": { "type": ["string", "null"], "pattern": "^[0-9a-f]{64}$" }, "inventory": { "type": "object", "additionalProperties": false, "required": ["packages", "configurations"], "properties": { "packages": { "type": "array", "items": { "$ref": "#/definitions/package" } }, "configurations": { "type": "array", "items": { "$ref": "#/definitions/configuration" } } } }, "checked": { "type": "array", "items": { "type": "string", "pattern": "^[0-9a-f]{64}$" } }, "skipped": { "type": "array", "items": { "$ref": "#/definitions/skip" } }, "researchStatus": { "type": "array", "items": { "$ref": "#/definitions/researchFailure" } } }, "definitions": { "path": { "type": "string", "pattern": "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$" }, "text": { "type": "string", "minLength": 1 }, "version": { "type": ["string", "null"], "minLength": 1 }, "resolution": { "type": "object", "additionalProperties": false, "required": ["name", "version"], "properties": { "name": { "$ref": "#/definitions/text" }, "version": { "$ref": "#/definitions/text" } } }, "package": { "type": "object", "additionalProperties": false, "required": ["workspace", "section", "declaredName", "specifier", "resolvedName", "version", "installState", "lockfileResolution"], "properties": { "workspace": { "$ref": "#/definitions/path" }, "section": { "enum": ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"] }, "declaredName": { "$ref": "#/definitions/text" }, "specifier": { "$ref": "#/definitions/text" }, "resolvedName": { "$ref": "#/definitions/text" }, "version": { "$ref": "#/definitions/version" }, "installState": { "enum": ["installed", "installed-mismatch", "lockfile-only", "unresolved"] }, "lockfileResolution": { "anyOf": [{ "type": "null" }, { "$ref": "#/definitions/resolution" }] } }, "if": { "properties": { "installState": { "enum": ["installed-mismatch", "lockfile-only"] } } }, "then": { "properties": { "lockfileResolution": { "$ref": "#/definitions/resolution" } } } }, "configuration": { "type": "object", "additionalProperties": false, "required": ["workspace", "path", "evidence", "digest", "review"], "properties": { "workspace": { "$ref": "#/definitions/path" }, "path": { "$ref": "#/definitions/path" }, "evidence": { "type": "string", "pattern": "^(?:schema:https://|filename:).+" }, "digest": { "type": "string", "pattern": "^[0-9a-f]{64}$" }, "review": { "anyOf": [{ "type": "null" }, { "$ref": "#/definitions/configurationReview" }] } } }, "configurationReview": { "type": "object", "additionalProperties": false, "required": ["technology", "source", "fields"], "properties": { "technology": { "$ref": "#/definitions/text" }, "source": { "$ref": "#/definitions/text" }, "fields": { "anyOf": [{ "type": "null" }, { "type": "array", "uniqueItems": true, "items": { "type": "string", "pattern": "^(?:/(?:[^~/]|~[01])*)+$" } }] } } }, "skip": { "type": "object", "additionalProperties": false, "required": ["kind", "source", "identity", "destination"], "properties": { "kind": { "enum": ["skill", "mcp", "hook", "code-standard"] }, "source": { "$ref": "#/definitions/text" }, "identity": { "$ref": "#/definitions/text" }, "destination": { "$ref": "#/definitions/path" } } }, "researchFailure": { "type": "object", "additionalProperties": false, "required": ["key", "version", "status", "reason", "checkedAt"], "properties": { "key": { "$ref": "#/definitions/text" }, "version": { "$ref": "#/definitions/version" }, "status": { "enum": ["unreachable", "not-found"] }, "reason": { "type": "string", "minLength": 1, "maxLength": 200 }, "checkedAt": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$" } } } } };
var pattern0 = new RegExp("^[0-9a-f]{64}$", "u");
var schema12 = { "type": "object", "additionalProperties": false, "required": ["workspace", "section", "declaredName", "specifier", "resolvedName", "version", "installState", "lockfileResolution"], "properties": { "workspace": { "$ref": "#/definitions/path" }, "section": { "enum": ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"] }, "declaredName": { "$ref": "#/definitions/text" }, "specifier": { "$ref": "#/definitions/text" }, "resolvedName": { "$ref": "#/definitions/text" }, "version": { "$ref": "#/definitions/version" }, "installState": { "enum": ["installed", "installed-mismatch", "lockfile-only", "unresolved"] }, "lockfileResolution": { "anyOf": [{ "type": "null" }, { "$ref": "#/definitions/resolution" }] } }, "if": { "properties": { "installState": { "enum": ["installed-mismatch", "lockfile-only"] } } }, "then": { "properties": { "lockfileResolution": { "$ref": "#/definitions/resolution" } } } };
var schema20 = { "type": ["string", "null"], "minLength": 1 };
var func2 = require_ucs2length().default;
function validate12(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.name === void 0 && (missing0 = "name") || data.version === void 0 && (missing0 = "version")) {
        validate12.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "name" || key0 === "version")) {
            validate12.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.name !== void 0) {
            let data0 = data.name;
            const _errs2 = errors;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (typeof data0 === "string") {
                if (func2(data0) < 1) {
                  validate12.errors = [{ instancePath: instancePath + "/name", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                  return false;
                }
              } else {
                validate12.errors = [{ instancePath: instancePath + "/name", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.version !== void 0) {
              let data1 = data.version;
              const _errs5 = errors;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (typeof data1 === "string") {
                  if (func2(data1) < 1) {
                    validate12.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                    return false;
                  }
                } else {
                  validate12.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate12.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate12.errors = vErrors;
  return errors === 0;
}
var pattern2 = new RegExp("^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$", "u");
function validate11(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  const _errs1 = errors;
  let valid0 = true;
  const _errs2 = errors;
  if (data && typeof data == "object" && !Array.isArray(data)) {
    if (data.installState !== void 0) {
      let data0 = data.installState;
      if (!(data0 === "installed-mismatch" || data0 === "lockfile-only")) {
        const err0 = {};
        if (vErrors === null) {
          vErrors = [err0];
        } else {
          vErrors.push(err0);
        }
        errors++;
      }
    }
  }
  var _valid0 = _errs2 === errors;
  errors = _errs1;
  if (vErrors !== null) {
    if (_errs1) {
      vErrors.length = _errs1;
    } else {
      vErrors = null;
    }
  }
  if (_valid0) {
    const _errs4 = errors;
    if (data && typeof data == "object" && !Array.isArray(data)) {
      if (data.lockfileResolution !== void 0) {
        if (!validate12(data.lockfileResolution, { instancePath: instancePath + "/lockfileResolution", parentData: data, parentDataProperty: "lockfileResolution", rootData })) {
          vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);
          errors = vErrors.length;
        }
      }
    }
    var _valid0 = _errs4 === errors;
    valid0 = _valid0;
  }
  if (!valid0) {
    const err1 = { instancePath, schemaPath: "#/if", keyword: "if", params: { failingKeyword: "then" }, message: 'must match "then" schema' };
    if (vErrors === null) {
      vErrors = [err1];
    } else {
      vErrors.push(err1);
    }
    errors++;
    validate11.errors = vErrors;
    return false;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.workspace === void 0 && (missing0 = "workspace") || data.section === void 0 && (missing0 = "section") || data.declaredName === void 0 && (missing0 = "declaredName") || data.specifier === void 0 && (missing0 = "specifier") || data.resolvedName === void 0 && (missing0 = "resolvedName") || data.version === void 0 && (missing0 = "version") || data.installState === void 0 && (missing0 = "installState") || data.lockfileResolution === void 0 && (missing0 = "lockfileResolution")) {
        validate11.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs6 = errors;
        for (const key0 in data) {
          if (!(key0 === "workspace" || key0 === "section" || key0 === "declaredName" || key0 === "specifier" || key0 === "resolvedName" || key0 === "version" || key0 === "installState" || key0 === "lockfileResolution")) {
            validate11.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs6 === errors) {
          if (data.workspace !== void 0) {
            let data2 = data.workspace;
            const _errs7 = errors;
            const _errs8 = errors;
            if (errors === _errs8) {
              if (typeof data2 === "string") {
                if (!pattern2.test(data2)) {
                  validate11.errors = [{ instancePath: instancePath + "/workspace", schemaPath: "#/definitions/path/pattern", keyword: "pattern", params: { pattern: "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$" }, message: 'must match pattern "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$"' }];
                  return false;
                }
              } else {
                validate11.errors = [{ instancePath: instancePath + "/workspace", schemaPath: "#/definitions/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid3 = _errs7 === errors;
          } else {
            var valid3 = true;
          }
          if (valid3) {
            if (data.section !== void 0) {
              let data3 = data.section;
              const _errs10 = errors;
              if (!(data3 === "dependencies" || data3 === "devDependencies" || data3 === "optionalDependencies" || data3 === "peerDependencies")) {
                validate11.errors = [{ instancePath: instancePath + "/section", schemaPath: "#/properties/section/enum", keyword: "enum", params: { allowedValues: schema12.properties.section.enum }, message: "must be equal to one of the allowed values" }];
                return false;
              }
              var valid3 = _errs10 === errors;
            } else {
              var valid3 = true;
            }
            if (valid3) {
              if (data.declaredName !== void 0) {
                let data4 = data.declaredName;
                const _errs11 = errors;
                const _errs12 = errors;
                if (errors === _errs12) {
                  if (typeof data4 === "string") {
                    if (func2(data4) < 1) {
                      validate11.errors = [{ instancePath: instancePath + "/declaredName", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                      return false;
                    }
                  } else {
                    validate11.errors = [{ instancePath: instancePath + "/declaredName", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                }
                var valid3 = _errs11 === errors;
              } else {
                var valid3 = true;
              }
              if (valid3) {
                if (data.specifier !== void 0) {
                  let data5 = data.specifier;
                  const _errs14 = errors;
                  const _errs15 = errors;
                  if (errors === _errs15) {
                    if (typeof data5 === "string") {
                      if (func2(data5) < 1) {
                        validate11.errors = [{ instancePath: instancePath + "/specifier", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                        return false;
                      }
                    } else {
                      validate11.errors = [{ instancePath: instancePath + "/specifier", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                  var valid3 = _errs14 === errors;
                } else {
                  var valid3 = true;
                }
                if (valid3) {
                  if (data.resolvedName !== void 0) {
                    let data6 = data.resolvedName;
                    const _errs17 = errors;
                    const _errs18 = errors;
                    if (errors === _errs18) {
                      if (typeof data6 === "string") {
                        if (func2(data6) < 1) {
                          validate11.errors = [{ instancePath: instancePath + "/resolvedName", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                          return false;
                        }
                      } else {
                        validate11.errors = [{ instancePath: instancePath + "/resolvedName", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                    }
                    var valid3 = _errs17 === errors;
                  } else {
                    var valid3 = true;
                  }
                  if (valid3) {
                    if (data.version !== void 0) {
                      let data7 = data.version;
                      const _errs20 = errors;
                      const _errs21 = errors;
                      if (typeof data7 !== "string" && data7 !== null) {
                        validate11.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/version/type", keyword: "type", params: { type: schema20.type }, message: "must be string,null" }];
                        return false;
                      }
                      if (errors === _errs21) {
                        if (typeof data7 === "string") {
                          if (func2(data7) < 1) {
                            validate11.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/version/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                            return false;
                          }
                        }
                      }
                      var valid3 = _errs20 === errors;
                    } else {
                      var valid3 = true;
                    }
                    if (valid3) {
                      if (data.installState !== void 0) {
                        let data8 = data.installState;
                        const _errs23 = errors;
                        if (!(data8 === "installed" || data8 === "installed-mismatch" || data8 === "lockfile-only" || data8 === "unresolved")) {
                          validate11.errors = [{ instancePath: instancePath + "/installState", schemaPath: "#/properties/installState/enum", keyword: "enum", params: { allowedValues: schema12.properties.installState.enum }, message: "must be equal to one of the allowed values" }];
                          return false;
                        }
                        var valid3 = _errs23 === errors;
                      } else {
                        var valid3 = true;
                      }
                      if (valid3) {
                        if (data.lockfileResolution !== void 0) {
                          let data9 = data.lockfileResolution;
                          const _errs24 = errors;
                          const _errs25 = errors;
                          let valid9 = false;
                          const _errs26 = errors;
                          if (data9 !== null) {
                            const err2 = { instancePath: instancePath + "/lockfileResolution", schemaPath: "#/properties/lockfileResolution/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                            if (vErrors === null) {
                              vErrors = [err2];
                            } else {
                              vErrors.push(err2);
                            }
                            errors++;
                          }
                          var _valid1 = _errs26 === errors;
                          valid9 = valid9 || _valid1;
                          if (!valid9) {
                            const _errs28 = errors;
                            if (!validate12(data9, { instancePath: instancePath + "/lockfileResolution", parentData: data, parentDataProperty: "lockfileResolution", rootData })) {
                              vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);
                              errors = vErrors.length;
                            }
                            var _valid1 = _errs28 === errors;
                            valid9 = valid9 || _valid1;
                          }
                          if (!valid9) {
                            const err3 = { instancePath: instancePath + "/lockfileResolution", schemaPath: "#/properties/lockfileResolution/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                            if (vErrors === null) {
                              vErrors = [err3];
                            } else {
                              vErrors.push(err3);
                            }
                            errors++;
                            validate11.errors = vErrors;
                            return false;
                          } else {
                            errors = _errs25;
                            if (vErrors !== null) {
                              if (_errs25) {
                                vErrors.length = _errs25;
                              } else {
                                vErrors = null;
                              }
                            }
                          }
                          var valid3 = _errs24 === errors;
                        } else {
                          var valid3 = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate11.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate11.errors = vErrors;
  return errors === 0;
}
var pattern5 = new RegExp("^(?:schema:https://|filename:).+", "u");
var pattern7 = new RegExp("^(?:/(?:[^~/]|~[01])*)+$", "u");
function validate17(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.technology === void 0 && (missing0 = "technology") || data.source === void 0 && (missing0 = "source") || data.fields === void 0 && (missing0 = "fields")) {
        validate17.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "technology" || key0 === "source" || key0 === "fields")) {
            validate17.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.technology !== void 0) {
            let data0 = data.technology;
            const _errs2 = errors;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (typeof data0 === "string") {
                if (func2(data0) < 1) {
                  validate17.errors = [{ instancePath: instancePath + "/technology", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                  return false;
                }
              } else {
                validate17.errors = [{ instancePath: instancePath + "/technology", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.source !== void 0) {
              let data1 = data.source;
              const _errs5 = errors;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (typeof data1 === "string") {
                  if (func2(data1) < 1) {
                    validate17.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                    return false;
                  }
                } else {
                  validate17.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.fields !== void 0) {
                let data2 = data.fields;
                const _errs8 = errors;
                const _errs9 = errors;
                let valid3 = false;
                const _errs10 = errors;
                if (data2 !== null) {
                  const err0 = { instancePath: instancePath + "/fields", schemaPath: "#/properties/fields/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                  if (vErrors === null) {
                    vErrors = [err0];
                  } else {
                    vErrors.push(err0);
                  }
                  errors++;
                }
                var _valid0 = _errs10 === errors;
                valid3 = valid3 || _valid0;
                if (!valid3) {
                  const _errs12 = errors;
                  if (errors === _errs12) {
                    if (Array.isArray(data2)) {
                      var valid4 = true;
                      const len0 = data2.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        let data3 = data2[i0];
                        const _errs14 = errors;
                        if (errors === _errs14) {
                          if (typeof data3 === "string") {
                            if (!pattern7.test(data3)) {
                              const err1 = { instancePath: instancePath + "/fields/" + i0, schemaPath: "#/properties/fields/anyOf/1/items/pattern", keyword: "pattern", params: { pattern: "^(?:/(?:[^~/]|~[01])*)+$" }, message: 'must match pattern "^(?:/(?:[^~/]|~[01])*)+$"' };
                              if (vErrors === null) {
                                vErrors = [err1];
                              } else {
                                vErrors.push(err1);
                              }
                              errors++;
                            }
                          } else {
                            const err2 = { instancePath: instancePath + "/fields/" + i0, schemaPath: "#/properties/fields/anyOf/1/items/type", keyword: "type", params: { type: "string" }, message: "must be string" };
                            if (vErrors === null) {
                              vErrors = [err2];
                            } else {
                              vErrors.push(err2);
                            }
                            errors++;
                          }
                        }
                        var valid4 = _errs14 === errors;
                        if (!valid4) {
                          break;
                        }
                      }
                      if (valid4) {
                        let i1 = data2.length;
                        let j0;
                        if (i1 > 1) {
                          const indices0 = {};
                          for (; i1--; ) {
                            let item0 = data2[i1];
                            if (typeof item0 !== "string") {
                              continue;
                            }
                            if (typeof indices0[item0] == "number") {
                              j0 = indices0[item0];
                              const err3 = { instancePath: instancePath + "/fields", schemaPath: "#/properties/fields/anyOf/1/uniqueItems", keyword: "uniqueItems", params: { i: i1, j: j0 }, message: "must NOT have duplicate items (items ## " + j0 + " and " + i1 + " are identical)" };
                              if (vErrors === null) {
                                vErrors = [err3];
                              } else {
                                vErrors.push(err3);
                              }
                              errors++;
                              break;
                            }
                            indices0[item0] = i1;
                          }
                        }
                      }
                    } else {
                      const err4 = { instancePath: instancePath + "/fields", schemaPath: "#/properties/fields/anyOf/1/type", keyword: "type", params: { type: "array" }, message: "must be array" };
                      if (vErrors === null) {
                        vErrors = [err4];
                      } else {
                        vErrors.push(err4);
                      }
                      errors++;
                    }
                  }
                  var _valid0 = _errs12 === errors;
                  valid3 = valid3 || _valid0;
                }
                if (!valid3) {
                  const err5 = { instancePath: instancePath + "/fields", schemaPath: "#/properties/fields/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                  if (vErrors === null) {
                    vErrors = [err5];
                  } else {
                    vErrors.push(err5);
                  }
                  errors++;
                  validate17.errors = vErrors;
                  return false;
                } else {
                  errors = _errs9;
                  if (vErrors !== null) {
                    if (_errs9) {
                      vErrors.length = _errs9;
                    } else {
                      vErrors = null;
                    }
                  }
                }
                var valid0 = _errs8 === errors;
              } else {
                var valid0 = true;
              }
            }
          }
        }
      }
    } else {
      validate17.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate17.errors = vErrors;
  return errors === 0;
}
function validate16(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.workspace === void 0 && (missing0 = "workspace") || data.path === void 0 && (missing0 = "path") || data.evidence === void 0 && (missing0 = "evidence") || data.digest === void 0 && (missing0 = "digest") || data.review === void 0 && (missing0 = "review")) {
        validate16.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "workspace" || key0 === "path" || key0 === "evidence" || key0 === "digest" || key0 === "review")) {
            validate16.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.workspace !== void 0) {
            let data0 = data.workspace;
            const _errs2 = errors;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (typeof data0 === "string") {
                if (!pattern2.test(data0)) {
                  validate16.errors = [{ instancePath: instancePath + "/workspace", schemaPath: "#/definitions/path/pattern", keyword: "pattern", params: { pattern: "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$" }, message: 'must match pattern "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$"' }];
                  return false;
                }
              } else {
                validate16.errors = [{ instancePath: instancePath + "/workspace", schemaPath: "#/definitions/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.path !== void 0) {
              let data1 = data.path;
              const _errs5 = errors;
              const _errs6 = errors;
              if (errors === _errs6) {
                if (typeof data1 === "string") {
                  if (!pattern2.test(data1)) {
                    validate16.errors = [{ instancePath: instancePath + "/path", schemaPath: "#/definitions/path/pattern", keyword: "pattern", params: { pattern: "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$" }, message: 'must match pattern "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$"' }];
                    return false;
                  }
                } else {
                  validate16.errors = [{ instancePath: instancePath + "/path", schemaPath: "#/definitions/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.evidence !== void 0) {
                let data2 = data.evidence;
                const _errs8 = errors;
                if (errors === _errs8) {
                  if (typeof data2 === "string") {
                    if (!pattern5.test(data2)) {
                      validate16.errors = [{ instancePath: instancePath + "/evidence", schemaPath: "#/properties/evidence/pattern", keyword: "pattern", params: { pattern: "^(?:schema:https://|filename:).+" }, message: 'must match pattern "^(?:schema:https://|filename:).+"' }];
                      return false;
                    }
                  } else {
                    validate16.errors = [{ instancePath: instancePath + "/evidence", schemaPath: "#/properties/evidence/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                }
                var valid0 = _errs8 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.digest !== void 0) {
                  let data3 = data.digest;
                  const _errs10 = errors;
                  if (errors === _errs10) {
                    if (typeof data3 === "string") {
                      if (!pattern0.test(data3)) {
                        validate16.errors = [{ instancePath: instancePath + "/digest", schemaPath: "#/properties/digest/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' }];
                        return false;
                      }
                    } else {
                      validate16.errors = [{ instancePath: instancePath + "/digest", schemaPath: "#/properties/digest/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                  var valid0 = _errs10 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.review !== void 0) {
                    let data4 = data.review;
                    const _errs12 = errors;
                    const _errs13 = errors;
                    let valid3 = false;
                    const _errs14 = errors;
                    if (data4 !== null) {
                      const err0 = { instancePath: instancePath + "/review", schemaPath: "#/properties/review/anyOf/0/type", keyword: "type", params: { type: "null" }, message: "must be null" };
                      if (vErrors === null) {
                        vErrors = [err0];
                      } else {
                        vErrors.push(err0);
                      }
                      errors++;
                    }
                    var _valid0 = _errs14 === errors;
                    valid3 = valid3 || _valid0;
                    if (!valid3) {
                      const _errs16 = errors;
                      if (!validate17(data4, { instancePath: instancePath + "/review", parentData: data, parentDataProperty: "review", rootData })) {
                        vErrors = vErrors === null ? validate17.errors : vErrors.concat(validate17.errors);
                        errors = vErrors.length;
                      }
                      var _valid0 = _errs16 === errors;
                      valid3 = valid3 || _valid0;
                    }
                    if (!valid3) {
                      const err1 = { instancePath: instancePath + "/review", schemaPath: "#/properties/review/anyOf", keyword: "anyOf", params: {}, message: "must match a schema in anyOf" };
                      if (vErrors === null) {
                        vErrors = [err1];
                      } else {
                        vErrors.push(err1);
                      }
                      errors++;
                      validate16.errors = vErrors;
                      return false;
                    } else {
                      errors = _errs13;
                      if (vErrors !== null) {
                        if (_errs13) {
                          vErrors.length = _errs13;
                        } else {
                          vErrors = null;
                        }
                      }
                    }
                    var valid0 = _errs12 === errors;
                  } else {
                    var valid0 = true;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate16.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate16.errors = vErrors;
  return errors === 0;
}
var schema27 = { "type": "object", "additionalProperties": false, "required": ["kind", "source", "identity", "destination"], "properties": { "kind": { "enum": ["skill", "mcp", "hook", "code-standard"] }, "source": { "$ref": "#/definitions/text" }, "identity": { "$ref": "#/definitions/text" }, "destination": { "$ref": "#/definitions/path" } } };
function validate20(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.kind === void 0 && (missing0 = "kind") || data.source === void 0 && (missing0 = "source") || data.identity === void 0 && (missing0 = "identity") || data.destination === void 0 && (missing0 = "destination")) {
        validate20.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "kind" || key0 === "source" || key0 === "identity" || key0 === "destination")) {
            validate20.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.kind !== void 0) {
            let data0 = data.kind;
            const _errs2 = errors;
            if (!(data0 === "skill" || data0 === "mcp" || data0 === "hook" || data0 === "code-standard")) {
              validate20.errors = [{ instancePath: instancePath + "/kind", schemaPath: "#/properties/kind/enum", keyword: "enum", params: { allowedValues: schema27.properties.kind.enum }, message: "must be equal to one of the allowed values" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.source !== void 0) {
              let data1 = data.source;
              const _errs3 = errors;
              const _errs4 = errors;
              if (errors === _errs4) {
                if (typeof data1 === "string") {
                  if (func2(data1) < 1) {
                    validate20.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                    return false;
                  }
                } else {
                  validate20.errors = [{ instancePath: instancePath + "/source", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                  return false;
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.identity !== void 0) {
                let data2 = data.identity;
                const _errs6 = errors;
                const _errs7 = errors;
                if (errors === _errs7) {
                  if (typeof data2 === "string") {
                    if (func2(data2) < 1) {
                      validate20.errors = [{ instancePath: instancePath + "/identity", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                      return false;
                    }
                  } else {
                    validate20.errors = [{ instancePath: instancePath + "/identity", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.destination !== void 0) {
                  let data3 = data.destination;
                  const _errs9 = errors;
                  const _errs10 = errors;
                  if (errors === _errs10) {
                    if (typeof data3 === "string") {
                      if (!pattern2.test(data3)) {
                        validate20.errors = [{ instancePath: instancePath + "/destination", schemaPath: "#/definitions/path/pattern", keyword: "pattern", params: { pattern: "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$" }, message: 'must match pattern "^(?!/|[A-Za-z]:)(?!.*(?:^|/)\\.\\.(?:/|$))[^\\\\\\r\\n]+$"' }];
                        return false;
                      }
                    } else {
                      validate20.errors = [{ instancePath: instancePath + "/destination", schemaPath: "#/definitions/path/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate20.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate20.errors = vErrors;
  return errors === 0;
}
var schema31 = { "type": "object", "additionalProperties": false, "required": ["key", "version", "status", "reason", "checkedAt"], "properties": { "key": { "$ref": "#/definitions/text" }, "version": { "$ref": "#/definitions/version" }, "status": { "enum": ["unreachable", "not-found"] }, "reason": { "type": "string", "minLength": 1, "maxLength": 200 }, "checkedAt": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$" } } };
var pattern10 = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$", "u");
function validate22(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.key === void 0 && (missing0 = "key") || data.version === void 0 && (missing0 = "version") || data.status === void 0 && (missing0 = "status") || data.reason === void 0 && (missing0 = "reason") || data.checkedAt === void 0 && (missing0 = "checkedAt")) {
        validate22.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "key" || key0 === "version" || key0 === "status" || key0 === "reason" || key0 === "checkedAt")) {
            validate22.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.key !== void 0) {
            let data0 = data.key;
            const _errs2 = errors;
            const _errs3 = errors;
            if (errors === _errs3) {
              if (typeof data0 === "string") {
                if (func2(data0) < 1) {
                  validate22.errors = [{ instancePath: instancePath + "/key", schemaPath: "#/definitions/text/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                  return false;
                }
              } else {
                validate22.errors = [{ instancePath: instancePath + "/key", schemaPath: "#/definitions/text/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                return false;
              }
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.version !== void 0) {
              let data1 = data.version;
              const _errs5 = errors;
              const _errs6 = errors;
              if (typeof data1 !== "string" && data1 !== null) {
                validate22.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/version/type", keyword: "type", params: { type: schema20.type }, message: "must be string,null" }];
                return false;
              }
              if (errors === _errs6) {
                if (typeof data1 === "string") {
                  if (func2(data1) < 1) {
                    validate22.errors = [{ instancePath: instancePath + "/version", schemaPath: "#/definitions/version/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                    return false;
                  }
                }
              }
              var valid0 = _errs5 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.status !== void 0) {
                let data2 = data.status;
                const _errs8 = errors;
                if (!(data2 === "unreachable" || data2 === "not-found")) {
                  validate22.errors = [{ instancePath: instancePath + "/status", schemaPath: "#/properties/status/enum", keyword: "enum", params: { allowedValues: schema31.properties.status.enum }, message: "must be equal to one of the allowed values" }];
                  return false;
                }
                var valid0 = _errs8 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.reason !== void 0) {
                  let data3 = data.reason;
                  const _errs9 = errors;
                  if (errors === _errs9) {
                    if (typeof data3 === "string") {
                      if (func2(data3) > 200) {
                        validate22.errors = [{ instancePath: instancePath + "/reason", schemaPath: "#/properties/reason/maxLength", keyword: "maxLength", params: { limit: 200 }, message: "must NOT have more than 200 characters" }];
                        return false;
                      } else {
                        if (func2(data3) < 1) {
                          validate22.errors = [{ instancePath: instancePath + "/reason", schemaPath: "#/properties/reason/minLength", keyword: "minLength", params: { limit: 1 }, message: "must NOT have fewer than 1 characters" }];
                          return false;
                        }
                      }
                    } else {
                      validate22.errors = [{ instancePath: instancePath + "/reason", schemaPath: "#/properties/reason/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                      return false;
                    }
                  }
                  var valid0 = _errs9 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.checkedAt !== void 0) {
                    let data4 = data.checkedAt;
                    const _errs11 = errors;
                    if (errors === _errs11) {
                      if (typeof data4 === "string") {
                        if (!pattern10.test(data4)) {
                          validate22.errors = [{ instancePath: instancePath + "/checkedAt", schemaPath: "#/properties/checkedAt/pattern", keyword: "pattern", params: { pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$" }, message: 'must match pattern "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$"' }];
                          return false;
                        }
                      } else {
                        validate22.errors = [{ instancePath: instancePath + "/checkedAt", schemaPath: "#/properties/checkedAt/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                        return false;
                      }
                    }
                    var valid0 = _errs11 === errors;
                  } else {
                    var valid0 = true;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate22.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate22.errors = vErrors;
  return errors === 0;
}
function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (data.schemaVersion === void 0 && (missing0 = "schemaVersion") || data.fingerprint === void 0 && (missing0 = "fingerprint") || data.codeStandardsDigest === void 0 && (missing0 = "codeStandardsDigest") || data.inventory === void 0 && (missing0 = "inventory") || data.checked === void 0 && (missing0 = "checked") || data.skipped === void 0 && (missing0 = "skipped") || data.researchStatus === void 0 && (missing0 = "researchStatus")) {
        validate10.errors = [{ instancePath, schemaPath: "#/required", keyword: "required", params: { missingProperty: missing0 }, message: "must have required property '" + missing0 + "'" }];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (!(key0 === "schemaVersion" || key0 === "fingerprint" || key0 === "codeStandardsDigest" || key0 === "inventory" || key0 === "checked" || key0 === "skipped" || key0 === "researchStatus")) {
            validate10.errors = [{ instancePath, schemaPath: "#/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key0 }, message: "must NOT have additional properties" }];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.schemaVersion !== void 0) {
            const _errs2 = errors;
            if (4 !== data.schemaVersion) {
              validate10.errors = [{ instancePath: instancePath + "/schemaVersion", schemaPath: "#/properties/schemaVersion/const", keyword: "const", params: { allowedValue: 4 }, message: "must be equal to constant" }];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.fingerprint !== void 0) {
              let data1 = data.fingerprint;
              const _errs3 = errors;
              if (typeof data1 !== "string" && data1 !== null) {
                validate10.errors = [{ instancePath: instancePath + "/fingerprint", schemaPath: "#/properties/fingerprint/type", keyword: "type", params: { type: schema11.properties.fingerprint.type }, message: "must be string,null" }];
                return false;
              }
              if (errors === _errs3) {
                if (typeof data1 === "string") {
                  if (!pattern0.test(data1)) {
                    validate10.errors = [{ instancePath: instancePath + "/fingerprint", schemaPath: "#/properties/fingerprint/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' }];
                    return false;
                  }
                }
              }
              var valid0 = _errs3 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.codeStandardsDigest !== void 0) {
                let data2 = data.codeStandardsDigest;
                const _errs5 = errors;
                if (typeof data2 !== "string" && data2 !== null) {
                  validate10.errors = [{ instancePath: instancePath + "/codeStandardsDigest", schemaPath: "#/properties/codeStandardsDigest/type", keyword: "type", params: { type: schema11.properties.codeStandardsDigest.type }, message: "must be string,null" }];
                  return false;
                }
                if (errors === _errs5) {
                  if (typeof data2 === "string") {
                    if (!pattern0.test(data2)) {
                      validate10.errors = [{ instancePath: instancePath + "/codeStandardsDigest", schemaPath: "#/properties/codeStandardsDigest/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' }];
                      return false;
                    }
                  }
                }
                var valid0 = _errs5 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.inventory !== void 0) {
                  let data3 = data.inventory;
                  const _errs7 = errors;
                  if (errors === _errs7) {
                    if (data3 && typeof data3 == "object" && !Array.isArray(data3)) {
                      let missing1;
                      if (data3.packages === void 0 && (missing1 = "packages") || data3.configurations === void 0 && (missing1 = "configurations")) {
                        validate10.errors = [{ instancePath: instancePath + "/inventory", schemaPath: "#/properties/inventory/required", keyword: "required", params: { missingProperty: missing1 }, message: "must have required property '" + missing1 + "'" }];
                        return false;
                      } else {
                        const _errs9 = errors;
                        for (const key1 in data3) {
                          if (!(key1 === "packages" || key1 === "configurations")) {
                            validate10.errors = [{ instancePath: instancePath + "/inventory", schemaPath: "#/properties/inventory/additionalProperties", keyword: "additionalProperties", params: { additionalProperty: key1 }, message: "must NOT have additional properties" }];
                            return false;
                            break;
                          }
                        }
                        if (_errs9 === errors) {
                          if (data3.packages !== void 0) {
                            let data4 = data3.packages;
                            const _errs10 = errors;
                            if (errors === _errs10) {
                              if (Array.isArray(data4)) {
                                var valid2 = true;
                                const len0 = data4.length;
                                for (let i0 = 0; i0 < len0; i0++) {
                                  const _errs12 = errors;
                                  if (!validate11(data4[i0], { instancePath: instancePath + "/inventory/packages/" + i0, parentData: data4, parentDataProperty: i0, rootData })) {
                                    vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
                                    errors = vErrors.length;
                                  }
                                  var valid2 = _errs12 === errors;
                                  if (!valid2) {
                                    break;
                                  }
                                }
                              } else {
                                validate10.errors = [{ instancePath: instancePath + "/inventory/packages", schemaPath: "#/properties/inventory/properties/packages/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                return false;
                              }
                            }
                            var valid1 = _errs10 === errors;
                          } else {
                            var valid1 = true;
                          }
                          if (valid1) {
                            if (data3.configurations !== void 0) {
                              let data6 = data3.configurations;
                              const _errs13 = errors;
                              if (errors === _errs13) {
                                if (Array.isArray(data6)) {
                                  var valid3 = true;
                                  const len1 = data6.length;
                                  for (let i1 = 0; i1 < len1; i1++) {
                                    const _errs15 = errors;
                                    if (!validate16(data6[i1], { instancePath: instancePath + "/inventory/configurations/" + i1, parentData: data6, parentDataProperty: i1, rootData })) {
                                      vErrors = vErrors === null ? validate16.errors : vErrors.concat(validate16.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid3 = _errs15 === errors;
                                    if (!valid3) {
                                      break;
                                    }
                                  }
                                } else {
                                  validate10.errors = [{ instancePath: instancePath + "/inventory/configurations", schemaPath: "#/properties/inventory/properties/configurations/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                                  return false;
                                }
                              }
                              var valid1 = _errs13 === errors;
                            } else {
                              var valid1 = true;
                            }
                          }
                        }
                      }
                    } else {
                      validate10.errors = [{ instancePath: instancePath + "/inventory", schemaPath: "#/properties/inventory/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
                      return false;
                    }
                  }
                  var valid0 = _errs7 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.checked !== void 0) {
                    let data8 = data.checked;
                    const _errs16 = errors;
                    if (errors === _errs16) {
                      if (Array.isArray(data8)) {
                        var valid4 = true;
                        const len2 = data8.length;
                        for (let i2 = 0; i2 < len2; i2++) {
                          let data9 = data8[i2];
                          const _errs18 = errors;
                          if (errors === _errs18) {
                            if (typeof data9 === "string") {
                              if (!pattern0.test(data9)) {
                                validate10.errors = [{ instancePath: instancePath + "/checked/" + i2, schemaPath: "#/properties/checked/items/pattern", keyword: "pattern", params: { pattern: "^[0-9a-f]{64}$" }, message: 'must match pattern "^[0-9a-f]{64}$"' }];
                                return false;
                              }
                            } else {
                              validate10.errors = [{ instancePath: instancePath + "/checked/" + i2, schemaPath: "#/properties/checked/items/type", keyword: "type", params: { type: "string" }, message: "must be string" }];
                              return false;
                            }
                          }
                          var valid4 = _errs18 === errors;
                          if (!valid4) {
                            break;
                          }
                        }
                      } else {
                        validate10.errors = [{ instancePath: instancePath + "/checked", schemaPath: "#/properties/checked/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                        return false;
                      }
                    }
                    var valid0 = _errs16 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.skipped !== void 0) {
                      let data10 = data.skipped;
                      const _errs20 = errors;
                      if (errors === _errs20) {
                        if (Array.isArray(data10)) {
                          var valid5 = true;
                          const len3 = data10.length;
                          for (let i3 = 0; i3 < len3; i3++) {
                            const _errs22 = errors;
                            if (!validate20(data10[i3], { instancePath: instancePath + "/skipped/" + i3, parentData: data10, parentDataProperty: i3, rootData })) {
                              vErrors = vErrors === null ? validate20.errors : vErrors.concat(validate20.errors);
                              errors = vErrors.length;
                            }
                            var valid5 = _errs22 === errors;
                            if (!valid5) {
                              break;
                            }
                          }
                        } else {
                          validate10.errors = [{ instancePath: instancePath + "/skipped", schemaPath: "#/properties/skipped/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                          return false;
                        }
                      }
                      var valid0 = _errs20 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.researchStatus !== void 0) {
                        let data12 = data.researchStatus;
                        const _errs23 = errors;
                        if (errors === _errs23) {
                          if (Array.isArray(data12)) {
                            var valid6 = true;
                            const len4 = data12.length;
                            for (let i4 = 0; i4 < len4; i4++) {
                              const _errs25 = errors;
                              if (!validate22(data12[i4], { instancePath: instancePath + "/researchStatus/" + i4, parentData: data12, parentDataProperty: i4, rootData })) {
                                vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
                                errors = vErrors.length;
                              }
                              var valid6 = _errs25 === errors;
                              if (!valid6) {
                                break;
                              }
                            }
                          } else {
                            validate10.errors = [{ instancePath: instancePath + "/researchStatus", schemaPath: "#/properties/researchStatus/type", keyword: "type", params: { type: "array" }, message: "must be array" }];
                            return false;
                          }
                        }
                        var valid0 = _errs23 === errors;
                      } else {
                        var valid0 = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      validate10.errors = [{ instancePath, schemaPath: "#/type", keyword: "type", params: { type: "object" }, message: "must be object" }];
      return false;
    }
  }
  validate10.errors = vErrors;
  return errors === 0;
}
export {
  snapshot_validator_source_default as default,
  validate,
  validate as validateSnapshot
};
