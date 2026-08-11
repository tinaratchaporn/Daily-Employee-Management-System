import { io } from "./app";

export const sendNotification = (data: any) => {
  io.emit("notification", data);
};