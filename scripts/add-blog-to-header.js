const fs = require('fs');
const path = require('path');

// 1. Update frontend/index.html
const indexPath = path.join(__dirname, '..', 'frontend', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add Blog link before </nav> in desktop navlinks
if (!indexContent.includes('href="/blog.html">Blog</a>') && !indexContent.includes('href="/blog">Blog</a>')) {
  const navEndTarget = /<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>/;
  if (navEndTarget.test(indexContent)) {
    indexContent = indexContent.replace(
      navEndTarget,
      '</div>\r\n          </div>\r\n        </div>\r\n        <a class="lux-nav-link" href="/blog.html">Blog</a>\r\n      </nav>'
    );
    console.log('Added Blog link to desktop nav in index.html');
  } else {
    console.error('Could not find navEndTarget in index.html');
  }

  // Ensure mobile menu has Blog
  if (indexContent.includes('<a href="/blog.html">Knowledge Centre</a>')) {
    indexContent = indexContent.replace(
      '<a href="/blog.html">Knowledge Centre</a>',
      '<a href="/blog.html">Blog</a>'
    );
    console.log('Updated mobile menu to Blog in index.html');
  }

  fs.writeFileSync(indexPath, indexContent, 'utf8');
} else {
  console.log('Blog link already in index.html header.');
}

// 2. Update frontend/public/js/lux-shell.js
const shellPath = path.join(__dirname, '..', 'frontend', 'public', 'js', 'lux-shell.js');
let shellContent = fs.readFileSync(shellPath, 'utf8');

if (!shellContent.includes('class="lux-nav-link" href="/blog.html">Blog</a>')) {
  shellContent = shellContent.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/nav>\s*<div class="lux-nav-actions">/,
    '</div>\n            </div>\n          </div>\n          <a class="lux-nav-link" href="/blog.html">Blog</a>\n        </nav>\n        <div class="lux-nav-actions">'
  );
  shellContent = shellContent.replace(
    '<a href="/blog.html">Knowledge Centre</a>',
    '<a href="/blog.html">Blog</a>'
  );
  fs.writeFileSync(shellPath, shellContent, 'utf8');
  console.log('Added Blog link to lux-shell.js');
}

// 3. Run sync-home-header logic across all subpages
require('./sync-home-header.js');
