export default class helloCommand {
	constructor(data) {
		this.error = false;
		this.errorMsg = '';

		this.name = data.name ? data.name : 'default';

		// test error handling
		if( this.name.length > 15 ) {
			this.error = true;
			this.errorMsg = 'Name too long';
		}
	}

	hasError() {
		return this.error;
	}

	getError() {
		return this.errorMsg;
	}

	getCommand() {
		return 'echo hello '+this.name;
	}
}