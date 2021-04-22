// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let unit = getSetting('unit') === 'min' ? 60 : 1;
	let duration = getSetting('duration') * unit * 1000;
	let name = getSetting('name');
	let index = 0
	let timer = null
	let setTimer = null
	if (getSetting('open')) {
		const msgList = [
			'每日三瓶水，健康打工人',
			'一天七杯水，医生远离我',
			'多喝水，尿不黄',
			'在吗？多喝热水',
			'多喝热水',
			'喝口水，休息一下吧',
			'为了腰子请勿憋尿',
			'喝口水动动脖子',
			'肾好你也好，多喝水，少石头',
			'等体检的时候 ,才知道多喝水有多么重要了',
			'谁不会休息喝水，谁就不会工作',
			'喝水，摸鱼'
		]
		setTimer = () => {
			return setInterval(function () {
				if (getSetting('open')) {
					vscode.window.showInformationMessage(`${name ? name + ',' : name} ${msgList[index]}，( ゜ -゜)つロ 乾杯🍻`, '知道啦', '不再提示').then(result => {
						if (result === '不再提示') {
							index = 0
							timer && clearInterval(timer)
							handleStopDun()
						}
					});
					index++
					if (index > msgList.length - 1) {
						index = 0
					}
				} else {
					timer && clearInterval(timer)
				}
				
			}, duration)
		}
		timer = setTimer()
	}
	
	let disposable = vscode.commands.registerCommand('extension.stopDun', function () {
		handleStopDun()
	});

	let listen = vscode.workspace.onDidChangeConfiguration((e) => {
		const list = ["dundundun.name", "dundundun.unit", "dundundun.duration", "dundundun.open"]
		const affected = list.some(item => e.affectsConfiguration(item));
		console.log('e', e, affected);
		if (affected) {
			index = 0
			timer && clearInterval(timer)
			unit = getSetting('unit') === 'min' ? 60 : 1;
			duration = getSetting('duration') * unit * 1000;
			name = getSetting('name');
		}
		if (e.affectsConfiguration("dundundun.open") && !getSetting('open')) {
			handleStopDun()
		} else {
			timer = setTimer()
		}
	});

	let handleStopDun = () => {
		if (timer) {
			updateConfiguration('dundundun', 'open', false, true)
			vscode.window.showInformationMessage(`dundundun已经关闭，如有需要可在全局配置中重新开启`, '( ゜ -゜)つロ 乾杯🍻')
		}
	}
	

	context.subscriptions.push(disposable, listen);
}

function deactivate() { }



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
