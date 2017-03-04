import { CategorizeTrigger } from '../Categorize/CategorizeTrigger';

export class FindTrigger extends CategorizeTrigger {
    
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
