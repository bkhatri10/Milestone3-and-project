require('dotenv').config();
const { QueueClient } = require("@azure/storage-queue");
const { v4: uuidv4 } = require("uuid");

async function sendStockEvent(productId, quantity) {
  const correlationId = uuidv4();
  const payload = JSON.stringify({ productId, quantity, correlationId, timestamp: new Date().toISOString() });

  const queueClient = new QueueClient(process.env.AZURE_QUEUE_CONN, process.env.QUEUE_NAME);
  await queueClient.sendMessage(payload); // no base64 needed; SDK handles it
  console.log(`[BACKEND] Event sent: ${payload}`);
}

(async () => {
  // simulate low stock
  await sendStockEvent(101, 2);
})();
