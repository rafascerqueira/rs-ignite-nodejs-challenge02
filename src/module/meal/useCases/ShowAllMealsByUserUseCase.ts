import { knex } from '../../../database'

export class ShowAllMealsByUserUseCase {
  async execute(id: string) {
    return knex('meals').where({ user_id: id }).orderBy('date', 'desc')
  }
}
