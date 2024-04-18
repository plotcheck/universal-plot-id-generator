# Universal Plot ID Generator

This code calcuates a unique ID for a GeoJSON polygon geometry. It can be used offiline, and does not require any form of online database.

Given a valid GeoJSON polygon like this:

```js
{"type":"Polygon","coordinates":[[[-21.829992,-1.852858],[-21.829992,-13.022224],[-6.973366,-13.022224],[-6.973366,-1.852858],[-21.829992,-1.852858]]]}
```

you get this Universal Plot ID:

```
A7EEC333-76407A47-5A4F0F6C
```

This tool has the following goals:

- Given the same boundary, it must generate the same ID every time
- Even a small change in the boundary should result in a completely new ID
- The boundary cannot be reverse engineered from the ID
- The ID must be as user friendly as possible while remaining unique (mathematically unlikely that two boundaries would get the same ID even with billions of plots)
- Option to increase the strength by adding an additional block e.g. A7EEC333-76407A47-5A4F0F6C-XXXXXXXX

## Usage

### Install

```sh
npm install @maphubs/universal-plot-id
#or
pnpm add @maphubs/universal-plot-id
```

### Command line

### API

```ts
import { getUniversalPlotID } from '@maphubs/universal-plot-id'

const plotPolygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-21.829992, -1.852858],
      [-21.829992, -13.022224],
      [-6.973366, -13.022224],
      [-6.973366, -1.852858],
      [-21.829992, -1.852858]
    ]
  ]
}
const id = getUniversalPlotID(plotPolygon)
```

### Optional arguments

You can increase the size of they key, for example increasing to 128 will add an additional 8-character block to end of the IDs.

If you are creating billions of IDs, the chance of a collison (two plots having the same ID) will increase so you may want to use the longer ID

```js
const bits = 128 // default is 96, can be up to 256 for SHA256
const id = getUniversalPlotID(plotPolygon, 128)
```

## How it works

- the geometry is standardized, coordinates are truncated to 6 decimal places, and the polygon is rewound for a consistent vertex order
- only the geometry is used, any attributes or other metadata are ignored
- the SHA256 hash alogorithm is used to generate a 256 bit hash which is then truncated to the requested size
- the hash written as text in hexadecimal format, and split into 8-character sections to make it a bit easier to read.

## Extending the ID

It may make the ID more useful to add additional information to beginning and end.

As a standard, we also support adding the 2-digit ISO country code and a local ID number to the end.

For example if the plot is in Malaysia and has a local id in our database as 1234, we may store it like this.

MY:A7EEC333-76407A47-5A4F0F6C:1234
