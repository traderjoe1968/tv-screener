/**
 * Query class for building and executing TradingView screener queries
 */

import fetch from 'node-fetch';
import {
  QueryDict,
  ScreenerDict,
  ScannerData,
  FilterOperationDict,
  OperationDict,
  ExpressionDict,
  SortOrder,
  Cookies,
} from './models';

const SCREENER_URL = 'https://scanner.tradingview.com';

export class Query {
  private queryDict: QueryDict;

  constructor() {
    this.queryDict = {
      markets: ['america'],
      symbols: {},
      options: {
        lang: 'en',
      },
      columns: ['name', 'close', 'volume', 'market_cap_basic'],
      filter: [],
      sort: {
        sortBy: 'name',
        sortOrder: 'asc',
      },
      range: [0, 50],
    };
  }

  /**
   * Select specific columns to retrieve
   * @param columns - Column names to select
   * @returns Query instance for chaining
   */
  select(...columns: string[]): Query {
    if (columns.length > 0) {
      this.queryDict.columns = columns;
    }
    return this;
  }

  /**
   * Set markets to query
   * @param markets - Market identifiers (e.g., 'america', 'india', 'forex')
   * @returns Query instance for chaining
   */
  setMarkets(...markets: string[]): Query {
    if (markets.length > 0) {
      this.queryDict.markets = markets;
    }
    return this;
  }

  /**
   * Set specific tickers to filter
   * @param tickers - Ticker symbols in format "EXCHANGE:SYMBOL"
   * @returns Query instance for chaining
   */
  setTickers(...tickers: string[]): Query {
    if (tickers.length > 0) {
      if (!this.queryDict.symbols) {
        this.queryDict.symbols = {};
      }
      this.queryDict.symbols.tickers = tickers;
    }
    return this;
  }

  /**
   * Set index to filter equities
   * @param indexes - Index names
   * @returns Query instance for chaining
   */
  setIndex(...indexes: string[]): Query {
    if (indexes.length > 0) {
      if (!this.queryDict.symbols) {
        this.queryDict.symbols = {};
      }
      if (!this.queryDict.symbols.groups) {
        this.queryDict.symbols.groups = [];
      }
      this.queryDict.symbols.groups.push({
        type: 'index',
        values: indexes,
      });
    }
    return this;
  }

  /**
   * Add filter conditions with AND logic
   * @param expressions - Filter expressions to apply
   * @returns Query instance for chaining
   */
  where(...expressions: FilterOperationDict[]): Query {
    if (!this.queryDict.filter) {
      this.queryDict.filter = [];
    }

    for (const expr of expressions) {
      this.queryDict.filter.push(expr as any);
    }
    return this;
  }

  /**
   * Add complex filter with custom AND/OR logic
   * @param operation - Complex operation with nested logic
   * @returns Query instance for chaining
   */
  where2(operation: OperationDict): Query {
    this.queryDict.filter2 = operation;
    return this;
  }

  /**
   * Set sorting order
   * @param column - Column to sort by
   * @param ascending - Sort in ascending order (default: true)
   * @param nullsFirst - Put null values first (default: false)
   * @returns Query instance for chaining
   */
  orderBy(
    column: string,
    ascending: boolean = true,
    nullsFirst: boolean = false
  ): Query {
    this.queryDict.sort = {
      sortBy: column,
      sortOrder: ascending ? 'asc' : 'desc',
      nullsFirst,
    };
    return this;
  }

  /**
   * Set maximum number of results to return
   * @param limit - Maximum number of results
   * @returns Query instance for chaining
   */
  limit(limit: number): Query {
    if (!this.queryDict.range) {
      this.queryDict.range = [0, limit];
    } else {
      this.queryDict.range[1] = this.queryDict.range[0] + limit;
    }
    return this;
  }

  /**
   * Set offset for pagination
   * @param offset - Number of results to skip
   * @returns Query instance for chaining
   */
  offset(offset: number): Query {
    if (!this.queryDict.range) {
      this.queryDict.range = [offset, offset + 50];
    } else {
      const currentLimit = this.queryDict.range[1] - this.queryDict.range[0];
      this.queryDict.range = [offset, offset + currentLimit];
    }
    return this;
  }

  /**
   * Create a copy of this query
   * @returns New Query instance with same configuration
   */
  copy(): Query {
    const newQuery = new Query();
    newQuery.queryDict = JSON.parse(JSON.stringify(this.queryDict));
    return newQuery;
  }

  /**
   * Get the raw query dictionary
   * @returns QueryDict object
   */
  getQueryDict(): QueryDict {
    return this.queryDict;
  }

  /**
   * Execute query and get raw API response
   * @param cookies - Optional cookies for authentication
   * @returns Raw screener response
   */
  async getScannerDataRaw(cookies?: Cookies): Promise<ScreenerDict> {
    const market = this.queryDict.markets?.[0] || 'america';
    const url = `${SCREENER_URL}/${market}/scan`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    if (cookies) {
      const cookieString = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
      headers['Cookie'] = cookieString;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(this.queryDict),
    });

    if (!response.ok) {
      throw new Error(
        `TradingView API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as ScreenerDict;
    return data;
  }

  /**
   * Execute query and get formatted scanner data
   * @param cookies - Optional cookies for authentication
   * @returns Scanner data with total count and formatted rows
   */
  async getScannerData(cookies?: Cookies): Promise<ScannerData> {
    const rawData = await this.getScannerDataRaw(cookies);
    const columns = this.queryDict.columns || [];

    // Convert raw data to array of objects
    const formattedData = rawData.data.map((row) => {
      const obj: Record<string, any> = {
        symbol: row.s,
      };

      // Map each data value to its column name
      columns.forEach((col, index) => {
        obj[col] = row.d[index];
      });

      return obj;
    });

    return {
      totalCount: rawData.totalCount,
      data: formattedData,
    };
  }

  /**
   * Get the query as a JSON string
   * @returns JSON string representation of the query
   */
  toJSON(): string {
    return JSON.stringify(this.queryDict, null, 2);
  }
}
