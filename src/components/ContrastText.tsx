import React, { useMemo } from "react";
import tinycolor from "tinycolor2";
import { Text } from "./Text";
// eslint-disable-next-line no-restricted-imports
import type { TextProps } from "react-native";

export interface ContrastTextProps extends TextProps {
  /**
   * Cor de fundo em Hex/RGBA em que este texto ficará por cima.
   * O componente calculará automaticamente o contraste.
   */
  backgroundColor: string;
}

export function ContrastText({
  backgroundColor,
  style,
  ...props
}: ContrastTextProps) {
  const textColor = useMemo(() => {
    // Calcula o contraste da cor de fundo com o branco puro.
    // Segundo a W3C (WCAG), se o contraste com o branco for menor que 2.5
    // significa que é melhor usar texto escuro para legibilidade.
    const contrastWithWhite = tinycolor.readability(backgroundColor, "#ffffff");
    return contrastWithWhite < 2.5 ? "rgba(0,0,0,0.85)" : "#ffffff";
  }, [backgroundColor]);

  return <Text style={[style, { color: textColor }]} {...props} />;
}
