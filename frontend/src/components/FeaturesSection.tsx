import { MapPin, Eye, Search, Users, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: MapPin,
    title: "Interactive Map",
    description: "Explore educational institutions across India with our interactive map interface. Find colleges by location, type, and specialization."
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Advanced search filters to find institutions by courses, rankings, fees, location, and admission criteria."
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with current students and alumni to get insights about campus life and academic programs."
  },
  {
    icon: Award,
    title: "Rankings & Ratings",
    description: "Access comprehensive rankings, accreditation status, and ratings from multiple trusted sources."
  },
  {
    icon: Globe,
    title: "Comprehensive Coverage",
    description: "Complete database covering universities, colleges, technical institutes, and specialized schools across India."
  },
  {
    icon: MapPin,
    title: "Get Directions",
    description: "Receive directions and flawlessly plan the college visit schedule according to the desired mode of travel."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-primary">VoyageEdu</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive information and tools to help you make the best educational decisions for your future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="institution-card group text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Perfect Institution?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Join thousands of students who have found their ideal educational path through VoyageEdu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/institutions"
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold transition-colors text-center"
              >
                Start Exploring
              </Link>
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;