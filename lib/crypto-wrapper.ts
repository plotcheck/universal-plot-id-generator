// crypto-wrapper.ts
let crypto: {
  sha256(data: string): Promise<string> | string
}

if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
  // Browser environment
  crypto = {
    async sha256(data: string): Promise<string> {
      const encoder = new TextEncoder()
      const encodedData = encoder.encode(data)
      const hashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        encodedData
      )
      return bufferToHex(hashBuffer)
    }
  }
} else {
  // Node.js environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module, unicorn/prefer-node-protocol
  const { createHash } = require('crypto')
  crypto = {
    sha256(data: string): string {
      return createHash('sha256').update(data).digest('hex')
    }
  }
}

function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  const hexString = Array.from(byteArray, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('')
  return hexString
}

export default crypto
