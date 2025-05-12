
import { Link } from "react-router-dom";
import { Artwork } from "../types";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../utils/formatters";

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  // Ensure the ID is valid and convert to string if needed
  const artworkId = artwork.id ? artwork.id.toString() : "";
  
  return (
    <Link to={`/artwork/${artworkId}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-sm transition-all duration-200 hover:shadow-md h-full">
        <div className="aspect-square overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif font-medium text-base sm:text-lg">{artwork.title}</h3>
          <p className="text-sm text-muted-foreground">{artwork.artist}</p>
          <p className="mt-2 font-medium">{formatCurrency(artwork.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArtworkCard;
