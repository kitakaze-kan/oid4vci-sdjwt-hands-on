import QRCode from "qrcode";

export const createQR = (data: string) =>
  QRCode.toString(data, { type: "svg", errorCorrectionLevel: "M" });
