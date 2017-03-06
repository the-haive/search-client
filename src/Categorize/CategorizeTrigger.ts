import * as deepmerge from 'deepmerge';

import { Trigger } from '../Common/Trigger';

export class CategorizeTrigger extends Trigger {
    
    /**
     * Creates a CategorizeTrigger object for you, based on CategorizeTrigger defaults and the overrides provided as a param.
     * @param categorizeTrigger - The trigger defined here will override the default CategorizeTrigger.
     */
    public static new(categorizeTrigger?: CategorizeTrigger) {
        return deepmerge(new CategorizeTrigger(), categorizeTrigger || {}, {clone: true}) as CategorizeTrigger;
    }

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
