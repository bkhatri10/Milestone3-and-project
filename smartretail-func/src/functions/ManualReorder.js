const { app } = require('@azure/functions');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

app.http('ManualReorder', {
  methods: ['POST'],
  authLevel: 'function', // use a function key
  handler: async (req, ctx) => {
    const { productId, quantity } = await req.json();
    const correlationId = uuidv4();
    ctx.log(`[HTTP] Manual reorder CID=${correlationId} product=${productId} qty=${quantity}`);

    // call Supplier API directly
    const supplierUrl = process.env.SUPPLIER_API_URL;
    const resp = await axios.post(supplierUrl, { productId, quantity, correlationId });
    return { jsonBody: { ok:true, correlationId, supplier: resp.data } };
  }
});
