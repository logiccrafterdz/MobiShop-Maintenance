import { useEffect } from 'react';
import { useAppStore } from '../store';
import { format } from 'date-fns';

export default function ReceiptPrint() {
  const { printingRepair, setPrintingRepair } = useAppStore();

  useEffect(() => {
    if (printingRepair) {
      setTimeout(() => {
        window.print();
        setPrintingRepair(null);
      }, 500); // small delay to allow DOM render
    }
  }, [printingRepair, setPrintingRepair]);

  if (!printingRepair) return null;

  // Receipt format for 80mm thermal printer
  return (
    <div className="print-only fixed inset-0 bg-white z-[9999] p-4 text-black font-sans w-[80mm] mx-auto text-sm">
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
      <div className="mt-8 pt-8 text-center" style={{ width: '50mm', height: '30mm', overflow: 'hidden' }}>
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
