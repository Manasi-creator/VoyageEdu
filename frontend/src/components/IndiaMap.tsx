import { useState } from "react";
import { MapPin, Eye, Star, Users } from "lucide-react";

// Sample institution data with coordinates for major Indian cities
const institutions = [
  {
    id: 1,
    name: "Indian Institute of Technology Delhi",
    city: "Delhi",
    type: "Engineering",
    rating: 4.8,
    students: 8000,
    coordinates: { x: 48, y: 25 }, // Approximate position on India map
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "University of Mumbai",
    city: "Mumbai",
    type: "University",
    rating: 4.5,
    students: 15000,
    coordinates: { x: 40, y: 45 },
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Indian Institute of Science",
    city: "Bangalore",
    type: "Research",
    rating: 4.9,
    students: 3000,
    coordinates: { x: 45, y: 65 },
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Jadavpur University",
    city: "Kolkata",
    type: "University",
    rating: 4.6,
    students: 12000,
    coordinates: { x: 65, y: 40 },
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Anna University",
    city: "Chennai",
    type: "Engineering",
    rating: 4.4,
    students: 20000,
    coordinates: { x: 52, y: 70 },
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
  }
];

interface InstitutionCardProps {
  institution: typeof institutions[0];
  onClose: () => void;
}

const InstitutionCard = ({ institution, onClose }: InstitutionCardProps) => (
  <div className="absolute z-50 bg-white rounded-lg shadow-2xl p-6 w-80 transform -translate-x-1/2 -translate-y-full border animate-slide-up">
    <button 
      onClick={onClose}
      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
    >
      ×
    </button>
    
    <img 
      src={institution.image} 
      alt={institution.name}
      className="w-full h-32 object-cover rounded-md mb-4"
    />
    
    <h3 className="font-bold text-lg mb-2 text-foreground">{institution.name}</h3>
    <p className="text-sm text-muted-foreground mb-3">{institution.city} • {institution.type}</p>
    
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="text-sm font-medium">{institution.rating}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-sm">{institution.students.toLocaleString()} students</span>
      </div>
    </div>
    
    <div className="flex gap-2">
      <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary-dark transition-colors">
        <Eye className="w-3 h-3" />
        360° View
      </button>
      <button className="flex-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-md text-sm hover:bg-accent-light transition-colors">
        View Details
      </button>
    </div>
  </div>
);

const IndiaMap = () => {
  const [hoveredInstitution, setHoveredInstitution] = useState<typeof institutions[0] | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<typeof institutions[0] | null>(null);

  const handleMarkerClick = (institution: typeof institutions[0]) => {
    setSelectedInstitution(selectedInstitution?.id === institution.id ? null : institution);
    setHoveredInstitution(null);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Educational Institutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive map of India showing top educational institutions. Click on markers to view detailed information.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* India Map SVG */}
          <div className="relative bg-white rounded-2xl shadow-lg p-8">
            <svg viewBox="0 0 100 100" className="w-full h-96 md:h-[500px]">
              {/* Simplified India outline */}
              <path
                d="M20 20 Q30 15 40 20 L70 25 Q80 30 85 40 L90 60 Q85 80 75 85 L60 90 Q40 85 30 80 L25 70 Q15 50 20 20 Z"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                className="transition-colors duration-300"
              />
              
              {/* Institution markers */}
              {institutions.map((institution) => (
                <g key={institution.id}>
                  {/* Marker */}
                  <circle
                    cx={institution.coordinates.x}
                    cy={institution.coordinates.y}
                    r="2"
                    className="map-marker cursor-pointer"
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth="0.5"
                    onMouseEnter={() => setHoveredInstitution(institution)}
                    onMouseLeave={() => setHoveredInstitution(null)}
                    onClick={() => handleMarkerClick(institution)}
                  />
                  
                  {/* Pulse animation */}
                  <circle
                    cx={institution.coordinates.x}
                    cy={institution.coordinates.y}
                    r="3"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.3"
                    opacity="0.6"
                    className="animate-pulse-glow"
                  />
                  
                  {/* Hover tooltip */}
                  {hoveredInstitution?.id === institution.id && (
                    <g>
                      <rect
                        x={institution.coordinates.x - 12}
                        y={institution.coordinates.y - 8}
                        width="24"
                        height="5"
                        rx="2"
                        fill="rgba(0,0,0,0.8)"
                      />
                      <text
                        x={institution.coordinates.x}
                        y={institution.coordinates.y - 4.5}
                        textAnchor="middle"
                        fontSize="1.5"
                        fill="white"
                      >
                        {institution.city}
                      </text>
                    </g>
                  )}
                  
                  {/* Institution card */}
                  {selectedInstitution?.id === institution.id && (
                    <foreignObject
                      x={institution.coordinates.x}
                      y={institution.coordinates.y}
                      width="1"
                      height="1"
                      overflow="visible"
                    >
                      <InstitutionCard
                        institution={institution}
                        onClose={() => setSelectedInstitution(null)}
                      />
                    </foreignObject>
                  )}
                </g>
              ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Educational Institution</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Click markers for details
              </div>
            </div>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center institution-card">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">5 Featured</h3>
            <p className="text-sm text-muted-foreground">Top Institutions</p>
          </div>
          
          <div className="text-center institution-card">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg">4.6 Avg</h3>
            <p className="text-sm text-muted-foreground">Rating Score</p>
          </div>
          
          <div className="text-center institution-card">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-lg">58,000</h3>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          
          <div className="text-center institution-card">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold text-lg">360° Views</h3>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaMap;