const FtpDeploy = require('ftp-deploy');
const fs = require('fs');
const path = require('path');

// Check if config exists
const configPath = path.join(process.cwd(), '.ftp-deploy.json');
let config;

// If config file exists, use it
if (fs.existsSync(configPath)) {
  console.log('Using existing .ftp-deploy.json configuration...');
  config = require(configPath);
} else {
  // Default configuration - will need to be updated
  console.log('No .ftp-deploy.json found, using default configuration...');
  console.log('IMPORTANT: Please update .ftp-deploy.json with your FTP credentials before deploying!');
  
  config = {
    user: "FTP_USER", // Update these values
    password: "FTP_PASS", // Update these values
    host: "ftp.yourserver.com", // Update these values
    port: 21,
    localRoot: path.join(process.cwd(), '.next/out'),
    remoteRoot: "/public_html/",
    include: ["*", "**/*"],
    exclude: [".git/**", "node_modules/**", "scripts/**"],
    deleteRemote: false, // Set to true to delete existing files on the remote server
    forcePasv: true,
    sftp: false
  };
  
  // Write default config if it doesn't exist
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Created default .ftp-deploy.json - please update with your actual FTP credentials!');
  
  // Exit without deploying
  console.log('Exiting without deploying. Update the configuration and run the script again.');
  process.exit(0);
}

// Deploy using FTP
async function deploy() {
  console.log('Starting FTP deployment...');
  
  // Check if static export exists
  if (!fs.existsSync(config.localRoot)) {
    console.error(`Error: Static export directory not found at: ${config.localRoot}`);
    console.log('Run "npm run build" before deploying to generate the static export.');
    process.exit(1);
  }
  
  const ftpDeploy = new FtpDeploy();
  
  // Configure event handlers
  ftpDeploy.on('uploading', (data) => {
    const { totalFilesCount, transferredFileCount, filename } = data;
    console.log(`[${transferredFileCount}/${totalFilesCount}] Uploading: ${filename}`);
  });
  
  ftpDeploy.on('uploaded', (data) => {
    const { totalFilesCount, transferredFileCount, filename } = data;
    console.log(`[${transferredFileCount}/${totalFilesCount}] Uploaded: ${filename}`);
  });
  
  ftpDeploy.on('upload-error', (data) => {
    console.error('Upload error:', data);
  });
  
  // Start deployment
  try {
    const result = await ftpDeploy.deploy(config);
    console.log('Deployment complete!');
    console.log(`Deployed ${result.length} files to ${config.host}${config.remoteRoot}`);
  } catch (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  }
}

// Run the deployment
deploy(); 