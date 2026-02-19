export function getAdminEmailTemplate({
                                          name,
                                          email,
                                          message,
                                          timestamp,
                                          userAgent,
                                          ipAddress,
                                      }: {
    name: string
    email: string
    message: string
    timestamp: string
    userAgent?: string
    ipAddress?: string
}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0f0f; color: #e5e5e5;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0f0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d1515 0%, #0a0f0f 100%); border: 1px solid rgba(0, 255, 200, 0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, rgba(0,255,200,0.08) 0%, rgba(0,255,200,0.03) 100%); padding: 30px; border-bottom: 1px solid rgba(0, 255, 200, 0.15);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #00ffc8; letter-spacing: 0.5px; text-transform: uppercase;">
                🎯 New Message Received
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #7a9999; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">
                ~/contact-form/inbox
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Sender info card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0, 255, 200, 0.03); border: 1px solid rgba(0, 255, 200, 0.1); border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; font-size: 11px; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 1px; color: #7a9999;">
                      Sender Details
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; font-size: 12px; color: #7a9999;">Name</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #e5e5e5;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(0, 255, 200, 0.08);">
                          <p style="margin: 0; font-size: 12px; color: #7a9999;">Email</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #00ffc8;">
                            <a href="mailto:${email}" style="color: #00ffc8; text-decoration: none;">${email}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message content -->
              <div style="margin-bottom: 30px;">
                <p style="margin: 0 0 12px 0; font-size: 11px; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 1px; color: #7a9999;">
                  Message
                </p>
                <div style="background: rgba(0, 255, 200, 0.02); border-left: 3px solid #00ffc8; padding: 20px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #e5e5e5; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Reply CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="mailto:${email}?subject=Re: Your message from portfolio" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00ffc8 0%, #00e5b3 100%); color: #0a0f0f; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(0, 255, 200, 0.3);">
                      Reply to ${name.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Metadata footer -->
          <tr>
            <td style="background: rgba(0, 0, 0, 0.3); padding: 20px 30px; border-top: 1px solid rgba(0, 255, 200, 0.08);">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 11px; color: #5a7777; font-family: 'Courier New', monospace;">
                <tr>
                  <td style="padding: 4px 0;">
                    <strong>Timestamp:</strong> ${timestamp}
                  </td>
                </tr>
                ${userAgent ? `
                <tr>
                  <td style="padding: 4px 0;">
                    <strong>User Agent:</strong> ${userAgent.substring(0, 80)}...
                  </td>
                </tr>
                ` : ''}
                ${ipAddress ? `
                <tr>
                  <td style="padding: 4px 0;">
                    <strong>IP Address:</strong> ${ipAddress}
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Footer text -->
        <p style="margin: 30px 0 0 0; font-size: 12px; color: #5a7777; text-align: center;">
          Automated notification from portfolio contact form
        </p>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim()
}