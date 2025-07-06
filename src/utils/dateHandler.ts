import { DateLib } from "react-day-picker";

export function dateString(date: Date[]): String[] {
    const sdf = new DateLib();
    return date.map(data => sdf.format(data ,"dd/MM/yyyy"));
}
