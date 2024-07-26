import { config } from 'dotenv';
config()

import express from 'express';
const app = express()
const port = 3000



const jokes = [
  {
    id: 1,
    title: "Why don't scientists trust atoms?",
    content: "Because they make up everything!"
  },
  {
    id: 2,
    title: "Why did the scarecrow win an award?",
    content: "Because he was outstanding in his field!"
  },
  {
    id: 3,
    title: "What do you call fake spaghetti?",
    content: "An impasta!"
  },
  {
    id: 4,
    title: "How does a penguin build its house?",
    content: "Igloos it together!"
  },
  {
    id: 5,
    title: "Why did the bicycle fall over?",
    content: "Because it was two-tired!"
  }
];

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.get('/api/jokes', (req, res) => {
  res.send(jokes)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})