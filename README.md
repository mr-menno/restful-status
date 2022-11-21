Two environment varialbles:

`TOKEN` sets the security token between the front end and back end. 
`TIMEOUT` sets the automatic clearing of health checks in seconds.  When this timeout expires the specific health check is cleared.

`curl -H "Authorization: $TOKEN" http://address/api/v1/healthcheck/<category>/<check>/<status>`

`category` can be a high level category
`check` would be the specific check
`status` would be 0-100, although today on 0 and 100 are supported.