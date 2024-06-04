import Fastify from 'fastify'
import { ApiError } from './ApiError'

const fastify = Fastify({
  logger: true,
})

export default fastify.setErrorHandler((error, _, reply) => {
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({ error })
  }

  return reply.status(500).send({
    status: 'error',
    message: `Internal Server Error: ${error}`,
  })
})
