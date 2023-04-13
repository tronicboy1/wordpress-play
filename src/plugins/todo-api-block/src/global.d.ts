declare global {
  interface Window {
    wp: {
      blocks: WpBlocks;
      element: WpElement;
    };
  }

  type ReactElement = any;
  interface WpBlocks {
    registerBlockType: (
      name: string,
      callbacks: {
        edit: () => ReactElement;
        save: () => ReactElement;
      }
    ) => void;
  }
  interface WpElement {
    createElement: (tag: keyof HTMLElementTagNameMap, props: any, content: string) => ReactElement;
  }
}

export {}
