import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const ddMMYYYY = "DD/MM/YYYY";
export const ddMMYYYYHHmm = "DD/MM/YYYY HH:mm";

export const checkTokenExpiry = (token) => {
    let result;
    try {
        const currentTime = Math.floor(Date.now() / 1000);

        const decoded = jwt.decode(token);
        if (!decoded || (decoded.exp && decoded.exp < currentTime)) { // Nếu token không có thông tin hết hạn thì server sẽ xử lý phần này
            result = {isValid: false, message: "Token không hợp lệ hoặc Token đã hết hạn."};
        } else {
            result = {isValid: true, message: "Token vẫn còn hạn."};
        }
    } catch (error) {
        result = {isValid: false, message: error.message};
    }
    return result;
}

export const listActiveOptions = [
    {value: "1", label: "Active"},
    {value: "0", label: "Inactive"}
];

export const convertUnixDate = (unixTimestamp, format = ddMMYYYYHHmm) => {
    if (!unixTimestamp) return null;

    return dayjs.unix(unixTimestamp).format(format);
}