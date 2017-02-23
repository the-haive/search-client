import { Trigger } from './Trigger';

/**
 * Will execute a search when a whitespace is added (regex whitespace) to the monitored queryfield.
 * Note. The rule will not trigger a search when the query is whitespace only.
 */
export class OnWhitespaceTrigger extends Trigger {
}
