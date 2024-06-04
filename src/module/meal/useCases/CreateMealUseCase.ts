import { randomUUID } from 'node:crypto'
import { knex } from '../../../database'
import { MealDTO } from '../DTO/MealDTO'

export class CreateMealUseCase {
  async execute({ name, description, date, isOnDiet, userId }: MealDTO) {
    return await knex('meals')
      .insert({
        id: randomUUID(),
        name,
        description,
        date: date.getTime(),
        is_on_diet: isOnDiet,
        user_id: userId,
      })
      .returning(['id'])
  }
}
