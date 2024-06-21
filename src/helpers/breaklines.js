module.exports = function (text) {
  text = String(text);
  text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
  return text;
};
