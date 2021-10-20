const { app, BrowserWindow } = require("electron");
const path = require("path");

//const PY_DIST_FOLDER = 'stuttering_model'
//const PY_DIST_FOLDER = 'pymodel'
const PY_DIST_FOLDER = 'wow2'
const PY_FOLDER = 'pymodel'
//const PY_MODULE = 'model' // without .py suffix
const PY_MODULE = 'engine' // without .py suffix

let pyProc = null
let pyPort = null

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER)
  return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
  if (!guessPackaged()) {
    return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
  }
  if (process.platform === 'win32') {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

const selectPort = () => {
  pyPort = 5000 
  return pyPort
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  if (guessPackaged()) {
      console.log("I AM HERE!");
    pyProc = require('child_process').execFile(script, [port])
  } else {
//    pyProc = require('child_process').spawn('python', [script, port])
    pyProc = require('child_process').spawn('python', ['pymodel/model.py', port])
  }
 
  if (pyProc != null) {
    //console.log(pyProc)
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


const loadMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width : 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    console.log("hello");
    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

app.on("ready", loadMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        loadMainWindow();
    }
});
