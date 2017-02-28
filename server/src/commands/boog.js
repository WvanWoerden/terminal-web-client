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
		return "D:/Git/BOOG/bin/json.exe";
	}

	getArguments() {
		return [this.statement, ...this.axioms];
	}
}