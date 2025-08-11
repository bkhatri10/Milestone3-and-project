SmartRetail – Final Project
Cloud-native retail workflow (Docker + Azure Functions + Queues)

Low stock → message hits Azure Storage Queue → Function App processes it → Supplier API gets an order. Plus a tiny Inventory API, an HTTP “manual reorder,” a daily summary, logs, and CI/CD.

Architecture (simple)
VM (Docker)

supplier-api → http://4.206.177.26:5000

inventory-api → http://4.206.177.26:4000

Azure

Storage Account: bidhanstorage → Queue: stock-events

Function App: func-bidhan

ProcessStockEvent (Queue trigger)

ManualReorder (HTTP trigger)

DailySummary (Timer trigger)

Application Insights + Log Analytics (end-to-end trace)

CI/CD: GitHub Actions deploys Docker to VM and Functions to Azure

(See final-project-diagram.png)

How it works
Backend/publisher (or a test script) sends { productId, quantity, correlationId, timestamp } to stock-events.

ProcessStockEvent reads the message and POSTs to supplier-api.

ManualReorder lets you POST an order on demand.

DailySummary pulls sample stock from inventory-api and logs it daily.

All logs include a correlationId (CID) so you can trace in Log Analytics.

Quick start (what I actually run)
VM (Docker)
bash
Copy code
# on the VM
cd ~/smartretail
docker compose up -d --build
docker ps  # should show supplier-api (5000) and inventory-api (4000)
Azure Function App settings (Portal → func-bidhan → Configuration → App settings)
AzureWebJobsStorage = <connection string of bidhanstorage>

SUPPLIER_API_URL = http://4.206.177.26:5000/order

INVENTORY_API_URL = http://4.206.177.26:4000

Deploy Functions
bash
Copy code
# on my laptop, in smartretail-func folder
func azure functionapp publish func-bidhan --javascript
Test it
1) Send a queue message (publisher)
bash
Copy code
node smartretail-backend/publisher.js
2) Manual reorder (HTTP)
bash
Copy code
# replace <FUNCTION_URL_WITH_CODE> from Portal → Functions → ManualReorder → Get function URL
curl -X POST "<FUNCTION_URL_WITH_CODE>" \
  -H "Content-Type: application/json" \
  -d '{"productId":101,"quantity":5}'
3) Check logs
Portal → func-bidhan → Monitoring → Log stream

VM → docker logs -n 50 <supplier-api-container>

Log Analytics (workspace) query:

kusto
Copy code
traces
| where message has "CID="
| order by timestamp desc
Security (what I did)
No secrets in code – keys live in Function App App settings.

HTTP trigger auth = function (requires ?code=).

NSG rules only open needed ports; optionally restrict to my IP.

(Optional) Key Vault: app setting value can be a Key Vault reference.
