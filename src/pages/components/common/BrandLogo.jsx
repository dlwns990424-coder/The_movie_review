export default function BrandLogo({
  compact = false,
  className = "",
  alt = "MAMORI",
}) {
  const fileName = compact
    ? "mamori-wordmark-compact.svg"
    : "mamori-wordmark.svg";

  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/${fileName}`}
      alt={alt}
      className={`block h-auto ${className}`}
    />
  );
}