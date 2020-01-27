-- lag database,bruker og set passord

create role shop password '123';     -- shop er brukeren
alter role shop with login;          -- kan logge in via net
create database shop owner shop;     -- lag en database

-- skift til den nye databasen
\c shop;


DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS kunde cascade;
DROP TABLE IF EXISTS vare cascade;
DROP TABLE IF EXISTS bestilling cascade;
DROP TABLE IF EXISTS linje cascade;


create table users (
    userid SERIAL PRIMARY KEY,
    username text unique not null,
    role text default 'user',
    password text not null
); 

CREATE TABLE kunde (
  kundeid SERIAL PRIMARY KEY,
  fornavn text NOT NULL,
  etternavn text NOT NULL,
  adresse text,
  epost text,
  tlf text,
  kjonn text,
  userid int unique not null
);

CREATE TABLE  vare  (
   vareid  SERIAL PRIMARY KEY,
   navn  text NOT NULL,
   pris  int NOT NULL
);

CREATE TABLE  bestilling  (
   bestillingid  SERIAL PRIMARY KEY,
   dato  date NOT NULL,
   kundeid  int NOT NULL
);

CREATE TABLE  linje  (
   linjeid  SERIAL PRIMARY KEY,
   antall  int DEFAULT 1,
   vareid  int NOT NULL,
   bestillingid  int NOT NULL
);

ALTER TABLE  bestilling  ADD FOREIGN KEY ( kundeid ) REFERENCES  kunde  ( kundeid );
ALTER TABLE  linje  ADD FOREIGN KEY ( bestillingid ) REFERENCES  bestilling  ( bestillingid );
ALTER TABLE  linje  ADD FOREIGN KEY ( vareid ) REFERENCES  vare  ( vareid );
ALTER TABLE  kunde  ADD FOREIGN KEY ( userid ) REFERENCES  users  ( userid );

alter table bestilling owner to shop;
alter table vare owner to shop;
alter table kunde owner to shop;
alter table linje owner to shop;