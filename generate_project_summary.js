const fs = require("fs/promises");
const path = require("path");
const puppeteer = require("puppeteer-core");

const APP_URL =
  process.env.APP_URL ||
  process.argv[2] ||
  "http://localhost:3000";
const REACT_PROJECT_DIR = path.join(__dirname, "frontend", "src");
const SCREENSHOTS_DIR = path.join(__dirname, "screenshots");
const SUMMARY_FILE = path.join(__dirname, "project_summary.txt");
const BROWSER_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const ROUTES = [
  {
    name: "HOME",
    route: "/",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Public", "Home.jsx"),
    screenshot: "home.png",
  },
  {
    name: "ABOUT",
    route: "/about",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Common", "About.jsx"),
    screenshot: "about.png",
  },
  {
    name: "CONTACT",
    route: "/contact",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Common", "Contact.jsx"),
    screenshot: "contact.png",
  },
  {
    name: "FAQ",
    route: "/faq",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Common", "FAQ.jsx"),
    screenshot: "faq.png",
  },
  {
    name: "TERMS",
    route: "/terms",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Common", "Terms.jsx"),
    screenshot: "terms.png",
  },
  {
    name: "PRIVACY_POLICY",
    route: "/privacy-policy",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Common", "PrivacyPolicy.jsx"),
    screenshot: "privacy-policy.png",
  },
  {
    name: "CANDIDATE_DASHBOARD",
    route: "/candidate/dashboard",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Candidate", "Dashboard.jsx"),
    screenshot: "candidate-dashboard.png",
  },
  {
    name: "CANDIDATE_JOBS",
    route: "/candidate/jobs",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Candidate", "Jobs.jsx"),
    screenshot: "candidate-jobs.png",
  },
  {
    name: "RESUME",
    route: "/candidate/resume",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Candidate", "Resume.jsx"),
    screenshot: "resume.png",
  },
  {
    name: "RESUME_ANALYSIS",
    route: "/candidate/resume/analysis",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Candidate", "ResumeAnalysis.jsx"),
    screenshot: "resume-analysis.png",
  },
  {
    name: "MY_RESUMES",
    route: "/candidate/my-resumes",
    source: path.join(REACT_PROJECT_DIR, "Pages", "Candidate", "MyResumes.jsx"),
    screenshot: "my-resumes.png",
  },
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function resolveBrowserPath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  for (const candidate of BROWSER_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch (error) {
    }
  }

  throw new Error(
    "No supported Chrome/Edge executable found. Set PUPPETEER_EXECUTABLE_PATH to a browser executable."
  );
}

async function readFirst80Lines(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content.split(/\r?\n/).slice(0, 80).join("\n");
  } catch (error) {
    return `ERROR: Failed to read source file.\n${error.message}`;
  }
}

async function captureRoute(page, routeConfig) {
  const targetUrl = new URL(routeConfig.route, APP_URL).toString();
  const screenshotPath = path.join(SCREENSHOTS_DIR, routeConfig.screenshot);

  await page.goto(targetUrl, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  return screenshotPath;
}

function formatSection(name, screenshotFileName, codeSnippet) {
  return [
    `===== ${name} =====`,
    `Screenshot: screenshots/${screenshotFileName}`,
    "Code:",
    codeSnippet,
    "",
  ].join("\n");
}

async function generateSummary() {
  await ensureDir(SCREENSHOTS_DIR);
  const executablePath = await resolveBrowserPath();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    defaultViewport: {
      width: 1440,
      height: 900,
    },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const sections = [];

  try {
    for (const routeConfig of ROUTES) {
      try {
        await captureRoute(page, routeConfig);
        const codeSnippet = await readFirst80Lines(routeConfig.source);
        sections.push(
          formatSection(routeConfig.name, routeConfig.screenshot, codeSnippet)
        );
      } catch (error) {
        sections.push(
          formatSection(
            routeConfig.name,
            routeConfig.screenshot,
            `ERROR: Failed to process route ${routeConfig.route}\n${error.message}`
          )
        );
      }
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(SUMMARY_FILE, sections.join("\n"), "utf8");
}

generateSummary().catch(async (error) => {
  const fallbackMessage = [
    "===== ERROR =====",
    `Code:`,
    error.stack || error.message,
    "",
  ].join("\n");

  try {
    await ensureDir(SCREENSHOTS_DIR);
    await fs.writeFile(SUMMARY_FILE, fallbackMessage, "utf8");
  } catch (writeError) {
    console.error(writeError);
  }

  console.error(error);
  process.exit(1);
});
