export default class boogCommand {
	constructor(data) {
		this.error = false;
		this.errorMsg = '';

		this.statement = data.statement ? data.statement : '2=3';
		this.axioms = data.axioms;
		console.log( this.axioms );
	}

	hasError() {
		return this.error;
	}

	getError() {
		return this.errorMsg;
	}

	getCommand() {
		let cmd = 'D:/Git/BOOG/bin/json.exe "'+this.statement+'"';
		cmd = this.axioms.reduce( (cmd, axiom) => cmd + ' "' + axiom + '"' , cmd);
		console.log(cmd);
		return cmd;
	}
}