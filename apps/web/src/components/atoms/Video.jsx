import styled from 'styled-components';

export const VideoContainer = styled.div`
  width: var(--width);
  height: var(--height);
  background-color: #3a3a3e;
  box-sizing: border-box;
  position: relative;

  &.active {
    position: absolute;
    width: 100%;
    height: calc(100% - 4px);
    top: 0;
    z-index: 12;
  }

  .set-size {
    cursor: pointer;
    display: flex;
    justify-content: center;
    width: 32px;
    height: 32px;
    position: absolute;
    right: 12px;
    top: 12px;
    background: white;
    border-radius: 50%;
    font-size: 24px;
    line-height: 28px;
  }
`;

export const Video = styled.video`
  height: 100%;
  width: 100%;
`;
