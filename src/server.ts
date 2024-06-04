import app from './app'
import { env } from './env'

const whatTimeIsIt = new Date(Date.now()).toLocaleString()

app
  .listen({ port: env.PORT })
  .then(() => console.log(`API server is running now [ ${whatTimeIsIt} ]`))
