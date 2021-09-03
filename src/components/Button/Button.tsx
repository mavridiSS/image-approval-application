import styled from "styled-components";

interface ButtonProps {
  readonly primary?: boolean;
}

const Button = styled.button<ButtonProps>`
  cursor: pointer;
  height: 60px;
  width: 200px;
  color: white;
  border-radius: 30px;
  border: none;
  font-size: x-large;
  background: ${(props) => (props.primary ? "blue" : "#833B2B")};
`;

export default Button;
