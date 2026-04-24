const fs = require('fs');
const path = './src/components/ImageCarousel.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    '    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);\n    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);\n\n    return (\n        <div className="relative group md:aspect-video aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">\n            <Image',
    `    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    const next = () => setCurrentIndex(nextIndex);
    const prev = () => setCurrentIndex(prevIndex);

    return (
        <div className="relative group md:aspect-video aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            {images.length > 1 && (
                <div className="hidden">
                    <Image
                        src={images[prevIndex]}
                        alt="preload previous"
                        fill
                        priority
                    />
                    <Image
                        src={images[nextIndex]}
                        alt="preload next"
                        fill
                        priority
                    />
                </div>
            )}
            <Image`
);

fs.writeFileSync(path, content, 'utf8');
