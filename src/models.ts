/**
 * Type definitions for TradingView Screener API
 * These types correspond to the Python TypedDict definitions
 */

/**
 * Operation types for filtering
 */
export type Operation =
  | 'greater'
  | 'less'
  | 'egreater'
  | 'eless'
  | 'equal'
  | 'nequal'
  | 'in_range'
  | 'not_in_range'
  | 'in_day_range'
  | 'in_week_range'
  | 'in_month_range'
  | 'above_pct'
  | 'below_pct'
  | 'in_range_pct'
  | 'not_in_range_pct'
  | 'crosses'
  | 'crosses_above'
  | 'crosses_below'
  | 'match'
  | 'nmatch'
  | 'has'
  | 'has_none_of'
  | 'empty'
  | 'nempty';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Logical operators
 */
export type LogicalOperator = 'and' | 'or';

/**
 * Filter operation dictionary
 */
export interface FilterOperationDict {
  left: string;
  operation: Operation;
  right?: any;
}

/**
 * Sort configuration
 */
export interface SortByDict {
  sortBy: string;
  sortOrder: SortOrder;
  nullsFirst?: boolean;
}

/**
 * Symbols dictionary for filtering
 */
export interface SymbolsDict {
  query?: {
    types: string[];
  };
  tickers?: string[];
  symbolset?: string;
  watchlist?: {
    id: string;
  };
  groups?: Array<{
    type: string;
    values: string[];
  }>;
}

/**
 * Expression wrapper
 */
export interface ExpressionDict {
  expression: FilterOperationDict;
}

/**
 * Operation comparison for complex queries
 */
export interface OperationComparisonDict {
  operator: LogicalOperator;
  operands: Array<ExpressionDict | OperationDict>;
}

/**
 * Operation wrapper
 */
export interface OperationDict {
  operation: OperationComparisonDict;
}

/**
 * Main query dictionary sent to API
 */
export interface QueryDict {
  markets?: string[];
  symbols?: SymbolsDict;
  options?: {
    lang?: string;
  };
  columns?: string[];
  filter?: FilterOperationDict[];
  filter2?: OperationDict;
  sort?: SortByDict;
  range?: [number, number];
  preset?: string;
  price_conversion?: {
    to_symbol?: boolean;
  };
}

/**
 * Individual screener result row
 */
export interface ScreenerRowDict {
  s: string; // symbol
  d: any[]; // data values
}

/**
 * Screener API response
 */
export interface ScreenerDict {
  totalCount: number;
  data: ScreenerRowDict[];
}

/**
 * Scanner data result
 */
export interface ScannerData {
  totalCount: number;
  data: Array<Record<string, any>>;
}

/**
 * Cookie configuration for authenticated requests
 */
export type Cookies = Record<string, string>;
