var express     = require('express');
var server      = express();
var bodyParser  = require('body-parser');

server.use(bodyParser.json());

const healthchecks = [];

server.use((req,res,next) => {
    if(req.path.match(/^\/api/)) {
        if(req.headers.authorization) {
            if(req.headers.authorization===process.env.TOKEN) next();
            res.status(401).json('unauthorized');
        } else {
            res.status(401).json('unauthorized');
        }
    } else {
        next();
    }
})

server.get('/api/v1/healthcheck/status',(req,res) => {
    res.json(healthchecks);
})

server.get('/api/v1/healthcheck/:category/:check/:health', (req,res) => {
    if(!req.params.category.match(/^[a-zA-Z0-9_-]{1,64}$/)) return res.status(500).send("invalid");
    if(!req.params.check.match(/^[a-zA-Z0-9_-]{1,64}$/)) return res.status(500).send("invalid");
    if(!req.params.health.match(/^[0-9]{1,3}$/)) return res.status(500).send("invalid");
    let hc = healthchecks.find(hc => hc.category===req.params.category && hc.check===req.params.check);
    if(hc) {
        hc.health=parseInt(req.params.health);
        hc.lastUpdate = new Date().getTime();
    } else {
        hc = {
            category: req.params.category,
            check: req.params.check,
            health: parseInt(req.params.health),
            lastUpdate: new Date().getTime()
        };
        healthchecks.push(hc);
    }
    res.json(hc);
})

server.use(express.static(__dirname + '/../restful-status-app/build'));

setInterval(() => {
    let timeNow = new Date().getTime();
    healthchecks.forEach(hc => {
        if(timeNow - hc.lastUpdate > parseInt((process.env.TIMEOUT||(60*60*24)))*1000) {
            hc.health=0;
        }
    })
},500);

server.listen(process.env.PORT || 4000);