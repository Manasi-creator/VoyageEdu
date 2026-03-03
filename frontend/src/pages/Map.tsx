import { useState } from "react";
import Navbar from "@/components/Navbar";
import LeafletMap from "@/components/LeafletMap";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

const Map = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="py-16 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Educational Institutions Map
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover top educational institutions across India with our interactive map. Click on markers to explore detailed information about universities, colleges, and schools.
              </p>
            </div>
          </div>
        </div>
        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-50 bg-background/95 p-4 md:p-8 overflow-auto"
              : "container mx-auto px-4 pb-16"
          }
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {isFullscreen ? "Fullscreen Map View" : "Explore the Map"}
              </h2>
              <p className="text-muted-foreground">
                Use the map to explore institutions across India. Toggle fullscreen for an immersive experience.
              </p>
            </div>
            <Button
              variant={isFullscreen ? "secondary" : "outline"}
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="self-start md:self-auto"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-8 h-8 mr-2" />
                  View Fullscreen
                </>
              )}
            </Button>
          </div>
          <LeafletMap
            height={isFullscreen ? "calc(100vh - 220px)" : "600px"}
            showAll={true}
            enableClustering={true}
            disableScrollZoom={false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Map;