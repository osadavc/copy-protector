const getClipboard = () => {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.focus();

  document.execCommand("paste");
  const clipboardText = input.value;

  document.body.removeChild(input);

  return clipboardText;
};

export default getClipboard;
