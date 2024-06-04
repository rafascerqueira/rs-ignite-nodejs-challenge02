import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import app from '../src/app'

describe('Meals routes', () => {
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

  it('should be able to record a meal eaten by user', async () => {
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
        name: 'Dinner',
        description: 'last meal today',
        isOnDiet: true,
        date: new Date(),
        userId: id,
      })
      .expect(201)
  })

  it('should be able to edit a existing meal', async () => {
    const user = await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoemeal@email.com' })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    let { id } = user.body

    const meal = await request(app.server)
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

    let mealId = meal.body.id

    await request(app.server)
      .put('/api/meals/meal/' + mealId)
      .set('Cookie', cookies)
      .send({
        name: 'midday meal',
        description: 'lunch - Meat with fries',
        isOnDiet: true,
        date: new Date(),
      })
      .expect(200)
  })

  it('should be able to remove a meal', async () => {
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
        name: 'Dinner',
        description: 'last meal today',
        isOnDiet: true,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    const junkFood = await request(app.server)
      .post('/api/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Junk Food',
        description: 'The food that I eat while waiting a train',
        isOnDiet: false,
        date: new Date(),
        userId: id,
      })
      .expect(201)

    let junkFoodId = junkFood.body.id

    await request(app.server)
      .delete('/api/meals/meal/' + junkFoodId)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should be able to list all meals by user', async () => {
    const user = await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoemeal@email.com' })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    let { id } = user.body

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
      .get('/api/meals/byUser/')
      .set('Cookie', cookies)
      .expect(200)
  })

  it('should be able to view a single meal', async () => {
    const user = await request(app.server)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'johndoemeal@email.com' })
      .expect(201)

    const cookies = user.get('Set-Cookie') || []

    let { id } = user.body

    const meal = await request(app.server)
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

    let mealId = meal.body.id

    await request(app.server)
      .get('/api/meals/meal/' + mealId)
      .set('Cookie', cookies)
      .expect(200)
  })
})
