--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bestilling; Type: TABLE; Schema: public; Owner: audun
--

CREATE TABLE public.bestilling (
    bestillingid integer NOT NULL,
    dato date NOT NULL,
    betalt boolean DEFAULT false,
    betalingsmetode text NOT NULL,
    kundeid integer NOT NULL
);


ALTER TABLE public.bestilling OWNER TO audun;

--
-- Name: bestilling_bestillingid_seq; Type: SEQUENCE; Schema: public; Owner: audun
--

CREATE SEQUENCE public.bestilling_bestillingid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bestilling_bestillingid_seq OWNER TO audun;

--
-- Name: bestilling_bestillingid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: audun
--

ALTER SEQUENCE public.bestilling_bestillingid_seq OWNED BY public.bestilling.bestillingid;


--
-- Name: kunde; Type: TABLE; Schema: public; Owner: audun
--

CREATE TABLE public.kunde (
    kundeid integer NOT NULL,
    fornavn text NOT NULL,
    etternavn text NOT NULL,
    adresse text NOT NULL,
    tlf text DEFAULT ''::text,
    epost text DEFAULT ''::text
);


ALTER TABLE public.kunde OWNER TO audun;

--
-- Name: kunde_kundeid_seq; Type: SEQUENCE; Schema: public; Owner: audun
--

CREATE SEQUENCE public.kunde_kundeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kunde_kundeid_seq OWNER TO audun;

--
-- Name: kunde_kundeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: audun
--

ALTER SEQUENCE public.kunde_kundeid_seq OWNED BY public.kunde.kundeid;


--
-- Name: linje; Type: TABLE; Schema: public; Owner: audun
--

CREATE TABLE public.linje (
    linjeid integer NOT NULL,
    pris integer NOT NULL,
    antall integer DEFAULT 1,
    bestillingid integer NOT NULL,
    vareid integer NOT NULL
);


ALTER TABLE public.linje OWNER TO audun;

--
-- Name: linje_linjeid_seq; Type: SEQUENCE; Schema: public; Owner: audun
--

CREATE SEQUENCE public.linje_linjeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.linje_linjeid_seq OWNER TO audun;

--
-- Name: linje_linjeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: audun
--

ALTER SEQUENCE public.linje_linjeid_seq OWNED BY public.linje.linjeid;


--
-- Name: vare; Type: TABLE; Schema: public; Owner: audun
--

CREATE TABLE public.vare (
    vareid integer NOT NULL,
    varenavn text NOT NULL,
    beholdning integer DEFAULT 0,
    basispris integer NOT NULL
);


ALTER TABLE public.vare OWNER TO audun;

--
-- Name: vare_vareid_seq; Type: SEQUENCE; Schema: public; Owner: audun
--

CREATE SEQUENCE public.vare_vareid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vare_vareid_seq OWNER TO audun;

--
-- Name: vare_vareid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: audun
--

ALTER SEQUENCE public.vare_vareid_seq OWNED BY public.vare.vareid;


--
-- Name: bestilling bestillingid; Type: DEFAULT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.bestilling ALTER COLUMN bestillingid SET DEFAULT nextval('public.bestilling_bestillingid_seq'::regclass);


--
-- Name: kunde kundeid; Type: DEFAULT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.kunde ALTER COLUMN kundeid SET DEFAULT nextval('public.kunde_kundeid_seq'::regclass);


--
-- Name: linje linjeid; Type: DEFAULT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.linje ALTER COLUMN linjeid SET DEFAULT nextval('public.linje_linjeid_seq'::regclass);


--
-- Name: vare vareid; Type: DEFAULT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.vare ALTER COLUMN vareid SET DEFAULT nextval('public.vare_vareid_seq'::regclass);


--
-- Data for Name: bestilling; Type: TABLE DATA; Schema: public; Owner: audun
--

COPY public.bestilling (bestillingid, dato, betalt, betalingsmetode, kundeid) FROM stdin;
\.


--
-- Data for Name: kunde; Type: TABLE DATA; Schema: public; Owner: audun
--

COPY public.kunde (kundeid, fornavn, etternavn, adresse, tlf, epost) FROM stdin;
10	lisa	jensen	haugesund	123	a.b@c
11	olga	jensen	karmøy	123	a.b@c
5	kari	olsen	Kristiania	123	a.b@c
9	lisa	nilsen	Kristiania	123	a.b@c
12	gaute	hauge	karmøy	123	a.b@c
13	fredd	hauge	haugesund		a.b@c
14	fredrik	hauge	haugesund		a.b@c
15	frode	hauge	haugesund		a.b@c
16	finn	hauge	haugesund		a.b@c
\.


--
-- Data for Name: linje; Type: TABLE DATA; Schema: public; Owner: audun
--

COPY public.linje (linjeid, pris, antall, bestillingid, vareid) FROM stdin;
\.


--
-- Data for Name: vare; Type: TABLE DATA; Schema: public; Owner: audun
--

COPY public.vare (vareid, varenavn, beholdning, basispris) FROM stdin;
\.


--
-- Name: bestilling_bestillingid_seq; Type: SEQUENCE SET; Schema: public; Owner: audun
--

SELECT pg_catalog.setval('public.bestilling_bestillingid_seq', 1, false);


--
-- Name: kunde_kundeid_seq; Type: SEQUENCE SET; Schema: public; Owner: audun
--

SELECT pg_catalog.setval('public.kunde_kundeid_seq', 16, true);


--
-- Name: linje_linjeid_seq; Type: SEQUENCE SET; Schema: public; Owner: audun
--

SELECT pg_catalog.setval('public.linje_linjeid_seq', 1, false);


--
-- Name: vare_vareid_seq; Type: SEQUENCE SET; Schema: public; Owner: audun
--

SELECT pg_catalog.setval('public.vare_vareid_seq', 1, false);


--
-- Name: bestilling bestilling_pkey; Type: CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.bestilling
    ADD CONSTRAINT bestilling_pkey PRIMARY KEY (bestillingid);


--
-- Name: kunde kunde_pkey; Type: CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.kunde
    ADD CONSTRAINT kunde_pkey PRIMARY KEY (kundeid);


--
-- Name: linje linje_pkey; Type: CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.linje
    ADD CONSTRAINT linje_pkey PRIMARY KEY (linjeid);


--
-- Name: vare vare_pkey; Type: CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.vare
    ADD CONSTRAINT vare_pkey PRIMARY KEY (vareid);


--
-- Name: bestilling bestilling_kundeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.bestilling
    ADD CONSTRAINT bestilling_kundeid_fkey FOREIGN KEY (kundeid) REFERENCES public.kunde(kundeid);


--
-- Name: linje linje_bestillingid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.linje
    ADD CONSTRAINT linje_bestillingid_fkey FOREIGN KEY (bestillingid) REFERENCES public.bestilling(bestillingid);


--
-- Name: linje linje_vareid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: audun
--

ALTER TABLE ONLY public.linje
    ADD CONSTRAINT linje_vareid_fkey FOREIGN KEY (vareid) REFERENCES public.vare(vareid);


--
-- PostgreSQL database dump complete
--

