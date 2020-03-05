/* global fetchMock */

import { getFormData } from '../utility/test-helpers.js';
import { GradeCandidateEntity } from '../../src/activities/GradeCandidateEntity.js';
import { testData } from './data/GradeCandidateEntity.js';

describe('GradeCandidateEntity', () => {
	afterEach(() => {
		fetchMock.reset();
	});

	describe('Grade', () => {
		let entity, entityJson;

		beforeEach(() => {
			entityJson = window.D2L.Hypermedia.Siren.Parse(testData.gradeCandidateEntity.grade);
			entity = new GradeCandidateEntity(entityJson);
		});

		it('gets href', () => {
			expect(entity.href()).to.equal('https://9caa9c10-0175-4c56-84e5-fc2bca4d8a52.grades.api.proddev.d2l/organizations/6609/grades/20');
		});

		it('gets getGradeCandidates', () => {
			expect(entity.getGradeCandidates()).to.be.an('array').that.is.empty;
		});

		it('is not a category', () => {
			expect(entity.isCategory()).to.be.false;
		});

		it('is the current association', () => {
			expect(entity.isCurrentAssociation()).to.be.true;
		});

		it('can associate grade', () => {
			expect(entity.canAssociateGrade()).to.be.true;
		});

		it('returns a promise when associating grade', async() => {
			fetchMock.postOnce('https://9caa9c10-0175-4c56-84e5-fc2bca4d8a52.activities.api.proddev.d2l/activities/6606_2000_11/usages/6609/associate-grade', entityJson);

			await entity.associateGrade();

			const form = await getFormData(fetchMock.lastCall().request);
			if (!form.notSupported) {
				expect(form.get('gradeItemId')).to.equal('20');
			}
			expect(fetchMock.called()).to.be.true;
		});
	});

	describe('Grade without Associate Action', () => {
		let entity;

		beforeEach(() => {
			const entityJson = window.D2L.Hypermedia.Siren.Parse(testData.gradeCandidateEntity.gradeWithoutAssociateAction);
			entity = new GradeCandidateEntity(entityJson);
		});

		it('gets href', () => {
			expect(entity.href()).to.equal('https://9caa9c10-0175-4c56-84e5-fc2bca4d8a52.grades.api.proddev.d2l/organizations/6609/grades/20');
		});

		it('gets getGradeCandidates', () => {
			expect(entity.getGradeCandidates()).to.be.an('array').that.is.empty;
		});

		it('is not a category', () => {
			expect(entity.isCategory()).to.be.false;
		});

		it('is not the current association', () => {
			expect(entity.isCurrentAssociation()).to.be.false;
		});

		it('can not associate to grade', () => {
			expect(entity.canAssociateGrade()).to.be.false;
		});

		it('skips associating as it does not have the associate action', async() => {
			await entity.associateGrade();
			expect(fetchMock.done());
		});
	});

	describe('Category with Grade', () => {
		let entity;

		beforeEach(() => {
			const entityJson = window.D2L.Hypermedia.Siren.Parse(testData.gradeCandidateEntity.categoryWithGrade);
			entity = new GradeCandidateEntity(entityJson);
		});

		it('gets href', () => {
			expect(entity.href()).to.equal('https://9caa9c10-0175-4c56-84e5-fc2bca4d8a52.grades.api.proddev.d2l/organizations/6609/grade-categories/5010');
		});

		it('gets getGradeCandidates', () => {
			const expected = entity.getGradeCandidates();
			expect(expected).to.be.an('array');
			expect(expected).to.have.lengthOf(1);
		});

		it('is a category', () => {
			expect(entity.isCategory()).to.be.true;
		});

		it('is not the current association', () => {
			expect(entity.isCurrentAssociation()).to.be.false;
		});

		it('can associate grade', () => {
			expect(entity.canAssociateGrade()).to.be.false;
		});

		it('skips associating as it does not hve the associate action', async() => {
			await entity.associateGrade();
			expect(fetchMock.done());
		});
	});
});
