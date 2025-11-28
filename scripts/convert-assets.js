const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convert = async () => {
    try {
        // Icon
        console.log('Converting icon...');
        await sharp('assets/images/chata_icon.svg')
            .resize(1024, 1024)
            .png()
            .toFile('assets/icon.png');
        console.log('Icon converted: assets/icon.png');

        // Splash
        console.log('Converting splash...');
        await sharp('assets/images/chata_logo.svg')
            .resize(1000) // Width 1000, auto height
            .png()
            .toFile('assets/splash.png');
        console.log('Splash converted: assets/splash.png');

    } catch (error) {
        console.error('Error converting assets:', error);
        process.exit(1);
    }
};

convert();
