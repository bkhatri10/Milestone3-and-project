const express = require("express");
const app = express();
app.use(express.json());

app.post("/order", (req, res) => {
  const { productId, quantity, correlationId } = req.body || {};
  console.log(`[SUPPLIER API] Received order: product=${productId} qty=${quantity} CID=${correlationId}`);
  res.json({ status: "Order received", correlationId });
});

app.get("/health", (_, res) => res.send("OK"));

app.listen(5000, () => console.log("Supplier API running on port 5000"));

