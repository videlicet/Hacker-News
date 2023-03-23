import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offSet, setOffSet] = useState(2);

  const getData = (searchTerm, pageNumber) => {
    if (!pageNumber) {pageNumber = 0}
    if (!searchTerm) {searchTerm = ''}
    fetch(`http://hn.algolia.com/api/v1/search?query=${searchTerm}&tags=story&page=${pageNumber}&hitsPerPage=20`)
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
          let pageNumbersArray = [];
          for (let i = -offSet; i <= offSet; i++) {
            if (pageNumber+i >= 0 && pageNumber+i <= myJson.nbPages-1 )
            pageNumbersArray.push(pageNumber+i+1);
          }
          setPageNumbers(pageNumbersArray);
        } else {
          console.log('Nothing found')
          setNews({hits: [{title: `No match for ${searchTerm}! :-(`}]});
          setPageNumbers([]);
        }
      })
      .catch((e) => {
        console.log(e.message);
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  
  useEffect((searchTerm, pageNumber) => {
    getData(searchTerm, pageNumber+1)
  },[])

  function pageChange(event) {
    console.log("the number is " + event.target.innerHTML)
    setCurrentPageNumber(Number(event.target.innerHTML));
    getData(searchText, Number(event.target.innerHTML)-1);
  }

  function handleChange(event) {
    setSearchText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = searchText; 
    getData(searchTerm, 0);
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
        {news && Object.keys(news).length > 0 && news.hits.map((newsItem) =>
          <div className='news-item'>
            <a href={newsItem.url} className='results-title' target="_blank">{newsItem.title}</a><br/>
            <span className='results-date'>{newsItem.created_at}</span>
          </div>)
        }
      </div>
     {news.nbPages !== 0 &&
     <div className='pagination-container'>
        {pageNumbers.map((number) => 
          <span className='pagination' onClick={pageChange}>{number}</span>)
        }
      </div>
     }
    </div>
  );
}

export default App;




/* To-Do */


/* Trash Can */

      /*  
function pageArrayMaker() {
let pageNumbersArray = [];
for (let i = -offSet; i <= offSet; i++) {
pageNumbersArray.push(currentPageNumber+i);
}
return pageNumbersArray;
} 
  */


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