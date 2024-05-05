import { Skia } from "@shopify/react-native-skia";

type Value = string | number;
type Values = Value[];

export const glsl = (source: TemplateStringsArray, ...values: Values) => {
  const processed = source.flatMap((s, i) => [s, values[i]]).filter(Boolean);
  return processed.join("");
};

export const generateShader = () => {
  const maxSigma = 15;
  const k = 30;
  const windowSize = k * maxSigma;
  const halfWindowSize = (windowSize / 2).toFixed(1);
  const source = glsl`
uniform shader noise;
uniform shader content;
uniform shader mask;

uniform vec4 rectangle;
uniform float radius;
uniform float dropShadowSize;
uniform float2 direction;

float roundedRectangleSDF(vec2 position, vec2 box, float radius) {
    vec2 q = abs(position) - box + vec2(radius);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;   
}

// Function to calculate Gaussian weight
float Gaussian(float x, float sigma) {
  return exp(-(x * x) / (2.0 * sigma * sigma)) / (2.0 * 3.14159 * sigma * sigma);
}

// Function to perform blur in one direction
vec4 blur(vec2 uv, vec2 direction, float sigma) {
  vec4 result = vec4(0.0);
  float totalWeight = 0.0;
  float window = sigma * ${k.toFixed(1)} * 0.5;

  for (float i = ${-halfWindowSize}; i <= ${halfWindowSize}; i++) {
    if (abs(i) > window) {
      continue;
    }
    float weight = Gaussian(i, sigma);
    vec2 offset = vec2(direction * i);
    vec4 sample = content.eval(uv + offset);

    result += sample * weight;
    totalWeight += weight;
  }

  if (totalWeight > 0.0) {
    result /= totalWeight;
  }

  return result;
}


half4 main(vec2 coord) {   
  vec2 shiftRect = (rectangle.zw - rectangle.xy) / 2.0;
  vec2 shiftCoord = coord - rectangle.xy;
  float distanceToClosestEdge = roundedRectangleSDF(
      shiftCoord - shiftRect, shiftRect, radius);

      vec4 c = content.eval(coord);

      if (distanceToClosestEdge > 0.0) {
          // We're outside of the filtered area

          if (distanceToClosestEdge < dropShadowSize) {
              // Emulate drop shadow around the filtered area
              float darkenFactor = (dropShadowSize - distanceToClosestEdge) / dropShadowSize;
              // Use exponential drop shadow decay for more pleasant visuals
              darkenFactor = pow(darkenFactor, 1.6);
              // Shift towards black, by 10% around the edge, dissipating to 0% further away
              return c * (0.9 + (1.0 - darkenFactor) / 10.0);
          }
          return c;
      }
      
      float amount = mask.eval(coord).a;

      vec4 b = blur(coord, direction, mix(0.1, ${maxSigma.toFixed(
        1
      )}, amount) );
      vec4 n = noise.eval(coord);

      // How far are we from the top-left corner?
      float lightenFactor = min(1.0, length(coord - rectangle.xy) / (0.85 * length(rectangle.zw - rectangle.xy)));

      // Add some noise for extra texture
      float noiseLuminance = dot(n.rgb, vec3(0.2126, 0.7152, 0.0722));
      lightenFactor = min(1.0, lightenFactor + noiseLuminance);

      // Shift towards white, by 35% in top left corner, down to 10% in bottom right corner
      return b + (vec4(1.0) - b) * (0.35 - 0.25 * lightenFactor);
    }
`;

  return Skia.RuntimeEffect.Make(source)!;
};
