/**
 * Helper function to create a print-friendly version of the page
 */
export const printElement = (elementId: string, title?: string) => {
  const printContent = document.getElementById(elementId);
  if (!printContent) return;
  
  const windowUrl = 'about:blank';
  const uniqueName = `print_${new Date().getTime()}`; // Convert to string with a prefix
  
  const printWindow = window.open(windowUrl, uniqueName, 'left=0,top=0,width=800,height=600');
  
  if (!printWindow) {
    alert("Please allow popups for this website");
    return;
  }
  
  const printDocument = printWindow.document;
  
  printDocument.open();
  
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        if (styleSheet.href) {
          return `<link rel="stylesheet" type="text/css" href="${styleSheet.href}" />`;
        } else {
          return `<style>${Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('\n')}</style>`;
        }
      } catch (e) {
        // Cross-origin stylesheet access may throw an error
        if (styleSheet.href) {
          return `<link rel="stylesheet" type="text/css" href="${styleSheet.href}" />`;
        }
        return '';
      }
    })
    .join('');
  
  printDocument.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print'}</title>
        ${styles}
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          setTimeout(function() {
            window.print();
            window.close();
          }, 500);
        </script>
      </body>
    </html>
  `);
  
  printDocument.close();
};

/**
 * Utility to trigger browser print dialog
 */
export const printPage = () => {
  window.print();
};
