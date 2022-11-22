import {time_formatter} from "./TimeFormatter";

export const timeFormatter = (format) => {
  return (row, col) => {
    return time_formatter(row[col.property], format ?? "yyyy-MM-dd");
  }
};

export const sizeFormatter = (row, col) => {
  let size = row[col.property];
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
}
