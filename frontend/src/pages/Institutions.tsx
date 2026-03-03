import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Users, MapPin, Award, ExternalLink, Search, Filter, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { InstitutionMetadata } from "@/services/institutionMetadataService";

const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const Institutions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial values from URL params or use defaults
  const searchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filterType, setFilterType] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [institutions, setInstitutions] = useState<InstitutionMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  // Fetch institutions from the backend API
const fetchInstitutions = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (filterType !== 'all') params.set('location_type', filterType);
    if (filterState !== 'all') params.set('state', filterState);
    params.set('sort', sortBy); 
    params.set('flat', 'true');

    const apiUrl = `http://localhost:5000/api/institutions?${params.toString()}`;
    console.log('Fetching from:', apiUrl);
    
    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      console.log('Response status:', response.status);
      
      // First, read the response as text
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
      
      // Then try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', typeof data, data);
        throw new Error(`Expected array of institutions but got ${typeof data}`);
      }
      
      console.log(`Successfully parsed ${data.length} institutions`);
      setInstitutions(data);
      
      // Update URL with search params
      navigate({ search: params.toString() }, { replace: true });
      
    } catch (fetchError) {
      const status = response?.status;
      const statusText = response?.statusText;
      console.error('Fetch error:', {
        status,
        statusText,
        error: fetchError,
        url: apiUrl
      });
      
      throw new Error(
        status 
          ? `Request failed with status ${status}: ${statusText}` 
          : `Network error: ${fetchError.message}`
      );
    }
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load institutions';
    console.error('Error in fetchInstitutions:', errorMessage, err);
    setError(errorMessage);
    setInstitutions([]);
  } finally {
    setLoading(false);
  }
}, [searchTerm, filterType, filterState, sortBy, navigate]);

  // Initial data fetch and when filters change
  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);
  

  // Update search term when URL changes (e.g., when user navigates with back/forward)
  useEffect(() => {
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const state = searchParams.get('state');
    
    if (search !== null && search !== searchTerm) {
      setSearchTerm(search);
    }
    if (type !== null) {
      setFilterType(type);
    }
    if (state !== null) {
      setFilterState(state);
    }
  }, [searchParams, searchTerm]);

  // Server-side filtering is now handled by the backend
  const filteredInstitutions = institutions || [];

  const handleSortChange = (value: string) => {
  setSortBy(value);
  setCurrentPage(1); // Reset to first page when changing sort
};

  const institutionTypes = useMemo(() => {
    const types = (institutions || [])
      .map(inst => inst?.type || inst?.location_type || 'Educational Institution')
      .filter((type): type is string => !!type);
    return [...new Set(types)];
  }, [institutions]);

  const states = useMemo(() => {
    return [...new Set((institutions || []).map(inst => inst?.state).filter(Boolean))];
  }, [institutions]);

  // Format website URL helper
  const formatWebsiteUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Handle filter changes
  const handleTypeChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const handleStateChange = (value: string) => {
    setFilterState(value);
    setCurrentPage(1);
  };

  // Handle search input change
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(localSearchTerm);
      setCurrentPage(1);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const currentItems = filteredInstitutions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterState]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading institutions</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Discover Educational Institutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore a comprehensive directory of educational institutions across India with detailed information and insights.
          </p>
        </div>
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-semibold">Find Institutions</h2>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? `Showing results for "${searchTerm}"`
                    : "Filter and search through our comprehensive database"}
                </p>
              </div>
              <div className="w-full md:w-auto grid grid-cols-1 md:flex md:items-center gap-3 mt-4 md:mt-0">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="-name">Name (Z-A)</SelectItem>
                    <SelectItem value="year_of_establishment">Established (Oldest first)</SelectItem>
                    <SelectItem value="-year_of_establishment">Established (Newest first)</SelectItem>
                    <SelectItem value="state">State (A-Z)</SelectItem>
                    <SelectItem value="-state">State (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterState} onValueChange={handleStateChange}>
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <SelectValue placeholder="All States & UTs" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="all">All States & UTs</SelectItem>
                    {INDIAN_STATES_AND_UTS.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[2fr] gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, city, state, or AISHE code..."
                  className="pl-10 h-12 text-base"
                  value={localSearchTerm}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading institutions...</span>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {searchTerm 
                  ? `No results found for "${searchTerm}"`
                  : 'No institutions found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Try adjusting your filters to find what you\'re looking for.'}
              </p>
              {(searchTerm || filterState !== 'all' || filterType !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterState('all');
                    setFilterType('all');
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
                  Showing <span className="font-medium text-foreground">{currentItems.length}</span> of{' '}
                  <span className="font-medium text-foreground">{filteredInstitutions.length}</span> institutions
                  {searchTerm && (
                    <span> matching <span className="font-medium text-foreground">"{searchTerm}"</span></span>
                  )}
                </p>
                <div className="text-sm text-muted-foreground">
                  Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                  <span className="font-medium text-foreground">{totalPages}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((institution) => (
                  <InstitutionCard key={institution._id} institution={institution} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredInstitutions.length)} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredInstitutions.length)} of {filteredInstitutions.length} institutions
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-24"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, current page, and pages around current
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className={`w-10 h-10 p-0 ${currentPage === pageNum ? '' : 'border-border'}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 border-border"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-24"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const InstitutionCard = ({ institution }: { institution: InstitutionMetadata }) => {
  const [showLocationError, setShowLocationError] = useState(false);

  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleGetDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If we have coordinates, use them directly
    if (institution.lat && institution.lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${institution.lat},${institution.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // If we have address components, try to build a search query
    const searchQuery = [institution.name, institution.district, institution.state]
      .filter(Boolean)
      .join(', ');
      
    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // No location data available
      setShowLocationError(true);
      // Hide the error after 3 seconds
      setTimeout(() => setShowLocationError(false), 3000);
    }
  };

  const locationLabel = [institution.district, institution.state].filter(Boolean).join(', ');
  const hasLocationData = (institution.lat && institution.lng) || 
                         (institution.name && (institution.district || institution.state));

  return (
    <div className="group h-full flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6 pb-4 border-b border-border">
        <h3 className="text-lg font-semibold leading-tight tracking-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {institution.name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {institution.state && (
            <Badge variant="secondary" className="text-xs font-medium">
              {institution.state}
            </Badge>
          )}
          {institution.district && (
            <Badge variant="outline" className="text-xs">
              {institution.district}
            </Badge>
          )}
          {institution.location_type && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {institution.location_type.charAt(0).toUpperCase() + institution.location_type.slice(1)}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-4 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">State & District</p>
          <p className="font-medium">{locationLabel || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">AISHE Code</p>
          <p className="font-mono text-sm font-medium">{institution.aishe_code || 'Not available'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Year of Establishment</p>
          <p className="font-medium">{institution.year_of_establishment || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Location Type</p>
          <p className="font-medium capitalize">{institution.location_type || 'Not specified'}</p>
        </div>

        <div className="pt-4 border-t border-border mt-auto space-y-2">
          {institution.website && (
            <a
              href={formatWebsiteUrl(institution.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Visit ${institution.name} website`}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Visit Website
            </a>
          )}
          
          <button
            onClick={handleGetDirections}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label={`Get directions to ${institution.name}`}
          >
            <MapPin className="h-4 w-4 mr-1.5" />
            Get Directions
          </button>
          
          {showLocationError && (
            <div className="text-xs text-red-500 mt-1">
              Location not found for this college.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Institutions;

