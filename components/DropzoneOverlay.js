import React from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core";

const Overlay = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  display: ${props => (props.show ? "block" : "none")};
  border: 2px solid ${props => props.theme.palette.primary.main};
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.4);
`;

function DropzoneOverlay({ show, children, theme }) {
  return (
    <>
      {children}
      <Overlay show={show} theme={theme} />
    </>
  );
}

export default withTheme(DropzoneOverlay);
