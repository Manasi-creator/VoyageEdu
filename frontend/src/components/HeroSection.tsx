import { Map, BookOpen, Info, Search, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-education.jpg";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [institutionCount, setInstitutionCount] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch geolocated institutions count on component mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/institutions/geolocated-count');
        if (response.ok) {
          const data = await response.json();
          setInstitutionCount(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch institution count:', error);
      }
    };
    fetchCount();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/institutions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students studying in university campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover India's
            <span className="block text-accent"> Educational Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore thousands of educational institutions across India. Find your perfect college with detailed profiles and comprehensive information.
          </p>
          
          {institutionCount !== null && (
            <div className="text-white/90 mb-8">
              <p className="text-lg">
                <span className="font-semibold">{institutionCount.toLocaleString()}</span> educational institutions currently geolocated on the map
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/map')} 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-6 text-lg flex items-center gap-2"
            >
              <Map className="w-5 h-5" />
              Explore Map
            </Button>
            <Button 
              onClick={() => navigate('/institutions')} 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-6 text-lg flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Browse Institutions
            </Button>
            <Button 
              onClick={() => navigate('/about')} 
              variant="ghost" 
              className="text-white hover:bg-white/10 px-6 py-6 text-lg flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              Learn More
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
            <div className="relative glass-effect rounded-full p-2">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search colleges, universities, or courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-white/90 text-lg py-6 px-6 focus-visible:ring-2 focus-visible:ring-accent text-gray-900 placeholder:text-gray-500 rounded-full"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-accent hover:bg-accent-light text-accent-foreground rounded-full px-8 py-6 ml-2 search-glow"
                >
                  <Search className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1500+</div>
              <div className="text-white/80 text-lg">Educational Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">28</div>
              <div className="text-white/80 text-lg">States & Union Territories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-10 animate-float">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-md">
          <Users className="w-10 h-10 text-white" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;