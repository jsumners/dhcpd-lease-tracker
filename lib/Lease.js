'use strict';
var string = require('useful-string');
var chr39 = String.fromCharCode(39);

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

Lease.prototype.psqlValuesString = function psqlValuesString() {
  var result = '';
  var c = ',';
  var n = 'null,';

  function quote(value) {
    return string.format('{0}{1}{2}', chr39, value, chr39);
  }

  function val(prop) {
    return (prop) ? quote(prop) + c : n;
  }

  result += (this.ip) ? 'cast(' + quote(this.ip) + ' as inet),' : n;
  result += val(this.startDate);
  result += val(this.endDate);
  result += val(this.tstp);
  result += val(this.tsfp);
  result += val(this.atsfp);
  result += val(this.cltt);
  result += val(this.hardwareAddress);
  result += val(this.hardwareType);
  result += val(this.uid);
  result += val(this.clientHostname);

  return result.substring(0, result.length - 1);
};

exports = module.exports = Lease;