import Image from "next/image";

const logoSizes = {
  small: {
    className: "h-10 w-36 sm:w-40",
    sizes: "160px",
  },
  medium: {
    className: "h-20 w-64 sm:h-24 sm:w-80",
    sizes: "(max-width: 640px) 256px, 320px",
  },
  large: {
    className: "h-28 w-full max-w-[300px] sm:h-32 sm:max-w-[350px]",
    sizes: "(max-width: 640px) 300px, 350px",
  },
};

export function DesignSwissLogo({
  size = "medium",
  priority = false,
}: {
  size?: keyof typeof logoSizes;
  priority?: boolean;
}) {
  const config = logoSizes[size];

  return (
    <div className={`relative ${config.className}`}>
      <Image
        src="/images/designswiss-logo.png"
        alt="DesignSwiss"
        fill
        priority={priority}
        sizes={config.sizes}
        className="object-contain"
      />
    </div>
  );
}
