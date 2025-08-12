const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

console.log('🎨 Starting Unseen AI Art Experience Platform...\n');

// Function to open browser after a delay
function openBrowser() {
  setTimeout(() => {
    console.log('🌐 Opening browser to http://localhost:3000...');
    
    // Open browser based on platform
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
      command = 'start http://localhost:3000';
    } else if (platform === 'darwin') {
      command = 'open http://localhost:3000';
    } else {
      command = 'xdg-open http://localhost:3000';
    }
    
    exec(command, (error) => {
      if (error) {
        console.log('⚠️  Could not open browser automatically. Please open http://localhost:3000 manually.');
      }
    });
  }, 5000); // Wait 5 seconds for servers to start
}

// Function to show demo instructions
function showInstructions() {
  setTimeout(() => {
    console.log('\n🎯 DEMO INSTRUCTIONS:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('1. 🏠 HOME: View the platform overview');
    console.log('2. 👨‍🎨 ARTISTS: Browse available artists');
    console.log('3. 📅 EVENTS: View events and their art pieces');
    console.log('4. 🎨 AI ART: Generate AI artwork');
    console.log('5. 🛒 MARKETPLACE: Browse AI-generated art listings');
    console.log('');
    console.log('🎪 INTERACTIVE DEMO FLOW:');
    console.log('• Click "Events" → View "Corporate Art Exhibition"');
    console.log('• Click "View Details" on "Abstract Corporate" art piece');
    console.log('• Add a description like "This piece feels dynamic and energetic"');
    console.log('• Click "Generate AI Content" to create AI summary, poem, and art');
    console.log('• Visit "Marketplace" to see the generated content listed');
    console.log('');
    console.log('📱 QR CODE DEMO:');
    console.log('• Click "Scan Event QR Code" on Events page');
    console.log('• Use the mock QR scanner to simulate real-world usage');
    console.log('');
    console.log('🔗 API ENDPOINTS:');
    console.log('• Backend API: http://localhost:3002/api');
    console.log('• Frontend: http://localhost:3000');
    console.log('═══════════════════════════════════════════════════════════════\n');
  }, 3000);
}

// Start the development servers
const devProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle process events
devProcess.on('error', (error) => {
  console.error('❌ Error starting demo:', error);
  process.exit(1);
});

devProcess.on('close', (code) => {
  console.log(`\n👋 Demo stopped with code ${code}`);
  process.exit(code);
});

// Show instructions and open browser
showInstructions();
openBrowser();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping demo...');
  devProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping demo...');
  devProcess.kill('SIGTERM');
  process.exit(0);
}); 