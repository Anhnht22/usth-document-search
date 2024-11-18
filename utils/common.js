import jwt from "jsonwebtoken";

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