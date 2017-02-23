import { Trigger } from './Trigger';

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
