create table if not exists leases (
  id integer primary key,
  ip text collate rtrim,
  startDate integer,
  endDate integer,
  tstp integer,
  tsfp integer,
  atsfp integer,
  cltt integer,
  hardwareAddress text collate rtrim,
  hardwareType text collate rtrim,
  uid text collate rtrim,
  clientHostname text collate rtrim
);

create index if not exists ip_index on leases (ip);
create index if not exists hardwareAddress_index on leases (hardwareAddress);
create index if not exists hardwareType_index on leases (hardwareType);
create index if not exists uid_index on leases (uid);
create index if not exists clientHostname_index on leases (clientHostname);