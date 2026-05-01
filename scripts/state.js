// Simple in-memory state model for the 4-step Assona funnel.
// This is intentionally minimal and can be extended as needed.

export const funnelState = {
  currentStep: 1, // 1–4
  upload: {
    pdfName: 'Rechnung-003.pdf',
    documentType: 'invoice', // 'invoice' | 'estimate'
    // In a real app you might store a Blob or URL here
    pdfData: null,
  },
  damage: {
    types: new Set(['partial']), // 'partial' | 'uvv' | 'inspection'
    causes: new Set(), // set of cause labels
  },
  validation: {
    // placeholder; fill with concrete flags/values as we port step 3
  },
  review: {
    invoiceItems: [], // array of items for the accordion
    totals: {
      net: '677,28 EUR',
      taxRate: '19,00 %',
      gross: '805,69 EUR',
    },
    submitted: false,
  },
};

export function setStep(step) {
  funnelState.currentStep = step;
}

