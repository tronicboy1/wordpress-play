import "./wc-counter";

function registerBlock(blocks, createElement, blockEditor) {
  blocks.registerBlockType("ajm/wc-demo-block", {
    edit: () => {
      const blockProps = blockEditor.useBlockProps();
      return createElement("wc-counter", blockProps, "");
    },
    save: () => createElement("wc-counter", null, ""),
    title: "Wc Counter",
    category: "widgets",
    icon: "menu",
  });
}

registerBlock(window.wp.blocks, window.wp.element.createElement, window.wp.blockEditor);
