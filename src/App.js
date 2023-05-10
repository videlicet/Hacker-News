import './App.css';
import React, { useEffect, useState } from 'react';
import { Markup } from 'interweave';

function App() {
  const [news, setNews] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([[],[],[]]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchTag, setSearchTag] = useState('story');
  const [searchResultsPerPage, setSearchResultsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offSet, setOffSet] = useState(1);

  const getData = (searchTerm, pageNumber, tag, resultsPerPage) => {
    setLoading(true);
    setNews([]);
    let query;
    if (!pageNumber) {pageNumber = 0}
    if (!searchTerm) {searchTerm = ''}
    if (!resultsPerPage) {resultsPerPage = 20}
    switch(tag) {
      case false:
        tag = 'story';
        query = `query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
        break;
      case 'comment':
        query = `query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
        break;
      case 'story-author':
        query = `tags=story%2Cauthor_${searchTerm}&page=${pageNumber}`;
        break;
      case 'comment-author':
        query = `tags=comment%2Cauthor_${searchTerm}&page=${pageNumber}`;
        break;
      default:
        tag = 'story';
        query = `query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
    } 
    fetch(`https://hn.algolia.com/api/v1/search_by_date?${query}&hitsPerPage=${resultsPerPage}`)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson)
        if (myJson.hits.length !== 0) {
          setNews(myJson);
          let pageNumbersArray = [];
          for (let i = -offSet; i <= offSet; i++) {
            if (pageNumber+i >= 0 && pageNumber+i <= myJson.nbPages-1 )
            pageNumbersArray.push(pageNumber+i+1);
          }
          if (pageNumbersArray[0] == 2) {
            pageNumbersArray.unshift(1);
          }
          if (pageNumbersArray[pageNumbersArray.length-1] == pageNumbers[2]-1) {
            pageNumbersArray.push(pageNumbers[2]);
          }
          let firstPage = 1; 
          let lastPage = myJson.nbPages > 0  ? myJson.nbPages : 0;
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
    setCurrentPageNumber(Number(event.target.innerHTML));
    getData(searchText, Number(event.target.innerHTML)-1, searchTag);
  }

  function handleTextChange(event) {
    setSearchText(event.target.value);
  }

  function handleTagChange(event) {
    setSearchTag(event.target.value);
  }

  function handleResultsPerPageChange(event) {
    getData(searchText, 0, searchTag, event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    getData(searchText, 0, searchTag, searchResultsPerPage);
  }

  return (
    <div className='container'>
      <header className='header'>
        <h1>Hacker News</h1>
        <form onSubmit={handleSubmit}>
          <select name='tag' onChange={handleTagChange}>
            <option value='story'>story</option>
            <option value='comment'>comment</option>
            <option value='story-author'>stories by author</option>
            <option value='comment-author'>comments by author</option>
          </select> 
          <input type='text' value={searchText} onChange={handleTextChange} />
          <select className='results-per-page' name='results-per-page' onChange={handleResultsPerPageChange}>
            <option value='10'>10</option>
            <option value='20' selected='selected'>20</option>
            <option value='30'>30</option>
            <option value='50'>50</option>
          </select> 
          <input type='submit' value='' />
        </form>
      </header>
      <div className='results'>
        {loading && <div className='loading'>Loading ...</div>}
        {error && (<div>{`There is a problem fetching the post data - ${error}`}</div>)}
        {news && Object.keys(news).length > 0 && news.hits.map((newsItem) =>
          <div className='news-item'>
            <div className='news-item-header'>
              {newsItem.title && <a href={newsItem.url} className='results-title' target="_blank">{newsItem.title}</a>}
              {newsItem.comment_text && <div className='results-title'>{<Markup content={newsItem.comment_text}/>}</div>}
              <p className='author'>{newsItem.author}</p>
            </div>
            <div className='results-date'>
                {newsItem.created_at && `${newsItem.created_at.substring(0, 4)}/${newsItem.created_at.substring(5, 7)}/${newsItem.created_at.substring(8, 10)}`}
                <br/>
                {newsItem.created_at && `${newsItem.created_at.substring(11, 16)} UTC`}
            </div>
          </div>)
        }
      </div>
     {news.nbPages !== 0 &&
     <div className='pagination-container'>
        {pageNumbers[1][0] >= 3 && <span className='pagination' onClick={pageChange}>{pageNumbers[0]}</span>}
        {pageNumbers[1][0] >= 3 && ' · · · '}
        {pageNumbers[1].map((number) => 
          <span id={currentPageNumber == number ? 'current-page' : ''} className='pagination' onClick={pageChange}>{number}</span>)
        }
        {pageNumbers[2] !== 0 && pageNumbers[1][pageNumbers[1].length-1] < pageNumbers[2] && '· · ·'}
        {pageNumbers[2] > 0 && pageNumbers[1][pageNumbers[1].length-1] < pageNumbers[2] && <span className='pagination' onClick={pageChange}>{pageNumbers[2]}</span>}
      </div>
     }
    </div>
  );
}

export default App;


/* To-Do */
/*      
- make author search non sensitive
*/