import "./my-element";

function registerBlock(blocks: WpBlocks, element: WpElement) {
  console.log("register callback", blocks, element);
  const el = element.createElement;

  blocks.registerBlockType("create-block/todo-api-block", {
    edit: () => el("my-element", null, "Edit"),
    save: () => el("my-element", null, "Save"),
  });
}

registerBlock(window.wp.blocks, window.wp.element);

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

declare global {
  interface Window {
    wp: {
      blocks: WpBlocks;
      element: WpElement;
    };
  }
}
