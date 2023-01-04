import fastify from 'fastify';
import { readFileSync } from 'fs';
import fastifyMiddie from 'middie';
import { join } from 'path';
import { build, createServer } from 'vite';

const start = async () => {
  const frontendDir = join(__dirname, 'frontend');
  const server = fastify({ logger: true });
  await server.register(fastifyMiddie);
  const vite = await createServer({
    root: frontendDir,
    base: '/frontend/',
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });
  server.use(vite.middlewares);
  console.log('VITE CONFIG:', JSON.stringify(vite.config, null, 2));

  server.get('/build-vite', async (req, res) => {
    await build({
      root: join(__dirname, 'frontend'),
      build: {
        outDir: '../../dist',
      },
    });
    res.send({ status: true });
  });

  server.get('/frontend/*', async (req, res) => {
    const url = req.url;
    console.log('URL:', url);
    console.log('MODULE_GRAPH:', vite.moduleGraph);

    let template = readFileSync(join(frontendDir, 'index.html'), 'utf-8');
    template = await vite.transformIndexHtml(url, template);

    res.type('text/html').send(template);
  });

  await server.listen({ port: 3000 });
};

start();
