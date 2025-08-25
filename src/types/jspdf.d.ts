// TypeScript declaration to extend jsPDF types
declare module 'jspdf' {
  interface jsPDF {
    getNumberOfPages(): number;
    internal: {
      getNumberOfPages(): number;
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
  }
}

// Additional type extensions for better compatibility
declare global {
  interface Window {
    jsPDF: any;
  }
}

export {};
