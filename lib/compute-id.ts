import type { Polygon } from 'geojson'
import crypto from './crypto-wrapper'

const computeID = async (geometry: Polygon, bits: number = 96) => {
  const geometryString = JSON.stringify(geometry)
  // compute SHA256 hash of the geometry
  const hashHex = await crypto.sha256(geometryString)

  // trunctate to the selected size
  // compute hex size from bits
  const hexSize = bits / 4
  const hashHex96 = hashHex.slice(0, hexSize)

  // uppercase letters are more human readable
  const hashHex96Upper = hashHex96.toUpperCase()

  // split into 8 character parts
  const hexParts = hashHex96Upper.match(/.{1,8}/g) as string[] // we can trust that sha256 did return a string of length multiple of 8
  const prettyHex = hexParts.join('-')

  return prettyHex
}

export default computeID
