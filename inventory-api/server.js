const express = require('express');
const app = express();
app.use(express.json());

let stock = { "101": 8, "102": 15 }; // mock

app.get('/inventory/:id', (req,res)=>{
  const id = req.params.id;
  res.json({ productId: id, quantity: stock[id] ?? 0 });
});

app.post('/inventory/:id/adjust', (req,res)=>{
  const id = req.params.id;
  const { delta } = req.body || { delta: 0 };
  stock[id] = (stock[id] ?? 0) + Number(delta);
  res.json({ ok:true, productId:id, quantity:stock[id] });
});

app.listen(4000, ()=>console.log('Inventory API on 4000'));

