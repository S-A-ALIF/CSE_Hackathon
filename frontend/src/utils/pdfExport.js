import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// W3C official formula to convert OKLCH / OKLAB strings to standard RGB/RGBA for html2canvas compatibility
function replaceOklchWithRgb(str) {
  if (!str || typeof str !== 'string') return str;
  if (!str.includes('oklch') && !str.includes('oklab')) return str;

  return str.replace(/oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+(?:deg)?)(?:\s*\/\s*([0-9.]+%?))?\s*\)/gi, (match, lStr, cStr, hStr, aStr) => {
    let L = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
    let C = cStr.endsWith('%') ? parseFloat(cStr) / 100 : parseFloat(cStr);
    let H = parseFloat(hStr);
    let alpha = 1;
    if (aStr) {
      alpha = aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr);
    }

    const hRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hRad);
    const b = C * Math.sin(hRad);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const rLin =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    const toSrgb = (c) => {
      const clamped = Math.max(0, Math.min(1, c));
      const val = clamped <= 0.0031308
        ? clamped * 12.92
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
      return Math.round(Math.max(0, Math.min(255, val * 255)));
    };

    const R = toSrgb(rLin);
    const G = toSrgb(gLin);
    const B = toSrgb(bLin);

    return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
  });
}

export async function exportWebpageToPDF(elementId, filename = 'document.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x scale for crisp high-resolution text
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Remove dark mode classes so PDF always generates clean light-mode formatting
        clonedDoc.documentElement.classList.remove('dark');
        clonedDoc.body.classList.remove('dark');

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
          clonedEl.style.color = '#0f172a'; // slate-900
          clonedEl.style.padding = '32px';
          clonedEl.style.width = '800px';
          clonedEl.style.maxWidth = '800px';

          // Sanitize all computed OKLCH colors to standard RGB across all child elements
          const allNodes = [clonedEl, ...clonedEl.querySelectorAll('*')];
          const propsToSanitize = [
            'color',
            'backgroundColor',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
            'outlineColor',
            'textDecorationColor',
            'boxShadow',
            'textShadow'
          ];

          allNodes.forEach((node) => {
            if (node.style) {
              const computed = clonedDoc.defaultView ? clonedDoc.defaultView.getComputedStyle(node) : window.getComputedStyle(node);
              propsToSanitize.forEach((prop) => {
                try {
                  const val = computed[prop];
                  if (val && (val.includes('oklch') || val.includes('oklab'))) {
                    node.style[prop] = replaceOklchWithRgb(val);
                  }
                } catch (e) {
                  // Ignore inaccessible computed style property
                }
              });
            }
          });
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if content exceeds a single A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
}
