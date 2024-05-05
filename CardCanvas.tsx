import {
  Canvas,
  Circle,
  Fill,
  FractalNoise,
  Group,
  ImageShader,
  LinearGradient,
  Paint,
  RoundedRect,
  Shader,
  SkFont,
  SkImage,
  useCanvasRef,
  vec,
} from "@shopify/react-native-skia";
import { generateShader } from "./Shader";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import TextToPath from "./TextToPath";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = windowWidth - 40;
const BORDER_STROKE = 3;
const BORDER_RADIUS = 30;
const CARD_X_Y = {
  x: (windowWidth - CARD_WIDTH) / 2,
  y: (windowHeight - CARD_HEIGHT) / 2,
};

const CardCanvas = ({ font }: { font: SkFont }) => {
  const source = generateShader();
  const ref = useCanvasRef();
  const [image, setImage] = useState<SkImage | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        setImage(ref.current.makeImageSnapshot());
      }
    }, 500);
  }, []);

  if (!image)
    return (
      <Canvas style={styles.container} ref={ref}>
        <Group>
          <Circle r={100} cx={300} cy={350}>
            <LinearGradient
              start={vec(200, 250)}
              end={vec(350, 300)}
              colors={["#7A26D9", "#E444E1"]}
              mode={"clamp"}
            />
          </Circle>
          <Circle r={55} cx={100} cy={550} color={"#EA357C"} />
          <Circle r={25} cx={150} cy={350}>
            <LinearGradient
              start={vec(75, 275)}
              end={vec(100, 300)}
              colors={["#EC6051", "#EA334C"]}
              mode={"clamp"}
            />
          </Circle>
        </Group>
      </Canvas>
    );
  return (
    <Canvas style={styles.container}>
      <Fill>
        <Paint>
          <Shader
            source={source}
            uniforms={{
              rectangle: [
                CARD_X_Y.x + BORDER_STROKE,
                CARD_X_Y.y + BORDER_STROKE,
                CARD_X_Y.x + CARD_WIDTH - BORDER_STROKE,
                CARD_X_Y.y + CARD_HEIGHT - BORDER_STROKE,
              ],
              radius: BORDER_RADIUS,
              dropShadowSize: 30,
              direction: [1, 1],
            }}
          >
            <FractalNoise freqX={0.45} freqY={0.45} octaves={5} seed={2} />

            <ImageShader
              image={image}
              origin={vec(0, 0)}
              width={windowWidth}
              height={windowHeight}
              fit={"cover"}
            />

            <LinearGradient
              start={vec(CARD_X_Y.x, CARD_X_Y.y)}
              end={vec(CARD_X_Y.x + CARD_WIDTH, CARD_X_Y.y + CARD_HEIGHT)}
              colors={["transparent", "black"]}
            />
          </Shader>
        </Paint>
      </Fill>

      <Group>
        <RoundedRect
          x={CARD_X_Y.x}
          y={CARD_X_Y.y}
          height={CARD_HEIGHT}
          width={CARD_WIDTH}
          strokeWidth={BORDER_STROKE}
          r={BORDER_RADIUS}
          style={"stroke"}
        >
          <LinearGradient
            start={vec(CARD_X_Y.x, CARD_X_Y.y)}
            end={vec(CARD_X_Y.x + CARD_WIDTH, CARD_X_Y.y + CARD_HEIGHT)}
            colors={["#FFFFFF80", "#FFFFFF00", "#FF48DB00", "#FF48DB80"]}
            mode={"clamp"}
          />
        </RoundedRect>

        <TextToPath
          font={font}
          text={"MEMBERSHIP"}
          size={18}
          isEmboldened={!true}
          color={"#FFFFFF80"}
          x={CARD_X_Y.x + 20}
          y={CARD_X_Y.y + 40}
        />

        <TextToPath
          font={font}
          text={"PRATHAMESH NEMADE"}
          size={20}
          isEmboldened={!true}
          color={"#FFFFFF80"}
          x={CARD_X_Y.x + 20}
          y={CARD_X_Y.y + CARD_HEIGHT - 80}
        />
        <TextToPath
          font={font}
          text={"Hello React Native Developers!"}
          size={20}
          isEmboldened={!true}
          color={"#FFFFFF80"}
          x={CARD_X_Y.x + 20}
          y={CARD_X_Y.y + CARD_HEIGHT - 40}
        />
      </Group>
    </Canvas>
  );
};

export default CardCanvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03080D",
  },
});
