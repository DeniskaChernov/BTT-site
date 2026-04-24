import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pdf from "pdf-parse/lib/pdf-parse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = path.join(__dirname, "../public/downloads/bententrade-catalog.pdf");
const buf = fs.readFileSync(pdfPath);
const data = await pdf(buf);
console.log(data.text);
