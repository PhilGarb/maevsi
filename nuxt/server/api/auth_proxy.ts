import { CompatibilityEvent } from 'h3'

export default function (event: CompatibilityEvent) {
  const { req, res } = event

  if (req.headers['x-authenticate']) {
    res.statusCode = 200
  } else {
    res.statusCode = 429
  }

  res.end()
}
