import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { approveImage, unapproveImage } from "../../store/rootReducer";
import Button from "../Button";

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
`;

export default function Actions() {
  const dispatch = useDispatch();
  const handleUnapproveImage = () => dispatch(unapproveImage());
  const handleApproveImage = () => dispatch(approveImage());
  return (
    <ActionsContainer>
      <Button onClick={handleUnapproveImage}>X</Button>
      <Button primary onClick={handleApproveImage}>
        ✓
      </Button>
    </ActionsContainer>
  );
}
