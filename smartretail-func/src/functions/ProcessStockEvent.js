const { app } = require('@azure/functions');
const axios = require('axios');

app.storageQueue('ProcessStockEvent', {
  queueName: 'stock-events',
  connection: 'AzureWebJobsStorage',
  handler: async (queueItem, context) => {
    let data;
    try { data = JSON.parse(queueItem); }
    catch { context.log.error('[FUNCTION] Invalid message JSON'); return; }

    const { productId, quantity, correlationId } = data || {};
    context.log(`[FUNCTION] Received event CID=${correlationId} product=${productId} qty=${quantity}`);

    const url = process.env.SUPPLIER_API_URL || 'http://4.206.177.26:5000/order';
    try {
      const res = await axios.post(url, data, { timeout: 5000 });
      context.log(`[FUNCTION] Sent to supplier → Response CID=${res.data?.correlationId || 'n/a'}`);
    } catch (e) {
      context.log.error(`[FUNCTION] Error calling supplier API: ${e.message}`);
    }
  }
});

