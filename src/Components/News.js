import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    

const capitalizeFirstLetter = (string)=>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
      const updateNews = async() =>{
          props.setProgress(10);
        let url = `https://newsapi.org/v2/top-headlines?country=in&page=${page}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}`;
        setLoading(true);
         let data = await fetch(url);
         props.setProgress(30);
        let parseData = await data.json();
        props.setProgress(70);
        console.log(parseData);
        setArticles(parseData.articles);
        setTotalResults(parseData.totalResults);
        setLoading(false);
        props.setProgress(100);
      }

      useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews();
      }, [] )// eslint-disable-line react-hooks/exhaustive-deps
    

    
    const fetchMoreData = async() => {

        let url = `https://newsapi.org/v2/top-headlines?country=in&category=${props.category}&apiKey=31f84d2eadaa4b02b4712dc1416936cb&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page+1);
        setLoading(true);
        let data = await fetch(url);
        let parseData = await data.json();
        console.log(parseData);
        setArticles(articles.concat(parseData.articles));
        setTotalResults(parseData.totalResults);
        setLoading(false);
       
        
      };
    
    
        console.log("render");
        return (
            <>
            <h1 className = "text-center" style = {{margin : "35px 0px", marginTop : "90px"}}>NewsMonkey-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading&&<Spinner/>} 

           <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
        <div className='container'>
                <div className = "row">
                {articles.map((element)=>{
                    return <div className = "col-md-4" key = {element.url}>
                    <NewsItem  title = {element.title?element.title.slice(0,45):""} description = {element.description?element.description.slice(0,88):""} imageUrl = {element.urlToImage} newsUrl = {element.url} author = {!element.author ? "unknown" : element.author} date = {element.publishedAt} source = {element.source.name}/>

                    </div>
                })}
                    
                    
                </div> 
                </div>

                </InfiniteScroll>

               {/* <div className = "container d-flex justify-content-between">
                <button type="button" disabled = {this.state.page < 1} className="btn btn-dark" onClick = {this.handlePrevClick}>&larr; Previous</button>
                <button type="button" disabled = {this.state.page+ 1 > Math.ceil(this.state.totalResults/props.pageSize)} className="btn btn-dark" onClick = {this.handleNextClick}>Next &rarr;</button>
                </div>
                */}

                
            
               
         </>   
        );
    }

News.defaultProps = {
    country : "in",
    pageSize : 8
}
News.propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number
}
export default News;