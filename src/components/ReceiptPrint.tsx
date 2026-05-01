import { useEffect } from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { print } from 'tauri-plugin-printer-v2';

export default function ReceiptPrint() {
  const { printingRepair, setPrintingRepair, settings } = useAppStore();

  useEffect(() => {
    const handlePrint = async () => {
      if (printingRepair) {
        // Wait a bit for React to update the DOM
        await new Promise(resolve => setTimeout(resolve, 500));

        const receiptHtml = document.getElementById('receipt-content')?.outerHTML;
        const stickerHtml = document.getElementById('sticker-content')?.outerHTML;

        // Base styles for printing
        const styles = `
          <style>
            body { font-family: sans-serif; margin: 0; padding: 10px; color: black; }
            .receipt { width: 80mm; margin: 0 auto; font-size: 14px; }
            .sticker { width: 50mm; height: 30mm; margin: 0 auto; text-align: center; border: 1px dashed #ccc; padding: 5px; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-xl { font-size: 20px; }
            .text-lg { font-size: 18px; }
            .text-xs { font-size: 12px; }
            .border-t { border-top: 1px solid black; }
            .border-b { border-bottom: 1px solid black; }
            .border-dashed { border-style: dashed; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
          </style>
        `;

        // 1. Print Receipt
        if (receiptHtml && settings.receipt_printer) {
          try {
            await print({
              id: `receipt-${printingRepair.repair_id}`,
              html: styles + receiptHtml,
              printername: settings.receipt_printer,
              silent: true,
            });
          } catch (e) {
            console.error('Receipt print failed:', e);
            window.print(); // Fallback to dialog
          }
        }

        // 2. Print Sticker
        if (stickerHtml && settings.sticker_printer) {
          try {
            await print({
              id: `sticker-${printingRepair.repair_id}`,
              html: styles + stickerHtml,
              printername: settings.sticker_printer,
              silent: true,
            });
          } catch (e) {
            console.error('Sticker print failed:', e);
          }
        }

        // If no printers set, use standard dialog
        if (!settings.receipt_printer && !settings.sticker_printer) {
          window.print();
        }

        setPrintingRepair(null);
      }
    };

    handlePrint();
  }, [printingRepair, setPrintingRepair, settings]);

  if (!printingRepair) return null;

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
      {/* Container for Receipt */}
      <div id="receipt-content" className="receipt p-4 text-black font-sans w-[80mm] mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold uppercase tracking-wider">MobiShop Chlef</h1>
        <p className="text-xs">Tel: 0667794482 / 0799598209</p>
      </div>

      <div className="border-t border-b border-dashed border-black py-2 mb-4">
        <h2 className="text-lg font-bold text-center">{printingRepair.repair_id}</h2>
        <p className="text-xs text-center">{format(new Date(printingRepair.created_at), 'yyyy-MM-dd HH:mm')}</p>
      </div>

      <div className="mb-4 text-sm space-y-1">
        <p><span className="font-semibold">Customer:</span> {printingRepair.customer_name}</p>
        <p><span className="font-semibold">Phone:</span> {printingRepair.customer_phone}</p>
        <p><span className="font-semibold">Device:</span> {printingRepair.device_type} - {printingRepair.device_model}</p>
        <p className="border-t border-dotted border-gray-400 mt-2 pt-2">
          <span className="font-semibold">Issue:</span><br/>
          {printingRepair.issue_desc}
        </p>
      </div>

      <div className="border-t border-dashed border-black py-2 mb-4">
        <div className="flex justify-between">
          <span>Est. Cost:</span>
          <span className="font-bold">{printingRepair.est_cost.toFixed(2)} DZD</span>
        </div>
        <div className="flex justify-between">
          <span>Deposit:</span>
          <span className="font-bold">{printingRepair.deposit_paid.toFixed(2)} DZD</span>
        </div>
        <div className="flex justify-between mt-1 pt-1 border-t border-black">
          <span>Remaining:</span>
          <span className="font-bold">{Math.max(0, printingRepair.est_cost - printingRepair.deposit_paid).toFixed(2)} DZD</span>
        </div>
      </div>

      {printingRepair.notes && (
        <div className="text-xs mb-4">
          <p className="font-semibold">Notes:</p>
          <p>{printingRepair.notes}</p>
        </div>
      )}

      <div className="text-center mt-6">
        {/* Placeholder for QR Code, standard img/svg later */}
        <div className="border border-black p-4 inline-block mb-2">QR Code / Barcode</div>
        <p className="text-xs font-semibold">Thank you, please keep this receipt.</p>
        <p className="text-[10px] mt-1">Est. Completion: 3 Days</p>
      </div>
      
      {/* Page break for Sticker */}
      <div className="page-break" style={{ pageBreakBefore: 'always' }} />
      
      {/* Sticker Format (50x30mm roughly proportional) */}
      <div id="sticker-content" className="sticker mt-8 pt-8 text-center" style={{ width: '50mm', height: '30mm', overflow: 'hidden' }}>
        <h1 className="text-xl font-bold">{printingRepair.repair_id}</h1>
        <p className="text-sm font-semibold truncate">{printingRepair.device_model}</p>
        <div className="flex justify-between text-xs mt-1">
          <span>{printingRepair.customer_name.substring(0, 3).toUpperCase()}</span>
          <span>{format(new Date(printingRepair.created_at), 'MM/dd')}</span>
        </div>
      </div>
    </div>
  );
}
