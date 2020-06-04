const fs = require('fs')

const secretPostgresDbPath = '/run/secrets/postgres_db'
const secretPostgraphileJwtSecretPath = '/run/secrets/postgraphile_jwt-secret'
const secretPostgresRoleMaevsiTusdPasswordPath = '/run/secrets/postgres_role_maevsi-tusd_password'

const secretPostgraphileJwtSecret = (fs.existsSync(secretPostgraphileJwtSecretPath))
  ? fs.readFileSync(secretPostgraphileJwtSecretPath, 'utf-8')
  : undefined

function iCal (req, res) {
  const htmlToText = require('html-to-text')
  const ical = require('ical-generator')
  const moment = require('moment')
  const md = require('markdown-it')()

  const data = req.body
  const eventId = data.event.organizerUsername + '/' + data.event.slug
  const eventUrl = 'https://' + process.env.GRIDSOME_STACK_DOMAIN + '/events/' + eventId
  const eventDescriptionHtml = md.render(data.event.description)

  res.type('text/calendar')
  res.set('Content-Disposition', 'attachment; filename="' + eventId.replace('/', '_') + '.ics"')
  res.send(ical({
    domain: process.env.GRIDSOME_STACK_DOMAIN,
    // `prodId` is generated automatically.
    name: eventId.replace('/', '_'),
    url: eventUrl,
    // `scale` is specified as `GREGORIAN` if not set explicitly.
    timezone: 'UTC',
    method: 'REQUEST', // https://tools.ietf.org/html/rfc5546#section-3.2
    // `ttl` ... I don't think that's needed?
    events: [
      {
        id: eventId,
        // sequence: ,
        start: moment(data.event.start), // Appointment date of beginning, required.
        ...(data.event.end && { end: data.event.end }),
        // `timezone` shouldn't be needed as the database outputs UTC dates.
        timestamp: moment(), // Appointment date of creation (= now).
        // allDay: false,
        // floating: , // Mutually exclusive with `timezone`.
        // repeating: {
        //   freq: 'MONTHLY', // required
        //   count: 5,
        //   interval: 2,
        //   until: new Date('Jan 01 2014 00:00:00 UTC'),
        //   byDay: ['su', 'mo'], // repeat only sunday and monday
        //   byMonth: [1, 2], // repeat only in january und february,
        //   byMonthDay: [1, 15], // repeat only on the 1st and 15th
        //   bySetPos: 3, // repeat every 3rd sunday (will take the first element of the byDay array)
        //   exclude: [new Date('Dec 25 2013 00:00:00 UTC')], // exclude these dates
        //   excludeTimezone: 'Europe/Berlin' // timezone of exclude
        // },
        // recurrenceId: moment(),
        summary: data.event.name, // The event's title.
        ...(data.event.description && { description: htmlToText.fromString(eventDescriptionHtml) }),
        ...(data.event.description && { htmlDescription: eventDescriptionHtml }),
        ...(data.event.place && { location: data.event.place }),
        // geo: {
        //   lat: 44.4987,
        //   lon: -6.87667
        // },
        organizer: {
          name: data.event.organizerUsername,
          email: data.event.organizerUsername + '@' + process.env.GRIDSOME_STACK_DOMAIN
          // mailto: 'explicit@mailto.com'
        },
        // attendees: [{
        //   name: 'Me',
        //   email: 'm@e.ee',
        //   rsvp: true,
        //   role: 'req-participant',
        //   status: 'accepted',
        //   type: 'individual',
        //   delegatesTo: { email: 'to@bar.com', name: 'From' },
        //   delegatesFrom: { email: 'from@bar.com', name: 'Too' }
        // }],
        // alarms: [{
        //   type: 'display',
        //   triggerBefore: moment(),
        //   triggerAfter: moment(),
        //   repeat: 4,
        //   interval: 300,
        //   attach: 'https://example.com/notification.aud',
        //   description: 'Alarm!'
        // }],
        // categories: [{
        //   name: 'appointment'
        // }],
        url: eventUrl,
        status: 'confirmed'
        // busystatus: 'busy',
        // created: moment(), // Event creation date.
        // lastModified: moment()
      }
    ]
  }).toString())
}

const { Pool } = require('pg')

const pool = new Pool({
  database: (fs.existsSync(secretPostgresDbPath))
    ? fs.readFileSync(secretPostgresDbPath, 'utf-8')
    : undefined,
  host: 'postgres',
  password: (fs.existsSync(secretPostgresRoleMaevsiTusdPasswordPath))
    ? fs.readFileSync(secretPostgresRoleMaevsiTusdPasswordPath, 'utf-8')
    : undefined,
  user: 'maevsi_tusd' // lgtm [js/hardcoded-credentials]
})

function deleteUpload (res, uploadId, storageKey) {
  pool.query('DELETE FROM maevsi.profile_picture WHERE upload_storage_key = $1;',
    [storageKey],
    (err, queryRes) => {
      if (err) {
        res.status(500).send(err)
        return
      }

      pool.query('DELETE FROM maevsi.upload WHERE id = $1;',
        [uploadId],
        (err, queryRes) => {
          if (err) {
            res.status(500).send(err)
            return
          }

          res.status(204).end()
        }
      )
    }
  )
}

function tusdDelete (req, res) {
  const uploadId = req.query.uploadId

  if (uploadId === undefined) {
    res.status(422).send('The request query parameter "uploadId" is undefined!')
    return
  }

  console.log('tusdDelete: ' + uploadId)

  if (req.header('Authorization') === undefined) {
    res.status(401).send('The request header "Authorization" is undefined!')
    return
  }

  if (secretPostgraphileJwtSecret === undefined) {
    res.status(500).send('Secret missing!')
    return
  }

  const jsonwebtoken = require('jsonwebtoken')

  try {
    jsonwebtoken.verify(req.header('Authorization').substring(7), secretPostgraphileJwtSecret, {
      audience: 'postgraphile',
      issuer: 'postgraphile'
    })
  } catch (err) {
    res.status(401).send('Json web token verification failed: "' + err.message + '"!')
    return
  }

  pool.query('SELECT * FROM maevsi.upload WHERE id = $1;',
    [uploadId],
    (err, queryRes) => {
      if (err) {
        res.status(500).send(err)
        return
      }

      if (queryRes.rows.length === 0) {
        res.status(500).send('No result found for id "' + uploadId + '"!')
      }

      const storageKey = queryRes.rows[0].storage_key

      if (storageKey !== null) {
        const http = require('http')

        const reqTusd = http.request('http://tusd:1080/files/' + storageKey + '+', {
          headers: {
            'Tus-Resumable': '1.0.0'
          },
          method: 'DELETE'
        }, (httpResp) => {
          httpResp.on('data', () => { }) // Do not remove! If you do, the 'end' event won't fire.
          httpResp.on('end', () => {
            if (httpResp.statusCode === 204) {
              res.status(204).end()
            } else if (httpResp.statusCode === 404) {
              deleteUpload(res, uploadId, storageKey)
            } else {
              res.status(500).send('Tusd status was "' + httpResp.statusCode + '".')
            }
          })
        }).on('error', (err) => {
          res.status(500).send('Internal delete failed: "' + err.message + '"!')
        })

        reqTusd.end()
      } else {
        deleteUpload(res, uploadId, storageKey)
      }
    }
  )
}

function tusdPost (req, res) {
  switch (req.get('Hook-Name')) {
    case 'pre-create':
      console.log('tusd/pre-create')

      pool.query('SELECT EXISTS(SELECT * FROM maevsi.upload WHERE id = $1);',
        [req.body.Upload.MetaData.maevsiUploadId],
        (err, queryRes) => {
          if (err) {
            res.status(500).send(err)
            return
          }

          if (!queryRes.rows[0].exists) {
            res.status(500).send('Upload id does not exist!')
            return
          }

          res.end()
        }
      )

      break
    case 'post-finish':
      console.log('tusd/post-finish: ' + req.body.Upload.Storage.Key)

      pool.query(
        'UPDATE maevsi.upload SET storage_key = $1 WHERE id = $2;',
        [
          req.body.Upload.Storage.Key,
          req.body.Upload.MetaData.maevsiUploadId
        ],
        (err, queryRes) => {
          if (err) {
            res.status(500).send(err)
            return
          }

          res.end()
        }
      )

      break
    case 'post-terminate':
      console.log('tusd/post-terminate: ' + req.body.Upload.Storage.Key)
      deleteUpload(res, req.body.Upload.MetaData.maevsiUploadId, req.body.Upload.Storage.Key)

      break
  }
}

module.exports = {
  iCal,
  tusdDelete,
  tusdPost
}
