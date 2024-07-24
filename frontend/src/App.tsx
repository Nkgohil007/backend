import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface Jokes {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [jokes, setJokes] = useState<Jokes[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/jokes")
      .then((r) => {
        console.log("123", r.data);
        setJokes(r.data);
      })
      .catch((e) => {
        console.log("error", e.message);
      });
  }, []);
  return (
    <>
      <h1>react</h1>
      <h2>JOKES: {jokes.length}</h2>
      {jokes &&
        jokes.map((val, index) => {
          return (
            <div key={val.id}>
              <h4>{val.title}</h4>
              <h4>{val.content}</h4>
            </div>
          );
        })}
    </>
  );
}

export default App;
