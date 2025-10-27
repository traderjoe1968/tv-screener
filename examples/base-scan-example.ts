/**
 * Base scan example
 * Demonstrates using the baseScan function and customizing it
 */

import { getBaseScanQuery } from './base_scan';
import { col } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function runBaseScan() {
  console.log('Base Scan Example\n');

  // Get session ID from environment
  const cookies = process.env.TVSESSIONID
    ? { sessionid: process.env.TVSESSIONID }
    : undefined;

  if (cookies) {
    console.log('Using authenticated session for real-time data\n');
  }

  // Example 1: Run the base scan directly
  console.log('1. Running base scan (limited to 10 results for demo):');
  try {
    const baseScanQuery = getBaseScanQuery().limit(10);
    const { totalCount, data } = await baseScanQuery.getScannerData(cookies);

    console.log(`Found ${totalCount} total active US stocks`);
    console.log('\nFirst 10 stocks:');
    console.table(
      data.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        close: stock.close,
        volume: stock.volume,
        change: stock.change?.toFixed(2) + '%',
        rel_volume: stock.relative_volume_10d_calc?.toFixed(2),
      }))
    );
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Customize the base scan with additional filters
  console.log('\n2. Base scan with custom filters (high volume stocks):');
  try {
    const customQuery = getBaseScanQuery()
      .where(
        col('volume').gt(5_000_000),
        col('close').gte(5),
        col('relative_volume_10d_calc').gt(1.5)
      )
      .orderBy('relative_volume_10d_calc', false)
      .limit(10);

    const { totalCount, data } = await customQuery.getScannerData(cookies);

    console.log(`Found ${totalCount} high volume stocks`);
    console.log('\nTop 10 by relative volume:');
    console.table(
      data.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        close: stock.close,
        volume: stock.volume.toLocaleString(),
        change: stock.change?.toFixed(2) + '%',
        rel_volume: stock.relative_volume_10d_calc?.toFixed(2) + 'x',
      }))
    );
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Filter for stocks with premarket activity
  console.log('\n3. Stocks with significant premarket movement:');
  try {
    const premarketQuery = getBaseScanQuery()
      .where(
        col('premarket_volume').gt(100_000),
        col('premarket_change').notEmpty(),
        col('premarket_change').gt(5) // More than 5% premarket gain
      )
      .orderBy('premarket_change', false)
      .limit(10);

    const { totalCount, data } = await premarketQuery.getScannerData();

    console.log(`Found ${totalCount} stocks with significant premarket movement`);
    console.log('\nTop 10 by premarket change:');
    console.table(
      data.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        pm_change: stock.premarket_change?.toFixed(2) + '%',
        pm_volume: stock.premarket_volume?.toLocaleString(),
        pm_gap: stock.premarket_gap?.toFixed(2) + '%',
        close: stock.close,
      }))
    );
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Gapping stocks
  console.log('\n4. Stocks gapping up significantly:');
  try {
    const gapQuery = getBaseScanQuery()
      .where(
        col('gap').gt(5), // Gap greater than 5%
        col('volume').gt(1_000_000),
        col('close').between(1, 100)
      )
      .orderBy('gap', false)
      .limit(10);

    const { totalCount, data } = await gapQuery.getScannerData();

    console.log(`Found ${totalCount} stocks with significant gaps`);
    console.log('\nTop 10 by gap percentage:');
    console.table(
      data.map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        gap: stock.gap?.toFixed(2) + '%',
        close: stock.close,
        volume: stock.volume.toLocaleString(),
        change: stock.change?.toFixed(2) + '%',
      }))
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

runBaseScan();
