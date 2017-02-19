/**
 * The abstract base class for any Trigger-type that is to be defined.
 */
export abstract class Trigger {}

/**
 * Will execute a search when the user press [Enter] in the monitored queryfield.
 */
export class OnEnterTrigger extends Trigger {
}

/**
 * Will execute a search when the length of the query is >= minLength.
 */
export class OnMinLengthTrigger extends Trigger {
    public minLength: number = 3;
}

/**
 * Will execute a search when a whitespace is added (regex whitespace) to the monitored queryfield.
 * Note. The rule will not trigger a search when the query is whitespace only.
 */
export class OnWhitespaceTrigger extends Trigger {
}

/**
 * Represents the setup of triggers for each operation (autocomplete, find, categorize) for the monitored query-field.
 */
export class Triggers {
    /**
     * The list of triggers that combined define when to execute autocomplete() calls.
     */
    public autocomplete: Trigger[];

    /**
     * The list of triggers that combined define when to execute find() callss.
     */
    public find: Trigger[];
    
    /**
     * The list of triggers that combined define when to execute categorize() callss.
     */
    public categorize: Trigger[];
}
