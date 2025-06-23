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
// src/index.ts
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const node_server_1 = require("@hono/node-server");
const prisma_1 = require("../generated/prisma");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = new hono_1.Hono();
const prisma = new prisma_1.PrismaClient();
app.use('*', (0, cors_1.cors)());
// POST /items
const saveFileTemp_1 = require("./utils/saveFileTemp");
app.post('/items', (c) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const form = yield c.req.formData();
    const name = (_a = form.get('name')) === null || _a === void 0 ? void 0 : _a.toString();
    const type = (_b = form.get('type')) === null || _b === void 0 ? void 0 : _b.toString();
    const description = (_c = form.get('description')) === null || _c === void 0 ? void 0 : _c.toString();
    const coverImage = form.get('coverImage');
    const additionalImages = form.getAll('additionalImages');
    if (!name || !type || !description || !coverImage) {
        return c.json({ error: 'Missing required fields' }, 400);
    }
    const coverImageUrl = yield (0, saveFileTemp_1.saveFile)(coverImage, 'cover-images');
    const additionalImageUrls = yield Promise.all(additionalImages.map((file) => (0, saveFileTemp_1.saveFile)(file, 'additional-images')));
    const item = yield prisma.item.create({
        data: {
            name,
            type,
            description,
            coverImageUrl,
            additionalImages: additionalImageUrls,
        },
    });
    return c.json(item, 201);
}));
// GET /items
app.get('/items', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield prisma.item.findMany();
    return c.json(items);
}));
app.post('/enquire', (c) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, itemName } = yield c.req.json();
    // Optionally send an email or store enquiry in DB
    console.log('Enquiry received for item:', itemId, itemName);
    return c.json({ message: 'Enquiry sent successfully' });
}));
// Start server
const PORT = Number(process.env.PORT) || 4000;
(0, node_server_1.serve)({ fetch: app.fetch, port: PORT });
console.log(`Server running at http://localhost:${PORT}`);
