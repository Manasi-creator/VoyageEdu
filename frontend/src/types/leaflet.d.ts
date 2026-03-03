// Type declarations for Leaflet.js loaded via CDN
declare global {
  interface Window {
    L: {
      map: (element: HTMLElement | string, options?: any) => any;
      tileLayer: (urlTemplate: string, options?: any) => any;
      marker: (latlng: [number, number], options?: any) => any;
      icon: (options: any) => any;
      featureGroup: new (layers?: any[]) => any;
      markerClusterGroup: new (options?: any) => any;
    };
  }
}

export {};

