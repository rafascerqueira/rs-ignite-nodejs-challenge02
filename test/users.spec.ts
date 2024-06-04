import { execSync } from 'child_process'
import request from 'supertest'
import app from '../src/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a user', async () => {
    await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoe@email.com' })
      .expect(201)

    await request(app.server)
      .post('/api/users')
      .send({ name: 'John Twice', email: 'johndoe@email.com' })
      .expect(400)
  })

  it('should be able to identify a user through request', async () => {
    const createUserResponse = await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoe@email.com' })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })

  it(`should be able to retrieve a user's metrics`, async () => {
    const user = await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoe@email.com' })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    let { id } = user.body

    await request(app.server)
      .post('/api/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: 'first meal today',
        isOnDiet: true,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    await request(app.server)
      .post('/api/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Lunch',
        description: 'midday meal',
        isOnDiet: true,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    await request(app.server)
      .post('/api/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Snickers',
        description: 'junk food',
        isOnDiet: false,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    await request(app.server)
      .post('/api/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
        description: 'last meal today',
        isOnDiet: true,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/api/users/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMealsRecord: 4,
      mealsOnDiet: 3,
      mealsOffDiet: 1,
      bestDietSequence: 2,
    })
  })
})
