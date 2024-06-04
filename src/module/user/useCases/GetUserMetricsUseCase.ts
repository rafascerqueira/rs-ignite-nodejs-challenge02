import { knex } from '../../../database'
import { ApiError } from '../../../errors/ApiError'
import { MetricsDTO } from '../DTO/MetricsDTO'

export class GetUserMetricsUseCase {
  async execute(id: string) {
    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new ApiError('User not found!')
    }

    const mealsByUser = await knex('meals').where({ user_id: id })

    let { amount, isOnDiet, isOffDiet, score } = mealsByUser.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.isOnDiet += 1
          acc.sequence += 1
        } else {
          acc.isOffDiet += 1
          acc.sequence = 0
        }

        if (acc.sequence > acc.score) {
          acc.score = acc.sequence
        }

        acc.amount += 1

        return acc
      },
      { isOnDiet: 0, isOffDiet: 0, amount: 0, sequence: 0, score: 0 },
    )

    const metrics: MetricsDTO = {
      totalMealsRecord: amount,
      mealsOnDiet: isOnDiet,
      mealsOffDiet: isOffDiet,
      bestDietSequence: score,
    }

    return metrics
  }
}
