"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useToast } from "./ToastProvider";

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { message: string; children: ReactNode }

export function DemoButton({ message, children, onClick, ...props }: DemoButtonProps) {
  const { showToast } = useToast();
  return <button type="button" {...props} onClick={(event) => { onClick?.(event); showToast(message); }}>{children}</button>;
}
