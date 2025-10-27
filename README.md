# TradingView Screener (TypeScript/Node.js)

A pure TypeScript/Node.js implementation of the TradingView screener API client, providing the same functionality as the Python [tradingview-screener](https://github.com/shner-elmo/TradingView-Screener) library.

## Features

- **3000+ Data Fields**: Access OHLC data, technical indicators, and fundamental metrics
- **Multiple Markets**: Supports stocks, crypto, forex, CFDs, futures, and bonds
- **Flexible Timeframes**: Query data from 1 minute to 1 month intervals
- **SQL-like Filtering**: Build complex queries with AND/OR logic
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Method Chaining**: Fluent API for building queries

## Installation

```bash
npm install
npm run build
```

## Quick Start

```typescript
import { Query } from './src';

// Simple query
const query = new Query()
  .select('name', 'close', 'volume', 'market_cap_basic');

const data = await query.getScannerData();
console.log(data);
```

## API Reference

### Basic Usage

#### Selecting Columns

```typescript
import { Query } from './src';

const query = new Query()
  .select('name', 'close', 'volume', 'relative_volume_10d_calc');

const { totalCount, data } = await query.getScannerData();
```

#### Setting Markets

```typescript
// Query specific markets
const query = new Query()
  .setMarkets('america', 'india')
  .select('name', 'close', 'volume');
```

#### Filtering by Tickers

```typescript
const query = new Query()
  .setTickers('NYSE:AAPL', 'NASDAQ:GOOGL', 'NASDAQ:MSFT')
  .select('name', 'close', 'volume');
```

### Advanced Filtering

#### Using Column Filters

```typescript
import { Query, col } from './src';

const query = new Query()
  .select('name', 'close', 'volume', 'market_cap_basic')
  .where(
    col('market_cap_basic').between(1_000_000, 50_000_000),
    col('volume').gt(1_000_000),
    col('close').gte(10)
  );
```

#### Comparison Operators

The `Column` class supports the following operators:

```typescript
col('close').gt(100)           // Greater than
col('close').gte(100)          // Greater than or equal
col('close').lt(100)           // Less than
col('close').lte(100)          // Less than or equal
col('close').eq(100)           // Equal
col('close').neq(100)          // Not equal
col('volume').between(1000, 5000)  // Between range
col('price').notBetween(10, 20)    // Not in range
```

#### Range Operations

```typescript
// Day, week, month ranges
col('change').inDayRange(-5, 5)
col('change').inWeekRange(-10, 10)
col('change').inMonthRange(-20, 20)

// Percentage operations
col('change').abovePct(5)
col('change').belowPct(-5)
col('change').betweenPct(-10, 10)
```

#### List Operations

```typescript
// Check if value is in list
col('sector').isin(['Technology', 'Healthcare'])

// Check if value is not in list
col('sector').notIn(['Energy', 'Utilities'])

// Has operation
col('tags').has(['growth', 'dividend'])
col('tags').hasNoneOf(['penny', 'otc'])
```

#### String Operations

```typescript
col('name').like('Apple%')
col('name').notLike('%Bank%')
```

#### Null Checks

```typescript
col('dividend_yield').notEmpty()
col('beta').empty()
```

#### Technical Indicators

```typescript
// MACD crossover
col('MACD.macd').gte(col('MACD.signal'))

// RSI conditions
col('RSI').between(30, 70)

// Moving average crosses
col('close').crossesAbove(col('SMA50'))
```

### Complex Queries with AND/OR

```typescript
import { Query, col, And, Or } from './src';

// Complex nested logic
const query = new Query()
  .select('name', 'close', 'volume', 'market_cap_basic')
  .where2(
    And(
      col('market_cap_basic').between(1_000_000, 100_000_000),
      Or(
        col('volume').gt(1_000_000),
        col('relative_volume_10d_calc').gt(1.5)
      ),
      col('close').gte(5)
    )
  );
```

### Sorting and Pagination

```typescript
const query = new Query()
  .select('name', 'close', 'volume')
  .where(col('volume').gt(1_000_000))
  .orderBy('volume', false)  // Sort descending
  .offset(10)                 // Skip first 10 results
  .limit(25);                 // Return 25 results
```

### Real-Time Data Access

For real-time data, you need to provide authentication cookies:

```typescript
// Using cookies from browser
const cookies = {
  sessionid: 'your-session-id'
};

const query = new Query()
  .select('name', 'close', 'volume');

const data = await query.getScannerData(cookies);
```

### Reusable Queries

```typescript
// Create a base query template
const baseQuery = new Query()
  .select('name', 'close', 'volume', 'market_cap_basic')
  .where(col('market_cap_basic').gt(1_000_000));

// Copy and modify for different use cases
const techStocks = baseQuery
  .copy()
  .where(col('sector').eq('Technology'));

const largeVolume = baseQuery
  .copy()
  .where(col('volume').gt(5_000_000))
  .orderBy('volume', false);
```

## Complete Examples

### Example 1: Finding Growth Stocks

```typescript
import { Query, col } from './src';

async function findGrowthStocks() {
  const query = new Query()
    .select(
      'name',
      'close',
      'volume',
      'market_cap_basic',
      'price_earnings_ttm',
      'earnings_per_share_diluted_ttm'
    )
    .where(
      col('market_cap_basic').between(1_000_000_000, 50_000_000_000),
      col('volume').gt(500_000),
      col('price_earnings_ttm').between(10, 30),
      col('earnings_per_share_diluted_ttm').gt(0)
    )
    .orderBy('market_cap_basic', false)
    .limit(50);

  const { totalCount, data } = await query.getScannerData();

  console.log(`Found ${totalCount} stocks`);
  console.log(data);
}

findGrowthStocks();
```

### Example 2: High Volume Breakouts

```typescript
import { Query, col } from './src';

async function findBreakouts() {
  const query = new Query()
    .select(
      'name',
      'close',
      'volume',
      'relative_volume_10d_calc',
      'change'
    )
    .where(
      col('relative_volume_10d_calc').gt(2),
      col('change').gt(5),
      col('volume').gt(1_000_000),
      col('close').between(5, 100)
    )
    .orderBy('relative_volume_10d_calc', false)
    .limit(25);

  const { totalCount, data } = await query.getScannerData();

  console.log(`Found ${totalCount} potential breakouts`);
  data.forEach(stock => {
    console.log(
      `${stock.name}: $${stock.close} (${stock.change}% change, ` +
      `${stock.relative_volume_10d_calc.toFixed(2)}x volume)`
    );
  });
}

findBreakouts();
```

### Example 3: Technical Analysis Screener

```typescript
import { Query, col, And, Or } from './src';

async function technicalScreener() {
  const query = new Query()
    .select(
      'name',
      'close',
      'volume',
      'RSI',
      'MACD.macd',
      'MACD.signal'
    )
    .where2(
      And(
        col('volume').gt(500_000),
        col('close').between(10, 200),
        Or(
          // RSI oversold
          col('RSI').lt(35),
          // MACD bullish crossover
          And(
            col('MACD.macd').gte(col('MACD.signal')),
            col('MACD.macd').lt(0)
          )
        )
      )
    )
    .orderBy('volume', false)
    .limit(30);

  const { totalCount, data } = await query.getScannerData();

  console.log(`Found ${totalCount} technical setups`);
  console.log(data);
}

technicalScreener();
```

## API Response Format

The `getScannerData()` method returns an object with:

```typescript
{
  totalCount: number;    // Total number of results matching the query
  data: Array<{          // Array of result objects
    symbol: string;      // Ticker symbol
    [key: string]: any;  // Selected column values
  }>;
}
```

The `getScannerDataRaw()` method returns the raw API response:

```typescript
{
  totalCount: number;
  data: Array<{
    s: string;    // symbol
    d: any[];     // data array
  }>;
}
```

## Available Column Operators

| Operator | Method | Example |
|----------|--------|---------|
| > | `gt(value)` | `col('close').gt(100)` |
| >= | `gte(value)` | `col('close').gte(100)` |
| < | `lt(value)` | `col('close').lt(100)` |
| <= | `lte(value)` | `col('close').lte(100)` |
| == | `eq(value)` | `col('sector').eq('Technology')` |
| != | `neq(value)` | `col('sector').neq('Energy')` |
| BETWEEN | `between(min, max)` | `col('close').between(10, 50)` |
| NOT BETWEEN | `notBetween(min, max)` | `col('close').notBetween(10, 50)` |
| IN | `isin(values)` | `col('sector').isin(['Tech', 'Health'])` |
| NOT IN | `notIn(values)` | `col('sector').notIn(['Energy'])` |
| LIKE | `like(pattern)` | `col('name').like('Apple%')` |
| NOT LIKE | `notLike(pattern)` | `col('name').notLike('%Bank%')` |
| IS NULL | `empty()` | `col('dividend').empty()` |
| IS NOT NULL | `notEmpty()` | `col('dividend').notEmpty()` |
| CROSSES | `crosses(value)` | `col('close').crosses(col('SMA50'))` |
| CROSSES ABOVE | `crossesAbove(value)` | `col('close').crossesAbove(col('SMA20'))` |
| CROSSES BELOW | `crossesBelow(value)` | `col('close').crossesBelow(col('SMA50'))` |

## Architecture

This library is a direct TypeScript port of the Python `tradingview-screener` library. It:

1. Builds query objects using a fluent API
2. Converts queries to JSON payloads
3. Sends POST requests to TradingView's screener API
4. Parses and formats the response data

The implementation maintains the same structure as the Python version:

- `models.ts`: TypeScript type definitions
- `column.ts`: Column class for building filter expressions
- `operators.ts`: AND/OR logical operators
- `query.ts`: Main Query class for building and executing queries
- `examples/base_scan.ts`: Pre-configured base scan from YAML configuration

## Contributing

This is a faithful TypeScript port of the original Python library. When adding features, please ensure they match the Python implementation.

## License

MIT

## Credits

This is a TypeScript/Node.js port of [shner-elmo/TradingView-Screener](https://github.com/shner-elmo/TradingView-Screener).

Original Python library by shner-elmo.
