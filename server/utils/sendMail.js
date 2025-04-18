import { createTransport } from "nodemailer";

const sendMail = async (email, subject, otp) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 10px;
        }
        p {
            font-size: 16px;
            color: #555555;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 40px;
            font-weight: bold;
            color: #4caf50; /* Green text for the OTP */
            margin-bottom: 20px;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 14px;
            color: #ffffff;
            background-color: #007bff; /* Blue button */
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello <strong>${email}</strong>,</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <div class="otp">${otp}</div>
        <a href="#" class="btn">Verify Now</a>
        <p class="footer">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
`;


  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;