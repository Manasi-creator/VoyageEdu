import { useEffect, useRef, useState } from 'react';
import { fetchInstitutions, Institution } from '@/services/institutionService';
import { useLeaflet } from '@/hooks/useLeaflet';

interface LeafletMapProps {
  height?: string;
  showAll?: boolean;
  maxMarkers?: number;
  enableClustering?: boolean;
  disableScrollZoom?: boolean;
}

const LeafletMap = ({ 
  height = '600px', 
  showAll = true, 
  maxMarkers = 5,
  enableClustering = true,
  disableScrollZoom = false
}: LeafletMapProps) => {
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
        console.log('LeafletMap: Waiting for Leaflet.js...', { leafletLoaded, hasL: !!window.L });
      } else if (!mapRef.current) {
        console.log('LeafletMap: Waiting for map container...');
      }
      return;
    }
    
    // If Leaflet is loaded but hook hasn't updated, proceed anyway
    if (!leafletLoaded && window.L) {
      console.log('LeafletMap: Leaflet.js is available, proceeding with map initialization');
    }

    console.log('Initializing Leaflet map...');

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

    // Disable scroll zoom if requested
    if (disableScrollZoom) {
      map.scrollWheelZoom.disable();
    }

    mapInstanceRef.current = map;

    // Invalidate map size to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('LeafletMap: Loading timeout - forcing map to render');
      setLoading(false);
      setError('Request timed out. Please check your backend connection.');
    }, 10000); // 10 second timeout

    // Fetch institutions
    console.log('Fetching institutions from API...');
    fetchInstitutions()
      .then((data) => {
        console.log(`Fetched ${data.length} institutions from API`);
        
        // Filter out institutions without valid coordinates
        const validInstitutions = data.filter(
          (inst) => inst.lat != null && inst.lng != null && !isNaN(inst.lat) && !isNaN(inst.lng)
        );
        
        console.log(`${validInstitutions.length} institutions have valid coordinates`);

        // Log institutions with missing coordinates
        const missingCoords = data.filter(
          (inst) => inst.lat == null || inst.lng == null || isNaN(inst.lat) || isNaN(inst.lng)
        );
        if (missingCoords.length > 0) {
          console.warn(`⚠️ ${missingCoords.length} institutions missing coordinates:`, missingCoords.map(i => i.name));
        }

        // Always set loading to false, even if no institutions
        setLoading(false);
        setError(null);

        // Limit markers if needed
        const institutionsToShow = showAll 
          ? validInstitutions 
          : validInstitutions.slice(0, maxMarkers);

        setInstitutions(institutionsToShow);

        // Create marker cluster group if clustering is enabled
        let markerGroup: any;
        if (enableClustering && window.L.markerClusterGroup) {
          const MarkerClusterGroup = window.L.markerClusterGroup as any;
          markerGroup = new MarkerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
          });
          map.addLayer(markerGroup);
        }

        // Format website URL helper function
        const formatWebsiteUrl = (url: string) => {
          if (!url) return '';
          if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
          }
          return `https://${url}`;
        };

        // Create markers only if we have institutions
        if (institutionsToShow.length === 0) {
          console.warn('LeafletMap: No institutions with valid coordinates to display');
          return; // Exit early if no institutions
        }

        // Create markers
        institutionsToShow.forEach((institution) => {
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
              <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">
                ${institution.address || `${institution.city || ''}${institution.city && institution.state ? ', ' : ''}${institution.state || ''}`.trim() || 'Location not specified'}
              </p>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${websiteUrl ? `
                  <a href="${websiteUrl}" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     style="display: inline-block; padding: 6px 12px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; width: 100%; text-align: center;"
                     aria-label="Visit institution website">
                    Visit Website
                  </a>
                ` : `
                  <div style="padding: 6px 12px; background: #f0f0f0; color: #666; text-align: center; border-radius: 4px; font-size: 14px;">
                    Website not available
                  </div>
                `}
                
                <button onclick="(function(e) { 
                  e.stopPropagation(); 
                  const searchQuery = ['${institution.name.replace(/'/g, "\\'")}', 
                                     '${institution.city ? institution.city.replace(/'/g, "\\'") : ''}', 
                                     '${institution.state ? institution.state.replace(/'/g, "\\'") : ''}']
                                   .filter(Boolean).join(', ');
                  if (${institution.lat} && ${institution.lng}) {
                    window.open('https://www.google.com/maps/dir/?api=1&destination=${institution.lat},${institution.lng}', '_blank', 'noopener,noreferrer');
                  } else if (searchQuery) {
                    const encodedQuery = encodeURIComponent(searchQuery);
                    window.open('https://www.google.com/maps/search/?api=1&query=' + encodedQuery, '_blank', 'noopener,noreferrer');
                  } else {
                    const errorEl = document.createElement('div');
                    errorEl.style.color = '#e53e3e';
                    errorEl.style.fontSize = '12px';
                    errorEl.style.marginTop = '4px';
                    errorEl.textContent = 'Location not found';
                    e.target.parentNode.appendChild(errorEl);
                    setTimeout(() => errorEl.remove(), 3000);
                  }
                  return false; 
                })(event);"
                style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 6px 12px; background: #38a169; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;"
                aria-label="Get directions to ${institution.name.replace(/"/g, '&quot;')}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Get Directions
                </button>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Open popup on hover
          marker.on('mouseover', function() {
            this.openPopup();
          });

          // Add marker to group or map
          if (markerGroup) {
            markerGroup.addLayer(marker);
          } else {
            marker.addTo(map);
          }

          markersRef.current.push(marker);
        });

        // Fit map bounds to show all markers
        if (institutionsToShow.length > 0) {
          if (markerGroup) {
            map.fitBounds(markerGroup.getBounds().pad(0.1));
          } else {
            const FeatureGroup = window.L.featureGroup as any;
            const group = new FeatureGroup(markersRef.current);
            map.fitBounds(group.getBounds().pad(0.1));
          }
        }
      })
      .catch((err) => {
        console.error('Error loading institutions:', err);
        setError('Failed to load institutions. Please try again later.');
        setLoading(false);
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
  }, [leafletLoaded, showAll, maxMarkers, enableClustering, disableScrollZoom]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg border relative">
      {/* Always render map container - Leaflet needs it to exist */}
      <div 
        ref={mapRef} 
        id="map"
        style={{ 
          height, 
          width: '100%',
          minHeight: '400px',
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
            {!leafletLoaded && (
              <p className="text-sm text-muted-foreground mt-2">Please wait while the map library loads</p>
            )}
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-50">
          <div className="text-center p-4">
            <p className="text-destructive mb-2 font-semibold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;

