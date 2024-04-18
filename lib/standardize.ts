import rewind from '@turf/rewind'
import truncate from '@turf/truncate'
import type { Polygon } from 'geojson'

const standardize = (geometry: Polygon) => {
  // rewind the ploygon for consistent winding order
  rewind(geometry, { mutate: true })
  // truncate the coordinates to 6 decimal places, remove z value if present
  truncate(geometry, { precision: 6, coordinates: 2, mutate: true })

  return geometry
}

export default standardize
