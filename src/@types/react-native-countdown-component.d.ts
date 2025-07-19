declare module "react-native-countdown-component" {
  import { ComponentType } from "react";

  interface CountdownProps {
    until: number;
    onFinish?: () => void;
    onPress?: () => void;
    size?: number;
    digitStyle?: object;
    digitTxtStyle?: object;
    timeLabelStyle?: object;
    separatorStyle?: object;
    timeToShow?: Array<"H" | "M" | "S" | "D">;
    showSeparator?: boolean;
    running?: boolean;
    // Add other props as needed
  }

  const Countdown: ComponentType<CountdownProps>;
  export default Countdown;
}
