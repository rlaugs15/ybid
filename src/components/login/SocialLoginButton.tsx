"use client";

import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  imgSrc: string;
  alt: string;
}

export default function SocialLoginButton({ imgSrc, alt, ...rest }: SocialLoginButtonProps) {
  return (
    <button {...rest} className="px-1 py-0 w-82.25 h-12.5 relative hover:cursor-pointer">
      <Image src={imgSrc} alt={alt} fill className="object-contain" />
    </button>
  );
}
