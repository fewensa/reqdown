import Fastify, { FastifyRequest } from 'fastify'

const proxy = require('@fastify/http-proxy');
const fs = require('node:fs');


const fastify = Fastify({
  logger: true
});

async function route() {

  fastify.register(proxy, {
    upstream: '',
    prefix: '/:path(.*)',
    rewritePrefix: '/:path',
    http2: false,
    async preHandler(request, reply, next) {
      const url = request.url;
      const now = new Date().toISOString();
      const reqbody = request.body;
      if (reqbody) {
        try {
          const body = JSON.stringify(reqbody);
          const file = `/data/${now}.txt`;
          fs.writeFileSync(
            file,
            `
            ${url}
            --------
            ${body}
            `
            );
          // file written successfully
        } catch (err) {
          console.error(err);
        }
      }
      next();
      return reply;
    },
    replyOptions: {
      getUpstream: function (request: FastifyRequest) {
        return process.env.PROXY_ENDPOINT;
      },
    },
  });

}


async function main() {
  try {
    await route();
    await fastify.listen({host: '0.0.0.0', port: 3000})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

main().then(() => {
}).catch(e => console.error(e));
