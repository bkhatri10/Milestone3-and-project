# Milestone3-and-project

# SmartRetail – Milestone 3  
**Event-Driven Inventory Workflow**

This project extends the SmartRetail system so low-stock alerts automatically reach a supplier API, without anyone manually placing the order.

## How It Works
1. **Backend Publisher** – When a product’s stock drops below a set threshold, it sends a JSON message to an **Azure Storage Queue**.  
2. **Azure Function** – Listens to that queue, logs the event, and calls the **Supplier API** with the same `correlationId` for tracking.  
3. **Supplier API** – Receives the order, logs it, and sends a confirmation back.

The `correlationId` is used from start to finish so we can trace the whole journey in Azure Monitor.

## Tech Stack
- **Azure Storage Queue** – Event messaging
- **Azure Functions** – Serverless event handler
- **Docker** – Runs the Supplier API
- **Node.js** – Backend publisher + API
- **Azure Monitor / Log Analytics** – End-to-end tracing

## Test Flow
1. Start the Supplier API container on the VM.  
2. Run the backend publisher to send a queue message.  
3. Watch Azure Function logs for “Received event” → “Sent to supplier”.  
4. Check Supplier API logs to confirm the order arrived with the same `correlationId`.
