import { Typography } from "../ui";

export default function EnergyStats({ average }) {
  return <Typography variant="body1">Average energy: {average.toFixed(2)}</Typography>;
}