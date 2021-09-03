import React from "react";
import styled from "styled-components";

const StyledHeader = styled.h3`
  color: #606060;
`;

const StyledSpan = styled.span`
  color: #e3e7f0;
  font-size: 25px;
  margin: 0 3px;
`;

export default function FooterInfo() {
  return (
    <StyledHeader>
      Click on the
      <StyledSpan>+</StyledSpan>
      in order to get image recommendations
    </StyledHeader>
  );
}
