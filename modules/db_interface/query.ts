
export var Query = {
    MIGRATE_30 : 
        "INSERT INTO msp_ping_30 (device_recid, ip_address, ms_response, response_count, datetime) " +
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, round((count(nullif(responded, false))::decimal/5),1), date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '5 min' as timestamp " +
        "FROM( SELECT * FROM msp_ping p WHERE  datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.responded ORDER BY p.device_recid, p.datetime ) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid " + 
        "ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval); ",
    MIGRATE_60 : 
        "INSERT INTO msp_ping_60 (device_recid, ip_address, ms_response, response_count, datetime) " + 
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, (round(sum(response_count),1)::decimal) as ping_success_rate, date_trunc('hour', datetime) + date_part('minute', datetime)::int / 25 * interval '25 min' as timestamp " +
        "FROM(SELECT * FROM msp_ping_30 p WHERE  datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_30_recid, p.response_count ORDER BY p.device_recid, p.datetime) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);",
    INSERT_RECORDS :
        "INSERT INTO msp_ping (device_recid, ip_address, ms_response, responded, datetime) VALUES (deviceRecID, \'IPAddress\', msResponse, respondedResult, \'psqlDate\');",
    UPDATE_SITE_LOCATION :
        "UPDATE msp_site SET latitude=newLat, longitude=newLon WHERE site_recid=siteID;",
    DELETE_RECENT_PINGS :
        "DELETE FROM msp_ping;",
    DELETE_30_DAYS :
        "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval);",
    DELETE_60_DAYS :
        "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);",
    DELETE_90_DAYS :
        "DELETE FROM msp_ping_60 WHERE datetime < (timezone('UTC',NOW()) - '90 days'::interval);",
    GET_ALL_COMPANIES :
        "SELECT * FROM msp_company;",
    GET_COMPANY :       
        "SELECT company_recid FROM msp_company WHERE username=\'username\';",
    GET_ALL_SITES :
        "SELECT * FROM msp_site;",
    GET_SITES_BY_COMPANY :
        "SELECT site_recid FROM msp_site WHERE company_recid=\'companyID\';",
    GET_ALL_DEVICES :
        "SELECT * FROM msp_device;",
    GET_COMPANY_DEVICES :
        "SELECT * FROM msp_company c, msp_site s, msp_device d " +
        "WHERE c.company_recid = companyID " +
        "AND c.company_recid = s.company_recid " +
        "AND s.site_recid = d.site_recid " +
        "ORDER BY d.site_recid, d.device_recid;",
    GET_SITE_DEVICES :
        "SELECT device_recid FROM msp_device WHERE site_recid=\'siteID\';",
    GET_ALL_PINGS :
        "SELECT * FROM msp_ping;",
    GET_30_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY device_recid, ping_recid, msp_ping.ip_address, ms_response, responded, datetime ORDER BY device_recid, datetime",
    GET_60_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY device_recid, ping_recid, ip_address, ms_response, response_count, datetime ORDER BY device_recid, datetime",
    GET_RECENT_PINGS :
        "SELECT * FROM msp_ping where device_recid=\'deviceRecID\' order by datetime desc, ping_recid, device_recid limit limitNum;",
    GET_DEVICE_PINGS :
        "SELECT * from msp_ping where msp_ping.device_recid=\'deviceRecID\' order by datetime",
    GET_PINGS_BETWEEN :
        "SELECT * from msp_ping  where datetime>='psqlStart' AND datetime<'psqlFinish' and device_recid=deviceID " +
        "UNION " +
        "SELECT ping_30_recid, device_recid, ip_address, ms_response, CASE WHEN response_count>=1 THEN true ELSE false END, datetime from msp_ping_30 WHERE datetime>='psqlStart' AND datetime<'psqlFinish' AND device_recid=deviceID " +
        "UNION " + 
        "SELECT ping_60_recid, device_recid, ip_address, ms_response, CASE WHEN response_count>=1 THEN true ELSE false END, datetime from msp_ping_60 WHERE datetime>='psqlStart' AND datetime<'psqlFinish' AND device_recid=deviceID ORDER BY datetime;",
    GET_30_DAY_UPTIME :
        "SELECT (count(nullif(responded, false))::decimal)/count(*) AS uptime FROM msp_ping where device_recid=deviceRecID;",
    GET_60_DAY_UPTIME :
        "SELECT sum(response_count)/count(*) AS uptime FROM msp_ping_30 where device_recid=deviceRecID",
    GET_90_DAY_UPTIME :
        "SELECT sum(response_count)/count(*) AS uptime FROM msp_ping_60 where device_recid=deviceRecID",
    GET_NEWEST_DATETIME :
        "SELECT datetime FROM msp_ping ORDER BY datetime DESC LIMIT 1;"
    
}