import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import mammoth from "https://esm.sh/mammoth@1.6.0";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parse HTML content into structured elements
function parseHtmlToElements(html: string): { type: string; content: string; level?: number }[] {
  const elements: { type: string; content: string; level?: number }[] = [];
  
  // Match headings, paragraphs, lists, etc.
  const regex = /<(h[1-6]|p|li|ul|ol|strong|em|br|div)[^>]*>(.*?)<\/\1>|<br\s*\/?>/gis;
  
  let lastIndex = 0;
  let match;
  
  // Process HTML by extracting meaningful elements
  const processedHtml = html
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/<script[^>]*>.*?<\/script>/gis, '');
  
  // Split by block elements
  const blockPattern = /<(h[1-6]|p|div|li|tr|table)[^>]*>([\s\S]*?)<\/\1>/gi;
  
  let blockMatch;
  while ((blockMatch = blockPattern.exec(processedHtml)) !== null) {
    const tag = blockMatch[1].toLowerCase();
    let content = blockMatch[2]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '...')
      .trim();
    
    if (!content) continue;
    
    if (tag.startsWith('h')) {
      const level = parseInt(tag[1]);
      elements.push({ type: 'heading', content, level });
    } else if (tag === 'li') {
      elements.push({ type: 'list-item', content });
    } else {
      elements.push({ type: 'paragraph', content });
    }
  }
  
  // If no elements found, fall back to plain text extraction
  if (elements.length === 0) {
    const plainText = processedHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    const paragraphs = plainText.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (trimmed) {
        elements.push({ type: 'paragraph', content: trimmed });
      }
    }
  }
  
  return elements;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[doc-to-pdf] Received request");
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error("[doc-to-pdf] No file provided");
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[doc-to-pdf] Processing file: ${file.name}, size: ${file.size} bytes`);

    const fileBuffer = await file.arrayBuffer();
    
    console.log("[doc-to-pdf] Converting DOCX to HTML...");
    const result = await mammoth.convertToHtml({ 
      arrayBuffer: fileBuffer 
    });
    
    const htmlContent = result.value;
    const messages = result.messages;
    
    if (messages.length > 0) {
      console.log("[doc-to-pdf] Mammoth messages:", messages);
    }
    
    console.log("[doc-to-pdf] HTML conversion complete, generating PDF...");
    
    // Parse HTML into structured elements
    const elements = parseHtmlToElements(htmlContent);
    console.log(`[doc-to-pdf] Parsed ${elements.length} elements`);
    
    // Create PDF with better settings
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 25;
    const marginRight = 25;
    const marginTop = 30;
    const marginBottom = 25;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    // Font settings
    const fonts = {
      heading1: { size: 18, lineHeight: 10 },
      heading2: { size: 16, lineHeight: 9 },
      heading3: { size: 14, lineHeight: 8 },
      heading4: { size: 12, lineHeight: 7 },
      paragraph: { size: 11, lineHeight: 6 },
      listItem: { size: 11, lineHeight: 6 }
    };
    
    let y = marginTop;
    let pageNumber = 1;
    
    // Add page number footer
    const addPageNumber = () => {
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    };
    
    // Check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (y + requiredSpace > pageHeight - marginBottom) {
        addPageNumber();
        doc.addPage();
        pageNumber++;
        y = marginTop;
        return true;
      }
      return false;
    };
    
    // Process each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (element.type === 'heading') {
        const level = element.level || 1;
        const fontKey = `heading${Math.min(level, 4)}` as keyof typeof fonts;
        const font = fonts[fontKey];
        
        // Add extra space before headings (except first element)
        if (i > 0) {
          checkNewPage(font.lineHeight * 2);
          y += font.lineHeight;
        }
        
        doc.setFontSize(font.size);
        doc.setFont('helvetica', 'bold');
        
        const lines = doc.splitTextToSize(element.content, contentWidth);
        
        for (const line of lines) {
          checkNewPage(font.lineHeight);
          doc.text(line, marginLeft, y);
          y += font.lineHeight;
        }
        
        // Add space after heading
        y += 3;
        
      } else if (element.type === 'list-item') {
        const font = fonts.listItem;
        
        doc.setFontSize(font.size);
        doc.setFont('helvetica', 'normal');
        
        // Add bullet point
        const bulletIndent = 8;
        const textIndent = marginLeft + bulletIndent;
        const textWidth = contentWidth - bulletIndent;
        
        const lines = doc.splitTextToSize(element.content, textWidth);
        
        checkNewPage(font.lineHeight);
        
        // Draw bullet
        doc.text('•', marginLeft + 2, y);
        
        // Draw text
        for (let j = 0; j < lines.length; j++) {
          if (j > 0) {
            checkNewPage(font.lineHeight);
          }
          doc.text(lines[j], textIndent, y);
          y += font.lineHeight;
        }
        
      } else {
        // Paragraph
        const font = fonts.paragraph;
        
        // Add space between paragraphs
        if (i > 0 && elements[i - 1].type !== 'heading') {
          y += 2;
        }
        
        doc.setFontSize(font.size);
        doc.setFont('helvetica', 'normal');
        
        const lines = doc.splitTextToSize(element.content, contentWidth);
        
        for (const line of lines) {
          checkNewPage(font.lineHeight);
          doc.text(line, marginLeft, y);
          y += font.lineHeight;
        }
      }
    }
    
    // Add page number to last page
    addPageNumber();
    
    console.log("[doc-to-pdf] PDF generation complete");
    
    // Get PDF as array buffer
    const pdfOutput = doc.output('arraybuffer');
    
    console.log(`[doc-to-pdf] PDF size: ${pdfOutput.byteLength} bytes, pages: ${pageNumber}`);

    return new Response(pdfOutput, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^.]+$/, '')}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error("[doc-to-pdf] Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Conversion failed',
        details: String(error)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
