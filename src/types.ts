export interface RandomImage {
  id: string;
  urls: {
    full: string;
    raw: string;
    small: string;
    thumb: string;
    regular: string;
  };
  altDescription: string;
}
