import { Loader } from "lucide-react";
import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 23, color = "#000000" }) => {
  return <Loader className="animate-spin" size={size} color={color} />;
};

export default Spinner;
