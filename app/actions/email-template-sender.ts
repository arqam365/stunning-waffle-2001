export function getSenderEmailTemplate({
                                           name,
                                       }: {
    name: string
}) {
    const firstName = name.split(' ')[0]

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0f0f; color: #e5e5e5;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0f0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d1515 0%, #0a0f0f 100%); border: 1px solid rgba(0, 255, 200, 0.1); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, rgba(0,255,200,0.08) 0%, rgba(0,255,200,0.03) 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(0, 255, 200, 0.15);">
              <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #00ffc8; letter-spacing: 0.5px;">
                Thanks for reaching out, ${firstName}!
              </h1>
              <p style="margin: 12px 0 0 0; font-size: 13px; color: #7a9999; font-family: 'Courier New', monospace; letter-spacing: 0.5px;">
                ~/confirmation
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #e5e5e5;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #e5e5e5;">
                I've received your message and I'm excited to hear from you! I read every message personally and will get back to you as soon as possible — usually within 24-48 hours.
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.7; color: #e5e5e5;">
                In the meantime, feel free to check out my recent work and connect with me on other platforms:
              </p>
              
              <!-- Social links -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px;">
                          <a href="https://github.com/Bilal2001" 
                             style="display: inline-block; padding: 12px 20px; background: rgba(0, 255, 200, 0.08); border: 1px solid rgba(0, 255, 200, 0.2); color: #00ffc8; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 4px; letter-spacing: 0.3px;">
                            GitHub
                          </a>
                        </td>
                        <td style="padding: 0 10px;">
                          <a href="https://www.linkedin.com/in/mohammedbilalsheikh/" 
                             style="display: inline-block; padding: 12px 20px; background: rgba(0, 255, 200, 0.08); border: 1px solid rgba(0, 255, 200, 0.2); color: #00ffc8; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 4px; letter-spacing: 0.3px;">
                            LinkedIn
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info box -->
              <div style="background: rgba(0, 255, 200, 0.05); border-left: 3px solid #00ffc8; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #b3d9d9;">
                  <strong style="color: #00ffc8;">💡 Quick tip:</strong> If your project has a tight deadline or specific requirements, feel free to mention them in your follow-up email — it helps me prioritize!
                </p>
              </div>
              
              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.7; color: #e5e5e5;">
                Talk soon,<br>
                <strong style="color: #00ffc8;">Mohammed Bilal Sheikh</strong>
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: rgba(0, 0, 0, 0.3); padding: 25px 30px; border-top: 1px solid rgba(0, 255, 200, 0.08); text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #7a9999;">
                Python Backend Engineer | Systems Architect
              </p>
              <p style="margin: 0; font-size: 11px; color: #5a7777;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>
          
        </table>
        
        <!-- Footer legal -->
        <p style="margin: 30px 0 0 0; font-size: 11px; color: #5a7777; text-align: center; line-height: 1.5;">
          © 2026 Mohammed Bilal Sheikh. All rights reserved.<br>
          If you didn't send this message, please disregard this email.
        </p>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim()
}