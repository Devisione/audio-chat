import styled from 'styled-components';

export const Gallery = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: calc(var(--width) * var(--cols));

  .user-name {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
  }
`;
