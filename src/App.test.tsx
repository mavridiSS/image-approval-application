import React, { ReactNode } from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render as rtlRender, screen, fireEvent } from "@testing-library/react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./store/rootReducer";
import { RootState } from "./store";
import App from "./App";
import { UNSPLASH_API } from "./store/api";
import imageMock from "../test-utils/image-mock.json";

// We don't inject the persistor here so omit it
const defaultState: Omit<RootState, "_persist"> = {
  currentImage: null,
  approvedImages: [],
  unapprovedImages: [],
  isLoading: false,
  error: "",
};

const server = setupServer(
  rest.get(`${UNSPLASH_API}/photos/random`, (req, res, ctx) => {
    return res(ctx.json(imageMock));
  })
);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

function render(
  ui,
  {
    preloadedState = defaultState,
    store = createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(thunkMiddleware)
    ),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children?: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

describe("Static properties", () => {
  beforeEach(() => {
    render(<App />);
  });
  test("renders correct number of approved images initially", () => {
    const element = screen.getByText("Approved Images (0)");
    expect(element).toBeInTheDocument();
  });

  test("renders correct footer text initially", () => {
    screen.getByText((content, node) => {
      const hasText = (node) =>
        node.textContent ===
        "Click on the+in order to get image recommendations";
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from((node as Element).children).every(
        (child) => !hasText(child)
      );

      return nodeHasText && childrenDontHaveText;
    });
  });

  test("renders 2 default images initially", () => {
    const elements = screen.getAllByAltText("Add");
    expect(elements).toHaveLength(2);
  });
});

describe("Fetching a random image functionality", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("clicking on first default image should load a random image", async () => {
    const elements = screen.getAllByAltText("Add");
    fireEvent.click(elements[0]);
    expect(
      await screen.findByAltText("woman in white hijab smiling")
    ).toBeInTheDocument();
  });

  test("clicking on second default image should load a random image", async () => {
    const elements = screen.getAllByAltText("Add");
    fireEvent.click(elements[1]);
    expect(
      await screen.findByAltText("woman in white hijab smiling")
    ).toBeInTheDocument();
  });

  test("when a random image is loaded we should see the action buttons", async () => {
    const elements = screen.getAllByAltText("Add");
    fireEvent.click(elements[0]);
    expect(
      await screen.findByRole("button", { name: "X" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "✓" })
    ).toBeInTheDocument();
  });

  test("should render a loader when fetching a image", async () => {
    server.use(
      rest.get(`${UNSPLASH_API}/photos/random`, (req, res, ctx) => {
        return res(ctx.json(imageMock), ctx.delay(150));
      })
    );
    const elements = screen.getAllByAltText("Add");
    fireEvent.click(elements[0]);
    expect(screen.getByTestId("Loader")).toBeInTheDocument();
  });

  test("should render an error message when we cannnot get an image", async () => {
    server.use(
      rest.get(`${UNSPLASH_API}/photos/random`, (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ errors: ["OAuth. The access token is invalid."] })
        );
      })
    );
    const elements = screen.getAllByAltText("Add");
    fireEvent.click(elements[0]);
    expect(
      await screen.findByText("Error: OAuth. The access token is invalid.")
    ).toBeInTheDocument();
  });
});

describe("Approve/Reject random image", () => {
  beforeEach(() => {
    render(<App />, {
      preloadedState: {
        ...defaultState,
        currentImage: {
          id: "12345",
          urls: {
            full: "full",
            thumb: "thumb",
            small: "small",
            regular: "regular",
            raw: "raw",
          },
          altDescription: "test_alt_description",
        },
      },
    });
  });
  test("when we approve an image to be added to the approved images", async () => {
    const approveButton = screen.getByRole("button", { name: "✓" });
    fireEvent.click(approveButton);
    expect(screen.getByText("Approved Images (1)")).toBeInTheDocument();
    expect(await screen.findAllByAltText("test_alt_description")).toHaveLength(
      1
    );
  });
  test("when we approve an image it should load another one", async () => {
    const approveButton = screen.getByRole("button", { name: "✓" });
    fireEvent.click(approveButton);
    expect(
      await screen.findByAltText("woman in white hijab smiling")
    ).toBeInTheDocument();
  });

  test("when we reject an image it should load another one and not update approved images", async () => {
    const rejectButton = screen.getByRole("button", { name: "X" });
    fireEvent.click(rejectButton);
    expect(screen.getByText("Approved Images (0)")).toBeInTheDocument();
    expect(
      await screen.findByAltText("woman in white hijab smiling")
    ).toBeInTheDocument();
  });

  test("when we reject an image and it loads the same one we should fetch for another one", async () => {
    server.use(
      rest.get(`${UNSPLASH_API}/photos/random`, (req, res, ctx) => {
        return res(
          ctx.json({
            ...imageMock,
            id: "12345", // Same id as the currently loaded image
          })
        );
      })
    );
    const approveButton = screen.getByRole("button", { name: "X" });
    fireEvent.click(approveButton);
    expect(screen.queryByAltText("test_alt_description")).toBeNull();
    expect(screen.getByTestId("Loader")).toBeInTheDocument();
    server.use(
      rest.get(`${UNSPLASH_API}/photos/random`, (req, res, ctx) => {
        return res(ctx.json(imageMock));
      })
    );
    expect(
      await screen.findByAltText("woman in white hijab smiling")
    ).toBeInTheDocument();
  });
});
