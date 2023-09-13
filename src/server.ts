import bootstrap from "./app"
import env from "./utils/validatedEnv"

const PORT = env.port

bootstrap(PORT)
