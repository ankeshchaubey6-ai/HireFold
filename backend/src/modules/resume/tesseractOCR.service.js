import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import Tesseract from "tesseract.js";

const execAsync = util.promisify(exec);


export async function checkOCRSystem() {
  try {
    // Check for pdftoppm
    await execAsync("which pdftoppm");
    
    // Check for tesseract
    await execAsync("which tesseract");
    
    return true;
    
  } catch (error) {
    return false;
  }
}

