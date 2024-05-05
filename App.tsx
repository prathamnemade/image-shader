// https://www.pushing-pixels.org/2022/04/09/shader-based-render-effects-in-compose-desktop-with-skia.html
import { View } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import CardCanvas from "./CardCanvas";

export default function App() {
  const font = useFont(require("./assets/fonts/AirbnbCerealBold.ttf"));
  if (font === null) return null;

  return (
    <View style={{ flex: 1 }}>
      <CardCanvas font={font} />
    </View>
  );
}
