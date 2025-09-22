export const extractFirstNumber = (text: string): number | "" => {
  const number = text.match(/\d+/)?.[0];
  return number ? parseInt(number, 10) : "";
};
export function formatPostalCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}`;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
}

export function formatNIP(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}
