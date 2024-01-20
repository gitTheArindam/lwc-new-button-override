import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class NewOpportunitySmeModal extends LightningModal {
    @api label;
    @api recordId;

    handleCancel() {
        this.close({
            buttonName: 'cancel'
        });
    }

    async handleSaveAndNew() {
        await this.template
            .querySelector('c-new-opportunity-sme')
            .handleSaveAndNew();
    }

    async handleSave() {
        const createdRecordId = await this.template
            .querySelector('c-new-opportunity-sme')
            .handleSave();
        this.close({
            buttonName: 'save',
            recordId: createdRecordId
        });
    }
}