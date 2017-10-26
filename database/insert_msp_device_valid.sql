SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

INSERT INTO msp_device VALUES (1000, 'WebHost 1', 'Mikrotik', 'Marketing Web Server', 'Web Server', '', '78A907570944.sn.mynetname.net', 1000);
INSERT INTO msp_device VALUES (1001, 'Main Office Router', 'Mikrotik', 'Office Wifi Router', 'Router', '', '78A9077F9070.sn.mynetname.net', 1003);
INSERT INTO msp_device VALUES (1003, 'DB 1', 'Mikrotik', 'Sales Database', 'Database Server', '', '78A907F7CB17.sn.mynetname.net', 1002);
INSERT INTO msp_device VALUES (1007, 'Main Office Router', 'Mikrotik', 'Office Wifi Router', 'Router', '', '78A90765364C.sn.mynetname.net', 1010);
INSERT INTO msp_device VALUES (1011, 'WebHost 1', 'Mikrotik', 'Marketing Web Server', 'Web Server', '', '78A90707A60F.sn.mynetname.net', 1012);
INSERT INTO msp_device VALUES (1008, 'DB 1', 'Mikrotik', 'Sales Database', 'Database Server', '', '78A9071CFAC4.sn.mynetname.net', 1013);
INSERT INTO msp_device VALUES (1002, 'Procurement 1', 'Virtual Server', 'Western Inventory Control', 'Web Server', '', '78A907457024.sn.mynetname.net', 1001);
INSERT INTO msp_device VALUES (1004, 'DB 2', 'Amazon EC2', 'Billing Database', 'Database Server', '', '78A9078DC78B.sn.mynetname.net', 1004);
INSERT INTO msp_device VALUES (1005, 'WebHost 2', 'Amazon EC2', 'CSR Interface', 'Web Server', '', '78A907CBDA96.sn.mynetname.net', 1005);
INSERT INTO msp_device VALUES (1006, 'Procurement 2', 'Amazon EC2', 'Eastern Inventory Control', 'Web Server', '', '78A90785626E.sn.mynetname.net', 1006);
INSERT INTO msp_device VALUES (1009, 'DB 2', 'Amazon EC2', 'Billing Database', 'Database Server', '', '78A907F8F251.sn.mynetname.net', 1007);
INSERT INTO msp_device VALUES (1010, 'WebHost 2', 'Amazon EC2', 'CSR Interface', 'Web Server', '', '78A907D5263A.sn.mynetname.net', 1009);
INSERT INTO msp_device VALUES (1012, 'Procurement 2', 'Amazon EC2', 'Eastern Inventory Control', 'Web Server', '', '78A9070931B7.sn.mynetname.net', 1008);
INSERT INTO msp_device VALUES (1013, 'Procurement 1', 'Virtual Server', 'Western Inventory Control', 'Web Server', '', '78A907FE793D.sn.mynetname.net', 1011);