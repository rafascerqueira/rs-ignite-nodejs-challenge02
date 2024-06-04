import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateUserUseCase } from '../useCases/CreateUserUseCase'
import { randomUUID } from 'node:crypto'
import { knex } from '../../../database'
import { ApiError } from '../../../errors/ApiError'

export class CreateUserController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    const userAlreadyExists = await knex('users').where('email', email).first()

    if (userAlreadyExists) {
      throw new ApiError('user already exists')
    }

    const createUserUseCase = new CreateUserUseCase()

    const [id] = await createUserUseCase.execute({ name, email, sessionId })

    return reply.status(201).send(id)
  }
}
