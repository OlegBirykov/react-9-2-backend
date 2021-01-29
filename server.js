const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let posts = [];
let nextId = 1;

const router = new Router();

router.get('/posts', async (ctx) => {
  ctx.response.body = posts;
});

router.post('/posts', async (ctx) => {
  const { id, content } = ctx.request.body;

  if (id !== 0) {
    posts = posts.map((o) => (o.id !== id ? o : { ...o, content }));
    ctx.response.status = 204;
    return;
  }

  posts.push({ ...ctx.request.body, id: nextId++, created: Date.now() });
  ctx.response.status = 204;
});

router.delete('/posts/:id', async (ctx) => {
  const postId = Number(ctx.params.id);
  const index = posts.findIndex((o) => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port);
