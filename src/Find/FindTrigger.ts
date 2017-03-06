import * as deepmerge from 'deepmerge';

import { CategorizeTrigger } from '../Categorize/CategorizeTrigger';

export class FindTrigger extends CategorizeTrigger {
    
    /**
     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
     * @param findTrigger - The trigger defined here will override the default FindTrigger.
     */
    public static new(findTrigger?: FindTrigger) {
        return deepmerge(new FindTrigger(), findTrigger || {}, {clone: true}) as FindTrigger;
    }

    /**
     * Triggers when the useGrouping property has changed.
     */
    public matchGroupingChanged: boolean = true;

    /**
     * Triggers when the orderBy property has changed.
     */
    public matchOrderByChanged: boolean = true;

    /**
     * Triggers when the page property has changed.
     */
    public matchPageChanged: boolean = true;

    /**
     * Triggers when the pageSize property has changed.
     */
    public matchPageSizeChanged: boolean = true;
}
