import { Trigger } from '../Common/Trigger';

export class CategorizeTrigger extends Trigger {
    
    /**
     * Triggers when the clientId property has changed
     */
    public clientIdChanged: boolean = true;

    /**
     * Triggers when the from date property has changed.
     */
    public dateFromChanged: boolean = true;

    /**
     * Triggers when the to date property has changed.
     */
    public dateToChanged: boolean = true;

    /**
     * Triggers when the filter property has changed.
     */
    public filterChanged: boolean = true;

    /**
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged: boolean = true;

    /**
     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
     * @param categorizeTrigger - The trigger defined here will override the default CategorizeTrigger.
     */
    constructor(categorizeTrigger?: CategorizeTrigger) {
        super();
        Object.assign(this, categorizeTrigger);
    }

}
