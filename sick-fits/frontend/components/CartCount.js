import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

const StyledCount = styled.div`
  background-color: var(--red);
  color: white;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 4px;
  border-radius: 50%;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const AnimatedCount = styled.div`
  position: relative;
  .count {
    display: block;
    background-color: blue;
    position: relative;
    transition: transform 0.4s;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
    background-color: green;
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    position: absolute;
    top: 0;
    background-color: yellow;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

export const CartCount = ({ count }) => (
  <AnimatedCount>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        timeout={{ exit: 900, enter: 900 }}
        classNames="count"
        className="count"
        key={count}
      >
        <StyledCount>{count}</StyledCount>
      </CSSTransition>
    </TransitionGroup>
  </AnimatedCount>
);
