import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = (searchTerm) => {
    fetch(`http://hn.algolia.com/api/v1/search?query=${searchTerm}`)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        if (myJson.hits.length !== 0) {
          setNews(myJson);
        } else {
          console.log('Nothing found')
          setNews({hits: [{title: `No match for ${searchTerm}! :-(`}]});
        }
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect((searchTerm)=>{
    getData(searchTerm)
  },[])

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = searchText; 
    getData(searchTerm);
    setSearchText('');
  }

  return (
    <div className='container'>
      <header className='header'>
        <h1>Hacker News</h1>
        <form onSubmit={handleSubmit}>
          <input type='text' value={searchText} onChange={handleChange} />
          <input type='submit' value='' />
        </form>
      </header>
      <div className='results'>
        {loading && <div>Loading ...</div>}
        {error && (<div>{`There is a problem fetching the post data - ${error}`}</div>)}
        {
          news && Object.keys(news).length > 0 && news.hits.map((newsItem) =>
          <div className='news-item'>
            <a href={newsItem.url} className='results-title' target="_blank">{newsItem.title}</a><br/>
            <span className='results-date'>{newsItem.created_at}</span>
          </div>)
        }
      </div>
    </div>
  );
}

export default App;


/* To-Do */

/* Trash Can */

// interface Data {
//   hits: [{
//     title: string
//   }]
// }

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

// fetch('./hackernews.json'
// ,{
//   headers : { 
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//    }
// }
//)

// const filteredHits = myJson.hits.filter((newsItem) => newsItem.title.match(searchTerm) || newsItem.title.toLowerCase().match(searchTerm.toLowerCase()));
// if (filteredHits.length !== 0) {
//   myJson.hits= filteredHits;
//   setNews(myJson);
// } else {

// }