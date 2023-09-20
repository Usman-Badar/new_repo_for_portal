export function convertTZ(date) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));   
}