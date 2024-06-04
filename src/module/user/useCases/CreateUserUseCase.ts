import { randomUUID } from 'node:crypto'
import { knex } from '../../../database'
import { CreateUserDTO } from '../DTO/CreateUserDTO'

export class CreateUserUseCase {
  async execute({ name, email, sessionId }: CreateUserDTO) {
    const id = randomUUID()

    return await knex('users')
      .insert({
        id,
        name,
        email,
        session_id: sessionId,
      })
      .returning(['id'])
  }
}
