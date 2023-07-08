// Require the driver
const faunadb = require('faunadb')
const q = faunadb.query

// Acquire the secret and optional endpoint from environment variables
const secret = process.env.FAUNADB_SECRET
var endpoint = process.env.FAUNADB_ENDPOINT

if (typeof secret === 'undefined' || secret === '') {
  console.error('The FAUNADB_SECRET environment variable is not set, exiting.')
  process.exit(1)
}

if (!endpoint) endpoint = 'https://db.fauna.com/'

var mg, domain, port, scheme
if ((mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/))) {
  scheme = mg[1] || 'https'
  domain = mg[2] || 'db.fauna.com'
  port = mg[4] || 443
}

// Instantiate a client
const client = new faunadb.Client({
  secret: secret,
  domain: domain,
  port: port,
  scheme: scheme,
})

// Create a collection called 'myCollection'
client.query(
  q.CreateCollection({ name: 'myCollection' })
)

// Show the result
.then((ret) => console.log(ret))
.catch((err) => console.error(
  'Error: [%s] %s: %s',
  err.name,
  err.message,
  err.errors()[0].description,
))