import { CategorizeTriggers } from '../Categorize/CategorizeTriggers';

/**
 * These are the triggers that define when and when not to trigger a find lookup.
 */
export class FindTriggers extends CategorizeTriggers {
    
    /**
     * Triggers when the useGrouping property has changed.
     */
    public matchGroupingChanged?: boolean = true;

    /**
     * Triggers when the orderBy property has changed.
     */
    public matchOrderByChanged?: boolean = true;

    /**
     * Triggers when the page property has changed.
     */
    public matchPageChanged?: boolean = true;

    /**
     * Triggers when the pageSize property has changed.
     */
    public matchPageSizeChanged?: boolean = true;

    /**
     * Creates a FindTrigger object for you, based on FindTrigger defaults and the overrides provided as a param.
     * @param triggers - The trigger defined here will override the default FindTrigger.
     */
    constructor(triggers?: FindTriggers) {
        super(triggers);
        if (triggers) {
            this.matchGroupingChanged = typeof triggers.matchGroupingChanged !== "undefined" ? triggers.matchGroupingChanged : this.matchGroupingChanged;
            this.matchOrderByChanged = typeof triggers.matchOrderByChanged !== "undefined" ? triggers.matchOrderByChanged : this.matchOrderByChanged;
            this.matchPageChanged = typeof triggers.matchPageChanged !== "undefined" ? triggers.matchPageChanged : this.matchPageChanged;
            this.matchPageSizeChanged = typeof triggers.matchPageSizeChanged !== "undefined" ? triggers.matchPageSizeChanged : this.matchPageSizeChanged;
        }
    }

}
