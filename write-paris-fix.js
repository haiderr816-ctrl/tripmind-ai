const fs = require('fs');

let file = fs.readFileSync('app/blog/[slug]/page.tsx', 'utf8');

const badSection = `    content: \`
      <h2 class="text-2xl font-bold text-primary mb-4">Getting Around Paris</h2>
      <p class="text-muted-foreground mb-6">Paris has an excellent public transportation system. The Métro is the most efficient way to navigate the city, with 16 lines covering all major attractions.</p>
      
      content: \``;

const goodSection = `    content: \``;

if (file.includes(badSection)) {
  file = file.replace(badSection, goodSection);
  fs.writeFileSync('app/blog/[slug]/page.tsx', file);
  console.log('SUCCESS - Duplicate content removed!');
} else {
  console.log('ERROR - Pattern not found');
}