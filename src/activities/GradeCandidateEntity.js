import { Entity } from '../es6/Entity';
import { performSirenAction } from '../es6/SirenAction';

/**
 * GradeCandidateEntity class representation of a grade-candidate
 */
export class GradeCandidateEntity extends Entity {
	/**
	 * @returns {string} Grade candidate's name
	 */
	name() {
		return this._entity && this._entity.properties && this._entity.properties.name;
	}

	/**
	 * @returns {string} Grade candidate's maxPoints value
	 */
	maxPoints() {
		return this._entity && this._entity.properties && this._entity.properties.maxPoints;
	}

	/**
	 * @returns {bool} True if the associate-grade action is present on the grade candidate
	 */
	canAssociateGrade() {
		return this._entity && this._entity.hasActionByName('associate-grade');
	}

	/**
	 * Calls the Siren action to associate this grade with the activity
	 */
	async associateGrade() {
		if (!this.canAssociateGrade()) {
			return;
		}

		const action = this._entity.getActionByName('associate-grade');
		await performSirenAction(this._token, action);
	}
}