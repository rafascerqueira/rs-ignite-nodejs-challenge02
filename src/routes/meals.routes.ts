import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { CreateMealController } from '../module/meal/controllers/CreateMealController'
import { ShowAllMealsByUserController } from '../module/meal/controllers/ShowAllMealsByUserController'
import { ShowOneMealController } from '../module/meal/controllers/ShowOneMealController'
import { DeleteMealController } from '../module/meal/controllers/DeleteMealController'
import { EditMealController } from '../module/meal/controllers/EditMealController'

const createMealController = new CreateMealController()
const showAllMealsByUserController = new ShowAllMealsByUserController()
const showOneMealController = new ShowOneMealController()
const editMealController = new EditMealController()
const deleteMealController = new DeleteMealController()

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    createMealController.execute,
  )

  app.get(
    '/byUser/',
    { preHandler: [checkSessionIdExists] },
    showAllMealsByUserController.execute,
  )

  app.get(
    '/meal/:id',
    { preHandler: [checkSessionIdExists] },
    showOneMealController.execute,
  )

  app.put(
    '/meal/:id',
    { preHandler: [checkSessionIdExists] },
    editMealController.execute,
  )

  app.delete(
    '/meal/:id',
    { preHandler: [checkSessionIdExists] },
    deleteMealController.execute,
  )
}
