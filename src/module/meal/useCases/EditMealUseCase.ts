import { knex } from '../../../database'
import { ApiError } from '../../../errors/ApiError'
import { MealDTO } from '../DTO/MealDTO'

export class EditMealUseCase {
  async execute(id: string, meal: Partial<MealDTO>) {
    const isMealExists = await knex('meals').where({ id }).first()

    if (!isMealExists) {
      throw new ApiError('The meal does not exists')
    }

    const payload = {
      ...meal,
      date: meal.date?.getTime(),
    }

    return await knex('meals').where({ id }).update(payload)
  }
}
