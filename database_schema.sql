--
-- PostgreSQL database dump
--

\restrict wRg1arxHRWuUB5MzyOGDuZ8udULB0clNK9TjcjLOa9F5dWQac9Q835YWead8mN4

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: poste_employe; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.poste_employe AS ENUM (
    'Chef_Chantier',
    'Conducteur_Travaux',
    'Ingenieur',
    'Macon',
    'Chauffeur_Engin',
    'Ouvrier'
);


ALTER TYPE public.poste_employe OWNER TO postgres;

--
-- Name: statut_demande; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statut_demande AS ENUM (
    'En_attente',
    'Approuve',
    'Refuse'
);


ALTER TYPE public.statut_demande OWNER TO postgres;

--
-- Name: statut_projet; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statut_projet AS ENUM (
    'Etude',
    'En Cours',
    'Suspendu'
);


ALTER TYPE public.statut_projet OWNER TO postgres;

--
-- Name: type_projet; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_projet AS ENUM (
    'Route',
    'Batiment',
    'Pont'
);


ALTER TYPE public.type_projet OWNER TO postgres;

--
-- Name: type_ressource; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_ressource AS ENUM (
    'Engin',
    'Outillage',
    'Materiau'
);


ALTER TYPE public.type_ressource OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: demandes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demandes (
    id_demande integer NOT NULL,
    titre_demande character varying(255) NOT NULL,
    description text,
    staut public.statut_demande DEFAULT 'En_attente'::public.statut_demande,
    id_projet integer NOT NULL,
    id_utilisateur integer NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_delete boolean DEFAULT false,
    delete_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_employe integer
);


ALTER TABLE public.demandes OWNER TO postgres;

--
-- Name: demandes_id_demande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demandes_id_demande_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demandes_id_demande_seq OWNER TO postgres;

--
-- Name: demandes_id_demande_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demandes_id_demande_seq OWNED BY public.demandes.id_demande;


--
-- Name: employes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employes (
    id_employe integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100),
    telephone character varying(20),
    poste public.poste_employe NOT NULL,
    salaire_journalier numeric(10,2) NOT NULL,
    id_projet integer,
    id_utilisateur integer,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_delete boolean DEFAULT false,
    delete_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.employes OWNER TO postgres;

--
-- Name: employes_id_employe_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employes_id_employe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employes_id_employe_seq OWNER TO postgres;

--
-- Name: employes_id_employe_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employes_id_employe_seq OWNED BY public.employes.id_employe;


--
-- Name: paiements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiements (
    id_paiement integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    date_paiement date DEFAULT CURRENT_DATE NOT NULL,
    description character varying(255),
    id_projet integer NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_delete boolean DEFAULT false,
    delete_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.paiements OWNER TO postgres;

--
-- Name: paiements_id_paiement_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiements_id_paiement_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paiements_id_paiement_seq OWNER TO postgres;

--
-- Name: paiements_id_paiement_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiements_id_paiement_seq OWNED BY public.paiements.id_paiement;


--
-- Name: projets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projets (
    id_projet integer NOT NULL,
    nom_projet character varying(255) NOT NULL,
    description text,
    type public.type_projet,
    date_debut date,
    date_fin_prevue date,
    budget numeric(15,2),
    status public.statut_projet DEFAULT 'Etude'::public.statut_projet,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp without time zone
);


ALTER TABLE public.projets OWNER TO postgres;

--
-- Name: projets_id_projet_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projets_id_projet_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projets_id_projet_seq OWNER TO postgres;

--
-- Name: projets_id_projet_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projets_id_projet_seq OWNED BY public.projets.id_projet;


--
-- Name: ressources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ressources (
    id_ressource integer NOT NULL,
    nom_ressource character varying(255) NOT NULL,
    categorie public.type_ressource NOT NULL,
    quantite_disponible integer DEFAULT 1 NOT NULL,
    id_projet integer,
    creat_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_delete boolean DEFAULT false,
    delete_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ressources OWNER TO postgres;

--
-- Name: ressources_id_ressource_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ressources_id_ressource_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ressources_id_ressource_seq OWNER TO postgres;

--
-- Name: ressources_id_ressource_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ressources_id_ressource_seq OWNED BY public.ressources.id_ressource;


--
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateur_id_seq OWNER TO postgres;

--
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- Name: demandes id_demande; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes ALTER COLUMN id_demande SET DEFAULT nextval('public.demandes_id_demande_seq'::regclass);


--
-- Name: employes id_employe; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes ALTER COLUMN id_employe SET DEFAULT nextval('public.employes_id_employe_seq'::regclass);


--
-- Name: paiements id_paiement; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements ALTER COLUMN id_paiement SET DEFAULT nextval('public.paiements_id_paiement_seq'::regclass);


--
-- Name: projets id_projet; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets ALTER COLUMN id_projet SET DEFAULT nextval('public.projets_id_projet_seq'::regclass);


--
-- Name: ressources id_ressource; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ressources ALTER COLUMN id_ressource SET DEFAULT nextval('public.ressources_id_ressource_seq'::regclass);


--
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- Name: demandes demandes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_pkey PRIMARY KEY (id_demande);


--
-- Name: employes employes_id_utilisateur_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_id_utilisateur_key UNIQUE (id_utilisateur);


--
-- Name: employes employes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_pkey PRIMARY KEY (id_employe);


--
-- Name: paiements paiements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_pkey PRIMARY KEY (id_paiement);


--
-- Name: projets projets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projets
    ADD CONSTRAINT projets_pkey PRIMARY KEY (id_projet);


--
-- Name: ressources ressources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ressources
    ADD CONSTRAINT ressources_pkey PRIMARY KEY (id_ressource);


--
-- Name: utilisateur utilisateur_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_email_key UNIQUE (email);


--
-- Name: utilisateur utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);


--
-- Name: demandes demandes_id_employe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_id_employe_fkey FOREIGN KEY (id_employe) REFERENCES public.employes(id_employe) ON DELETE CASCADE;


--
-- Name: demandes demandes_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE CASCADE;


--
-- Name: demandes demandes_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demandes
    ADD CONSTRAINT demandes_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id) ON DELETE CASCADE;


--
-- Name: employes employes_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE SET NULL;


--
-- Name: employes employes_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employes
    ADD CONSTRAINT employes_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateur(id) ON DELETE SET NULL;


--
-- Name: paiements paiements_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE CASCADE;


--
-- Name: ressources ressources_id_projet_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ressources
    ADD CONSTRAINT ressources_id_projet_fkey FOREIGN KEY (id_projet) REFERENCES public.projets(id_projet) ON DELETE SET NULL;


--
-- Name: TABLE demandes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.demandes TO sitraka;


--
-- Name: TABLE employes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employes TO sitraka;


--
-- Name: TABLE paiements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.paiements TO sitraka;


--
-- Name: TABLE projets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.projets TO sitraka;


--
-- Name: SEQUENCE projets_id_projet_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.projets_id_projet_seq TO sitraka;


--
-- Name: TABLE ressources; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ressources TO sitraka;


--
-- Name: TABLE utilisateur; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.utilisateur TO sitraka;


--
-- Name: SEQUENCE utilisateur_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.utilisateur_id_seq TO sitraka;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO sitraka;


--
-- PostgreSQL database dump complete
--

\unrestrict wRg1arxHRWuUB5MzyOGDuZ8udULB0clNK9TjcjLOa9F5dWQac9Q835YWead8mN4

