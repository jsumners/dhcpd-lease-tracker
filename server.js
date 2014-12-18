'use strict';
// Node core modules
var fs = require('fs');
var net = require('net');

// Third party modules
var anydb = require('any-db');
var moment = require('moment');
var winston = require('winston');

// Local modules
var config = require('./config.json');
var Parser = require('./lib/Parser');
var parser = new Parser();

var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(config.winston.console),
    new (winston.transports.File)(config.winston.file)
  ]
});

function logLease(lease) {
  log.debug('%j', lease);
  db.query(
    'insert into leases (record_date, ip, startDate, endDate, tstp, tsfp, ' +
    'atsfp, cltt, hardwareAddress, hardwareType, uid, clientHostname) values (' +
    '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [
      moment().toISOString(),
      lease.ip, lease.startDate, lease.endDate, lease.tstp, lease.tsfp,
      lease.atsfp, lease.cltt, lease.hardwareAddress,lease.hardwareType,
      lease.uid, lease.clientHostname
    ]
  );
}

var server = net.createServer(function serverCreate(client) {
  var remaining = '';

  client.on('data', function clientData(data) {
    log.debug('received data: `%s`', data.toString());
    remaining += data;
    var index = remaining.indexOf('\n');
    var last = 0;
    while (index > -1) {
      var line = remaining.substring(last, index);
      last = index + 1;
      parser.parseLine(line, logLease);
      index = remaining.indexOf('\n', last);
    }
  });

  client.on('connection', function clientConnection() {
    log.debug('client connected');
  });

  client.on('end', function clientEnd() {
    log.debug('client disconnected');
  });
});

function startListening() {
  log.info('Starting to listen for connections ...');
  server.listen(config.server.socketPath);
}

server.on('error', function serverError(err) {
  if (err.code === 'EADDRINUSE') {
    log.error('Address in use, retrying ...');
    var clientSocket = new net.Socket();

    clientSocket.on('error', function socketError(err) {
      if (err.code === 'ECONNREFUSED') {
        log.debug('socketError: ECONNREFUSED');
        fs.unlinkSync(config.server.socketPath);
        startListening();
      }
    });

    clientSocket.connect({path: config.server.socketPath}, function() {
      log.warn('Server already running. Exiting ...');
      process.exit(1);
    });
  }
});

var db = anydb.createPool(config.db.url, config.db.poolOptions);
startListening();