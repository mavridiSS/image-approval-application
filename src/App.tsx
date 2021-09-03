import React from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Actions from "./components/Actions/Actions";
import Alert from "./components/Alert";
import ApprovedImages from "./components/ApprovedImages";

import Divider from "./components/Divider";
import FooterInfo from "./components/FooterInfo";
import Header from "./components/Header";
import Image from "./components/Image";
import AddImage from "./components/Image/AddImage";
import Loader from "./components/Loader/";
import { useAppSelector } from "./store";
import { getRandomImage } from "./store/rootReducer";

function App() {
  const { isLoading, error, currentImage, approvedImages } = useAppSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  const handleGetRandomImage = () => dispatch(getRandomImage());

  return (
    <div className="App">
      <Header margin="25px 0 0">Image Approval Application</Header>
      <Divider />
      <div className="container">
        <ApprovedImages
          images={approvedImages}
          onGetRandomImage={handleGetRandomImage}
        />
        <Divider />
        <div className="image-container">
          {isLoading ? (
            <Loader data-testid="Loader" />
          ) : currentImage ? (
            <Image
              alt={currentImage?.altDescription as string}
              src={currentImage?.urls.regular as string}
            />
          ) : (
            <AddImage onClick={handleGetRandomImage} />
          )}
        </div>
        {error && <Alert>{error}</Alert>}
        <Divider />
        {currentImage ? <Actions /> : <FooterInfo />}
      </div>
    </div>
  );
}

export default App;
