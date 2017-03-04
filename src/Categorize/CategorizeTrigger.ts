import { Trigger } from '../Common/Trigger';

export class CategorizeTrigger extends Trigger {
    
    /**
     * Triggers when the searchType property has changed.
     */
    public searchTypeChanged: boolean = true;

    /**
     * Triggers when the filter property has changed.
     */
    public filterChanged: boolean = true;

    /**
     * Triggers when the from date property has changed.
     */
    public dateFromChanged: boolean = true;

    /**
     * Triggers when the to date property has changed.
     */
    public dateToChanged: boolean = true;

    /**
     * Triggers when the clientId property has changed
     */
    public clientIdChanged: boolean = true;
}
