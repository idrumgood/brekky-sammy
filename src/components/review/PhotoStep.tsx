import { Camera, X, MessageSquare, ArrowLeft, Check } from 'lucide-react';

interface PhotoStepProps {
    imagePreview: string | null;
    setImageFile: (file: File | null) => void;
    setImagePreview: (preview: string | null) => void;
    comment: string;
    setComment: (comment: string) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
    onNext: () => void;
}

export function PhotoStep({
    imagePreview,
    setImageFile,
    setImagePreview,
    comment,
    setComment,
    handleImageChange,
    onBack,
    onNext
}: PhotoStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Show us the Goods</h2>
                <p className="text-muted-foreground">Upload a photo for the club to salivate over.</p>
            </div>

            <div className="space-y-6">
                <div
                    className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-secondary/20 ${imagePreview ? 'border-primary' : 'border-border'}`}
                >
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 text-primary">
                                <Camera size={40} />
                            </div>
                            <p className="font-bold text-breakfast-coffee mb-2 text-lg">Snap a photo / Choose file</p>
                            <p className="text-sm text-muted-foreground">Mobile users can access camera directly.</p>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <MessageSquare size={16} className="text-primary" />
                        Add a Comment
                    </label>
                    <textarea
                        placeholder="Tell us everything. The bun, the bite, the vibes..."
                        className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-4 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg leading-relaxed"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Review Summary
                    <Check size={20} />
                </button>
            </div>
        </div>
    );
}
