import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MiniMap from "@/components/MiniMap";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <section className="py-20 bg-gradient-to-br from-background to-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Educational Institutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interactive map of India showing top educational institutions. Hover over markers to view information.
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <MiniMap />
              <div className="text-center mt-8">
                <a 
                  href="/map" 
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Full Map
                </a>
              </div>
            </div>
          </div>
        </section>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
