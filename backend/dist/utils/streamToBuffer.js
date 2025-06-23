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
exports.streamToBuffer = void 0;
const streamToBuffer = (stream) => __awaiter(void 0, void 0, void 0, function* () {
    const reader = stream.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = yield reader.read();
        if (done)
            break;
        if (value)
            chunks.push(value);
    }
    return Buffer.concat(chunks);
});
exports.streamToBuffer = streamToBuffer;
