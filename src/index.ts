import app from "./app"

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`app is liestening on http://localhost:${PORT}`)
})
