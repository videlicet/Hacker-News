import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [news, setNews] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([[],[],[]]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchTag, setSearchTag] = useState('story');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offSet, setOffSet] = useState(1);


  const getData = (searchTerm, pageNumber, tag) => {
    let query;
    if (!pageNumber) {pageNumber = 0}
    if (!searchTerm) {searchTerm = ''}
    switch(tag) {
      case false:
        tag = 'story';
        query = `search?query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
        break;
      case 'comment':
        query = `search?query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
        break;
      case 'story-author':
        query = `search?tags=story,author_${searchTerm}&page=${pageNumber}`;
      break;
      case 'comment-author':
        query = `search?tags=comment,author_${searchTerm}&page=${pageNumber}`;
      break;
      default:
        tag = 'story';
        query = `search?query=${searchTerm}&tags=${tag}&page=${pageNumber}`;
    } 
    fetch(`http://hn.algolia.com/api/v1/${query}&hitsPerPage=20`)
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
          if (pageNumbersArray[0] == 2) {
            pageNumbersArray.unshift(1);
          }
          if (pageNumbersArray[pageNumbersArray.length-1] == 49) {
            pageNumbersArray.push(50);
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
    console.log("the number is " + event.target.innerHTML)
    setCurrentPageNumber(Number(event.target.innerHTML));
    getData(searchText, Number(event.target.innerHTML)-1);
  }

  function handleTextChange(event) {
    setSearchText(event.target.value);
  }

  function handleTagChange(event) {
    setSearchTag(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = searchText;
    const searchTagHere = searchTag;
    getData(searchTerm, 0, searchTagHere);
  }

  return (
    <div className='container'>
      <header className='header'>
        <h1>Hacker News</h1>
        <div>
        </div>
        <form onSubmit={handleSubmit}>
          <select name='tag' onChange={handleTagChange}>
            <option value='story'>story</option>
            <option value='comment'>comment</option>
            <option value='story-author'>stories by author</option>
            <option value='comment-author'>comments by author</option>
          </select> 
          <input type='text' value={searchText} onChange={handleTextChange} />
          <input type='submit' value='' />
        </form>
      </header>
      <div className='results'>
        {loading && <div>Loading ...</div>}
        {error && (<div>{`There is a problem fetching the post data - ${error}`}</div>)}
        {news && Object.keys(news).length > 0 && news.hits.map((newsItem) =>
          <div className='news-item'>
            <div className='news-item-header'>
              <a href={newsItem.url} className='results-title' target="_blank">{newsItem.title}</a>
              <span className='results-date'>
              {`${newsItem.created_at.substring(0, 4)}/${newsItem.created_at.substring(5, 7)}/${newsItem.created_at.substring(8, 10)}`}
              </span>
            </div>
            <p className='author'>{newsItem.author}</p>
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
- pagination works strangely when searching by sth else than story

*/