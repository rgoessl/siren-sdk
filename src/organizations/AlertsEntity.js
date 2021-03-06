import { Entity } from '../es6/Entity.js';

/**
 * AlertsEntity class representation of a d2l notification alerts.
 */
export class AlertsEntity extends Entity {

	/**
	 * Whether or not there is unread alert message
	 */
	hasUnread() {
		return this._entity && this._entity.properties && this._entity.properties.hasUnread;
	}
}
