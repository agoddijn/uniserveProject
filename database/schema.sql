--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: msp_company; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_company (
    company_recid integer DEFAULT nextval(('pk_msp_company_recid'::text)::regclass) NOT NULL,
    company_id character varying(50) NOT NULL,
    company_name character varying(50) NOT NULL,
    phone_number character varying(15),
    contact_first_name character varying(30),
    contact_last_name character varying(30),
    username character varying(25),
    password character varying(25)
);


ALTER TABLE public.msp_company OWNER TO ubc03;

--
-- Name: msp_device; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_device (
    device_recid integer DEFAULT nextval(('pk_msp_device_recid'::text)::regclass) NOT NULL,
    device_id character varying(60) NOT NULL,
    manufacturer character varying(50),
    description character varying(60),
    device_type character varying(30),
    mac_address character varying(17),
    ip_address character varying(45) NOT NULL,
    site_recid integer NOT NULL
);


ALTER TABLE public.msp_device OWNER TO ubc03;

--
-- Name: msp_site; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_site (
    site_recid integer DEFAULT nextval(('pk_msp_site_recid'::text)::regclass) NOT NULL,
    company_recid integer NOT NULL,
    description character varying(50),
    address1 character varying(50),
    address2 character varying(50),
    city character varying(50),
    province character varying(50),
    postal_code character varying(12),
    latitude character varying(12),
    longitude character varying(12)
);


ALTER TABLE public.msp_site OWNER TO ubc03;

--
-- Name: msp_ping; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping (
    ping_recid integer DEFAULT nextval(('pk_msp_ping_recid'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    responded boolean DEFAULT false,
    datetime TIMESTAMP
);

CREATE INDEX datePingIndex ON msp_ping (datetime);
ALTER TABLE public.msp_ping OWNER TO ubc03;

--
-- Name: msp_ping_30; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping_30 (
    ping_30_recid integer DEFAULT nextval(('pk_msp_ping_recid'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    response_count decimal,
    datetime TIMESTAMP
);

CREATE INDEX date30PingIndex ON msp_ping_30 (datetime);
ALTER TABLE public.msp_ping_30 OWNER TO ubc03;

--
-- Name: msp_ping_60; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping_60 (
    ping_60_recid integer DEFAULT nextval(('pk_msp_ping_recid'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    response_count decimal,
    datetime TIMESTAMP
);

CREATE INDEX date60PingIndex ON msp_ping_60 (datetime);
ALTER TABLE public.msp_ping_60 OWNER TO ubc03;

--
-- Name: pk_msp_company_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_company_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_company_recid OWNER TO ubc03;

--
-- Name: pk_msp_device_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_device_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_device_recid OWNER TO ubc03;

--
-- Name: pk_msp_site_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_site_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_site_recid OWNER TO ubc03;

--
-- Name: pk_msp_ping_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_recid OWNER TO ubc03;

--
-- Name: pk_msp_ping_30_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_30_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_30_recid OWNER TO ubc03;

--
-- Name: pk_msp_ping_60_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_60_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_60_recid OWNER TO ubc03;

--
-- Name: msp_company_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_company
    ADD CONSTRAINT msp_company_pkey PRIMARY KEY (company_recid);


--
-- Name: msp_device_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_device
    ADD CONSTRAINT msp_device_pkey PRIMARY KEY (device_recid);


--
-- Name: msp_site_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_site
    ADD CONSTRAINT msp_site_pkey PRIMARY KEY (site_recid);


--
-- Name: msp_ping_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping
    ADD CONSTRAINT msp_ping_pkey PRIMARY KEY (ping_recid);


--
-- Name: msp_ping_30_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping_30
    ADD CONSTRAINT msp_ping_30_pkey PRIMARY KEY (ping_30_recid);



--
-- Name: msp_ping_60_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping_60
    ADD CONSTRAINT msp_ping_60_pkey PRIMARY KEY (ping_60_recid);


--
-- Name: msp_device_site_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_device
    ADD CONSTRAINT msp_device_site_recid_fkey FOREIGN KEY (site_recid) REFERENCES msp_site(site_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_company_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_site
    ADD CONSTRAINT msp_site_company_recid_fkey FOREIGN KEY (company_recid) REFERENCES msp_company(company_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_ping_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping
    ADD CONSTRAINT msp_ping_device_recid_fkey FOREIGN KEY (device_recid) REFERENCES msp_device(device_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_ping_30_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping_30
    ADD CONSTRAINT msp_ping_30_device_recid_fkey FOREIGN KEY (device_recid) REFERENCES msp_device(device_recid) ON DELETE RESTRICT;



--
-- Name: msp_site_ping_60_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping_60
    ADD CONSTRAINT msp_ping_60_device_recid_fkey FOREIGN KEY (device_recid) REFERENCES msp_device(device_recid) ON DELETE RESTRICT;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: ubc03
--

ALTER DEFAULT PRIVILEGES FOR ROLE ubc03 IN SCHEMA public REVOKE ALL ON TABLES  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE ubc03 IN SCHEMA public REVOKE ALL ON TABLES  FROM ubc03;
ALTER DEFAULT PRIVILEGES FOR ROLE ubc03 IN SCHEMA public GRANT ALL ON TABLES  TO ubc03;


--
-- PostgreSQL database dump complete
--

