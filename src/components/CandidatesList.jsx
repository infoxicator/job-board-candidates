import React, { Component } from "react";
import ReactDOM from "react-dom";
import Card from "./Card";
import CardDeck from "./container/CardDeck";
import PlaceholderImg from "./PlaceholderImg";

import "normalize.css";
// import "./styles.css";

export default class CandidatesList extends Component {
  cards = [
    { id: 0, title: "First", content: "Passed with cards prop" },
    {
      id: 1,
      title: "Second",
      content: (
        <div>
          Also components are possible: <br />
          <PlaceholderImg />
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
        </div>
      )
    }
  ];
  state = {
    id: 0
  };
  reset = () => {
    this.setState(state => ({
      id: state.id + 1
    }));
  };
  render() {
    return (
      <div className="App">
        <button onClick={this.reset}>Reset</button>
        {/* 
          CardDeck component can use an id for resetting the deck.
          Also cards prop or render props or Card components can be used to initialize cards
          Order: First defined is top-most card in deck - can be reversed by `reverse` prop.
        */}
        <CardDeck
          cardDeckId={this.state.id}
          /*cards={this.cards}*/

          /*reverse*/
          /*displayNoCardsLeft*/
        >
          {/*({ addCards, renderCards }) => {
            addCards(this.cards);
            addCards({ title: "Third", content: "Render props api" });
            return renderCards();
          }*/}
          <Card title="First">Content of card 1</Card>
          <Card title="Second">
            <p>Content of card 2</p>
            <PlaceholderImg />
          </Card>

          {/* 
          nested deck not supported yet - 
          would require a check & handling in CardDeck render
          <CardDeck key="Nested">
            <Card title="Nested deck 1" />
            <Card title="Nested deck 2">Don't use a final card</Card>
          </CardDeck>
          */}

          {Array.from(Array(4).keys()).map(index => (
            <Card title={["Third", "Fourth", "Fifth", "Sixth"][index]}>
              Content of card {index + 3}
            </Card>
          ))}
          <Card title="Final" fixed>
            Last card - fixed card (no dragging)
          </Card>
        </CardDeck>
      </div>
    );
  }
}
