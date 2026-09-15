<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
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
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .header {
            background: linear-gradient(135deg, #0b0f19, #0284c7);
            padding: 30px 25px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .header p {
            color: #bae6fd;
            margin: 5px 0 0 0;
            font-size: 13px;
        }
        .content {
            padding: 25px;
        }
        .invoice-box {
            background-color: #090d16;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .table th {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #334155;
            color: #94a3b8;
            font-size: 12px;
            text-transform: uppercase;
        }
        .table td {
            padding: 12px 10px;
            border-bottom: 1px solid #1e293b;
            font-size: 14px;
            color: #ffffff;
        }
        .badge {
            background-color: #064e3b;
            color: #34d399;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
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
            <p>Official Order Receipt & Purchase Confirmation</p>
        </div>

        <div class="content">
            <p style="font-size: 15px; color: #f8fafc;">Hello, <strong>{{ $invoice->billing_name }}</strong>!</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
                Thank you for your purchase in the Crystal Brawlers Store. Your order has been processed and successfully credited to your game account.
            </p>

            <div class="invoice-box">
                <table style="width: 100%;">
                    <tr>
                        <td style="font-size: 12px; color: #94a3b8;">Invoice Number:</td>
                        <td style="text-align: right; font-weight: bold; color: #38bdf8;">{{ $invoice->invoice_number }}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px; color: #94a3b8;">Issue Date:</td>
                        <td style="text-align: right; color: #cbd5e1;">{{ $invoice->created_at->format('M d, Y H:i:s') }} UTC</td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px; color: #94a3b8;">Payment Status:</td>
                        <td style="text-align: right;"><span class="badge">{{ strtoupper($invoice->status) }}</span></td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px; color: #94a3b8;">Payment Method:</td>
                        <td style="text-align: right; color: #f59e0b; font-weight: bold;">{{ $invoice->payment_method }}</td>
                    </tr>
                </table>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Category</th>
                            <th style="text-align: right;">Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>{{ $invoice->item_name }}</strong></td>
                            <td style="color: #38bdf8; text-transform: uppercase;">{{ $invoice->item_type }}</td>
                            <td style="text-align: right; font-weight: bold; color: #facc15;">
                                @if($invoice->price_coins > 0)
                                    {{ number_format($invoice->price_coins) }} 🪙
                                @endif
                                @if($invoice->price_crystals > 0)
                                    {{ number_format($invoice->price_crystals) }} 💎
                                @endif
                                @if($invoice->amount_usd > 0)
                                    ${{ number_format($invoice->amount_usd, 2) }} USD
                                @endif
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="font-size: 12px; color: #64748b; line-height: 1.4;">
                <p><strong>Customer Billing Details:</strong><br>
                {{ $invoice->billing_name }} ({{ $invoice->billing_email }})<br>
                {{ $invoice->billing_address ?? 'Digital Delivery' }}, {{ $invoice->billing_city ?? '' }} {{ $invoice->billing_post_code ?? '' }}<br>
                Country: {{ $invoice->billing_country ?? 'Global' }}
                </p>
            </div>
        </div>

        <div class="footer">
            <p><strong>{{ config('app.company.name', 'Crystal Brawlers Interactive Ltd.') }}</strong> (Reg: {{ config('app.company.number', '2026-EU-984210') }})</p>
            <p>{{ config('app.company.address', 'Tower 4, Fintech Square, Level 8, London, UK') }}</p>
            <p>Support: <a href="mailto:{{ config('app.company.email', 'info@crystalbrawlers.com') }}" style="color: #38bdf8; text-decoration: none;">{{ config('app.company.email', 'info@crystalbrawlers.com') }}</a></p>
            <p style="margin-top: 10px; font-size: 10px;">This is an automatically generated receipt for your digital game assets.</p>
        </div>
    </div>
</body>
</html>
