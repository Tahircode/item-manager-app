// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
// import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

config();

const app = new Hono();
const prisma = new PrismaClient();

app.use('*', cors());

// POST /items
import { saveFile } from './utils/saveFileTemp';

app.post('/items', async (c) => {
  const form = await c.req.formData();

  const name = form.get('name')?.toString();
  const type = form.get('type')?.toString();
  const description = form.get('description')?.toString();
  const coverImage = form.get('coverImage') as File | null;
  const additionalImages = form.getAll('additionalImages') as File[];
    console.log(FormData);

  if (!name || !type || !description || !coverImage) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const coverImageUrl = await saveFile(coverImage, 'cover-images');

  const additionalImageUrls = await Promise.all(
    additionalImages.map((file) => saveFile(file, 'additional-images'))
  );

  const item = await prisma.item.create({
    data: {
      name,
      type,
      description,
      coverImageUrl,
      additionalImages: additionalImageUrls,
    },
  });

  return c.json(item, 201);
});

// GET /items
app.get('/items', async (c) => {
  const items = await prisma.item.findMany();
  return c.json(items);
});
app.post('/enquire', async (c) => {
  const { itemId, itemName } = await c.req.json();

  console.log('Enquiry received for item:', itemId, itemName);

  return c.json({ message: 'Enquiry sent successfully' });
});


// const PORT = Number(process.env.PORT) || 4000;
// serve({ fetch: app.fetch, port: PORT });
// console.log(`Server running at http://localhost:${PORT}`);
export default {
  fetch: app.fetch,
};
