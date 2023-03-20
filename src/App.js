import './App.css';
import React, { useEffect, useState } from 'react';


// interface Data {
//   hits: [{
//     title: string
//   }]
// }

function App() {
  const [news, setNews] = useState([]);

  // const fetchJson = () => {
  //   fetch('hackernews.json')
  //   // .then((response) => {
  //   //   if (!response.ok) 
  //   //     throw new Error(`Request failed with a status of ${response.status}`);
  //   //     return response.json();
  //   // })
  //   // .then((news) => {
  //   //   setNews(news);
  //   // })
  //   // .catch(error => console.log(error.message));
  //   .then(response => {
  //     return response.json();
  //   }).then(newsItem => {
  //     setNews(newsItem);
  //   }).catch(error => console.log(error.message));
  // };

  const getData=()=>{
    fetch('./hackernews.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setNews(myJson);
      });
  }

  useEffect(()=>{
    getData()
  },[])

  return (
    <div className='container'>
      <header className='header'>
        <h1>Hacker News</h1>
        <form>
          <input type='text'/>
          <input type='submit' value=''/>
        </form>
      </header>
      <div className='results'>
        {
          news && Object.keys(news).length > 0 && news.hits.map((newsItem) =>
          <div className='news-item'>{newsItem.title}</div>)
        }
      </div>
    </div>
  );
}

export default App;
