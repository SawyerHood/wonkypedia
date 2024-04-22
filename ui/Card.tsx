import cx from "classnames";

export function Card({
  colorScheme,
  title,
  children,
  className,
}: {
  colorScheme: "blue" | "green" | "gray" | "purple";
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cta?: React.ReactNode;
}) {
  const colorSchemes = {
    blue: {
      bgColor: "bg-blue-50 border-blue-300 text-blue-800",
      textColor: "text-gray-600",
      headingColor: "text-blue-800",
    },
    green: {
      bgColor: "bg-green-100 border-green-400 text-green-900",
      textColor: "text-gray-600",
      headingColor: "text-green-900",
    },
    gray: {
      bgColor: "bg-gray-50 border-gray-300 text-gray-800",
      textColor: "text-gray-600",
      headingColor: "text-gray-800",
    },
    purple: {
      bgColor: "bg-purple-50 border-purple-300 text-purple-800",
      textColor: "text-gray-600",
      headingColor: "text-purple-800",
    },
  };

  const { bgColor, textColor, headingColor } = colorSchemes[colorScheme];

  return (
    <div className={cx(`p-4 w-full`, bgColor, `border`, className)}>
      {title && (
        <h5 className={cx(`mb-2 text-xl font-semibold`, headingColor)}>
          {title}
        </h5>
      )}
      <div className={cx(`font-light`, textColor)}>{children}</div>
    </div>
  );
}
