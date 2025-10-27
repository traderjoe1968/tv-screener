/**
 * Base scan implementation from base_scan.yaml
 * Scans for active stocks with comprehensive market data
 */

import { Query, col } from '../src';
import type { ScannerData, Cookies } from '../src/models';

/**
 * Execute the base scan for active stocks
 *
 * This scan retrieves comprehensive market data including:
 * - Real-time and premarket data
 * - Volume and price metrics
 * - Company information (sector, industry, etc.)
 *
 * Filters applied:
 * - active_symbol == true
 * - type == stock
 * - is_primary == true
 *
 * @param market - Stock market to scan (default: 'america'). Options: 'america', 'india', 'uk', 'germany', etc.
 *                 Note: This scan includes stock-specific fields. For crypto/forex, create a custom query.
 * @param cookies - Optional authentication cookies for real-time data
 * @returns Scanner data with all matching stocks
 */
export async function baseScan(
  market: string = 'america',
  cookies?: Cookies
): Promise<ScannerData> {
  const query = new Query()
    .setMarkets(market)
    .select(
      'time',
      'update_time',
      'logoid',
      'name',
      'description',
      'last_bar_update_time',
      'open',
      'high',
      'low',
      'close',
      'volume',
      'premarket_time',
      'premarket_open',
      'premarket_high',
      'premarket_low',
      'premarket_close',
      'premarket_volume',
      'premarket_change_abs',
      'premarket_change',
      'premarket_change_from_open',
      'premarket_gap',
      'change',
      'volume_change',
      'average_volume_30d_calc',
      'relative_volume',
      'relative_volume_10d_calc',
      'gap',
      'gap_up',
      'gap_up_abs',
      'float_shares_outstanding',
      'currency',
      'sector',
      'market',
      'industry',
      'update_mode',
      'type',
      'typespecs'
    )
    .where(
      col('active_symbol').eq(true),
      col('type').eq('stock'),
      col('is_primary').eq(true)
    )
    .setMarkets(market);

  return await query.getScannerData(cookies);
}

/**
 * Get the base scan query object for customization
 *
 * Use this if you want to modify the base scan with additional filters
 * or different sorting before executing it.
 *
 * @example
 * const query = getBaseScanQuery()
 *   .where(col('volume').gt(1_000_000))
 *   .orderBy('volume', false)
 *   .limit(50);
 * const data = await query.getScannerData();
 *
 * @param market - Stock market to scan (default: 'america'). Options: 'america', 'india', 'uk', 'germany', etc.
 *                 Note: This scan includes stock-specific fields. For crypto/forex, create a custom query.
 * @returns Query object configured with base scan parameters
 */
export function getBaseScanQuery(market: string = 'america'): Query {
  return new Query()
    .setMarkets(market)
    .select(
      'time',
      'update_time',
      'logoid',
      'name',
      'description',
      'last_bar_update_time',
      'open',
      'high',
      'low',
      'close',
      'volume',
      'premarket_time',
      'premarket_open',
      'premarket_high',
      'premarket_low',
      'premarket_close',
      'premarket_volume',
      'premarket_change_abs',
      'premarket_change',
      'premarket_change_from_open',
      'premarket_gap',
      'change',
      'volume_change',
      'average_volume_30d_calc',
      'relative_volume',
      'relative_volume_10d_calc',
      'gap',
      'gap_up',
      'gap_up_abs',
      'float_shares_outstanding',
      'currency',
      'sector',
      'market',
      'industry',
      'update_mode',
      'type',
      'typespecs'
    )
    .where(
      col('active_symbol').eq(true),
      col('type').eq('stock'),
      col('is_primary').eq(true)
    )
    .setMarkets(market);
}
