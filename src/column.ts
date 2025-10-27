/**
 * Column class for building filter expressions
 * Represents a field in the TradingView screener
 */

import { FilterOperationDict } from './models';

export class Column {
  constructor(public readonly name: string) {}

  /**
   * Greater than operator (>)
   */
  gt(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'greater',
      right: value,
    };
  }

  /**
   * Greater than or equal operator (>=)
   */
  gte(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'egreater',
      right: value,
    };
  }

  /**
   * Less than operator (<)
   */
  lt(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'less',
      right: value,
    };
  }

  /**
   * Less than or equal operator (<=)
   */
  lte(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'eless',
      right: value,
    };
  }

  /**
   * Equal operator (==)
   */
  eq(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'equal',
      right: value,
    };
  }

  /**
   * Not equal operator (!=)
   */
  neq(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'nequal',
      right: value,
    };
  }

  /**
   * Between range (inclusive)
   */
  between(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_range',
      right: [min, max],
    };
  }

  /**
   * Not between range
   */
  notBetween(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'not_in_range',
      right: [min, max],
    };
  }

  /**
   * In day range
   */
  inDayRange(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_day_range',
      right: [min, max],
    };
  }

  /**
   * In week range
   */
  inWeekRange(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_week_range',
      right: [min, max],
    };
  }

  /**
   * In month range
   */
  inMonthRange(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_month_range',
      right: [min, max],
    };
  }

  /**
   * Above percentage
   */
  abovePct(value: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'above_pct',
      right: value,
    };
  }

  /**
   * Below percentage
   */
  belowPct(value: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'below_pct',
      right: value,
    };
  }

  /**
   * Between percentage range
   */
  betweenPct(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'in_range_pct',
      right: [min, max],
    };
  }

  /**
   * Not between percentage range
   */
  notBetweenPct(min: number, max: number): FilterOperationDict {
    return {
      left: this.name,
      operation: 'not_in_range_pct',
      right: [min, max],
    };
  }

  /**
   * Crosses another value
   */
  crosses(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'crosses',
      right: value,
    };
  }

  /**
   * Crosses above another value
   */
  crossesAbove(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'crosses_above',
      right: value,
    };
  }

  /**
   * Crosses below another value
   */
  crossesBelow(value: any): FilterOperationDict {
    return {
      left: this.name,
      operation: 'crosses_below',
      right: value,
    };
  }

  /**
   * String match (like)
   */
  like(pattern: string): FilterOperationDict {
    return {
      left: this.name,
      operation: 'match',
      right: pattern,
    };
  }

  /**
   * String not match (not like)
   */
  notLike(pattern: string): FilterOperationDict {
    return {
      left: this.name,
      operation: 'nmatch',
      right: pattern,
    };
  }

  /**
   * Has value in list
   */
  has(values: any[]): FilterOperationDict {
    return {
      left: this.name,
      operation: 'has',
      right: values,
    };
  }

  /**
   * Has none of values in list
   */
  hasNoneOf(values: any[]): FilterOperationDict {
    return {
      left: this.name,
      operation: 'has_none_of',
      right: values,
    };
  }

  /**
   * Is in list
   */
  isin(values: any[]): FilterOperationDict {
    return {
      left: this.name,
      operation: 'has',
      right: values,
    };
  }

  /**
   * Is not in list
   */
  notIn(values: any[]): FilterOperationDict {
    return {
      left: this.name,
      operation: 'has_none_of',
      right: values,
    };
  }

  /**
   * Is empty (null)
   */
  empty(): FilterOperationDict {
    return {
      left: this.name,
      operation: 'empty',
    };
  }

  /**
   * Is not empty (not null)
   */
  notEmpty(): FilterOperationDict {
    return {
      left: this.name,
      operation: 'nempty',
    };
  }
}

/**
 * Convenience function to create a Column instance
 */
export function col(name: string): Column {
  return new Column(name);
}
