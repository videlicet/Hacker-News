import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([[],[],[]]);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offSet, setOffSet] = useState(1);


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
          console.log(pageNumbers);
          let pageNumbersArray = [];
          for (let i = -offSet; i <= offSet; i++) {
            if (pageNumber+i >= 0 && pageNumber+i <= myJson.nbPages-1 )
            pageNumbersArray.push(pageNumber+i+1);
          }
          if (pageNumbersArray[0] == 2) {
            pageNumbersArray.unshift(1);
          }
          let firstPage = 1; 
          let lastPage = myJson.nbPages > 0  ? myJson.nbPages-1 : 0;
          setPageNumbers([firstPage, pageNumbersArray, lastPage]);
        } else {
          console.log('Nothing found')
          setNews({hits: [{title: `No match for ${searchTerm}! :-(`}]});
          setPageNumbers([[],[],[]]);
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
        {pageNumbers[1][0] >= 3 && <span className='pagination' onClick={pageChange}>{pageNumbers[0]}</span>}
        {pageNumbers[1][0] >= 3 && ' · · · '}
        {pageNumbers[1].map((number) => 
          <span className='pagination' onClick={pageChange}>{number}</span>)
        }
        {pageNumbers[2] !== 0 && pageNumbers[1][pageNumbers[1].length-1] < 50 && '· · ·'}
        {pageNumbers[2] > 0 && pageNumbers[1][pageNumbers[1].length-1] < 50 && <span className='pagination' onClick={pageChange}>{pageNumbers[2]}</span>}
      </div>
     }
    </div>
  );
}

export default App;


/* To-Do */
/*      
- bei Seite 48 soll 49 nicht doppelt stehen (analog zur Regel bei erster Seite);
- bei klick auf 49 sieht man seite 50 und kann auch auf sie klicken;

*/