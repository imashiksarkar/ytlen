const calcDuration = (res: number) => {
  let secLeft = res
  const days = Math.floor(secLeft / (60 * 60 * 24))
  secLeft = secLeft % (60 * 60 * 24)
  const hours = Math.floor(secLeft / (60 * 60))
  secLeft = secLeft % (60 * 60)
  const minutes = Math.floor(secLeft / 60)
  secLeft = secLeft % 60
  console.log(days, "d\n", hours, "h\n", minutes, "m\n", secLeft, "s")
}

export default calcDuration
