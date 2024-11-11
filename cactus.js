import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const SPEED = 0.05
const CACTUS_INTERVAL_MIN = 500
const CACTUS_INTERVAL_MAX = 2000
const MIN_DISTANCE_BETWEEN_CACTI = 200 // Minimum distance between cacti
const worldElem = document.querySelector("[data-world]")

// Array of shape classes
const cactusShapes = [
  // "circle",
  // "square",
  // "triangle",
  // "rectangle",
  // "pentagon",
  // "hexagon",
  // "octagon",
  // "star",
  // "parallelogram",  // Added parallelogram
  // "trapezoid",      // Added trapezoid
  // "rhombus",        // Added rhombus
  "heart",          // Added heart
  // "diamond",       // Added crescent
];


let nextCactusTime

export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    cactus.remove()
  })
}

export function updateCactus(delta, speedScale) {
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove()
    }
  })

  if (nextCactusTime <= 0) {
    createCactus()
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale
  }
  nextCactusTime -= delta
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
    return cactus.getBoundingClientRect()
  })
}

function createCactus() {
  const cactus = document.createElement("div")
  cactus.dataset.cactus = true

  // Randomly select a shape class from cactusShapes array
  const randomIndex = Math.floor(Math.random() * cactusShapes.length)
  cactus.classList.add(cactusShapes[randomIndex], "cactus")

  // Set initial position
  let leftPosition = 100

  // Get the dimensions of the new cactus
  const cactusWidth = cactus.offsetWidth

  // Check existing cacti positions
  const existingRects = getCactusRects()
  let overlap = false
  do {
    overlap = false
    for (const rect of existingRects) {
      // Check if the new cactus will overlap with any existing cactus
      if (
        leftPosition + cactusWidth + MIN_DISTANCE_BETWEEN_CACTI > rect.left &&
        leftPosition < rect.right - MIN_DISTANCE_BETWEEN_CACTI
      ) {
        // If overlap, adjust leftPosition to ensure the new cactus is placed farther
        leftPosition = rect.right + MIN_DISTANCE_BETWEEN_CACTI
        overlap = true
        break
      }
    }
  } while (overlap)

  setCustomProperty(cactus, "--left", leftPosition)
  worldElem.append(cactus)
}


function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
