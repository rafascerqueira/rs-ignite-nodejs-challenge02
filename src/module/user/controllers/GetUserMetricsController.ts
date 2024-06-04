import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetUserMetricsUseCase } from '../useCases/GetUserMetricsUseCase'

export class GetUserMetricsController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userSchema = z.object({
      id: z.string(),
    })

    const { id } = userSchema.parse(request.user)

    if (!id) {
      return reply.status(202).send()
    }

    const getUserMetricsUseCase = new GetUserMetricsUseCase()

    const metrics = await getUserMetricsUseCase.execute(id)

    return reply.send(metrics)
  }
}
