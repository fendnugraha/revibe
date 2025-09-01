import { formatDistanceToNow } from "date-fns";

/**
 * Format angka dengan separator ribuan.
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
};

/**
 * Format angka menjadi format mata uang Rupiah.
 * @param {number} value
 * @returns {string}
 */
export const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Format tanggal ke format 'DD/MM/YYYY'.
 * @param {Date | string} date
 * @returns {string}
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID");
};

/**
 * Format tanggal ke format 'DD MMMM YYYY'.
 * @param {Date | string} date
 * @returns {string}
 */
export const formatLongDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

/**
 * Format tanggal dan jam ke format 'DD/MM/YYYY, HH:mm:ss'.
 * @param {Date | string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

export const todayDate = () => {
    const now = new Date();

    // Fungsi untuk memastikan angka memiliki dua digit (misal: 5 menjadi 05)
    const pad = (n) => `0${n}`.slice(-2);

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // getMonth() dimulai dari 0
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const TimeAgo = ({ timestamp }) => {
    return <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>;
};

export function formatNumberToK(num) {
    const absNum = Math.abs(num); // Ambil angka absolut (tanpa minus) untuk perhitungan
    let formatted;

    if (absNum >= 1_000_000_000) {
        formatted = (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (absNum >= 1_000_000) {
        formatted = (absNum / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (absNum >= 1_000) {
        formatted = (absNum / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
        formatted = absNum.toString(); // Di bawah 1000, tampilkan angka apa adanya
    }

    // Tambahkan minus jika angka awalnya negatif
    return num < 0 ? `-${formatted}` : formatted;
}
