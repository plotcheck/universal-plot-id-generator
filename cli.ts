/* eslint-disable unicorn/no-process-exit */
/** @format */

import fs from 'node:fs'
import { check } from '@placemarkio/check-geojson'
import standardize from './lib/standardize'
import computeID from './lib/compute-id'

// if args are not provided write help
if (process.argv.length !== 4) {
  console.error('Usage: npx tsx cli.ts <input.geojson> <output.geojson>')
  process.exit(1)
}

// get the first command line argument
const fileName = process.argv[2]

//read the file
const file = fs.readFileSync(fileName, 'utf8')

let geoJSON

try {
  geoJSON = check(file)
} catch (error) {
  console.error(`Invalid GeoJSON file`)
  console.error(error)
  process.exit(1)
}

const { features } = geoJSON
if (features.length === 0) {
  console.error('Invalid Empty GeoJSON: no features found')
  process.exit(1)
}

console.log(`Processing ${features.length} features...`)

// for each feature
for (const [index, feature] of features.entries()) {
  const { geometry } = feature
  if (geometry.type !== 'Polygon') {
    console.error(`Invalid GeoJSON: feature ${index} is not a Polygon`)
    process.exit(1)
  }

  // standardize the geometry, to produce a consistent hash
  standardize(geometry)

  // compute the ID from the geometry
  const id = computeID(geometry, 96)

  feature.properties['UPID'] = id
}

// write the updated GeoJSON file
fs.writeFileSync(process.argv[3], JSON.stringify(geoJSON))

console.log('GeoJSON file written successfully')
process.exit(0)
