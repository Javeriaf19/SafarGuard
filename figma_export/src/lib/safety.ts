export function stoppingDistance(
  speed: number,
  friction: number,
  reactionTime = 2.5,
) {
  const reaction = 0.278 * speed * reactionTime
  const braking = (speed * speed) / (254 * friction)
  return { reaction, braking, total: reaction + braking }
}

export function maximumModelSpeed(
  visibility: number,
  friction: number,
  reactionTime = 2.5,
) {
  const a = 1 / (254 * friction)
  const b = 0.278 * reactionTime
  const speed = (2 * visibility) / (b + Math.sqrt(b * b + 4 * a * visibility))
  return Math.max(0, Math.floor(speed / 5) * 5)
}
