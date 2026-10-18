# Synthetic images

These images contain invented test content only. The HEIC fixtures were encoded
locally from their existing PNG equivalents with macOS `sips`, with no cloud
service or external applicant image involved:

```sh
sips -s format heic -s formatOptions 90 tests/fixtures/synthetic-passport.png --out tests/fixtures/synthetic-passport.heic
sips -s format heic -s formatOptions 90 tests/fixtures/synthetic-photo.png --out tests/fixtures/synthetic-photo.heic
```

The passport fixture is 1600 × 1000; the portrait is 1200 × 1500. Browser tests
exercise software decoding, PDF/JPEG output, inline previews and immediate downloads and blocked
network operation. They do not establish support for every phone/HEIC variant.

`synthetic-passport-small.png` is an 800 × 500 copy used to verify that passport
PDFs have no arbitrary minimum resolution and are not upscaled:

```sh
sips -Z 800 tests/fixtures/synthetic-passport.png --out tests/fixtures/synthetic-passport-small.png
```
