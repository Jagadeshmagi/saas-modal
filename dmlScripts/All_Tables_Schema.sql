
-- Schema for all the tables
-- Created By Subrata on Dated 25-10-2017

--Table: public.instances

CREATE TABLE instances
(
  id bigint NOT NULL DEFAULT nextval('instances_id_seq'::regclass),
  customerid bigint,
  pulsarinstanceid text,
  ipaddress text,
  buildversion text,
  contentversion text,
  status text,
  created timestamp with time zone,
  CONSTRAINT pk_instances_id PRIMARY KEY (id)

);

--Table: public.product

CREATE TABLE product
(
 id bigint NOT NULL DEFAULT nextval('product_id_seq'::regclass),
 salesforceprodutid text,
 name text,
 description text,
 price numeric,
 sku text,
  CONSTRAINT pk_product_id PRIMARY KEY (id)
);


--Table: public.entitlements

CREATE TABLE entitlements
(
 id bigint NOT NULL DEFAULT nextval('entitlements_id_seq'::regclass),
 productid bigint,
 oppertunityid text,
 startdate timestamp with time zone,
 enddate timestamp with time zone,
 subtype text,
 vmcount numeric,
 containercount numeric,
 imagecount numeric,
  CONSTRAINT pk_entitlements_id PRIMARY KEY (id),
  CONSTRAINT entitlements_product_key FOREIGN KEY (productid)
      REFERENCES product (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION

);

-- Table: public.customer

CREATE TABLE customer
(
  id bigint NOT NULL DEFAULT nextval('customer_id_seq'::regclass),
  created timestamp with time zone,
  salesforcecustomerid text,
  companyname text,
  status text,
  instanceid bigint,
  entitlementid bigint,
  serviceagreementaccepted text, 
  CONSTRAINT customer_pkey PRIMARY KEY (id),
  CONSTRAINT customer_instanceid FOREIGN KEY (instanceid)
      REFERENCES instances (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
   CONSTRAINT customer_entitlementid FOREIGN KEY (entitlementid)
      REFERENCES entitlements (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Table: public.contact

CREATE TABLE contact
(
  id bigint NOT NULL DEFAULT nextval('contact_id_seq'::regclass),
  created timestamp with time zone,
  name text,
  customerid bigint,
  addr1 text,
  addr2 text,
  city text,
  state text,
  zip text,
  phone text,
  email text,
  country text,
  CONSTRAINT contact_pkey PRIMARY KEY (id),
  CONSTRAINT contact_customerid_key FOREIGN KEY (customerid)
      REFERENCES customer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

--Table: public.users

CREATE TABLE users
(
  id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  created timestamp without time zone NOT NULL DEFAULT now(),
  customerid bigint,
  login text,
  password text,
  resetpassword text,
  role text,
  lastlogin timestamp with time zone NOT NULL DEFAULT now(),
  status text,
  showhelpscreen text,
  CONSTRAINT pk_users_id PRIMARY KEY (id),
  CONSTRAINT users_customerid_key FOREIGN KEY (customerid)
      REFERENCES customer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

--Table: public.sassadminlog

CREATE TABLE sassadminlog
(
  id bigint NOT NULL DEFAULT nextval('sassadminlog_id_seq'::regclass),
  created timestamp with time zone,
  customerid bigint,
  emailtype text,
  updated timestamp with time zone,
  action text,
  CONSTRAINT pk_sassadminlog_id PRIMARY KEY (id),
  CONSTRAINT sassadminlog_customer_key FOREIGN KEY (customerid)
      REFERENCES customer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

--Table: public.schedule

CREATE TABLE schedule
(
 id bigint NOT NULL DEFAULT nextval('schedule_id_seq'::regclass),
 created timestamp with time zone,
 customerid bigint,
 scheduleddate timestamp with time zone,
 action text,
 emailtype text,
  CONSTRAINT pk_schedule_id PRIMARY KEY (id)
);














