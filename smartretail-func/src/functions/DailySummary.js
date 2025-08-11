const { app } = require('@azure/functions');
const axios = require('axios');

app.timer('DailySummary', {
  schedule: '0 0 12 * * *', // every day 12:00 UTC
  handler: async (timer, ctx) => {
    try {
      const invUrl = process.env.INVENTORY_API_URL; // http://<VM_IP>:4000
      // pull a couple of items as a demo “summary”
      const a = await axios.get(`${invUrl}/inventory/101`);
      const b = await axios.get(`${invUrl}/inventory/102`);
      ctx.log(`[TIMER] DailySummary 101=${a.data.quantity} 102=${b.data.quantity}`);
    } catch (e) {
      ctx.log.error(`[TIMER] Error: ${e.message}`);
    }
  }
});

