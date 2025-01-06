export const welcomeEmailTemplate = (name) => {
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

        .cta-button {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 20px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
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
            Welcome to Misrify Store!
        </div>

        <!-- Body -->
        <div class="email-body">
            <p>Hi ${name},<br>Welcome to Misrify Store, your go-to online destination for premium Egyptian products. We're thrilled to
                have you with us!</p>
            <p>At Misrify, we offer a wide variety of products, from fashion and accessories to home goods, all crafted
                with quality and care. We aim to provide an exceptional shopping experience that reflects the best of
                Egypt.</p>
            <p>To get started, visit our store and explore our exclusive collections:</p>

            <a href="[Store URL]" class="cta-button">Start Shopping Now</a>

            <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to
                help!</p>

            <p>Thank you for choosing Misrify Store.<br>Your Misrify Store Team</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            &copy; 2024 Misrify Store. All rights reserved.<br>
        </div>
    </div>
</body>

</html>
    `
}