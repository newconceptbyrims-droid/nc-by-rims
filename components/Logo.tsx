import Image from "next/image";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/images/logo-mark.png"
      alt="New Concept by Rims"
      width={size}
      height={size}
      priority
      className="rounded-sm"
      style={{ width: size, height: size }}
    />
  );
}
