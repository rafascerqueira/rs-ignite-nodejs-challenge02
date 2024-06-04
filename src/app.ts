import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users.routes'
import { mealsRoutes } from './routes/meals.routes'

const app = fastify()

app.register(cookie)

// routes register
app.register(usersRoutes, {
  prefix: 'api/users',
})
app.register(mealsRoutes, {
  prefix: 'api/meals',
})

export default app
