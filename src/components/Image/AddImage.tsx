import React from "react";
import styled from "styled-components";
import Image, { Props as ImageProps } from "./Image";

const StyledImageWithCursor = styled(Image)`
  cursor: pointer;
`;

interface Props {
  onClick: () => void;
}

export default function AddImage({
  onClick,
  alt = "Add",
  src = "add-image.png",
}: Props & Partial<ImageProps>) {
  return <StyledImageWithCursor onClick={onClick} alt={alt} src={src} />;
}
