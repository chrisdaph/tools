function initFormattingToolbar(toolbarId, editorId) {
  const toolbar = document.getElementById(toolbarId);
  const editor  = document.getElementById(editorId);
  if (!toolbar || !editor) return;

  toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      document.execCommand(btn.dataset.cmd, false, null);
      updateActiveStates();
    });
  });

  editor.addEventListener('keyup', updateActiveStates);
  editor.addEventListener('mouseup', updateActiveStates);

  const blockSelect = toolbar.querySelector('.fmt-block');
  if (blockSelect) {
    blockSelect.addEventListener('change', () => {
      document.execCommand('formatBlock', false, blockSelect.value);
    });
  }

  const fontFamilySelect = toolbar.querySelector('.fmt-font-family');
  if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', () => {
      editor.style.fontFamily = fontFamilySelect.value;
    });
  }

  const fontSizeSelect = toolbar.querySelector('.fmt-font-size');
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', () => {
      editor.style.fontSize = fontSizeSelect.value;
    });
  }

  const lineHeightSelect = toolbar.querySelector('.fmt-line-height');
  if (lineHeightSelect) {
    lineHeightSelect.addEventListener('change', () => {
      editor.style.lineHeight = lineHeightSelect.value;
    });
  }

  const textColorInput = toolbar.querySelector('.fmt-text-color');
  if (textColorInput) {
    textColorInput.addEventListener('input', () => {
      document.execCommand('foreColor', false, textColorInput.value);
      const swatch = toolbar.querySelector('.fmt-text-swatch');
      if (swatch) swatch.style.background = textColorInput.value;
    });
  }

  const highlightInput = toolbar.querySelector('.fmt-highlight-color');
  if (highlightInput) {
    highlightInput.addEventListener('input', () => {
      if (!document.execCommand('hiliteColor', false, highlightInput.value)) {
        document.execCommand('backColor', false, highlightInput.value);
      }
      const swatch = toolbar.querySelector('.fmt-highlight-swatch');
      if (swatch) swatch.style.background = highlightInput.value;
    });
  }

  editor.addEventListener('paste', e => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  function updateActiveStates() {
    toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
      try { btn.classList.toggle('active', document.queryCommandState(btn.dataset.cmd)); } catch(e) {}
    });
    if (blockSelect) {
      try {
        const val = document.queryCommandValue('formatBlock').toLowerCase();
        blockSelect.value = (val === 'div' || val === '') ? 'p' : val;
      } catch(e) {}
    }
  }
}
