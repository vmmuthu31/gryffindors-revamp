import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { uniqueCode: code },
      include: {
        user: {
          select: { name: true, email: true },
        },
        application: {
          include: {
            internship: {
              select: { title: true, track: true },
            },
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const studentName = certificate.user.name || "Student";
    const programTitle = certificate.application.internship.title;
    const issuedDate = new Date(certificate.issuedAt).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    const grade = certificate.grade || "Pass";

    // Use request URL to get the origin for images
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    // Generate HTML certificate with actual logos
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${certificate.uniqueCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    @page {
      size: A4 landscape;
      margin: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .certificate {
      width: 1056px;
      height: 748px;
      background: linear-gradient(135deg, #841a1c 0%, #a52528 50%, #681416 100%);
      border-radius: 12px;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(215,156,100,0.1) 0%, transparent 50%);
    }
    
    .inner {
      background: white;
      border-radius: 8px;
      padding: 48px 64px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .border-pattern {
      position: absolute;
      inset: 12px;
      border: 2px solid #d79c64;
      border-radius: 4px;
      pointer-events: none;
    }
    
    .top-logos {
      position: absolute;
      top: 30px;
      left: 32px;
      right: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-img {
      height: 50px;
      width: auto;
      object-fit: contain;
    }

    .msme-img{
      height: 72px;
      width: auto;
      object-fit: contain;
    }
    
    .center-logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .main-logo {
      height: 84px;
      width: auto;
      object-fit: contain;
    }
    
    .company-name {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #841a1c;
      letter-spacing: 4px;
      margin-bottom: 8px;
      margin-top: 0px;
    }
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      font-weight: 700;
      color: #841a1c;
      margin-bottom: 8px;
    }
    
    .subtitle {
      font-size: 13px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 28px;
    }
    
    .certify-text {
      font-size: 15px;
      color: #888;
      margin-bottom: 6px;
    }
    
    .name {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 14px;
      border-bottom: 2px solid #d79c64;
      padding-bottom: 8px;
    }
    
    .program-text {
      font-size: 13px;
      color: #888;
      margin-bottom: 5px;
    }
    
    .program {
      font-size: 22px;
      font-weight: 600;
      color: #841a1c;
      margin-bottom: 24px;
    }
    
    .details {
      display: flex;
      gap: 80px;
      margin-top: 12px;
    }
    
    .detail {
      text-align: center;
    }
    
    .detail-label {
      font-size: 10px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
    
    .grade-badge {
      background: linear-gradient(135deg, #d79c64 0%, #b8864f 100%);
      color: white;
      padding: 5px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .bottom-section {
      position: absolute;
      bottom: 24px;
      left: 32px;
      right: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .verify-section {
      text-align: left;
    }
    
    .verify-label {
      font-size: 9px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .verify-code {
      font-family: monospace;
      font-size: 13px;
      color: #841a1c;
      font-weight: 600;
    }
    
    .verify-url {
      font-size: 9px;
      color: #aaa;
    }
    
    .seal-section {
      text-align: center;
    }
    
    .seal {
      width: 80px;
      height: 80px;
      border: 4px double #22c55e;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 30% 30%, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
      box-shadow: inset 0 2px 8px rgba(34, 197, 94, 0.2), 0 2px 8px rgba(34, 197, 94, 0.15);
      position: relative;
    }
    
    .seal::before {
      content: '';
      position: absolute;
      inset: 6px;
      border: 2px solid #22c55e;
      border-radius: 50%;
    }
    
    .seal-icon {
      font-size: 20px;
      margin-bottom: 2px;
    }
    
    .seal-text {
      font-size: 8px;
      color: #166534;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .seal-subtext {
      font-size: 6px;
      color: #15803d;
      font-weight: 600;
    }
    
    .signature-section {
      text-align: center;
    }
    
    .signature-img {
      height: 50px;
      width: auto;
      object-fit: contain;
      margin-bottom: 4px;
    }
    
    .signature-line {
      width: 150px;
      border-bottom: 1px solid #999;
      margin-bottom: 4px;
    }
    
    .signature-name {
      font-size: 11px;
      font-weight: 600;
      color: #333;
    }
    
    .signature-title {
      font-size: 10px;
      color: #888;
      font-weight: 500;
    }
    
    @media print {
      body { background: white; padding: 0; }
      .certificate { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner">
      <div class="border-pattern"></div>
      
      <!-- Top Logos -->
      <div class="top-logos">
        <img src="${baseUrl}/assets/msme.png" alt="MSME" class="msme-img" onerror="this.style.display='none'" />
        <div class="center-logo-container">
          <img src="${baseUrl}/assets/logo.png" alt="Gryffindors" class="main-logo" />
        </div>
        <img src="${baseUrl}/assets/dpiit.png" alt="DPIIT" class="logo-img" onerror="this.style.display='none'" />
      </div>
      
      <div class="company-name">GRYFFINDORS</div>
      <h1 class="title">Certificate of Completion</h1>
      <p class="subtitle">Internship Program</p>
      
      <p class="certify-text">This is to certify that</p>
      <h2 class="name">${studentName}</h2>
      
      <p class="program-text">has successfully completed the</p>
      <h3 class="program">${programTitle}</h3>
      
      <div class="details">
        <div class="detail">
          <p class="detail-label">Date Issued</p>
          <p class="detail-value">${issuedDate}</p>
        </div>
        <div class="detail">
          <p class="detail-label">Grade</p>
          <p class="detail-value"><span class="grade-badge">${grade}</span></p>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="bottom-section">
        <div class="verify-section">
          <p class="verify-label">Verification Code</p>
          <p class="verify-code">${certificate.uniqueCode}</p>
          <p class="verify-url">gryffindors.in/verify-certificate/${certificate.uniqueCode}</p>
        </div>
        
        <div class="seal-section">
          <div class="seal">
            <span class="seal-icon">✓</span>
            <span class="seal-text">Verified</span>
            <span class="seal-subtext">Authentic</span>
          </div>
        </div>
        
        <div class="signature-section">
          <img src="${baseUrl}/assets/sign.png" alt="Signature" class="signature-img" />
          <div class="signature-line"></div>
          <p class="signature-name">CEO</p>
          <p class="signature-title">Gryffindors</p>
        </div>
      </div>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Failed to generate certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
