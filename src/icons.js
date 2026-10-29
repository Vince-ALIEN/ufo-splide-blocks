// Icône GalleryHorizontal de Lucide (licence ISC), reprise de lucide-react
// pour ne pas ajouter la dépendance. Rendu identique à getBlockIcon de
// ufo-tools-blocks : #EB9188 sur fond #F6F6F7.
const GalleryHorizontal = ({ size = 20, color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3v18" />
    <rect width="12" height="18" x="6" y="3" rx="2" />
    <path d="M22 3v18" />
  </svg>
);

export const galleryBlockIcon = {
  src: (
    <div
      style={{
        backgroundColor: "#F6F6F7",
        borderRadius: "4px",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GalleryHorizontal size={20} color="#EB9188" style={{ fill: "none" }} />
    </div>
  ),
};
