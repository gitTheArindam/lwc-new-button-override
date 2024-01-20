import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import OPPORTUNITY_SME_SUCCESS_MESSAGE from '@salesforce/label/c.OPPORTUNITY_SME_SUCCESS_MESSAGE';
import OPPORTUNITY_SME_FAILURE_MESSAGE from '@salesforce/label/c.OPPORTUNITY_SME_FAILURE_MESSAGE';

import OPPORTUNITY_SME_OBJECT from '@salesforce/schema/Opportunity_SME__c';
import OPPORTUNITY_FIELD from '@salesforce/schema/Opportunity_SME__c.Opportunity__c';
import DEPARTMENT_FIELD from '@salesforce/schema/Opportunity_SME__c.Department__c';
import EFFECTIVE_DATE_FIELD from '@salesforce/schema/Opportunity_SME__c.Effective_Date__c';
import EXPIRATION_DATE_FIELD from '@salesforce/schema/Opportunity_SME__c.Expiration_Date__c';

import getDepartments from '@salesforce/apex/NewOpportunitySmeController.getDepartments';

const TOAST_TYPE_SUCCESS = 'success';
const TOAST_TYPE_ERROR = 'error';

export default class NewOpportunitySme extends LightningElement {
    _recordId;

    departments;
    error;

    selectedDepartment;
    effectiveDate;
    expirationDate;

    @api
    set recordId(recordId) {
        this._recordId = recordId;
    }
    get recordId() {
        return this._recordId;
    }

    @wire(getDepartments, { opportunityId: '$_recordId' })
    wiredDepartments({ error, data }) {
        if (data) {
            this.departments = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.departments = undefined;
        }
    }

    get departmentOptions() {
        return this.departments?.map((dept) => ({ label: dept, value: dept }));
    }

    handleOpportunityChange(event) {
        this._recordId = event.detail.recordId;
        this.selectedDepartment = null;
    }

    handleDepartmentChange(event) {
        this.selectedDepartment = event.detail.value;
    }

    handleEffectiveDateChange(event) {
        this.effectiveDate = event.detail.value;
    }

    handleExpirationDateChange(event) {
        this.expirationDate = event.detail.value;
    }

    @api
    handleSave() {
        return this.createOpportunitySme();
    }

    @api
    async handleSaveAndNew() {
        await this.createOpportunitySme();
        this.resetAllValues();
    }

    async createOpportunitySme() {
        let createdRecordId;
        const fields = {};
        fields[OPPORTUNITY_FIELD.fieldApiName] = this._recordId;
        fields[DEPARTMENT_FIELD.fieldApiName] = this.selectedDepartment;
        fields[EFFECTIVE_DATE_FIELD.fieldApiName] = this.effectiveDate;
        fields[EXPIRATION_DATE_FIELD.fieldApiName] = this.expirationDate;

        const recordInput = {
            apiName: OPPORTUNITY_SME_OBJECT.objectApiName,
            fields
        };

        try {
            const result = await createRecord(recordInput);
            if (result) {
                this.displayToast(
                    OPPORTUNITY_SME_SUCCESS_MESSAGE,
                    result?.fields?.Name?.value,
                    TOAST_TYPE_SUCCESS
                );
                createdRecordId = result.id;
            }
        } catch (error) {
            this.displayToast(
                OPPORTUNITY_SME_FAILURE_MESSAGE,
                error.body.message,
                TOAST_TYPE_ERROR
            );
        }
        return createdRecordId;
    }

    resetAllValues() {
        this.template
            .querySelectorAll('lightning-combobox')
            .forEach((element) => {
                element.value = null;
            });
        this.template.querySelectorAll('lightning-input').forEach((element) => {
            element.value = null;
        });
    }

    displayToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
