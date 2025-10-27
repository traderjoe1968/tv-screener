/**
 * Simple script to run the base scan and output results
 */

import { baseScan } from './base_scan';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  try {
    console.log('Running base scan...\n');

    // Get session ID from environment
    const cookies = process.env.TVSESSIONID
      ? { sessionid: process.env.TVSESSIONID }
      : undefined;

    if (cookies) {
      console.log('Using authenticated session for real-time data\n');
    } else {
      console.log('No session ID found - using delayed data\n');
    }

    const { totalCount, data } = await baseScan('america', cookies);

    console.log(`Found ${totalCount} active US stocks\n`);
    console.log(`Sample of first 20 results:\n`);

    // Display formatted output
    data.slice(0, 20).forEach((stock, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${stock.symbol.padEnd(15)} ${stock.name}`);
      console.log(`    Price: $${stock.close?.toFixed(2) || 'N/A'}  |  Volume: ${stock.volume?.toLocaleString() || 'N/A'}`);
      console.log(`    Change: ${stock.change?.toFixed(2) || 'N/A'}%  |  Rel Vol: ${stock.relative_volume_10d_calc?.toFixed(2) || 'N/A'}x`);
      console.log(`    Sector: ${stock.sector || 'N/A'}  |  Industry: ${stock.industry || 'N/A'}`);

      if (stock.premarket_change && Math.abs(stock.premarket_change) > 0) {
        console.log(`    Premarket: ${stock.premarket_change.toFixed(2)}%  |  PM Vol: ${stock.premarket_volume?.toLocaleString() || 'N/A'}`);
      }

      console.log('');
    });

    console.log(`Total active stocks in database: ${totalCount}`);
  } catch (error) {
    console.error('Error running base scan:', error);
    process.exit(1);
  }
}

main();
