CREATE DATABASE ubc03_test


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

CREATE TABLE msp_company_test (
    company_recid integer DEFAULT nextval(('pk_msp_company_recid_test'::text)::regclass) NOT NULL,
    company_id character varying(50) NOT NULL,
    company_name character varying(50) NOT NULL,
    phone_number character varying(15),
    contact_first_name character varying(30),
    contact_last_name character varying(30),
    username character varying(25),
    password character varying(25)
);


ALTER TABLE public.msp_company_test OWNER TO ubc03;

--
-- Name: msp_device; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_device_test (
    device_recid integer DEFAULT nextval(('pk_msp_device_recid_test'::text)::regclass) NOT NULL,
    device_id character varying(60) NOT NULL,
    manufacturer character varying(50),
    description character varying(60),
    device_type character varying(30),
    mac_address character varying(17),
    ip_address character varying(45) NOT NULL,
    site_recid integer NOT NULL
);


ALTER TABLE public.msp_device_test OWNER TO ubc03;

--
-- Name: msp_site; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_site (
    site_recid integer DEFAULT nextval(('pk_msp_site_recid_test'::text)::regclass) NOT NULL,
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


ALTER TABLE public.msp_site_test OWNER TO ubc03;

--
-- Name: msp_ping; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping_test (
    ping_recid integer DEFAULT nextval(('pk_msp_ping_recid_test'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    responded boolean DEFAULT false,
    datetime TIMESTAMP
);


ALTER TABLE public.msp_ping_test OWNER TO ubc03;

--
-- Name: msp_ping_30; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping_30_test (
    ping_30_recid integer DEFAULT nextval(('pk_msp_ping_recid_test'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    response_count decimal,
    datetime TIMESTAMP
);


ALTER TABLE public.msp_ping_30_test OWNER TO ubc03;

--
-- Name: msp_ping_60; Type: TABLE; Schema: public; Owner: ubc03; Tablespace: 
--

CREATE TABLE msp_ping_60_test (
    ping_60_recid integer DEFAULT nextval(('pk_msp_ping_recid_test'::text)::regclass) NOT NULL,
    device_recid integer NOT NULL,
    ip_address character varying(50),
    ms_response integer,
    response_count decimal,
    datetime TIMESTAMP
);


ALTER TABLE public.msp_ping_60_test OWNER TO ubc03;

--
-- Name: pk_msp_company_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_company_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_company_recid_test OWNER TO ubc03;

--
-- Name: pk_msp_device_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_device_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_device_recid_test OWNER TO ubc03;

--
-- Name: pk_msp_site_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_site_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_site_recid_test OWNER TO ubc03;

--
-- Name: pk_msp_ping_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_recid_test OWNER TO ubc03;

--
-- Name: pk_msp_ping_30_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_30_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_30_recid_test OWNER TO ubc03;

--
-- Name: pk_msp_ping_60_recid; Type: SEQUENCE; Schema: public; Owner: ubc03
--

CREATE SEQUENCE pk_msp_ping_60_recid_test
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_ping_60_recid_test OWNER TO ubc03;

--
-- Name: msp_company_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_company_test
    ADD CONSTRAINT msp_company_pkey_test PRIMARY KEY (company_recid_test);


--
-- Name: msp_device_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_device_test
    ADD CONSTRAINT msp_device_pkey_test PRIMARY KEY (device_recid_test);


--
-- Name: msp_site_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_site_test
    ADD CONSTRAINT msp_site_pkey_test PRIMARY KEY (site_recid_test);


--
-- Name: msp_ping_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping_test
    ADD CONSTRAINT msp_ping_pkey_test PRIMARY KEY (ping_recid_test);


--
-- Name: msp_ping_30_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping_30_test
    ADD CONSTRAINT msp_ping_30_pkey_test PRIMARY KEY (ping_30_recid_test);



--
-- Name: msp_ping_60_pkey; Type: CONSTRAINT; Schema: public; Owner: ubc03; Tablespace: 
--

ALTER TABLE ONLY msp_ping_60_test
    ADD CONSTRAINT msp_ping_60_pkey_test PRIMARY KEY (ping_60_recid_test);


--
-- Name: msp_device_site_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_device_test
    ADD CONSTRAINT msp_device_site_recid_fkey_test FOREIGN KEY (site_recid) REFERENCES msp_site_test(site_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_company_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_site_test
    ADD CONSTRAINT msp_site_company_recid_fkey_test FOREIGN KEY (company_recid) REFERENCES msp_company_test(company_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_ping_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping_test
    ADD CONSTRAINT msp_ping_device_recid_fkey_test FOREIGN KEY (device_recid) REFERENCES msp_device_test(device_recid) ON DELETE RESTRICT;


--
-- Name: msp_site_ping_30_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping_30_test
    ADD CONSTRAINT msp_ping_30_device_recid_fkey_test FOREIGN KEY (device_recid) REFERENCES msp_device_test(device_recid) ON DELETE RESTRICT;



--
-- Name: msp_site_ping_60_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ubc03
--

ALTER TABLE ONLY msp_ping_60_test
    ADD CONSTRAINT msp_ping_60_device_recid_fkey_test FOREIGN KEY (device_recid) REFERENCES msp_device_test(device_recid) ON DELETE RESTRICT;


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

