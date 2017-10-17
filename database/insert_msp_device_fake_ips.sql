--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Data for Name: msp_device; Type: TABLE DATA; Schema: public; Owner: ubc03
--

INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1001, 'Main Office Router', 'Mikrotik', 'Office Wifi Router', 'Router', '', '216.58.193.78', 1003);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1003, 'DB 1', 'Virtual Server', 'Sales Database', 'Database Server', '', '172.217.3.174', 1002);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1004, 'DB 2', 'Amazon EC2', 'Billing Database', 'Database Server', '', '31.13.76.68', 1004);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1005, 'WebHost 2', 'Amazon EC2', 'CSR Interface', 'Web Server', '', '111.13.101.208', 1005);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1000, 'WebHost 1', 'Virtual Server', 'Marketing Web Server', 'Web Server', '00:15:5D:0B:1C:05', '198.35.26.96', 1000);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1006, 'Procurement 2', 'Amazon EC2', 'Eastern Inventory Control', 'Web Server', '', '206.190.36.45', 1006);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1002, 'Procurement 1', 'Virtual Server', 'Western Inventory Control', 'Web Server', '', '151.101.193.140', 1001);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1007, 'Main Office Router', 'Mikrotik', 'Office Wifi Router', 'Router', '', '61.135.157.156', 1010);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1008, 'DB 1', 'Virtual Server', 'Sales Database', 'Database Server', '', '104.244.42.1', 1013);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1009, 'DB 2', 'Amazon EC2', 'Billing Database', 'Database Server', '', '65.55.118.92', 1007);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1010, 'WebHost 2', 'Amazon EC2', 'CSR Interface', 'Web Server', '', '34.196.53.171', 1009);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1011, 'WebHost 1', 'Virtual Server', 'Marketing Web Server', 'Web Server', '00:15:5D:0B:1C:05', '123.125.116.16', 1012);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1012, 'Procurement 2', 'Amazon EC2', 'Eastern Inventory Control', 'Web Server', '', '172.217.3.163', 1008);
INSERT INTO msp_device (device_recid, device_id, manufacturer, description, device_type, mac_address, ip_address, site_recid) VALUES (1013, 'Procurement 1', 'Virtual Server', 'Western Inventory Control', 'Web Server', '', '151.101.52.193', 1011);


--
-- PostgreSQL database dump complete
--

