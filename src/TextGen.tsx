import {
    AlphaAction,
    FilterType, Gravity,
    ImageMagick,
    initializeImageMagick, Kernel,
    Magick,
    MagickColors,
    MagickFormat, MagickImage,
    MagickReadSettings, MorphologyMethod, MorphologySettings,
    MagickColor, MagickImageCollection,
    DrawableAffine,
    Percentage
} from "@imagemagick/magick-wasm";
import {Jimp, type JimpInstance} from "jimp";
import magickWasm from '@imagemagick/magick-wasm/magick.wasm?url';

await initializeImageMagick(new URL(magickWasm, import.meta.url));
const settings = new MagickReadSettings();
const fetch1 = await fetch("./images/typostuck.ttf");
const buffer = await fetch1.arrayBuffer();
const arrayint = new Uint8Array(buffer);
Magick.addFont("Typostuck", arrayint);
settings.font = "Typostuck";
settings.fillColor = new MagickColor('#ffdbac');
settings.antiAlias = false;
settings.textAntiAlias = false;
settings.textKerning = 0;
settings.fontPointsize = 15;

export async function createText(labelText: string, skew:number) {

    const imageBytes = await new Promise<Uint8Array>((resolve) => {
        ImageMagick.read('label:' + labelText, settings, (image) => {
            image.alpha(AlphaAction.On);
            image.filterType = FilterType.Point;
            image.trim();
            image.resize(0, 100);
            image.extent(image.width + 20, image.height + 20, Gravity.Center);
            // 14 degree skew
            image.affineTransform(new DrawableAffine(1,1,0,skew,0,0))
            image.colorFuzz = new Percentage(20);
            image.transparent(MagickColors.White);
            image.write(MagickFormat.Png, async (data) => {
                resolve(data)
                const arrayBuffer = data.buffer.slice(
                    data.byteOffset,
                    data.byteOffset + data.byteLength
                );
                const textImg2 = await Jimp.fromBuffer(arrayBuffer as unknown as ArrayBuffer);
                sessionStorage.setItem("fg", await textImg2.getBase64("image/png"));
            });
            image.dispose();
        })
    });
    return imageBytes;
}

export async function createAlpha(imageBytes: Uint8Array<ArrayBufferLike>, strokeNum: string) {
    let textwidth = 0;
    let textheight = 0;
    await new Promise<Uint8Array>((resolve) => {
        ImageMagick.read(new Uint8Array(imageBytes), image => {
            image.morphology(new MorphologySettings(MorphologyMethod.Dilate, Kernel.Square, strokeNum));
            image.alpha(AlphaAction.Extract);
            image.trim();
            textwidth = image.width;
            textheight = image.height;
            image.write(MagickFormat.Png, async data => {
                const arrayBuffer = data.buffer.slice(
                    data.byteOffset,
                    data.byteOffset + data.byteLength
                );
                const textImg2 = await Jimp.fromBuffer(arrayBuffer as unknown as ArrayBuffer)
                sessionStorage.setItem("alpha", await textImg2.getBase64("image/png"));
                resolve(data);
            })
        });
    });
    return [textwidth, textheight]
}

export async function extendFG (textwidth : number, textheight: number) {
    const foreground = await Jimp.read(sessionStorage.getItem("fg")!);
    foreground.autocrop();
    const extendedFG = new Jimp({height: textheight, width: textwidth});
    const x = (textwidth - foreground.bitmap.width) / 2;
    const y = (textheight - foreground.bitmap.height) / 2;
    extendedFG.composite(foreground, x,y);
    return extendedFG;
}

export async function getOutputImg(foreground : JimpInstance, doubleGrad :JimpInstance, width:number, height:number, offset:number) {
    const doubleGradCrop = doubleGrad.clone();
    doubleGradCrop.crop({w: width, h: height, x: 0, y: offset});

    doubleGradCrop.mask(await Jimp.read(sessionStorage.getItem("alpha")!))
    doubleGradCrop.composite(foreground,0,0);
    return doubleGradCrop;
}

export async function getGifImg(textwidth :number, textheight:number, speed: number, delay: number){

//gradient
    const imageGradientBack = await Jimp.read("./images/gradient.png");
    imageGradientBack.resize({ w: textwidth, h: textheight});
//append
    const doublegradient = new Jimp({width: imageGradientBack.width, height: imageGradientBack.height*2});
    doublegradient.composite(imageGradientBack,0,0);
    doublegradient.composite(imageGradientBack, 0,imageGradientBack.height);

    const foreground = await extendFG(textwidth, textheight);

    const magicImageCollection = MagickImageCollection.create()

    for (let i = 0; i < textheight; i=i+speed) {
        const doubleGradCrop = await getOutputImg(foreground, doublegradient, textwidth, textheight,i);
        const buf = await doubleGradCrop.getBuffer("image/png");
        const image = MagickImage.create(buf);
        image.animationDelay = delay;
        magicImageCollection.push(image);
    }

    let resultGif: Uint8Array = new Uint8Array();
    magicImageCollection.write(MagickFormat.Gif, data => {
        resultGif = new Uint8Array(data);
    });
    const gifBlob = new Blob([resultGif as unknown as ArrayBuffer], { type: "image/gif"});
    const gifUrl = URL.createObjectURL(gifBlob);
    return gifUrl;
}

export async function createCaucasian(labelText: string, skew: number, kerning: number, speed: number, delay: number, stroke: number){
    settings.textKerning = kerning;
    let textwidth = 0;
    let textheight = 0;
    const imageBytes = await createText(labelText, skew);
    //dilate
    const imagewh = await createAlpha(imageBytes,stroke.toString());
    textwidth = imagewh[0];
    textheight = imagewh[1];
    // get gif
    const gifUrl = await getGifImg(textwidth, textheight, speed, delay);
    return gifUrl;
}
