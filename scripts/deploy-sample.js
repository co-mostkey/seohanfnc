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
  
  // Override remote root to deploy to sample subdirectory
  config.remoteRoot = "/public_html/sample/";
} else {
  // Default configuration - will need to be updated
  console.log('No .ftp-deploy.json found, using default configuration...');
  console.log('IMPORTANT: Please update .ftp-deploy.json with your FTP credentials before deploying!');
  
  config = {
    user: "FTP_USER", // Update these values
    password: "FTP_PASS", // Update these values
    host: "ftp.yourserver.com", // Update these values
    port: 21,
    localRoot: path.join(process.cwd(), 'out-sample'),
    remoteRoot: "/public_html/sample/",
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

// Override localRoot to use 'out-sample' directory
config.localRoot = path.join(process.cwd(), 'out-sample');

// Run deployment
const ftpDeploy = new FtpDeploy();

ftpDeploy.on("uploading", function(data) {
  console.log(`Uploading: ${data.transferredFileCount}/${data.totalFilesCount} - ${data.filename}`);
});

ftpDeploy.on("uploaded", function(data) {
  console.log(`Uploaded: ${data.transferredFileCount}/${data.totalFilesCount} - ${data.filename}`);
});

ftpDeploy.on("log", function(data) {
  console.log(data);
});

ftpDeploy.on("upload-error", function(data) {
  console.log(`Error uploading: ${data.filename} - ${data.err}`);
});

console.log('Starting FTP deployment to /public_html/sample/...');
ftpDeploy.deploy(config)
  .then(res => console.log('Deployment completed successfully!'))
  .catch(err => console.log('Deployment failed:', err)); 