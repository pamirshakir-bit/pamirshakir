// Renders endcard.html frame by frame in Chromium and encodes the deliverables per format:
//   renders/<name>_alpha.mov    ProRes 4444 with alpha, for the edit timeline
//   renders/<name>_preview.mp4  H.264 over a stand-in shot, for a quick look on a phone
//
// Usage:
//   node render.cjs                        both formats at 25 fps
//   node render.cjs --format v --fps 30    one format (v = 1080x1920, h = 1920x1080), other frame rate
//   node render.cjs --stills 1,3,6,9       review stills over the stand-in shot (renders/stills/)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : fallback;
};
const FPS = Number(opt('fps', 25));
const STILLS = opt('stills', null);
const FORMATS = { v: { w: 1080, h: 1920, standin: 'standin-jourdan.jpg' }, h: { w: 1920, h: 1080, standin: 'standin-jourdan-h.jpg' } };
const which = opt('format', 'both');
const formats = which === 'both' ? ['v', 'h'] : [which];

const HERE = __dirname;
const OUT = path.join(HERE, 'renders');
const REC709 = ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv'];

function ffmpeg(...a) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' });
}

async function renderFormat(browser, key) {
  const { w, h, standin } = FORMATS[key];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(HERE, 'endcard.html') + `?format=${key}` + (STILLS ? '&preview' : ''));
  await page.evaluate(() => window.ready);

  if (STILLS) {
    const dir = path.join(OUT, 'stills');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of STILLS.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(dir, `${key}_still_${t.toFixed(2)}s.png`) });
    }
    await page.close();
    return;
  }

  const frames = path.join(OUT, `_frames_${key}`);
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  const total = Math.round(await page.evaluate(() => window.DURATION) * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.renderAt(t), i / FPS);
    await page.screenshot({ path: path.join(frames, `f_${String(i).padStart(4, '0')}.png`), omitBackground: true });
    if (i % 25 === 0) process.stdout.write(`\r${key}: frame ${i}/${total}`);
  }
  await page.close();
  console.log(`\r${key}: rendered ${total} frames`);

  const name = `hairmano-jourdan-endcard_${w}x${h}_${FPS}fps`;
  const seq = ['-framerate', String(FPS), '-i', path.join(frames, 'f_%04d.png')];
  // Straight (unpremultiplied) alpha, Rec.709 matrix so the colours land where they were designed.
  ffmpeg(...seq,
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuva444p10le',
    '-c:v', 'prores_ks', '-profile:v', '4444', '-alpha_bits', '16', '-vendor', 'apl0',
    ...REC709, path.join(OUT, `${name}_alpha.mov`));
  ffmpeg('-loop', '1', '-framerate', String(FPS), '-i', path.join(HERE, 'assets', standin), ...seq,
    // Blend in RGB so the black of the card stays true black after the conversion to Rec.709.
    '-filter_complex', '[0:v]format=gbrp[bg];[bg][1:v]overlay=format=gbrp:shortest=1,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart',
    ...REC709, path.join(OUT, `${name}_preview.mp4`));
  console.log(`${key}: wrote ${name}_alpha.mov and ${name}_preview.mp4`);
}

(async () => {
  const browser = await chromium.launch();
  for (const key of formats) await renderFormat(browser, key);
  await browser.close();
})();
