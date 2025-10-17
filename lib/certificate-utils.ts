/**
 * Utility functions for generating and downloading certificates
 */

interface CertificateData {
  userName: string;
  achievement: string;
  date: string;
  points: number;
  certificateId: string;
}

/**
 * Generate certificate content in text format
 */
export function generateCertificateText(data: CertificateData, language: 'en' | 'kn' = 'en'): string {
  const content = language === 'kn' ? 
    `ಪರ್ಯಾವರಣ ಪ್ರಮಾಣಪತ್ರ
===================

ಪ್ರಮಾಣಪತ್ರ ID: ${data.certificateId}
ದಿನಾಂಕ: ${data.date}

ಪ್ರತಿಫಲಿಸುವವರು: ${data.userName}
ಸಾಧನೆ: ${data.achievement}
ಅಂಕಗಳು: ${data.points}

ಈ ಪ್ರಮಾಣಪತ್ರವು ನೀವು ಅಪಶಿಷ್ಟ ವರ್ಗೀಕರಣ ಮತ್ತು ಪರ್ಯಾವರಣ ಸಂರಕ್ಷಣೆಗೆ 
ನೀಡಿದ ಕೊಡುಗೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.

ಅಭಿನಂದನೆಗಳು!
OpenCity AI Hub` :
    `Environmental Certificate
===================

Certificate ID: ${data.certificateId}
Date: ${data.date}

Recipient: ${data.userName}
Achievement: ${data.achievement}
Points: ${data.points}

This certificate recognizes your contribution to waste classification 
and environmental protection.

Congratulations!
OpenCity AI Hub`;

  return content;
}

/**
 * Generate certificate content in HTML format
 */
export function generateCertificateHTML(data: CertificateData, language: 'en' | 'kn' = 'en'): string {
  const title = language === 'kn' ? 'ಪರ್ಯಾವರಣ ಪ್ರಮಾಣಪತ್ರ' : 'Environmental Certificate';
  const certificateId = language === 'kn' ? 'ಪ್ರಮಾಣಪತ್ರ ID' : 'Certificate ID';
  const date = language === 'kn' ? 'ದಿನಾಂಕ' : 'Date';
  const recipient = language === 'kn' ? 'ಪ್ರತಿಫಲಿಸುವವರು' : 'Recipient';
  const achievement = language === 'kn' ? 'ಸಾಧನೆ' : 'Achievement';
  const points = language === 'kn' ? 'ಅಂಕಗಳು' : 'Points';
  const description = language === 'kn' ? 
    'ಈ ಪ್ರಮಾಣಪತ್ರವು ನೀವು ಅಪಶಿಷ್ಟ ವರ್ಗೀಕರಣ ಮತ್ತು ಪರ್ಯಾವರಣ ಸಂರಕ್ಷಣೆಗೆ ನೀಡಿದ ಕೊಡುಗೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.' :
    'This certificate recognizes your contribution to waste classification and environmental protection.';
  const congratulations = language === 'kn' ? 'ಅಭಿನಂದನೆಗಳು!' : 'Congratulations!';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
        }
        .certificate {
            border: 2px solid #4ade80;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            color: #4ade80;
            font-size: 32px;
            margin-bottom: 30px;
            font-weight: bold;
        }
        .content {
            text-align: left;
            margin: 30px 0;
        }
        .field {
            margin: 15px 0;
            display: flex;
        }
        .label {
            font-weight: bold;
            width: 150px;
            color: #333;
        }
        .value {
            flex: 1;
            color: #666;
        }
        .description {
            text-align: center;
            margin: 30px 0;
            font-style: italic;
            color: #555;
        }
        .signature {
            margin-top: 50px;
            text-align: right;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #4ade80;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">${title}</div>
        
        <div class="content">
            <div class="field">
                <div class="label">${certificateId}:</div>
                <div class="value">${data.certificateId}</div>
            </div>
            <div class="field">
                <div class="label">${date}:</div>
                <div class="value">${data.date}</div>
            </div>
            <div class="field">
                <div class="label">${recipient}:</div>
                <div class="value">${data.userName}</div>
            </div>
            <div class="field">
                <div class="label">${achievement}:</div>
                <div class="value">${data.achievement}</div>
            </div>
            <div class="field">
                <div class="label">${points}:</div>
                <div class="value">${data.points}</div>
            </div>
        </div>
        
        <div class="description">${description}</div>
        
        <div class="signature">
            <div>___________________________</div>
            <div>OpenCity AI Hub Team</div>
        </div>
        
        <div class="footer">${congratulations}</div>
    </div>
</body>
</html>`;
}

/**
 * Download certificate as a file
 */
export function downloadCertificate(data: CertificateData, format: 'txt' | 'html' = 'html', language: 'en' | 'kn' = 'en'): void {
  const content = format === 'html' ? 
    generateCertificateHTML(data, language) : 
    generateCertificateText(data, language);
  
  const blob = new Blob([content], { 
    type: format === 'html' ? 'text/html' : 'text/plain' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fileName = `certificate_${data.certificateId}_${language}.${format}`;
  
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}