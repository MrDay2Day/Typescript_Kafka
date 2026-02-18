## QuestDB

Connect to QuestDB `http://localhost:9000`: 

```sql
CREATE TABLE IF NOT EXISTS 'trades' (
  symbol SYMBOL,
  side SYMBOL,
  timestamp TIMESTAMP,
  price DOUBLE,
  amount DOUBLE
) timestamp (timestamp) PARTITION BY DAY WAL;

SELECT * FROM trades;

DROP TABLE 'trades';

TRUNCATE TABLE trades;
```

Then you can query the data


## TimescaleDB

```SQL
-- Optional: Create the standard PostgreSQL table but Kafka Connect with create the table
CREATE TABLE IF NOT EXISTS trades (
  symbol VARCHAR(255),
  side VARCHAR(50),
  timestamp TIMESTAMPTZ NOT NULL,
  price DOUBLE PRECISION,
  amount DOUBLE PRECISION
);

-- Convert it into a TimescaleDB Hypertable partitioned by time (1 day chunks by default)
-- Delete the existing rows
TRUNCATE trades;
-- Then
SELECT create_hypertable('trades', 'timestamp', if_not_exists => TRUE);

-- Migrating Data after recreating table as Hypertable
SELECT create_hypertable('trades', 'timestamp', migrate_data => true, if_not_exists => TRUE);

-- QUERY 

  -- Candle stick data
  SELECT 
    -- Convert the BIGINT to a native timestamp, then bucket it by 1 minute
    time_bucket('1 minute'::interval, to_timestamp(timestamp / 1000.0)) AS candle_time,
    symbol,
    FIRST(price, timestamp) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    LAST(price, timestamp) AS close,
    SUM(amount) AS volume
  FROM trades
  WHERE symbol = 'BTC-USD'
  GROUP BY candle_time, symbol
  ORDER BY candle_time DESC;

  -- Adding DateTime range
  SELECT 
    time_bucket('1 minute'::interval, to_timestamp(timestamp / 1000000.0)) AS candle_time,
    symbol,
    FIRST(price, timestamp) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    LAST(price, timestamp) AS close,
    SUM(amount) AS volume
  FROM trades
  WHERE symbol = 'BTC-USD'
    -- Filter from start date to end date (converted to microseconds)
    AND timestamp >= EXTRACT(EPOCH FROM TIMESTAMPTZ '2026-02-18 09:00:00-05') * 1000000
    AND timestamp < EXTRACT(EPOCH FROM TIMESTAMPTZ '2026-02-18 10:00:00-05') * 1000000
  GROUP BY candle_time, symbol
  ORDER BY candle_time ASC;
```