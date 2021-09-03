import React from "react";
import styled from "styled-components";
import { RandomImage } from "../../types";
import Header from "../Header";
import Image from "../Image";
import AddImage from "../Image/AddImage";

interface Props {
  images: RandomImage[];
  onGetRandomImage: () => void;
}

const ImagesContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
  gap: 15px;
  border-radius: 10px;
`;

const ImageContainer = styled.div`
  width: max(20vw, 120px);
  height: max(10vw, 60px);
  flex-shrink: 0;
`;

const renderImages = (images: RandomImage[], onGetRandomImage) =>
  !images.length ? (
    <ImageContainer>
      <AddImage onClick={onGetRandomImage} />
    </ImageContainer>
  ) : (
    images.map((image) => (
      <ImageContainer key={image.id}>
        <Image alt={image.altDescription} src={image.urls.small} />
      </ImageContainer>
    ))
  );

export default function ApprovedImages({ images, onGetRandomImage }: Props) {
  return (
    <div>
      <Header
        margin="0 0 25px"
        position="left"
      >{`Approved Images (${images.length})`}</Header>
      <ImagesContainer>
        {renderImages(images, onGetRandomImage)}
      </ImagesContainer>
    </div>
  );
}
