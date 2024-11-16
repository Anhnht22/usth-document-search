import "@/app/globals.scss";
import {Roboto} from "@next/font/google";

const roboto = Roboto({
    subsets: ["latin"], // Chọn subset phù hợp, ví dụ: "latin", "cyrillic", v.v.
    weight: ["100", "300", "400", "500", "700", "900"], // Chọn các trọng số cần sử dụng
    variable: "--font-roboto", // Tên biến CSS để sử dụng trong className
});

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body
            className={`${roboto.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}