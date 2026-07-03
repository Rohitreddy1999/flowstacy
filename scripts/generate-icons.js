import sharp from 'sharp'
import { readFileSync } from 'fs'

const svgContent = readFileSync('./public/flowstate-icon.svg')

await sharp(svgContent)
  .resize(192, 192)
  .png()
  .toFile('./public/pwa-192x192.png')

await sharp(svgContent)
  .resize(512, 512)
  .png()
  .toFile('./public/pwa-512x512.png')

await sharp(svgContent)
  .resize(180, 180)
  .png()
  .toFile('./public/apple-touch-icon.png')

console.log('Icons generated successfully')
