
CREATE TABLE frisor (
  frisorid serial primary key,
  fornavn text not null,
  etternavn text not null,
  mobil text
);

CREATE TABLE kunde (
  kundeid serial primary key,
  fornavn text not null,
  etternavn text not null,
  mobil text,
  kjonn text default 'f'
);

CREATE TABLE klipp (
  klippid serial primary key,
  klipptime date,
  pris int default = 1200,
  frisorid int references frisor (frisorid),
  kundeid int references kunde (kundeid)
);

delete from kunde where kjonn = 'm';
insert into kunde (fornavn, etternavn) values ('ole','olsen'),('ane','bruun');
select fornavn,etternavn from kunde where fornavn ~ 'kri';
update klipp set pris = 200;