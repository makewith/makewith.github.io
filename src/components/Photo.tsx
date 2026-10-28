export default function Photo({
  src,
  alt = "",
  ratio,
  eager = false,
  className = "",
}: {
  src: string;
  alt?: string;
  ratio: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`photo ${className}`} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
    </div>
  );
}
