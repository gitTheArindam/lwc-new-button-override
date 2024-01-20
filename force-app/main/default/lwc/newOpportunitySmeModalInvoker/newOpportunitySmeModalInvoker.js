import { LightningElement, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import newOpportunitySmeModal from 'c/newOpportunitySmeModal';

import NEW_OPPORTUNITY_SME from '@salesforce/label/c.NEW_OPPORTUNITY_SME';

import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_SME_OBJECT from '@salesforce/schema/Opportunity_SME__c';

const NAVIGATION_TYPE = 'standard__recordPage';
const NAVIGATION_ACTION = 'view';

const BUTTON_NAME_SAVE = 'save';
const BUTTON_NAME_SAVE_AND_NEW = 'saveAndNew';

const MODAL_SIZE = 'small';

export default class NewOpportunitySmeModalInvoker extends NavigationMixin(
    LightningElement
) {
    @wire(CurrentPageReference) pageReference;
    recordId;
    isOpenModal;

    connectedCallback() {
        if (this.pageReference) {
            this.recordId = this.pageReference?.attributes?.recordId;
            this.isOpenModal = this.pageReference?.state?.c__openModal;

            if (this.isOpenModal) {
                this.openModal();
            }
        }
    }

    async openModal() {
        const result = await newOpportunitySmeModal.open({
            label: NEW_OPPORTUNITY_SME,
            recordId: this.recordId,
            size: MODAL_SIZE
        });

        // Reload Page without the state variable
        // Else the modal will re-open on refresh
        if (result) {
            if (result?.buttonName === BUTTON_NAME_SAVE && result?.recordId) {
                this.navigateToRecordPage(
                    OPPORTUNITY_SME_OBJECT.objectApiName,
                    result.recordId
                );
            } else if (result?.buttonName === BUTTON_NAME_SAVE_AND_NEW) {
                // ! DO NOT REFRESH THE PAGE!
            } else {
                this.navigateToRecordPage(
                    OPPORTUNITY_OBJECT.objectApiName,
                    this.recordId
                );
            }
        } else {
            this.navigateToRecordPage(
                OPPORTUNITY_OBJECT.objectApiName,
                this.recordId
            );
        }
    }

    navigateToRecordPage(objectApiName, recordId) {
        this[NavigationMixin.Navigate]({
            type: NAVIGATION_TYPE,
            attributes: {
                recordId,
                objectApiName,
                actionName: NAVIGATION_ACTION
            }
        });
    }
}