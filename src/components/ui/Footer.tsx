import { type ReactNode } from "react";
type Props = { children: ReactNode };

export default function Footer({ children }: Props) {
  return (
    <footer className="col-span-2 flex items-center justify-center bg-stone-700">
      {children}
    </footer>
  );
}
