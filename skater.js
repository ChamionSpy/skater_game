import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const skaterElem = document.querySelector("[data-skater]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100
const MAX_AIR_JUMPS = 2

let airJumpCount = 0
let isJumping
let dinoFrame
let currentFrameTime
let yVelocity

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(skaterElem, "--bottom", 0)
  document.removeEventListener("keydown", onJump)
  document.addEventListener("keydown", onJump)
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return skaterElem.getBoundingClientRect()
}

export function setDinoLose() {
  skaterElem.src = "imgs/skaterLoose.png"
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    skaterElem.src = `imgs/skaterJumping.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    skaterElem.src = `imgs/skaterMoving.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (isJumping) {
    incrementCustomProperty(skaterElem, "--bottom", yVelocity * delta)

    if (getCustomProperty(skaterElem, "--bottom") <= 0) {
      setCustomProperty(skaterElem, "--bottom", 0)
      isJumping = false
      airJumpCount = 0
    }
    if (yVelocity >= 0 && airJumpCount >= MAX_AIR_JUMPS) {
      // Ensure gravity applies only after maximum air jumps
      yVelocity = 0
    }

    yVelocity -= GRAVITY * delta 
  }
}

function onJump(e) {
  if (e.code !== "Space") return

  if (!isJumping) {
    yVelocity = JUMP_SPEED
    isJumping = true
  } else if (airJumpCount < MAX_AIR_JUMPS - 1) {
    yVelocity = JUMP_SPEED
    airJumpCount++
  }
}
  