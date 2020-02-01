import React, { PureComponent } from "react";
import Card from "../Card";
import DragDetect from "./DragDetect";
import styled from "styled-components";
import { Spring, interpolate } from "react-spring";
import PropTypes from "prop-types";

const initialState = {
  thrownCount: 0,
  thrownCards: {}
};

// added PropTypes here as constant - easier to convert to FlowTypes
// Todo: Check if it is possible to use Flow in Codesandbox?
const cardDeckPropTypes = {
  cards: PropTypes.array,
  reverse: PropTypes.bool,
  displayNoCardsLeft: PropTypes.bool,
  cardDeckId: PropTypes.number
};

class CardDeck extends PureComponent {
  state = {
    ...initialState,
    prevPropsCardDeckId: this.props.cardDeckId,
    cards: this.props.cards ? this.props.cards.reverse() : []
  };

  static defaultProps = {
    cardDeckId: Date.now(),
    displayNoCardsLeft: false
  };

  /*
  Example cards prop:
    cards: [
      {
        id: 0,
        title: "First",
        content: <PlaceholderImg />,
        // or children: 'content goes here'
      },
      {
        id: 1,
        title: "Second",
        content: "Second text",
      },
      {
        id: 2,
        title: "Third",
        content: "Third text",
      }
    ]
*/

  // Compare prevDeckID from state to received - used for resetting state
  // Note: If cardDeckId changes we're getting a new wrapper (uses key on wrapper)
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.cardDeckId !== state.prevPropsCardDeckId) {
      return {
        ...initialState,
        prevPropsCardDeckId: nextProps.cardDeckId
      };
    }
    return null;
  }

  // Used for hiding first info text
  // Note: Could be also done with thrownCards state object
  countThrown = () => {
    this.setState(state => ({
      thrownCount: state.thrownCount + 1
    }));
  };

  cardAnimationDone = (id, isThrown) => {
    this.setState(state => ({
      thrownCards: {
        ...state.thrownCards,
        [id]: isThrown
      }
    }));
  };
  // This is the render method that will be called once everything is arranged
  // depending on the API used render props, card prop or card childs
  renderCards = cardsInput => {
    const { cardDeckId, reverse, displayNoCardsLeft } = this.props;
    const { thrownCards } = this.state;
    const cards = reverse ? cardsInput.reverse() : cardsInput;
    return (
      <Wrapper key={cardDeckId}>
        <Card
          title="No cards left"
          fixed
          content=""
          isVisible={displayNoCardsLeft}
        />
        {cards.map(cardProps => (
          /* Create a drag detection component for each card */
          <DragDetect
            key={cardProps.id}
            onThrow={this.countThrown}
            remove={thrownCards && thrownCards[cardProps.id]}
          >
            {(dragHandle, isDragging, isThrown, pos) => (
              /* We're using reset & reverse so the card animates to pos. 0,0 if not thrown */
              <Spring
                native
                reset={!isDragging && !isThrown}
                reverse={!isDragging && !isThrown}
                from={{ x: 0, y: 0 }}
                to={{ ...pos, opacity: isThrown ? 0.0 : 1.0 }}
                config={{
                  tension: 140,
                  friction: 30,
                  precision: 0.05
                }}
                onRest={() =>
                  isThrown
                    ? this.cardAnimationDone(cardProps.id, isThrown)
                    : null
                }
              >
                {interpolated => (
                  <Card
                    {...cardProps}
                    dragHandle={!cardProps.fixed && dragHandle}
                    isVisible={interpolate(
                      [interpolated.opacity],
                      o => o > 0.1
                    )}
                    children={cardProps.content || cardProps.children}
                    style={{
                      opacity: interpolate([interpolated.opacity], o => o),
                      transform: interpolate(
                        [interpolated.x, interpolated.y],
                        (x, y) =>
                          `translate(${x}px, ${y}px) scale(${
                            isDragging ? 1.1 : 1
                          }, ${isDragging ? 1.1 : 1})`
                      )
                    }}
                  />
                )}
              </Spring>
            )}
          </DragDetect>
        ))}
        {this.state.thrownCount === 0 && (
          <InfoText>
            Touch + hold header & throw the card to reveal other cards.
          </InfoText>
        )}
      </Wrapper>
    );
  };

  // Render props api (exposes addCards & renderCards)
  // 1. Call addCards(array or "title", "content")
  // 2. Call and return renderCards() at the end
  // (I personally don't like it & I would use child api or cards prop)
  renderProps = () => {
    const cards = [];
    return this.props.children({
      addCards: args => {
        if (Array.isArray(args)) {
          cards.push(...args);
        } else {
          cards.push({
            ...args,
            id: cards.length
          });
        }
      },
      renderCards: () => this.renderCards(cards.reverse())
    });
  };

  // Render method is checking which api is used and renders the cards with this.renderCards
  render() {
    // const allThrown = this.state.thrownCount === cards.length; // we could use this to render something only for the last card - not used at the moment
    if (this.props.cards) {
      return this.renderCards(this.props.cards);
    } else if (typeof this.props.children === "function") {
      return this.renderProps();
    } else {
      // finally there must be card(s) as child
      if (this.props.children) {
        // We have to extract the props because we're rendering the cards later with additional props for animation & drag handling
        const cards = Array.isArray(this.props.children) // check if multiple cards
          ? this.props.children
              .flat()
              .map((child, index) => ({ ...child.props, id: index }))
              .reverse()
          : [{ ...this.props.children.props, id: 0 }];
        return this.renderCards(cards);
      } else {
        console.error(
          "No cards available to render. Please pass them as prop, render prop or children."
        );
        return null;
      }
    }
  }
}

const Wrapper = styled.div`
  font-family: sans-serif;
`;

const InfoText = styled.div`
  position: absolute;
  bottom: 10%;
  width: 100%;
  text-align: center;
`;

CardDeck.propTypes = cardDeckPropTypes;

export default CardDeck;
