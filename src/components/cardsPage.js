import React, { useEffect, useState } from 'react';
import Swipeable from "react-swipy"
import {FINDMATCH, ADDTOMATCHLIST, ADDTOBLACKLIST} from '../apicall'
import Card from "./card/Card";
import Button from "./card/Button";
import '../style/cards.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck,faTimes} from '@fortawesome/free-solid-svg-icons'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { tsPropertySignature } from '@babel/types';

const wrapperStyles = {position: "relative", width: "350px", height: "500px"};

const checkIcon = <FontAwesomeIcon icon={faCheck} />
const timesIcon = <FontAwesomeIcon icon={faTimes} />


const actionsStyles = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 12,
};

function CardsPage(props){
  let [cards, setCards] = useState([]);
  let [similarCourses, setSimilarCourses] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if(loading){
      getMatches();
    }
  });

  const httpLink = createHttpLink({
    uri: 'https://classify-graphql-api.herokuapp.com/graphql',
    headers: {
        "Content-Type": "application/json",
    }
  })

  const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache()
  })

  const getMatches = async () =>{

    let data = await client
      .query({
          query: FINDMATCH,
          variables: {
              "id": parseInt(props.profile.id)
            }
      });
    setCards(data.data.findMatches)
    calcClasses();
    
  }

  const calcClasses = async () => {

    let similarCounts = []
   
      let count =0; 
      for(let i =0; i<cards.length;i++){ //each user
        for(let j=0; j<cards[i].courses.length; j++){ // each users course
          for(let x=0; x<props.profile.courses.length;x++){ //each profile course
            if(cards[i].courses[j].id == props.profile.courses[x].id){
              count++;
            }
          }
        }

        similarCounts.push(count);
        count = 0;
     }

     await setSimilarCourses(similarCounts);
     setLoading(false);
  }

  const addToMatchlist = async () =>{
    let data = await client 
        .mutate({
          mutation: ADDTOMATCHLIST,
          variables: {
            "profileId": parseInt(props.profile.id),
            "userId": parseInt(cards[0].id)
          }
        });
    console.log(data);
  }

  const addToBlacklist = async () =>{
    let data = await client
        .mutate({
          mutation: ADDTOBLACKLIST,
          variables: {
            "profileId": parseInt(props.profile.id),
            "userId": parseInt(cards[0].id)
          }
        });
    console.log(data);
  }

  const remove = () => {
    setCards(cards.slice(1, cards.length));
    setSimilarCourses(similarCourses.slice(1, similarCourses.length));
  };

  return (
    <div className="cards-page">
      {loading ? 
          <span>Loading...</span>
          : 
          <div className="card-container">
                <div style={wrapperStyles}>
                {cards.length > 0 ? (
                    <div style={wrapperStyles}>
                    <Swipeable
                        buttons={({left, right}) => (
                        <div style={actionsStyles}>
                            <Button id="card-reject-button" onClick={()=>{left(); console.log("left"); addToBlacklist()}}>{timesIcon}</Button>
                            <Button id="card-accept-button" onClick={()=>{right(); console.log("right"); addToMatchlist()}}>{checkIcon}</Button>
                        </div>
                        )}
                       // onSwipe={"left", 0, console.log("left")}
                        onAfterSwipe={remove}    
                    >
                        <Card>
                          {<div className="card"> 
                          <img className="profile-page-user-image" src="./profile.png"></img>
                          <h1>{cards[0].firstName} {cards[0].lastName}</h1>
                          <p>"{cards[0].biography}"</p>
                          <p>Number of matching courses: <b>{similarCourses[0]}</b></p>
                          </div>}
                        </Card>

                    </Swipeable>
                    {cards.length > 1 && 
                    
                    <Card zIndex={-1}>
                      {<div className="card"> 
                      <img className="profile-page-user-image" src="./profile.png"></img>
                      <h1>{cards[1].firstName} {cards[1].lastName}</h1>
                      <p>"{cards[1].biography}"</p>
                      <p>Number of matching courses: <b>{similarCourses[1]}</b></p>
                      </div>}
                    </Card>

                    }
                    </div>
                    ) : (
                    ""
                    )}
                    <Card zIndex={-2}>No More Users</Card>
                </div>
        </div>
      }
    </div>
  )
}

export default CardsPage;