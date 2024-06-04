import { FastifyInstance } from 'fastify'
import { CreateUserController } from '../module/user/controllers/CreateUserController'
import { GetUserMetricsController } from '../module/user/controllers/GetUserMetricsController'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

const createUserController = new CreateUserController()
const getUserMetricsController = new GetUserMetricsController()

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', createUserController.execute)

  app.get(
    '/meals/metrics',
    { preHandler: [checkSessionIdExists] },
    getUserMetricsController.execute,
  )
}
