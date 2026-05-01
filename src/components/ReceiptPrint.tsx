import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { printHtml } from 'tauri-plugin-printer-v2';

export default function ReceiptPrint() {
  const { t } = useTranslation();
  const { printingRepair, setPrintingRepair, settings } = useAppStore();

  useEffect(() => {
    const handlePrint = async () => {
      if (printingRepair) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const receiptHtml = document.getElementById('receipt-content')?.outerHTML;
        const stickerHtml = document.getElementById('sticker-content')?.outerHTML;

        const styles = `
          <style>
            body { font-family: sans-serif; margin: 0; padding: 10px; color: black; }
            .receipt { width: 80mm; margin: 0 auto; font-size: 14px; }
            .sticker { width: 50mm; height: 30mm; margin: 0 auto; text-align: center; border: 1px dashed #ccc; padding: 5px; }
            .text-center { text-align: center; }
            .font-bold, .font-semibold { font-weight: bold; }
            .text-xl { font-size: 20px; }
            .text-lg { font-size: 18px; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .border-t { border-top: 1px solid black; }
            .border-b { border-bottom: 1px solid black; }
            .border-dashed { border-style: dashed; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .pt-2 { padding-top: 8px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .space-y-1 > * + * { margin-top: 4px; }
          </style>
        `;

        // 1. Print Receipt
        if (receiptHtml && settings.receipt_printer) {
          try {
            await printHtml({
              id: `receipt-${printingRepair.repair_id}-${Date.now()}`,
              html: styles + receiptHtml,
              printer: settings.receipt_printer,
            });
          } catch (e) {
            console.error('Receipt print failed:', e);
            window.print();
          }
        }

        // 2. Print Sticker
        if (stickerHtml && settings.sticker_printer) {
          try {
            await printHtml({
              id: `sticker-${printingRepair.repair_id}-${Date.now()}`,
              html: styles + stickerHtml,
              printer: settings.sticker_printer,
            });
          } catch (e) {
            console.error('Sticker print failed:', e);
          }
        }

        // Fallback: If no printers configured, use browser dialog
        if (!settings.receipt_printer && !settings.sticker_printer) {
          window.print();
        }

        setPrintingRepair(null);
      }
    };

    handlePrint();
  }, [printingRepair, setPrintingRepair, settings, t]);

  if (!printingRepair) return null;

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
      {/* Receipt */}
      <div id="receipt-content" className="receipt p-4 text-black font-sans w-[80mm] mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">{t('receipt.shopName')}</h1>
          <p className="text-xs">Tel: 0667794482 / 0799598209</p>
        </div>

        <div className="border-t border-b border-dashed border-black py-2 mb-4">
          <h2 className="text-lg font-bold text-center">{printingRepair.repair_id}</h2>
          <p className="text-xs text-center">{format(new Date(printingRepair.created_at), 'yyyy-MM-dd HH:mm')}</p>
        </div>

        <div className="mb-4 text-sm space-y-1">
          <p><span className="font-semibold">{t('receipt.customer')}:</span> {printingRepair.customer_name}</p>
          <p><span className="font-semibold">{t('receipt.phone')}:</span> {printingRepair.customer_phone}</p>
          <p><span className="font-semibold">{t('receipt.device')}:</span> {printingRepair.device_type} - {printingRepair.device_model}</p>
          <p className="border-t border-dotted border-gray-400 mt-2 pt-2">
            <span className="font-semibold">{t('receipt.issue')}:</span><br/>
            {printingRepair.issue_desc}
          </p>
        </div>

        <div className="border-t border-dashed border-black py-2 mb-4">
          <div className="flex justify-between">
            <span>{t('receipt.estCost')}:</span>
            <span className="font-bold">{printingRepair.est_cost.toFixed(2)} DZD</span>
          </div>
          <div className="flex justify-between">
            <span>{t('receipt.deposit')}:</span>
            <span className="font-bold">{printingRepair.deposit_paid.toFixed(2)} DZD</span>
          </div>
          <div className="flex justify-between mt-1 pt-1 border-t border-black">
            <span>{t('receipt.remaining')}:</span>
            <span className="font-bold">{Math.max(0, printingRepair.est_cost - printingRepair.deposit_paid).toFixed(2)} DZD</span>
          </div>
        </div>

        {printingRepair.notes && (
          <div className="text-xs mb-4">
            <p className="font-semibold">{t('receipt.notes')}:</p>
            <p>{printingRepair.notes}</p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs font-semibold">{t('receipt.thanks')}</p>
          <p className="text-[10px] mt-1">{t('receipt.estCompletion')}</p>
        </div>
      </div>
      
      {/* Page break */}
      <div style={{ pageBreakBefore: 'always' }} />
      
      {/* Sticker */}
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
