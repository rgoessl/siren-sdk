'use strict';

import { AssignmentActivityEntity } from './AssignmentActivityEntity.js';
import { Entity } from '../../es6/Entity.js';
import { Rels } from '../../hypermedia-constants';

/**
 * AssignmentActivityUsageEntity class representation of a d2l AssignmentActivityUsage.
 */
export class AssignmentActivityUsageEntity extends Entity {
	assignmentHref() {
		if (!this._entity || !this._entity.hasLinkByRel(Rels.assignment)) {
			return;
		}

		return this._entity.getLinkByRel(Rels.assignment).href;
	}

	onAssignmentChange(onChange) {
		const assignmentHref = this.assignmentHref();
		// _subEntity builds new sub entity and allows this object to track it.
		// So all sub entities are dispose when this object is disposed.
		assignmentHref && this._subEntity(AssignmentActivityEntity, assignmentHref, onChange);
	}

}
