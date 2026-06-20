import Svg, { Path, Rect, Circle } from "react-native-svg";

type IconProps = { color?: string; size?: number };

export function HomeIcon({ color = "#fff", size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 10.9384C2.5 9.71422 3.06058 8.55744 4.02142 7.79888L9.52142 3.45677C10.9747 2.30948 13.0253 2.30948 14.4786 3.45677L19.9786 7.79888C20.9394 8.55744 21.5 9.71422 21.5 10.9384V17.5C21.5 19.7091 19.7091 21.5 17.5 21.5H16C15.4477 21.5 15 21.0523 15 20.5V17.5C15 16.3954 14.1046 15.5 13 15.5H11C9.89543 15.5 9 16.3954 9 17.5V20.5C9 21.0523 8.55228 21.5 8 21.5H6.5C4.29086 21.5 2.5 19.7091 2.5 17.5L2.5 10.9384Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function BookIcon({ color = "#fff", size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4.11745V20.9906M12 4.11745L13.1001 3.70461C15.6036 2.76513 18.3964 2.76513 20.8999 3.70461C21.5643 3.95395 22 4.55769 22 5.22907V19.0797C22 20.0016 21.0075 20.632 20.0951 20.2896C18.1082 19.544 15.8918 19.544 13.9049 20.2896L12.0137 20.9993C12.0071 21.0018 12 20.9972 12 20.9906M12 4.11745L10.8999 3.70461C8.39638 2.76513 5.60362 2.76513 3.10014 3.70461C2.43569 3.95395 2 4.55769 2 5.22907V19.0797C2 20.0016 2.99247 20.632 3.90485 20.2896C5.89175 19.544 8.10825 19.544 10.0951 20.2896L11.9863 20.9993C11.9929 21.0018 12 20.9972 12 20.9906"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function ChartIcon({ color = "#fff", size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth={1.5} />
      <Path d="M8 17L8 14" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 17L12 7" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17L16 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function UserIcon({ color = "#fff", size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={1.5} />
      <Path
        d="M5 16.9347C5 16.0743 5.54085 15.3068 6.35109 15.0175C10.004 13.7128 13.996 13.7128 17.6489 15.0175C18.4591 15.3068 19 16.0743 19 16.9347V18.2502C19 19.4376 17.9483 20.3498 16.7728 20.1818L15.8184 20.0455C13.2856 19.6837 10.7144 19.6837 8.18162 20.0455L7.22721 20.1818C6.0517 20.3498 5 19.4376 5 18.2502V16.9347Z"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
