import styled from "styled-components";

interface HeaderProps {
  position?: "left" | "center" | "right";
  margin?: string;
}

const Header = styled.h4<HeaderProps>`
  color: blue;
  text-transform: uppercase;
  font-weight: 600;
  text-align: ${(props) => (props.position ? props.position : "center")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
`;

export default Header;
