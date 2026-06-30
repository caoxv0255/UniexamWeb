const fs = require('fs')
const path = require('path')

const iconDir = path.join(__dirname)

const pngHeader = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
])

const createPNG = (width, height) => {
  const ihdr = Buffer.alloc(25)
  ihdr.writeUInt32BE(13, 0)
  ihdr.write('IHDR', 4)
  ihdr.writeUInt32BE(width, 8)
  ihdr.writeUInt32BE(height, 12)
  ihdr[16] = 8
  ihdr[17] = 6
  ihdr[18] = 0
  ihdr[19] = 0
  ihdr[20] = 0
  
  const crc32 = (buf) => {
    let crc = -1
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i]
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
      }
    }
    return ~crc >>> 0
  }
  
  ihdr.writeUInt32BE(crc32(ihdr.slice(4, 21)), 21)
  
  const idat = Buffer.from([
    0x00, 0x00, 0x00, 0x08, 0x49, 0x44, 0x41, 0x54,
    0x78, 0x9C, 0x62, 0x60, 0x60, 0x60, 0x60, 0x00,
    0x00, 0x00, 0x05, 0x00, 0x01, 0x6A, 0x38, 0xAF,
    0x83
  ])
  
  const iend = Buffer.from([
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ])
  
  return Buffer.concat([pngHeader, ihdr, idat, iend])
}

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true })
}

const sizes = [192, 512]
sizes.forEach(size => {
  const png = createPNG(size, size)
  fs.writeFileSync(path.join(iconDir, `app-${size}.png`), png)
  console.log(`Created app-${size}.png`)
})

console.log('Icon generation complete!')