import "./my-element";

function registerBlock(blocks: WpBlocks, element: WpElement) {
  const el = element.createElement;
  blocks.registerBlockType("create-block/todo-api-block", {
    edit: () => el("my-element", null, ""),
    save: () => el("my-element", null, "Save"),
  });
}

registerBlock(window.wp.blocks, window.wp.element);
