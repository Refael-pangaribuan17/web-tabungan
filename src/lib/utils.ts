
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.round(progress), 100);
}

export function getRandomMotivation(): string {
  const motivations = [
    "Menabung hari ini untuk masa depan yang lebih baik",
    "Setiap rupiah yang kamu tabung adalah langkah mendekati impianmu",
    "Kamu sudah semakin dekat dengan impianmu!",
    "Konsistensi adalah kunci untuk mencapai tujuan keuanganmu",
    "Teruslah menabung, hasilnya akan sepadan dengan usahamu"
  ];
  
  return motivations[Math.floor(Math.random() * motivations.length)];
}
