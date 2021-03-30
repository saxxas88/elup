const {
  ipcRenderer
} = require("electron");
window.onload = async () => {

  const version = document.getElementById("version");

  ipcRenderer.send("app_version");
  ipcRenderer.on("app_version", (event, arg) => {
    ipcRenderer.removeAllListeners("app_version");
    version.innerText = "Version " + arg.version;
  });

  const notification = document.getElementById("notification");
  const downloadBtn = document.getElementById("download-button");
  const closeBtn = document.getElementById("close-button");
  const message = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  closeBtn.addEventListener('click', closeNotification)
  downloadBtn.addEventListener('click', downloadApp)
  restartButton.addEventListener('click', restartApp)

  ipcRenderer.on("update_available", (event, arg) => {
    //ipcRenderer.removeAllListeners("update_available");
    message.innerText = "A new update is available. Downloading now?";
    console.log(arg);
      (notification.classList.contains('hidden')) ? notification.classList.remove("hidden") : null;
    (downloadBtn.classList.contains('hidden')) ? downloadBtn.classList.remove("hidden"): null;
    (closeBtn.classList.contains('hidden')) ? closeBtn.classList.remove("hidden"): null;
  });

  ipcRenderer.on("update_notAvailable", (event) => {
    //ipcRenderer.removeAllListeners("update_notAvailable");
    message.innerText = "No Updates. Current version is up-to-date.";
    (notification.classList.contains('hidden')) ? notification.classList.remove("hidden"): null;
    (closeBtn.classList.contains('hidden')) ? closeBtn.classList.remove("hidden"): null;
  });

  ipcRenderer.on("update_downloaded", () => {
    //ipcRenderer.removeAllListeners("update_downloaded");
    message.innerText =
      "Update Downloaded. It will be installed on restart. Restart now?";
    (notification.classList.contains('hidden')) ? notification.classList.remove("hidden"): null;
    (restartButton.classList.contains('hidden')) ? restartButton.classList.remove("hidden"): null;
    (closeBtn.classList.contains('hidden')) ? closeBtn.classList.remove("hidden"): null;

  });

  ipcRenderer.on("progress_available", (event, args) => {
    message.innerText = "Progress -> "+ args.percent;
    console.log(args);
      (notification.classList.contains('hidden')) ? notification.classList.remove("hidden") : null;
  });

  ipcRenderer.on("download_update", (event, arg) => {
    console.log('Array Promise to downloadUpdate',arg)
  });

  function closeNotification() {
    (!notification.classList.contains('hidden')) ? notification.classList.add("hidden"): null;
    (!downloadBtn.classList.contains('hidden')) ? downloadBtn.classList.add("hidden"): null;
    (!closeBtn.classList.contains('hidden')) ? closeBtn.classList.add("hidden"): null;
  }

  function downloadApp() {
    ipcRenderer.send("download_app");
    (!notification.classList.contains('hidden')) ? notification.classList.add("hidden"): null;
    (!downloadBtn.classList.contains('hidden')) ? downloadBtn.classList.add("hidden"): null;
    (!closeBtn.classList.contains('hidden')) ? closeBtn.classList.add("hidden"): null;
  }

  function restartApp() {
    ipcRenderer.send("restart_app");
    (!notification.classList.contains('hidden')) ? notification.classList.add("hidden"): null;
    (!restartButton.classList.contains('hidden')) ? restartButton.classList.add("hidden"): null;
    (!closeBtn.classList.contains('hidden')) ? closeBtn.classList.add("hidden"): null;
    (!downloadBtn.classList.contains('hidden')) ? downloadBtn.classList.add("hidden"): null;
  }

}