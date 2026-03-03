import { useEffect, useRef, useState } from 'react';
import { fetchInstitutions, getRandomInstitutions, Institution } from '@/services/institutionService';
import { useLeaflet } from '@/hooks/useLeaflet';

const MiniMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const leafletLoaded = useLeaflet();

  useEffect(() => {
    // Wait for Leaflet to be available - check window.L directly since hook might have timing issues
    if (!window.L || !mapRef.current) {
      if (!window.L) {
        console.log('MiniMap: Waiting for Leaflet.js...', { leafletLoaded, hasL: !!window.L });
      } else if (!mapRef.current) {
        console.log('MiniMap: Waiting for map container...');
      }
      return;
    }
    
    // If Leaflet is loaded but hook hasn't updated, proceed anyway
    if (!leafletLoaded && window.L) {
      console.log('MiniMap: Leaflet.js is available, proceeding with map initialization');
    }

    console.log('MiniMap: Initializing Leaflet map...');

    // Initialize map centered on India
    const map = window.L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true
    });

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Disable scroll zoom for mini map
    map.scrollWheelZoom.disable();

    mapInstanceRef.current = map;

    // Invalidate map size to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('MiniMap: Loading timeout - forcing map to render');
      setLoading(false);
      setError('Request timed out. Please check your backend connection.');
    }, 10000); // 10 second timeout

    // Fetch institutions and show random 5
    console.log('MiniMap: Fetching institutions from API...');
    fetchInstitutions()
      .then((data) => {
        console.log(`MiniMap: Fetched ${data.length} institutions from API`);
        
        // Filter out institutions without valid coordinates
        const validInstitutions = data.filter(
          (inst) => inst.lat != null && inst.lng != null && !isNaN(inst.lat) && !isNaN(inst.lng)
        );
        
        console.log(`MiniMap: ${validInstitutions.length} institutions have valid coordinates`);

        // Always set loading to false, even if no institutions
        setLoading(false);
        setError(null);

        // Get 5 random institutions (or all if less than 5)
        const randomInstitutions = validInstitutions.length > 0 
          ? getRandomInstitutions(validInstitutions, Math.min(5, validInstitutions.length))
          : [];
        
        setInstitutions(randomInstitutions);

        // Format website URL helper function
        const formatWebsiteUrl = (url: string) => {
          if (!url) return '';
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          return `https://${url}`;
        };

        // Create markers only if we have institutions
        if (randomInstitutions.length > 0) {
          randomInstitutions.forEach((institution) => {
            const marker = window.L.marker([institution.lat, institution.lng], {
              icon: window.L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            });

            const websiteUrl = institution.website ? formatWebsiteUrl(institution.website) : '';

            // Create popup content
            const popupContent = `
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1a1a1a;">
                  ${institution.name}
                </h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                  ${institution.address || `${institution.city}, ${institution.state}`}
                </p>
                ${websiteUrl ? `
                  <a href="${websiteUrl}" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; width: 100%; text-align: center;">
                    Visit Website
                  </a>
                ` : `
                  <p style="margin-top: 8px; padding: 6px 12px; background: #ccc; color: #666; text-align: center; border-radius: 4px; font-size: 14px;">
                    Website not available
                  </p>
                `}
              </div>
            `;

            marker.bindPopup(popupContent);

            // Open popup on hover
            marker.on('mouseover', function() {
              this.openPopup();
            });

            marker.addTo(map);
            markersRef.current.push(marker);
          });

          // Fit map bounds to show all markers
          const FeatureGroup = window.L.featureGroup as any;
          const group = new FeatureGroup(markersRef.current);
          map.fitBounds(group.getBounds().pad(0.1));
        } else {
          console.warn('MiniMap: No institutions with valid coordinates found');
        }
      })
      .catch((err) => {
        console.error('❌ MiniMap: Error loading institutions:', err);
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to load institutions');
      })
      .finally(() => {
        clearTimeout(loadingTimeout);
      });

    // Cleanup
    return () => {
      clearTimeout(loadingTimeout);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [leafletLoaded]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border relative">
      {/* Always render map container - Leaflet needs it to exist */}
      <div 
        ref={mapRef} 
        id="map"
        style={{ 
          height: '350px', 
          width: '100%',
          minHeight: '350px',
          zIndex: 0
        }} 
        className="leaflet-map-container"
      />
      
      {/* Loading overlay */}
      {(!leafletLoaded || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {!leafletLoaded ? 'Loading Leaflet.js...' : 'Loading map data...'}
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50">
          <div className="text-center p-4">
            <p className="text-destructive mb-2 font-semibold">Error: {error}</p>
            <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on port 5000</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {!error && institutions.length === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <p className="text-muted-foreground">No institutions found. Please check your database.</p>
        </div>
      )}
    </div>
  );
};

export default MiniMap;

