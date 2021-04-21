// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	if (getSetting('open')) {
		const msgList = ['每日三瓶水，健康打工人', '一天七杯水，医生远离我', '多喝水，尿不黄', '在吗？多喝热水', '多喝热水', '喝口水，休息一下吧', '为了腰子请勿憋尿', '喝口水动动脖子']
		const duration = getSetting('duration') * 60 * 1000;
		const name = getSetting('name');
		let index = 0
		let timer = setInterval(function () {
			if (getSetting('open')) {
				vscode.window.showInformationMessage(`${name}, ${msgList[index]}，( ゜ -゜)つロ 乾杯🍻`, '知道啦', '不再提示').then(result => {
					if (result === '不再提示') {
						index = 0
						clearInterval(timer)
						handleStopDun()
					}
				});
				index++
				if (index > msgList.length - 1) {
					index = 0
				}
			} else {
				clearInterval(timer)
			}
			
		}, duration)
	}
	
	let disposable = vscode.commands.registerCommand('extension.stopDun', function () {
		handleStopDun()
	});
	

	context.subscriptions.push(disposable);
}

function deactivate() { }

function handleStopDun() {
	updateConfiguration('dundundun', 'open', false, true)
	vscode.window.showInformationMessage(`dundundun已经关闭，如有需要可在全局配置中重新开启`, '( ゜ -゜)つロ 乾杯🍻')
}

function getSetting(key) {
	return vscode.workspace.getConfiguration().get(`dundundun.${key}`)
}

function updateConfiguration(cfgName, key, value, configurationTarget) {
	return new Promise((resolve, reject) => {
		let cfg = vscode.workspace.getConfiguration(cfgName);
		if (cfg.has(key)) {
			cfg.update(key, value, configurationTarget)
				.then(() => {
					resolve(true);
				}).then(undefined, err => {
					reject(err);
				});
		} else {
			resolve(false);
		}
	});
}

module.exports = {
	activate,
	deactivate
}
