import fastifyMiddie from '@fastify/middie';
import fastify from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createServer } from 'vite';

const start = async () => {
  const frontendDir = join(__dirname, 'frontend');
  const server = fastify({ logger: true });
  await server.register(fastifyMiddie);
  const vite = await createServer({
    root: frontendDir,
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });
  server.use(vite.middlewares);

  server.get('/*', async (req, res) => {
    const url = req.url;
    console.log('URL:', url);

    let template = readFileSync(join(frontendDir, 'index.html'), 'utf-8');
    template = await vite.transformIndexHtml(url, template);

    res.type('text/html').send(template);
  });

  await server.listen({ port: 3000 });
};

start();
