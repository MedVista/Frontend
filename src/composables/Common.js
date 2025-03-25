import { el } from "date-fns/locale";
function trimPath(path) {
  // แยกสตริงตามเครื่องหมาย /
  const parts = path.split("/");
  // กรองเฉพาะส่วนที่ไม่ใช่ตัวเลข
  const trimmedParts = parts.filter((part) => part && isNaN(part));
  // รวมกลับเป็นสตริง
  return trimmedParts.join("/");
}
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const formatDate = (date) => {
  // แปลงวันที่หรือใช้วันที่ปัจจุบัน
  const newdate = date ? new Date(date) : new Date();

  // จัดรูปแบบวันที่
  return newdate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
function formatTimeRange(timeRange) {
  // แยกช่วงเวลาตามเครื่องหมาย "-"
  const [startTime, endTime] = timeRange.split("-");

  // ตัดส่วนวินาทีออกจากเวลา
  const formatTime = (time) => time.slice(0, 5);
  if (startTime == "undefined" ) {
    return  " "
  }else{
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }
  // แปลงเวลาและเชื่อมกลับ
  
}
function formatISOToDate(date) {
  // ดึงวัน เดือน และปีจาก Date object
  if (date) {
    const day = String(date.getDate()).padStart(2, "0"); // เติม 0 ข้างหน้า ถ้าวันน้อยกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มนับจาก 0
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
}
const formatPhoneNumber = (value, previousValue) => {
  // ลบอักขระที่ไม่ใช่ตัวเลข
  const numericValue = value.replace(/\D/g, "");

  // ฟอร์แมตตัวเลขในรูปแบบ xxx-xxx-xxxx
  let formatted = numericValue
    .replace(/(\d{3})(\d{0,3})/, "$1-$2") // xxx-xxx
    .replace(/(\d{3}-\d{3})(\d{0,4})/, "$1-$2") // xxx-xxx-xxxx
    .slice(0, 12); // จำกัดความยาวที่ 12 ตัวอักษร

  // ตรวจสอบการกด Backspace
  if (value.length < previousValue.length) {
    if (
      previousValue[previousValue.length - 1] === "-" &&
      value[value.length - 1] !== "-"
    ) {
      // ลบตัว '-' ที่อาจติดมา
      formatted = formatted.slice(0, -1);
    }
  }

  return formatted;
};

export {
  trimPath,
  validateEmail,
  formatDate,
  formatTimeRange,
  formatISOToDate,
  formatPhoneNumber,
};
