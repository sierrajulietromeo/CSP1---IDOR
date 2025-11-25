/**
 * Database Reset Script
 * Resets the database to initial state with sample data
 * 
 * Run with: npm run reset
 */

const { execSync } = require('child_process');

console.log('Resetting HealthTrack Medical Portal Database...\n');

try {
    // Run the initialisation script
    execSync('node init-db.js', { stdio: 'inherit' });
    console.log('\n✓ Database has been reset successfully!');
} catch (error) {
    console.error('✗ Error resetting database:', error.message);
    process.exit(1);
}
