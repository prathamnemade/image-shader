import { SkFont, Skia, TextBlob, useFont } from "@shopify/react-native-skia";

const TextToPath = ({
  text,
  size,
  isEmboldened = false,
  color,
  x,
  y,
  font,
}: {
  text: string;
  size: number;
  isEmboldened: boolean;
  color: string;
  x: number;
  y: number;
  font: SkFont;
}) => {
  font.setSize(size);
  font.setEmbolden(isEmboldened ? 1 : 0);

  const blob = Skia.TextBlob.MakeFromText(text, font);

  return <TextBlob color={color} blob={blob} x={x} y={y} />;
};

export default TextToPath;
