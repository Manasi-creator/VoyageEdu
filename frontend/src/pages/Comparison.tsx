// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Star, Users, MapPin, Award, Calendar, BookOpen, GraduationCap, TrendingUp, X, Sparkles } from "lucide-react";
// import { useState } from "react";

// const colleges = [
//   {
//     id: 1,
//     name: "Indian Institute of Technology Delhi",
//     type: "Engineering & Technology",
//     city: "New Delhi",
//     state: "Delhi",
//     rating: 4.8,
//     students: 8500,
//     established: 1961,
//     tuitionFee: "₹2,00,000/year",
//     acceptance: "2%",
//     placement: "98%",
//     avgPackage: "₹16 LPA",
//     topRecruiter: "Google, Microsoft, Amazon",
//     specializations: ["Computer Science", "Mechanical Engineering", "Electrical Engineering"]
//   },
//   {
//     id: 2,
//     name: "University of Delhi",
//     type: "Multidisciplinary University",
//     city: "New Delhi",
//     state: "Delhi",
//     rating: 4.6,
//     students: 132000,
//     established: 1922,
//     tuitionFee: "₹50,000/year",
//     acceptance: "12%",
//     placement: "85%",
//     avgPackage: "₹6 LPA",
//     topRecruiter: "Deloitte, EY, KPMG",
//     specializations: ["Liberal Arts", "Sciences", "Commerce"]
//   },
//   {
//     id: 3,
//     name: "Indian Institute of Management Bangalore",
//     type: "Management",
//     city: "Bangalore",
//     state: "Karnataka",
//     rating: 4.9,
//     students: 1200,
//     established: 1973,
//     tuitionFee: "₹23,00,000/year",
//     acceptance: "1%",
//     placement: "100%",
//     avgPackage: "₹33 LPA",
//     topRecruiter: "McKinsey, BCG, Bain",
//     specializations: ["MBA", "Executive Education", "Research Programs"]
//   },
//   {
//     id: 4,
//     name: "Jawaharlal Nehru University",
//     type: "Central University",
//     city: "New Delhi",
//     state: "Delhi",
//     rating: 4.5,
//     students: 8500,
//     established: 1969,
//     tuitionFee: "₹30,000/year",
//     acceptance: "5%",
//     placement: "75%",
//     avgPackage: "₹5.5 LPA",
//     topRecruiter: "Government Organizations, NGOs",
//     specializations: ["Social Sciences", "Languages", "International Studies"]
//   },
//   {
//     id: 5,
//     name: "All India Institute of Medical Sciences Delhi",
//     type: "Medical",
//     city: "New Delhi",
//     state: "Delhi",
//     rating: 4.9,
//     students: 3500,
//     established: 1956,
//     tuitionFee: "₹1,400/year",
//     acceptance: "0.01%",
//     placement: "100%",
//     avgPackage: "₹12 LPA",
//     topRecruiter: "Apollo, Fortis, Max Healthcare",
//     specializations: ["Medicine", "Surgery", "Pediatrics"]
//   }
// ];

// const Comparison = () => {
//   const [selectedColleges, setSelectedColleges] = useState<number[]>([]);

//   const handleAddCollege = (collegeId: string) => {
//     const id = parseInt(collegeId);
//     if (!selectedColleges.includes(id) && selectedColleges.length < 3) {
//       setSelectedColleges([...selectedColleges, id]);
//     }
//   };

//   const handleRemoveCollege = (collegeId: number) => {
//     setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
//   };

//   const selectedCollegeData = selectedColleges.map(id => 
//     colleges.find(college => college.id === id)
//   ).filter(Boolean);

//   return (
//     <div className="min-h-screen">
//       <Navbar />
//       <main className="pt-20">
//         {/* Hero Section */}
//         <section className="hero-gradient py-20 px-4 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 animate-pulse" />
//           <div className="container mx-auto text-center relative z-10">
//             <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 animate-fade-in">
//               <Sparkles className="w-4 h-4 text-primary" />
//               <span className="text-sm font-medium text-primary">Smart Comparison Tool</span>
//             </div>
//             <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in">
//               Compare Colleges
//             </h1>
//             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
//               Make informed decisions by comparing institutions side-by-side
//             </p>
//           </div>
//         </section>

//         {/* Selection Section */}
//         <section className="py-8 px-4 bg-background">
//           <div className="container mx-auto">
//             <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in">
//               <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
//                 <CardTitle className="flex items-center gap-2">
//                   <GraduationCap className="w-5 h-5 text-primary animate-pulse" />
//                   Select Colleges to Compare
//                 </CardTitle>
//                 <CardDescription className="flex items-center gap-2">
//                   Choose up to 3 colleges to compare 
//                   <Badge variant={selectedColleges.length === 3 ? "default" : "secondary"} className="ml-auto">
//                     {selectedColleges.length}/3
//                   </Badge>
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <Select onValueChange={handleAddCollege}>
//                   <SelectTrigger className="w-full hover:border-primary transition-colors">
//                     <SelectValue placeholder="🎓 Select a college to add" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background z-50">
//                     {colleges
//                       .filter(college => !selectedColleges.includes(college.id))
//                       .map((college) => (
//                         <SelectItem 
//                           key={college.id} 
//                           value={college.id.toString()}
//                           className="cursor-pointer hover:bg-primary/10"
//                         >
//                           <div className="flex items-center gap-2">
//                             <Badge variant="outline" className="text-xs">{college.type}</Badge>
//                             <span>{college.name}</span>
//                           </div>
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         {/* Comparison Section */}
//         {selectedCollegeData.length > 0 && (
//           <section className="py-8 px-4 bg-gradient-to-b from-muted/30 to-background">
//             <div className="container mx-auto">
//               <div className={`grid gap-6 ${
//                 selectedCollegeData.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' :
//                 selectedCollegeData.length === 2 ? 'md:grid-cols-2' :
//                 'md:grid-cols-3'
//               }`}>
//                 {selectedCollegeData.map((college, index) => (
//                   <Card 
//                     key={college!.id} 
//                     className="relative card-gradient hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50 animate-fade-in group overflow-hidden"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="absolute top-2 right-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 z-10 transition-all hover:scale-110"
//                       onClick={() => handleRemoveCollege(college!.id)}
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
                    
//                     <CardHeader className="relative z-10">
//                       <CardTitle className="text-xl pr-8 group-hover:text-primary transition-colors">{college!.name}</CardTitle>
//                       <div className="flex items-center gap-2 mt-2 flex-wrap">
//                         <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
//                           {college!.type}
//                         </Badge>
//                         <div className="flex items-center gap-1 text-sm bg-accent/10 px-2 py-1 rounded-full">
//                           <Star className="w-4 h-4 fill-accent text-accent animate-pulse" />
//                           <span className="font-bold text-accent">{college!.rating}</span>
//                         </div>
//                       </div>
//                     </CardHeader>

//                     <CardContent className="space-y-4 relative z-10">
//                       {/* Location */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Location</p>
//                           <p className="text-sm text-muted-foreground">{college!.city}, {college!.state}</p>
//                         </div>
//                       </div>

//                       {/* Established */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Established</p>
//                           <p className="text-sm text-muted-foreground">{college!.established}</p>
//                         </div>
//                       </div>

//                       {/* Students */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Total Students</p>
//                           <p className="text-sm text-muted-foreground font-medium">{college!.students.toLocaleString()}</p>
//                         </div>
//                       </div>

//                       {/* Tuition */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group/item">
//                         <Award className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Tuition Fee</p>
//                           <p className="text-sm text-accent font-bold">{college!.tuitionFee}</p>
//                         </div>
//                       </div>

//                       {/* Acceptance Rate */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Acceptance Rate</p>
//                           <p className="text-sm text-muted-foreground">{college!.acceptance}</p>
//                         </div>
//                       </div>

//                       {/* Placement */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors group/item">
//                         <GraduationCap className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Placement Rate</p>
//                           <p className="text-sm text-accent font-bold">{college!.placement}</p>
//                         </div>
//                       </div>

//                       {/* Average Package */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Average Package</p>
//                           <p className="text-sm text-primary font-bold">{college!.avgPackage}</p>
//                         </div>
//                       </div>

//                       {/* Top Recruiters */}
//                       <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group/item">
//                         <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
//                         <div>
//                           <p className="text-sm font-semibold text-foreground">Top Recruiters</p>
//                           <p className="text-sm text-muted-foreground">{college!.topRecruiter}</p>
//                         </div>
//                       </div>

//                       {/* Specializations */}
//                       <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
//                         <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
//                           <Sparkles className="w-4 h-4 text-primary" />
//                           Specializations
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {college!.specializations.map((spec, idx) => (
//                             <Badge 
//                               key={idx} 
//                               variant="outline" 
//                               className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default border-primary/30"
//                             >
//                               {spec}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Empty State */}
//         {selectedCollegeData.length === 0 && (
//           <section className="py-20 px-4 animate-fade-in">
//             <div className="container mx-auto text-center">
//               <div className="relative inline-block mb-6">
//                 <GraduationCap className="w-20 h-20 text-primary mx-auto animate-pulse" />
//                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
//               </div>
//               <h3 className="text-2xl font-bold text-foreground mb-3">
//                 No Colleges Selected Yet
//               </h3>
//               <p className="text-muted-foreground text-lg mb-4">
//                 Select colleges from the dropdown above to start comparing
//               </p>
//               <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//                 <Sparkles className="w-4 h-4 text-accent" />
//                 <span>Choose up to 3 institutions for detailed comparison</span>
//               </div>
//             </div>
//           </section>
//         )}

//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Comparison;
