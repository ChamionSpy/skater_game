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

// Array of image URLs
const cactusImages = [
  "imgs/garbage.png",
  "imgs/garbage1.png",
  "imgs/garbage2.png",
  "imgs/garbage3.png",
  "imgs/garbage4.png",
  "imgs/garbage5.png",
  "imgs/bush.png",
  "imgs/bush2.png",
  "imgs/cactus3.png",
  "imgs/cactus4.png",
  "imgs/fence.png",
  "imgs/ledder.png",
  "imgs/roadBlock.png",
  "imgs/rock.png",
  "imgs/tree.png",
  "imgs/tree_trunk.png",
  "imgs/truck.png",
  // Add more image URLs as needed
]

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
  const cactus = document.createElement("img")
  cactus.dataset.cactus = true

  // Randomly select an image URL from cactusImages array
  const randomIndex = Math.floor(Math.random() * cactusImages.length)
  cactus.src = cactusImages[randomIndex]
  cactus.classList.add("cactus")

  // Set initial position
  let leftPosition = 100

  // Check existing cacti positions
  const existingRects = getCactusRects()
  let overlap = false
  do {
    overlap = false
    for (const rect of existingRects) {
      if (leftPosition >= rect.right + MIN_DISTANCE_BETWEEN_CACTI) {
        // Ensure new cactus is placed MIN_DISTANCE_BETWEEN_CACTI pixels to the right of the existing cactus
        overlap = false
        break
      } else if (leftPosition <= rect.left - MIN_DISTANCE_BETWEEN_CACTI) {
        // Ensure new cactus is placed MIN_DISTANCE_BETWEEN_CACTI pixels to the left of the existing cactus
        overlap = false
        break
      } else {
        // If overlap, adjust leftPosition
        leftPosition += MIN_DISTANCE_BETWEEN_CACTI
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