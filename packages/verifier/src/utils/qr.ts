import QRCode from "qrcode";
export const createQR = (d: string) =>
  QRCode.toString(d, { type: "svg", errorCorrectionLevel: "M" });
