interface WpBlocks {}
interface WpElement {}

declare global {
  interface Window {
    wp: {
      blocks: WpBlocks;
      element: WpElement;
    };
  }
}
