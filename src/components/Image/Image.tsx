import React from "react";
import styled from "styled-components";

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

export interface Props {
  src: string;
  alt: string;
}

export default function Image({
  alt,
  src,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & Props) {
  return <StyledImage src={src} alt={alt} {...props} />;
}
