let args = document.getElementById('args');
let cwd = document.getElementById('cwd');
let pid = document.getElementById('pid');
let version = document.getElementById('version');
let title = document.getElementById('title');
let platform = document.getElementById('platform');
let memoryUsage = document.getElementById('memoryUsage');
let execPath = document.getElementById('execPath');

fetch('/info')
.then(result=>{return result.json()})
.then(json=>{
    args.innerHTML = ` ${json.args}`
    cwd.innerHTML = ` ${json.cwd}`
    pid.innerHTML = ` ${json.pid}`
    version.innerHTML = ` ${json.version}`
    title.innerHTML = ` ${json.title}`
    platform.innerHTML = ` ${json.platform}`
    memoryUsage.innerHTML = ` ${json.memoryUsage}`
    execPath.innerHTML = ` ${json.execPath}`

}).catch(err=>console.log(err))
