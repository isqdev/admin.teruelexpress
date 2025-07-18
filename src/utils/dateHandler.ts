import { DateLib } from "react-day-picker";

export function dateString(date: Date[]): String[] {
    const sdf = new DateLib();
    return date.map(data => sdf.format(data ,"dd/MM/yyyy"));
}

export function parseDate(dateString: String): Date {
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
}
