
export var Query = {
    MIGRATE_30 : 
        "BEGIN TRANSACTION; " +
        "INSERT INTO msp_ping_30 (device_recid, ip_address, ms_response, response_count, datetime) " +
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, round((count(nullif(responded, false))::decimal/5),1), date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '5 min' as timestamp " +
        "FROM( SELECT * FROM msp_ping p WHERE  datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.responded ORDER BY p.device_recid, p.datetime ) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid " + 
        "ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval); " +
        "END TRANSACTION; ",
    MIGRATE_60 : 
        "BEGIN TRANSACTION; " +
        "INSERT INTO msp_ping_60 (device_recid, ip_address, ms_response, response_count, datetime) " + 
        "SELECT device_recid, min(ip_address) as ip_address, avg(ms_response)::int as ms_response, (round(sum(response_count),1)::decimal) as ping_success_rate, date_trunc('hour', datetime) + date_part('minute', datetime)::int / 5 * interval '25 min' as timestamp " +
        "FROM(SELECT * FROM msp_ping_30 p WHERE  datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY p.device_recid, p.ip_address, p.datetime,p.ms_response, p.ping_recid, p.response_count ORDER BY p.device_recid, p.datetime) AS SUBQUERY " +
        "GROUP BY timestamp, device_recid ORDER BY device_recid, timestamp; " +
        "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval); " +
        "END TRANSACTION;",
    DELETE_30_DAYS :
        "DELETE FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval);",
    DELETE_60_DAYS :
        "DELETE FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval);",
    GET_ALL_COMPANIES :
        "SELECT * FROM msp_company;",
    GET_ALL_SITES :
        "SELECT * FROM msp_site;",
    GET_ALL_DEVICES :
        "SELECT * FROM msp_device;",
    GET_ALL_PINGS :
        "SELECT * FROM msp_ping;",
    GET_30_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping WHERE datetime < (timezone('UTC',NOW()) - '30 days'::interval) GROUP BY device_recid, ping_recid ORDER BY device_recid, datetime",
    GET_60_DAYS_OLD_PINGS :
        "SELECT * FROM msp_ping_30 WHERE datetime < (timezone('UTC',NOW()) - '60 days'::interval) GROUP BY device_recid, ping_recid ORDER BY device_recid, datetime"
}