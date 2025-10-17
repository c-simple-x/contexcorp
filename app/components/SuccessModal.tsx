'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center bg-black/40 p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6"
            initial={{ y: 24, scale: .98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: .98, opacity: 0 }}
            onClick={(e)=>e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 grid place-items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600">
                  <path strokeWidth="2" d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">문의가 접수되었습니다</h3>
              <p className="mt-2 text-sm text-gray-600">담당자가 확인 후 빠르게 연락드릴게요.</p>
              <button onClick={onClose} className="btn mt-5">닫기</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
