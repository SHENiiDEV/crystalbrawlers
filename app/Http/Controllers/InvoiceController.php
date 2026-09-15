<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $invoices = $user->invoices()->paginate(15);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show(Request $request, Invoice $invoice): Response
    {
        $user = $request->user();
        if ($invoice->user_id !== $user->id) {
            abort(403, 'Unauthorized access to invoice');
        }

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }
}
