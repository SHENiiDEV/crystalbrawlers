<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Crystal Brawlers</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #080c14;
            color: #e2e8f0;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 16px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #0b0f19, #0284c7);
            padding: 35px 25px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            padding: 30px 25px;
            font-size: 14px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background-color: #f59e0b;
            color: #000000;
            font-weight: bold;
            padding: 12px 25px;
            border-radius: 10px;
            text-decoration: none;
            margin-top: 20px;
            text-transform: uppercase;
        }
        .bonus-box {
            background-color: #090d16;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 18px;
            margin: 20px 0;
        }
        .footer {
            background-color: #0b0f19;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #1e293b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Crystal Brawlers</h1>
            <p style="color: #bae6fd; margin-top: 5px;">Your Gladiator Journey Begins Now</p>
        </div>

        <div class="content">
            <h2 style="color: #ffffff; margin-top: 0;">Welcome, {{ $user->name }}!</h2>
            <p style="color: #94a3b8;">
                Your account has been successfully verified and registered. You are now ready to step into the 2D arena and forge your legend!
            </p>

            <div class="bonus-box">
                <h3 style="color: #facc15; margin: 0 0 10px 0; font-size: 16px;">🎁 Your Starter Reward Package</h3>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
                    <li><strong>25,000 Gold Coins</strong> (for attribute upgrades & store items)</li>
                    <li><strong>1,500 Crystals</strong> (for exclusive cosmetics)</li>
                    <li><strong>Royal Defender Knight Skin</strong> (unlocked)</li>
                </ul>
            </div>

            <p style="text-align: center;">
                <a href="{{ config('app.url') }}/heroes" class="btn">Choose Your Champion & Battle</a>
            </p>
        </div>

        <div class="footer">
            <p><strong>{{ config('app.company.name', 'Crystal Brawlers Interactive Ltd.') }}</strong> (Reg: {{ config('app.company.number', '2026-EU-984210') }})</p>
            <p>{{ config('app.company.address', 'Tower 4, Fintech Square, Level 8, London, UK') }}</p>
            <p>Support: <a href="mailto:{{ config('app.company.email', 'info@crystalbrawlers.com') }}" style="color: #38bdf8; text-decoration: none;">{{ config('app.company.email', 'info@crystalbrawlers.com') }}</a></p>
        </div>
    </div>
</body>
</html>
