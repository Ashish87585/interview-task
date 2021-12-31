"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, unquie: true },
    password: { type: String },
    phone: { type: String }
});
exports.default = (0, mongoose_1.model)("User", UserSchema);
