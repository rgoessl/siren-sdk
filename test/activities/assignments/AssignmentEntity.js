/* global fetchMock */

import { AssignmentEntity } from '../../../src/activities/assignments/AssignmentEntity.js';
import { nonEditableAssignment } from './data/NonEditableAssignment.js';
import { editableAssignment } from './data/EditableAssignment.js';

describe('AssignmentEntity', () => {
	var editableEntity, nonEditableEntity;

	beforeEach(() => {
		nonEditableEntity = window.D2L.Hypermedia.Siren.Parse(nonEditableAssignment);
		editableEntity = window.D2L.Hypermedia.Siren.Parse(editableAssignment);
	});

	afterEach(() => {
		fetchMock.reset();
	});

	describe('Basic loading', () => {
		it('reads name', () => {
			var assignmentEntity = new AssignmentEntity(nonEditableEntity);
			expect(assignmentEntity.name()).to.equal('Extra Special Assignment');
		});
	});

	describe('Editable', () => {
		it('sets canEditName to true', () => {
			var assignmentEntity = new AssignmentEntity(editableEntity);
			expect(assignmentEntity.canEditName()).to.be.true;
		});
	});

	describe('Non Editable', () => {
		it('sets canEditName to false', () => {
			var assignmentEntity = new AssignmentEntity(nonEditableEntity);
			expect(assignmentEntity.canEditName()).to.be.false;
		});
	});

	describe('Saves', () => {
		it('saves name and instructions', async() => {
			fetchMock.putOnce('https://f5aa43d7-c082-485c-84f5-4808147fe98a.assignments.api.dev.brightspace.com/123065/folders/7', editableEntity);

			var assignmentEntity = new AssignmentEntity(editableEntity);

			await assignmentEntity.save({
				name: 'New name',
				instructions: 'New instructions'
			});

			const form = await fetchMock.lastCall().request.formData();
			expect(form.get('name')).to.equal('New name');
			expect(form.get('instructions')).to.equal('New instructions');
			expect(fetchMock.called()).to.be.true;
		});

		it('skips save if not dirty', async() => {
			var assignmentEntity = new AssignmentEntity(editableEntity);

			await assignmentEntity.save({
				name: 'Extra Special Assignment',
				instructions: '<p>These are your instructions</p>'
			});

			expect(fetchMock.done());
		});

		it('skips save if not editable', async() => {
			var assignmentEntity = new AssignmentEntity(nonEditableEntity);

			await assignmentEntity.save({
				name: 'New name',
				instructions: 'New instructions'
			});

			expect(fetchMock.done());
		});
	});
});
