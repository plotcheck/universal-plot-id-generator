import standardize from './lib/standardize'
import computeID from './lib/compute-id'
import type { Polygon } from 'geojson'

const getUniversalPlotID = async (geometry: Polygon, bits: number = 96) => {
  // standardize the geometry, to produce a consistent hash
  standardize(geometry)

  // compute the ID from the geometry
  const id = await computeID(geometry, bits)

  return id
}

export { getUniversalPlotID }
