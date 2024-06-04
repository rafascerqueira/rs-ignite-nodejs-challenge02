import { knex } from '../../../database'
import { ApiError } from '../../../errors/ApiError'

export class DeleteMealUseCase {
  async execute(id: string, userId: string) {
    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      throw new ApiError('Item not found', 404)
    }

    if (meal.user_id != userId) {
      throw new ApiError('Unauthorized!', 401)
    }

    return await knex('meals').where({ id }).del()
  }
}
