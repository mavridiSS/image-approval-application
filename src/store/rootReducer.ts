import { batch } from "react-redux";
import { Action, AnyAction } from "redux";
import { RandomImage } from "../types";
import { fetchImage } from "./api";

enum ActionTypes {
  SET_RANDOM_IMAGE = "SET_RANDOM_IMAGE",
  UNAPPROVE_IMAGE = "UNAPPROVE_IMAGE",
  APPROVE_IMAGE = "APPROVE_IMAGE",
  IS_LOADING = "IS_LOADING",
  SET_ERROR = "SET_ERROR",
}

export const getRandomImage = () => async (dispatch, getState: () => State) => {
  const state = getState();
  batch(() => {
    dispatch({ type: ActionTypes.IS_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });
  });

  try {
    const randomImage = await fetchImage();
    if (state.unapprovedImages.includes(randomImage.id)) {
      dispatch(getRandomImage());
      return;
    }

    dispatch({ type: ActionTypes.SET_RANDOM_IMAGE, payload: randomImage });
  } catch (err) {
    dispatch({ type: ActionTypes.SET_ERROR, payload: String(err) });
  } finally {
    dispatch({ type: ActionTypes.IS_LOADING, payload: false });
  }
};

export const unapproveImage = () => (dispatch) =>
  batch(() => {
    dispatch({ type: ActionTypes.UNAPPROVE_IMAGE });
    dispatch(getRandomImage());
  });

export const approveImage = () => (dispatch) =>
  batch(() => {
    dispatch({ type: ActionTypes.APPROVE_IMAGE });
    dispatch(getRandomImage());
  });

interface State {
  currentImage: RandomImage | null;
  approvedImages: RandomImage[];
  unapprovedImages: RandomImage["id"][];
  isLoading: boolean;
  error: string;
}

const defaultState: State = {
  currentImage: null,
  approvedImages: [],
  unapprovedImages: [],
  isLoading: false,
  error: "",
};

function rootReducer(
  state = defaultState,
  action: Action<ActionTypes> & AnyAction
): State {
  switch (action.type) {
    case ActionTypes.SET_RANDOM_IMAGE:
      return {
        ...state,
        currentImage: action.payload,
        error: "",
      };
    case ActionTypes.UNAPPROVE_IMAGE:
      return {
        ...state,
        unapprovedImages: [
          ...state.unapprovedImages,
          state.currentImage?.id as string,
        ],
      };
    case ActionTypes.APPROVE_IMAGE:
      return {
        ...state,
        approvedImages: [
          ...state.approvedImages,
          state.currentImage as RandomImage,
        ],
      };
    case ActionTypes.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export default rootReducer;
