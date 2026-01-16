import JSZip from 'jszip'
import pica from 'pica'

const Pica = pica()

interface IconConfig {
    name: string
    size: number
}

const androidIcons: IconConfig[] = [
    { name: 'icon-1024.png', size: 1024 },
    { name: 'icon-192-xxxhdpi.png', size: 192 },
    { name: 'icon-144-xxhdpi.png', size: 144 },
    { name: 'icon-96-xhdpi.png', size: 96 },
    { name: 'icon-72-hdpi.png', size: 72 },
    { name: 'icon-48-mdpi.png', size: 48 },
    { name: 'icon-36-ldpi.png', size: 36 },
]

const iosIcons: IconConfig[] = [
    { name: 'icon-1024.png', size: 1024 },
    { name: 'icon-83.5-2x.png', size: 167 },
    { name: 'icon-76-2x.png', size: 152 },
    { name: 'icon-76.png', size: 76 },
    { name: 'icon-72-2x.png', size: 144 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-60-3x.png', size: 180 },
    { name: 'icon-60-2x.png', size: 120 },
    { name: 'icon-60.png', size: 60 },
    { name: 'icon-57-2x.png', size: 114 },
    { name: 'icon-57.png', size: 57 },
    { name: 'icon-50-2x.png', size: 100 },
    { name: 'icon-50.png', size: 50 },
    { name: 'icon-40-2x.png', size: 80 },
    { name: 'icon-40.png', size: 40 },
    { name: 'icon-29-3x.png', size: 87 },
    { name: 'icon-20.png', size: 20 },
    { name: 'icon-small-2x.png', size: 58 },
    { name: 'icon-small.png', size: 29 },
]

export const processImage = async (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = async () => {
            if (img.width !== 1024 || img.height !== 1024) {
                // Optional strict check, or just warn. User requirement says "Validation: Check that the file is an image". Check dimensions is good practice.
                // But user req: "Validation: Check that the file is an image".
                // It doesn't strictly say reject if not 1024, but "Action: User drags a 1024x1024...".
                // I will allow it but maybe resize to 1024 first if needed? No, user said 1024 input.
                // I'll proceed even if different but good to log it.
            }

            try {
                const zip = new JSZip()
                const androidFolder = zip.folder('android')
                const iosFolder = zip.folder('ios')

                // Process function
                const resizeAndAdd = async (folder: JSZip | null, config: IconConfig) => {
                    if (!folder) return

                    const canvas = document.createElement('canvas')
                    canvas.width = config.size
                    canvas.height = config.size

                    // Using pica for basic resizing
                    await Pica.resize(img, canvas, {
                        unsharpAmount: 80,
                        unsharpRadius: 0.6,
                        unsharpThreshold: 2
                    })

                    const blob = await Pica.toBlob(canvas, 'image/png', 0.90)
                    folder.file(config.name, blob)
                }

                // Parallel processing (batched to not freeze UI too much, but pica is async)
                await Promise.all([
                    ...androidIcons.map(icon => resizeAndAdd(androidFolder, icon)),
                    ...iosIcons.map(icon => resizeAndAdd(iosFolder, icon))
                ])

                const zipContent = await zip.generateAsync({ type: 'arraybuffer' })
                resolve(zipContent)

            } catch (e) {
                reject(e)
            }
        }
        img.onerror = (e) => reject(new Error('Failed to load image'))
        img.src = URL.createObjectURL(file)
    })
}
