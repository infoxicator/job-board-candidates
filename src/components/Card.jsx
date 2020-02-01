import React from "react";
import styled from "styled-components";
import { animated } from "react-spring";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Scrollbars from "react-custom-scrollbars";

const DEFAULT_IMAGE = "https://picsum.photos/800/100/?random/";

export default ({
  dragHandle,
  fixed,
  id = 0,
  title,
  image,
  isVisible,
  style,
  children
}) =>
  isVisible ? (
    <Wrapper style={style} raised>
      <Header {...dragHandle} title={title} fixed={fixed && fixed.toString()} />
      {/* Note: Added id to the CardMedia image url to avoid caching - not used by the picsum api. */}
      <CardMedia src={image || DEFAULT_IMAGE + id} component="img" />
      <CardContent>
        <Scrollbars autoHeight>{children}</Scrollbars>
      </CardContent>
    </Wrapper>
  ) : null;

const Header = styled(CardHeader)`
  cursor: ${props => (!props.fixed ? "pointer" : "auto")};
`;

const MainContent = styled.div`
  padding: 15px;
`;

const Wrapper = animated(styled(Card).attrs({
  //draggable: true
})`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 60%;
  height: 70vh;
  transform-origin: 50% 50%;
  overflow: hidden;
`);
