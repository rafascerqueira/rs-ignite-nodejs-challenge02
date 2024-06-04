import { knex } from '../../../database'
import { ApiError } from '../../../errors/ApiError'

export class ShowOneMealUseCase {
  async execute(id: string, userId: string) {
    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      throw new ApiError('Meal not found!')
    }

    if (meal.user_id != userId) {
      throw new ApiError('Unauthorized!', 401)
    }

    return meal
  }
}
