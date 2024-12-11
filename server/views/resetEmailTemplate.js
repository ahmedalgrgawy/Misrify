export const resetEmailTemplate = (resetOtp, name) => {
    return `
            <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }

                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .email-header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px 0;
                    font-size: 24px;
                    font-weight: bold;
                }

                .email-body {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                }

                .otp-code {
                    display: inline-block;
                    background-color: #f9f9f9;
                    color: #333333;
                    padding: 10px 20px;
                    font-size: 20px;
                    font-weight: bold;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    margin: 20px 0;
                }

                .email-footer {
                    text-align: center;
                    padding: 10px;
                    background-color: #f4f4f4;
                    font-size: 12px;
                    color: #666666;
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="email-header">
                    Your OTP Code
                </div>

                <!-- Body -->
                <div class="email-body">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>We received a request to reset your account password. Use the OTP below to complete your login:</p>

                    <div class="otp-code">${resetOtp}</div>

                    <p>If you did not request this, please ignore this email or contact our support team for assistance.</p>

                    <p>Thank you,<br>Misrify Store</p>
                </div>

                <!-- Footer -->
                <div class="email-footer">
                    &copy; 2025 Misrify Store. All rights reserved.
                </div>
            </div>
        </body>

        </html>
    `
}