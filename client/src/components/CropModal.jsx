import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCw, X } from "lucide-react";

function CropModal({ imageUrl, onClose, onSave }) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0); 
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);

    
    useEffect(() => {
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
    }, [imageUrl]);

    
    const handleDragStart = (e) => {
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setStartDrag({ x: clientX - offset.x, y: clientY - offset.y });
    };

    
    const handleDragMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setOffset({
            x: clientX - startDrag.x,
            y: clientY - startDrag.y,
        });
    };

    
    const handleDragEnd = () => {
        setIsDragging(false);
    };

    
    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    
    const handleSave = () => {
        const img = imgRef.current;
        if (!img) return;

        const canvas = document.createElement("canvas");
        const size = 300; 
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        
        ctx.clearRect(0, 0, size, size);

        
        ctx.save();

        
        ctx.translate(size / 2, size / 2);

        
        ctx.rotate((rotation * Math.PI) / 180);

        
        
        const viewportSize = 288;
        const relativeScale = size / viewportSize;

        
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const scaleX = viewportSize / imgWidth;
        const scaleY = viewportSize / imgHeight;
        const baseScale = Math.max(scaleX, scaleY);

        const w0 = imgWidth * baseScale * zoom;
        const h0 = imgHeight * baseScale * zoom;

        
        const dx = offset.x * relativeScale;
        const dy = offset.y * relativeScale;

        
        ctx.drawImage(img, -w0 * relativeScale / 2 + dx, -h0 * relativeScale / 2 + dy, w0 * relativeScale, h0 * relativeScale);

        
        ctx.restore();

        
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onSave(blob);
                }
            },
            "image/jpeg",
            0.9
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl relative">
                
                {}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-50 transition"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-black text-slate-950">Crop Profile Picture</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Drag to position, slide to zoom</p>

                {}
                <div className="my-8 flex justify-center">
                    <div
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                        className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-emerald-500 bg-slate-950 shadow-inner select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
                    >
                        <img
                            ref={imgRef}
                            src={imageUrl}
                            alt="Crop Preview"
                            draggable={false}
                            className="max-w-none origin-center pointer-events-none"
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                                transition: isDragging ? "none" : "transform 0.1s ease-out",
                                maxHeight: "100%",
                                maxWidth: "100%"
                            }}
                        />
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    {}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={16} className="text-slate-400" />
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.01"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-1.5 rounded-lg bg-slate-100 appearance-none cursor-pointer accent-emerald-500"
                        />
                        <ZoomIn size={16} className="text-emerald-500" />
                    </div>

                    {}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handleRotate}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
                        >
                            <RotateCw size={15} />
                            Rotate 90°
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="rounded-2xl px-5 py-3 text-xs font-black text-slate-500 hover:text-slate-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-black text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CropModal;
