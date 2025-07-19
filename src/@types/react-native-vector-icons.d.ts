declare module "react-native-vector-icons/*" {
  import { ComponentType } from "react";
  import { TextProps } from "react-native";

  const content: ComponentType<
    TextProps & { name: string; size?: number; color?: string }
  >;
  export default content;
}
