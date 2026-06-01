import { useState, useRef, useEffect } from 'react';
import { Phone, X, Ambulance, Shield, Flame, Building2, AlertTriangle } from 'lucide-react';

const CONTACTS = [
  { icon: Ambulance, labelKey: 'emergencyAmbulance', number: '123', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30' },
  { icon: Shield, labelKey: 'emergencyPolice', number: '999', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
  { icon: Flame, labelKey: 'emergencyFire', number: '122', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
  { icon: Building2, labelKey: 'emergencyHospital', number: '16263', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { icon: AlertTriangle, labelKey: 'emergencyNational', number: '999', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
];

export default function EmergencyFab({ dict }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const isDragging = useRef(false);
  const fabRef = useRef(null);

  const POPUP_W = 296;
  const BTN = 56;

  function clampPos(raw) {
    const maxX = window.innerWidth - BTN - 8;
    const maxY = window.innerHeight - BTN - 8;
    return {
      x: Math.max(POPUP_W, Math.min(raw.x, maxX)),
      y: Math.max(460, Math.min(raw.y, maxY)),
    };
  }

  useEffect(() => {
    const saved = localStorage.getItem('preg_fab_pos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.x !== null) {
          setPos(clampPos(parsed));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (pos.x !== null) {
      localStorage.setItem('preg_fab_pos', JSON.stringify(pos));
    }
  }, [pos]);

  const onDragStart = (clientX, clientY) => {
    const rect = fabRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: pos.x !== null ? pos.x : rect.left,
      startPosY: pos.y !== null ? pos.y : rect.top,
    };
    isDragging.current = true;
    setDragging(true);
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDragging.current) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    setPos(clampPos({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy,
    }));
  };

  const onDragEnd = () => {
    isDragging.current = false;
    setDragging(false);
  };

  const handleMouseDown = (e) => {
    if (open) return;
    onDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (open) return;
    const touch = e.touches[0];
    onDragStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => onDragMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      onDragMove(touch.clientX, touch.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', onDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, [dragging]);

  const fabStyle = pos.x !== null
    ? { left: pos.x, top: pos.y, position: 'fixed', transform: 'none', bottom: 'auto', right: 'auto' }
    : {};

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3"
        style={fabStyle}
      >
        {open && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-72 p-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{dict.emergencyTitle}</h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{dict.emergencySubtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X size={16} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <div className="space-y-2">
              {CONTACTS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.number + item.labelKey}
                    href={`tel:${item.number}`}
                    className={`flex items-center gap-3 p-3 rounded-xl ${item.bg} transition active:scale-[0.98]`}
                  >
                    <div className={`p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm ${item.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{dict[item.labelKey]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.number}</p>
                    </div>
                    <span className={`text-xs font-semibold ${item.color} flex items-center gap-1`}>
                      <Phone size={12} /> {dict.emergencyCall}
                    </span>
                  </a>
                );
              })}
            </div>

            <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mt-3">
              {dict.emergencyDisclaimer}
            </p>
          </div>
        )}

        <button
          ref={fabRef}
          onClick={() => { if (!dragging) setOpen(!open); }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition active:scale-90 ${
            open
              ? 'bg-gray-700 text-white rotate-45'
              : 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse hover:animate-none'
          } ${dragging ? 'scale-110 shadow-2xl' : ''}`}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          aria-label={dict.emergencyTitle}
        >
          {open ? <X size={24} /> : <Phone size={24} />}
        </button>
      </div>
    </>
  );
}
