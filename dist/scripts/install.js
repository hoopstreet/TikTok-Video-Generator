"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
const renderer_1 = require("@remotion/renderer");
const logger_1 = require("../logger");
const Kokoro_1 = require("../short-creator/libraries/Kokoro");
const music_1 = require("../short-creator/music");
const config_1 = require("../config");
const Whisper_1 = require("../short-creator/libraries/Whisper");
// runs in docker
async function install() {
    const config = new config_1.Config();
    logger_1.logger.info("Installing dependencies...");
    logger_1.logger.info("Installing Kokoro...");
    await Kokoro_1.Kokoro.init(config.kokoroModelPrecision);
    logger_1.logger.info("Installing browser shell...");
    await (0, renderer_1.ensureBrowser)();
    logger_1.logger.info("Installing whisper.cpp");
    await Whisper_1.Whisper.init(config);
    logger_1.logger.info("Installing dependencies complete");
    logger_1.logger.info("Ensuring the music files exist...");
    const musicManager = new music_1.MusicManager(config);
    try {
        musicManager.ensureMusicFilesExist();
    }
    catch (error) {
        logger_1.logger.error(error, "Missing music files");
        process.exit(1);
    }
}
install()
    .then(() => {
    logger_1.logger.info("Installation complete");
})
    .catch((error) => {
    logger_1.logger.error(error, "Installation failed");
});
