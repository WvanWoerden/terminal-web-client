import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import uuid from 'uuid';
import { 
	Form, 
	FormGroup, 
	ControlLabel, 
	Col, 
	FormControl,
	Button 
} from 'react-bootstrap';

export const Creator = React.createClass({
	mixins: [PureRenderMixin],
	prepareJob: function() {
		let statement = this.statementInput.value;
		let rawAxioms = this.axiomsInput.value;
		let axioms = rawAxioms.match(/[^\r\n]+/g);
		if( !axioms ) axioms = [];
		return { job_id: uuid.v4(), data: { statement, axioms } };
	},
	componentDidMount() {
		this.statementInput.focus();
	},
	render: function() {
		return (
			<Form onSubmit={(e) => { e.preventDefault(); this.props.addJob(this.prepareJob());} } horizontal>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}>
						Statement
					</Col>
					<Col sm={10}>
						<FormControl type="text" inputRef={(input) => { this.statementInput = input; }} />
					</Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}>
						Axioms
					</Col>
					<Col sm={10}>
						<FormControl 
							componentClass="textarea" 
							id="textareaAxioms"
							inputRef={(input) => { this.axiomsInput = input; }} />
					</Col>
				</FormGroup>
				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="submit" >
							Send
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}); 

function mapStateToProps(state) {
	return {
		user_id: state.get('user_id')
	};
}

export const CreatorContainer = connect(
	mapStateToProps, 
	actionCreators
)(Creator);