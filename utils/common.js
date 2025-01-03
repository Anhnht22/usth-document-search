import jwt from "jsonwebtoken";
import {format, fromUnixTime} from "date-fns";

export const ddMMyyyy = "dd/MM/yyyy";
export const ddMMyyyyHHmm = "dd/MM/yyyy HH:mm";

export const checkTokenExpiry = (token) => {
    let result;
    try {
        const currentTime = Math.floor(Date.now() / 1000);

        const dataUser = jwt.decode(token);
        if (!dataUser || (dataUser.exp && dataUser.exp < currentTime)) { // Nếu token không có thông tin hết hạn thì server sẽ xử lý phần này
            result = {isValid: false, message: "Token không hợp lệ hoặc Token đã hết hạn.", data: null};
        } else {
            result = {isValid: true, message: "Token vẫn còn hạn.", data: dataUser};
        }
    } catch (error) {
        result = {isValid: false, message: error.message, data: null};
    }
    return result;
}

export const listActiveOptions = [
    {value: "1", label: "Active"},
    {value: "0", label: "Inactive"}
];

export const listDocumentStatus = {
    DRAFT: {key: "DRAFT", color: "#9ca3af"},
    APPROVED: {key: "APPROVED", color: "#22c55e"},
    REJECTED: {key: "REJECTED", color: "#ef4444"},
}

export const convertUnixDate = (unixTimestamp, formatDate = ddMMyyyyHHmm) => {
    if (!unixTimestamp) return null;

    return format(fromUnixTime(unixTimestamp), formatDate);
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export const convertFileName = (fileName) => {
    return fileName
        .toLowerCase() // Chuyển về chữ thường
        .split(" ") // Tách bằng khoảng trắng
        .join("-") // Thay khoảng trắng bằng dấu gạch ngang
        .split("_") // Tách bằng dấu gạch dưới
        .join("-") // Thay dấu gạch dưới bằng gạch ngang
        .normalize("NFD") // Chuẩn hóa Unicode (NFD)
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
        .replace(/đ/g, "d") // Thay "đ" bằng "d"
        .replace(/[^\x00-\x7F]/g, "") // Loại bỏ ký tự không phải ASCII,;
}