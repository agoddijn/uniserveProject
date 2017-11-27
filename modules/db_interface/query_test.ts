
export var TestQuery = {
    MIGRATE_30 : 
        "INSERT INTO msp_ping_test_30_test (device_recid, ip_address, ms_response, response_count, datetime) " +
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, round((count(nullif(responded, false))::decimal/5),1), date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '5 min' as timestamp " +
        "FROM( SELECT * FROM msp_ping_test p WHERE  datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.responded ORDER BY p.device_recid, p.datetime ) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid " + 
        "ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping_test WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval); ",
    MIGRATE_60 : 
        "INSERT INTO msp_ping_test_60_test (device_recid, ip_address, ms_response, response_count, datetime) " + 
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, (round(sum(response_count),1)::decimal) as ping_success_rate, date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '25 min' as timestamp " +
        "FROM(SELECT * FROM msp_ping_test_30_test p WHERE  datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.response_count ORDER BY p.device_recid, p.datetime) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping_test_30_test WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);",
    INSERT_RECORDS :
        "INSERT INTO msp_ping_test (device_recid, ip_address, ms_response, responded, datetime) VALUES (deviceRecID, \'IPAddress\', msResponse, respondedResult, \'psqlDate\');",
    UPDATE_SITE_LOCATION :
        "UPDATE msp_site_test SET latitude=newLat, longitude=newLon WHERE site_recid=siteID;",
    DELETE_30_DAYS :
        "DELETE FROM msp_ping_test WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval);",
    DELETE_60_DAYS :
        "DELETE FROM msp_ping_test_30_test WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);",
    GET_ALL_COMPANIES :
        "SELECT * FROM msp_company_test;",
    GET_COMPANY :       
        "SELECT company_recid FROM msp_company_test WHERE username=\'username\';",
    GET_ALL_SITES :
        "SELECT * FROM msp_site_test;",
    GET_SITES_BY_COMPANY :
        "SELECT site_recid FROM msp_site_test WHERE company_recid=\'companyID\';",
    GET_ALL_DEVICES :
        "SELECT * FROM msp_device_test;",
    GET_COMPANY_DEVICES :
        "SELECT * FROM msp_company_test c, msp_site_test s, msp_device_test d " +
        "WHERE c.company_recid = companyID " +
        "AND c.company_recid = s.company_recid " +
        "AND s.site_recid = d.site_recid " +
        "ORDER BY d.site_recid, d.device_recid;",
    GET_SITE_DEVICES :
        "SELECT device_recid FROM msp_device_test WHERE site_recid=\'siteID\';",
    GET_ALL_PINGS :
        "SELECT * FROM msp_ping_test;",
    GET_30_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping_test WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY device_recid, ping_recid, msp_ping_test.ip_address, ms_response, responded, datetime ORDER BY device_recid, datetime",
    GET_60_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping_test_30_test WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY device_recid, ping_recid, ip_address, ms_response, response_count, datetime ORDER BY device_recid, datetime",
    GET_RECENT_PINGS :
        "SELECT * FROM msp_ping_test where device_recid=\'deviceRecID\' order by datetime desc, ping_recid, device_recid limit limitNum;",
    GET_DEVICE_PINGS :
        "SELECT * from msp_ping_test where msp_ping_test.device_recid=\'deviceRecID\' order by datetime",
    GET_PINGS_BETWEEN :
        "SELECT * from msp_ping_test  where datetime>='psqlStart' AND datetime<'psqlFinish' and device_recid=deviceID " +
        "UNION " +
        "SELECT ping_recid, device_recid, ip_address, ms_response, CASE WHEN response_count>=1 THEN true ELSE false END, datetime from msp_ping_test_30_test WHERE datetime>='psqlStart' AND datetime<'psqlFinish' AND device_recid=deviceID " +
        "UNION " + 
        "SELECT ping_recid, device_recid, ip_address, ms_response, CASE WHEN response_count>=1 THEN true ELSE false END, datetime from msp_ping_test_60_test WHERE datetime>='psqlStart' AND datetime<'psqlFinish' AND device_recid=deviceID ORDER BY datetime;",
    GET_30_DAY_UPTIME :
        "SELECT (count(nullif(responded, false))::decimal)/count(*) AS uptime FROM msp_ping_test where device_recid=deviceRecID;",
    GET_60_DAY_UPTIME :
        "SELECT sum(response_count)/count(*) AS uptime FROM msp_ping_test_30_test where device_recid=deviceRecID",
    GET_90_DAY_UPTIME :
        "SELECT sum(response_count)/count(*) AS uptime FROM msp_ping_test_60_test where device_recid=deviceRecID",
    
}