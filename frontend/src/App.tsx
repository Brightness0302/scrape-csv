import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { response } from 'express';

function App() {
  const [data, setData] = useState([]);

  const getAllRows = async () => {
    let count = 0;
    try {
      const resCount = await axios.post('http://localhost:5000/getCount')
      count = resCount.data.length
      for (let index=0;index<count;index++) {
        const resRow = await axios.post(`http://localhost:5000/getRow/${index}`)
        console.log(resRow.data)
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <button onClick={getAllRows}>Get CSV Files</button>
    </div>
  );
}

export default App;
