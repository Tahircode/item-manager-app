"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = saveFile;
const cloudinary_1 = require("../cloudinary");
const crypto_1 = require("crypto");
function saveFile(file_1) {
    return __awaiter(this, arguments, void 0, function* (file, folder = 'uploads') {
        const arrayBuffer = yield file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder,
                public_id: `${(0, crypto_1.randomUUID)()}-${file.name}`,
                allowed_formats: ['jpg', 'jpeg', 'png'],
            }, (err, result) => {
                if (err || !result) {
                    reject(err || new Error('Upload failed'));
                }
                else {
                    resolve(result.secure_url);
                }
            });
            stream.end(buffer);
        });
    });
}
