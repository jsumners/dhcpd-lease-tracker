'use strict';

function Lease() {
  if (! (this instanceof Lease)) {
    return new Lease();
  }
}

Lease.prototype = {
  ip: '',
  startDate: {},
  endDate: {},
  tstp: {},
  tsfp: {},
  atsfp: {},
  cltt: {},
  hardwareAddress: '',
  hardwareType: '',
  uid: '',
  clientHostname: ''
};

exports = module.exports = Lease;