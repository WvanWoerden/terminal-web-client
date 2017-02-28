var escapeShell = function(cmd) {
  return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
};

export default class boogCommand {
	constructor(data) {
		this.error = false;
		this.errorMsg = '';

		this.statement = data.statement ? data.statement : '2=3';
		this.axioms = data.axioms ? data.axioms : [];
	}

	hasError() {
		return this.error;
	}

	getError() {
		return this.errorMsg;
	}

	getCommand() {
		let cmd = 'D:/Git/BOOG/bin/json.exe '+escapeShell(this.statement);
		cmd = this.axioms.reduce( (cmd, axiom) => cmd + ' ' + escapeShell(axiom) , cmd);
		return cmd;
	}
}