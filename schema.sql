--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = sdata, pg_catalog;

ALTER TABLE sdata.user_data ALTER COLUMN data_id DROP DEFAULT;
DROP TABLE sdata.user_keys;
DROP SEQUENCE sdata.user_data_data_id_seq;
DROP TABLE sdata.user_data;
DROP TABLE sdata.user_admins;
DROP EXTENSION plpgsql;
DROP SCHEMA sdata;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: sdata; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA sdata;


ALTER SCHEMA sdata OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = sdata, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user_admins; Type: TABLE; Schema: sdata; Owner: postgres; Tablespace: 
--

CREATE TABLE user_admins (
    user_id bigint NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE sdata.user_admins OWNER TO postgres;

--
-- Name: user_data; Type: TABLE; Schema: sdata; Owner: postgres; Tablespace: 
--

CREATE TABLE user_data (
    data_id bigint NOT NULL,
    data_type character varying(20) NOT NULL,
    user_id bigint NOT NULL,
    active boolean NOT NULL,
    encrypted_to bigint NOT NULL,
    data_encrypted text NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    modified timestamp with time zone
);


ALTER TABLE sdata.user_data OWNER TO postgres;

--
-- Name: user_data_data_id_seq; Type: SEQUENCE; Schema: sdata; Owner: postgres
--

CREATE SEQUENCE user_data_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sdata.user_data_data_id_seq OWNER TO postgres;

--
-- Name: user_data_data_id_seq; Type: SEQUENCE OWNED BY; Schema: sdata; Owner: postgres
--

ALTER SEQUENCE user_data_data_id_seq OWNED BY user_data.data_id;


--
-- Name: user_keys; Type: TABLE; Schema: sdata; Owner: postgres; Tablespace: 
--

CREATE TABLE user_keys (
    user_id bigint NOT NULL,
    private_key_encrypted text NOT NULL,
    public_key text NOT NULL,
    active boolean NOT NULL,
    created timestamp with time zone,
    modified timestamp with time zone
);


ALTER TABLE sdata.user_keys OWNER TO postgres;

--
-- Name: data_id; Type: DEFAULT; Schema: sdata; Owner: postgres
--

ALTER TABLE ONLY user_data ALTER COLUMN data_id SET DEFAULT nextval('user_data_data_id_seq'::regclass);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

