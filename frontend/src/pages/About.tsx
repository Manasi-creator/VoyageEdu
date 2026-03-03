import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, Users, Globe, Award, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from our platform features to user experience."
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Making quality education information accessible to everyone, regardless of their background."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously innovating to provide the best tools and resources for educational discovery."
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "Providing accurate, verified information to help students make informed decisions."
  }
];

const stats = [
  { number: "1500+", label: "Institutions Listed" },
  { number: "28", label: "States Covered" },
  { number: "100+", label: "Cities Mapped" }
];

const teamMembers = [
  {
    name: "Raman Vhantale",
    role: "Project Lead",
    description: "Computer Science Undergraduate, VIT Pune",
    image: "/placeholder.svg"
  },
  {
    name: "Jay Rathi",
    role: "Frontend Developer",  
    description: "Computer Science Undergraduate, VIT Pune",
    image: "/placeholder.svg"
  },
  {
    name: "Manasi Rane",
    role: "Geocoding",
    description: "Computer Science Undergraduate, VIT Pune",
    image: "/placeholder.svg"
  },
  {
    name: "Sharwari Rajput",
    role: "Backend Developer",
    description: "Computer Science Undergraduate, VIT Pune",
    image: "/placeholder.svg"
  }
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="py-16 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                About VoyageEdu
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering students to discover their perfect educational journey across India's diverse landscape of institutions.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At VoyageEdu, we believe that every student deserves access to comprehensive, accurate information about educational opportunities. Our mission is to bridge the gap between students and institutions by providing an intuitive platform that makes educational discovery simple, transparent, and accessible.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-6 h-6 text-primary" />
                      <CardTitle>Vision</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      To become India's most trusted platform for educational discovery, helping millions of students find their ideal learning destination and achieve their academic dreams.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-6 h-6 text-accent" />
                      <CardTitle>Impact</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Making informed educational choices accessible to students from all backgrounds, contributing to a more educated and empowered society.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to students and educators.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Impact in Numbers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate educators and technologists working together to transform educational discovery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-accent text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">{member.role}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a student seeking the perfect institution or an educator wanting to share your story, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;