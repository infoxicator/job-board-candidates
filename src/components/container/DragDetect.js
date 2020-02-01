import React, { PureComponent } from "react";
import styled from "styled-components";

class DragDetect extends PureComponent {
  state = {
    isDragging: false,
    isThrown: false,
    x: 0,
    y: 0,
    startPos: 0,
    startTime: 0
  };

  THROW_THRESHOLD_SPEED = 0.3;

  handleDragStart = e => {
    e.preventDefault();
    if (!this.state.isDragging) {
      this.setState({
        isTouched: true,
        isDragging: true,
        startPos: this.pointerPos(e),
        startTime: e.timeStamp
      });
    }
  };

  handleDragEnd = e => {
    if (this.state.isDragging) {
      // calculate speed of drag -> used for throw detection
      const dt = e.timeStamp - this.state.startTime;
      const curPos = this.pointerPos(e);
      const startPos = this.state.startPos;
      const distance = Math.sqrt(
        (startPos.x - curPos.x) ** 2 + (startPos.y - curPos.y) ** 2
      );
      const speed = distance / dt;
      const isThrown = speed >= this.THROW_THRESHOLD_SPEED;

      if (isThrown) {
        this.props.onThrow();
      }

      this.setState({
        isDragging: false,
        isThrown
      });
    }
  };

  // Stop dragging if mouse left drag area?
  // Would be good but problematic if mouse not released
  // Changed mouse leave to dragEnd for now
  // --> only draw-back is that you can throw with-out mouse release
  handleMouseLeave = () => {
    this.setState({
      isDragging: false
    });
  };

  pointerPos(e) {
    return e.type.includes("touch")
      ? {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY
        }
      : {
          x: e.clientX,
          y: e.clientY
        };
  }

  handleDrag = e => {
    if (this.state.isDragging) {
      const curPos = this.pointerPos(e);
      const startPos = this.state.startPos;
      const delta = {
        x: curPos.x - startPos.x,
        y: curPos.y - startPos.y
      };
      this.setState({
        ...delta
      });
    }
  };
  // Events attached to header (only start events needed)
  dragHandle = {
    draggable: true,
    onTouchStart: this.handleDragStart,
    onMouseDown: this.handleDragStart
    //onMouseDown: this.handleDragStart
  };
  render() {
    const { children, remove } = this.props;
    const { isDragging, isThrown, x, y } = this.state;
    const trackingHandle = {
      onMouseMove: this.handleDrag,
      onTouchMove: this.handleDrag,
      onMouseUp: this.handleDragEnd,
      onTouchEnd: this.handleDragEnd,
      // Mouse leave stops dragging
      onMouseLeave: this.handleDragEnd //this.handleMouseLeave
    };

    return (
      !remove && (
        <Wrapper {...trackingHandle}>
          {children(this.dragHandle, isDragging, isThrown, { x, y })}
        </Wrapper>
      )
    );
  }
}

const Wrapper = styled.div``;

export default DragDetect;
