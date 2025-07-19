declare module "react-native-svg" {
  import * as React from "react";
  import { ViewProps } from "react-native";

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    viewBox?: string; // Add this!
    accessibilityLabel?: string;
    accessible?: boolean;
    [key: string]: any; // Optional: allow other props to avoid errors
  }

  export interface PathProps extends SvgProps {
    d?: string; // Add this for Path
    strokeWidth?: number;
    strokeLinecap?: string;
    strokeLinejoin?: string;
  }

  export class Svg extends React.Component<SvgProps> {}
  export class Path extends React.Component<PathProps> {}

  // Keep the others with SvgProps or extend similarly if needed
  export class Circle extends React.Component<SvgProps> {}
  export class Rect extends React.Component<SvgProps> {}
  export class Line extends React.Component<SvgProps> {}
  export class Polygon extends React.Component<SvgProps> {}
  export class Polyline extends React.Component<SvgProps> {}
  export class Ellipse extends React.Component<SvgProps> {}
  export class G extends React.Component<SvgProps> {}
  export class Defs extends React.Component<SvgProps> {}
  export class Stop extends React.Component<SvgProps> {}
  export class LinearGradient extends React.Component<SvgProps> {}
  export class RadialGradient extends React.Component<SvgProps> {}

  export default Svg;
}
