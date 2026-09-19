
import express from 'express';

const app = express();
app.use(express.json());

app.get("/api/item", (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(3000, ()=>{
  console.log("server is running at localhost:3000")
})

